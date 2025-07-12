/**
 * Meshroom Integration
 * Handles 3D model processing and photogrammetry with Meshroom
 */

class MeshroomIntegration {
    constructor() {
        this.config = window.getSupabaseConfig?.() || {};
        this.supabase = window.supabase;
        this.processingQueue = new Map();
        this.activeJobs = new Set();
        
        this.init();
    }

    async init() {
        try {
            await this.setupMeshroomConnection();
            this.setupEventListeners();
            console.log('Meshroom Integration initialized');
        } catch (error) {
            console.error('Failed to initialize Meshroom integration:', error);
        }
    }

    async setupMeshroomConnection() {
        // Test connection to Meshroom API
        try {
            const response = await fetch(`${this.config.meshroom.apiUrl}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('Meshroom API connection successful');
                this.meshroomAvailable = true;
            } else {
                console.warn('Meshroom API not available, using fallback processing');
                this.meshroomAvailable = false;
            }
        } catch (error) {
            console.warn('Meshroom API not available, using fallback processing');
            this.meshroomAvailable = false;
        }
    }

    setupEventListeners() {
        // Listen for scan completion from 3D scanner
        if (window.Scanner3DIntegration) {
            window.Scanner3DIntegration.onScanComplete = (photos) => {
                this.processScan(photos);
            };
        }
    }

    async processScan(photos) {
        if (!photos || photos.length === 0) {
            throw new Error('No photos provided for processing');
        }

        const jobId = this.generateJobId();
        const scanQuality = this.getScanQuality();
        
        try {
            // Create processing job
            const job = {
                id: jobId,
                status: 'processing',
                photos: photos.length,
                quality: scanQuality,
                createdAt: new Date().toISOString(),
                estimatedTime: this.estimateProcessingTime(photos.length, scanQuality)
            };

            this.processingQueue.set(jobId, job);
            this.activeJobs.add(jobId);

            // Update UI
            this.updateProcessingUI(job);

            // Process with Meshroom
            const modelData = await this.processWithMeshroom(photos, scanQuality);

            // Complete job
            await this.completeJob(jobId, modelData);

        } catch (error) {
            console.error('Failed to process scan:', error);
            await this.failJob(jobId, error.message);
        }
    }

    async processWithMeshroom(photos, quality) {
        if (this.meshroomAvailable) {
            return await this.processWithMeshroomAPI(photos, quality);
        } else {
            return await this.processWithFallback(photos, quality);
        }
    }

    async processWithMeshroomAPI(photos, quality) {
        const formData = new FormData();
        
        // Add photos to form data
        photos.forEach((photo, index) => {
            formData.append('photos', photo.blob, `photo_${index}.jpg`);
        });

        // Add processing parameters
        formData.append('quality', quality);
        formData.append('format', 'glb');
        formData.append('optimize', 'true');
        formData.append('generate_texture', 'true');

        // Send to Meshroom API
        const response = await fetch(`${this.config.meshroom.apiUrl}/process`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Meshroom API error: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Download the processed model
        const modelResponse = await fetch(`${this.config.meshroom.apiUrl}/download/${result.jobId}`);
        const modelBlob = await modelResponse.blob();

        return {
            model: modelBlob,
            metadata: {
                jobId: result.jobId,
                processingTime: result.processingTime,
                quality: quality,
                photoCount: photos.length,
                meshStats: result.meshStats,
                textureResolution: result.textureResolution
            }
        };
    }

    async processWithFallback(photos, quality) {
        // Simulate Meshroom processing for development
        console.log('Using fallback processing (simulation)');
        
        await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate processing time
        
        // Generate a simple 3D model based on photo count
        const modelData = this.generateFallbackModel(photos.length, quality);
        
        return {
            model: modelData.blob,
            metadata: {
                jobId: this.generateJobId(),
                processingTime: 5000,
                quality: quality,
                photoCount: photos.length,
                meshStats: {
                    vertices: photos.length * 100,
                    faces: photos.length * 50,
                    textureSize: '1024x1024'
                },
                textureResolution: '1024x1024',
                fallback: true
            }
        };
    }

    generateFallbackModel(photoCount, quality) {
        // Create a simple GLB model for demonstration
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create a simple texture
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#00ffe7');
        gradient.addColorStop(1, '#0066cc');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add some details based on photo count
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.fillText(`Scanned Model`, 50, 100);
        ctx.fillText(`${photoCount} photos`, 50, 150);
        ctx.fillText(`Quality: ${quality}`, 50, 200);
        
        // Convert to blob
        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve({ blob });
            }, 'image/png');
        });
    }

    async completeJob(jobId, modelData) {
        const job = this.processingQueue.get(jobId);
        if (!job) return;

        job.status = 'completed';
        job.completedAt = new Date().toISOString();
        job.modelData = modelData;

        this.processingQueue.set(jobId, job);
        this.activeJobs.delete(jobId);

        // Update UI
        this.updateProcessingUI(job);

        // Save to Supabase
        await this.saveProcessedModel(job);

        console.log('Job completed:', jobId);
    }

    async failJob(jobId, error) {
        const job = this.processingQueue.get(jobId);
        if (!job) return;

        job.status = 'failed';
        job.error = error;
        job.failedAt = new Date().toISOString();

        this.processingQueue.set(jobId, job);
        this.activeJobs.delete(jobId);

        // Update UI
        this.updateProcessingUI(job);

        console.error('Job failed:', jobId, error);
    }

    async saveProcessedModel(job) {
        if (!window.SupabaseIntegration) return;

        try {
            // Upload model to Supabase Storage
            const modelFile = new File([job.modelData.model], `model_${job.id}.glb`, {
                type: 'model/gltf-binary'
            });

            const assetData = await window.SupabaseIntegration.uploadAsset(
                modelFile,
                window.SupabaseIntegration.currentScene?.id,
                '3d-model',
                {
                    scanned: true,
                    photoCount: job.photos,
                    quality: job.quality,
                    processingTime: job.modelData.metadata.processingTime,
                    meshStats: job.modelData.metadata.meshStats,
                    textureResolution: job.modelData.metadata.textureResolution,
                    fallback: job.modelData.metadata.fallback || false,
                    spatial_position: { x: 0, y: 0, z: 0 },
                    ar_compatible: true
                }
            );

            // Track analytics
            await window.SupabaseIntegration.trackInteraction('model_processed', {
                job_id: job.id,
                photo_count: job.photos,
                quality: job.quality,
                processing_time: job.modelData.metadata.processingTime,
                mesh_vertices: job.modelData.metadata.meshStats.vertices,
                mesh_faces: job.modelData.metadata.meshStats.faces
            });

            console.log('Processed model saved:', assetData.id);
            return assetData;

        } catch (error) {
            console.error('Failed to save processed model:', error);
            throw error;
        }
    }

    updateProcessingUI(job) {
        // Update processing UI in scanner
        if (window.Scanner3DIntegration) {
            window.Scanner3DIntegration.updateProcessingStatus(job);
        }

        // Update progress in editor
        const progressElement = document.getElementById('scan-progress-fill');
        if (progressElement) {
            const progress = job.status === 'completed' ? 100 : 
                           job.status === 'failed' ? 0 : 50;
            progressElement.style.width = `${progress}%`;
        }
    }

    getScanQuality() {
        const qualitySelect = document.getElementById('scan-quality');
        return qualitySelect ? qualitySelect.value : 'medium';
    }

    estimateProcessingTime(photoCount, quality) {
        // Estimate processing time based on photo count and quality
        const baseTime = 30; // seconds
        const photoMultiplier = photoCount / 20;
        const qualityMultiplier = quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1;
        
        return Math.round(baseTime * photoMultiplier * qualityMultiplier);
    }

    generateJobId() {
        return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Real-time processing updates
    async setupRealtimeUpdates() {
        if (!this.supabase) return;

        // Subscribe to processing updates
        this.supabase
            .channel('model_processing')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'model_processing_jobs' },
                (payload) => this.handleProcessingUpdate(payload)
            )
            .subscribe();
    }

    handleProcessingUpdate(payload) {
        const jobId = payload.new?.job_id;
        if (jobId && this.processingQueue.has(jobId)) {
            const job = this.processingQueue.get(jobId);
            job.status = payload.new.status;
            job.progress = payload.new.progress;
            
            this.updateProcessingUI(job);
        }
    }

    // Quality assessment
    assessPhotoQuality(photo) {
        // Analyze photo quality for optimal processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        return new Promise((resolve) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                let brightness = 0;
                let contrast = 0;
                
                // Calculate brightness and contrast
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    brightness += (r + g + b) / 3;
                }
                
                brightness /= data.length / 4;
                
                // Quality assessment
                let quality = 'good';
                if (brightness < 50 || brightness > 200) {
                    quality = 'poor';
                } else if (brightness < 100 || brightness > 150) {
                    quality = 'fair';
                }
                
                resolve({
                    quality,
                    brightness,
                    resolution: `${img.width}x${img.height}`,
                    fileSize: photo.blob.size
                });
            };
            
            img.src = URL.createObjectURL(photo.blob);
        });
    }

    // Model optimization
    async optimizeModel(modelBlob, targetFormat = 'glb') {
        // Optimize model for web/AR use
        const optimizationSettings = {
            glb: {
                compression: 'draco',
                textureQuality: 'medium',
                maxTextureSize: 1024
            },
            gltf: {
                compression: 'none',
                textureQuality: 'high',
                maxTextureSize: 2048
            }
        };

        const settings = optimizationSettings[targetFormat];
        
        // In a real implementation, you would use a 3D model optimization library
        // For now, return the original model
        return modelBlob;
    }

    // Cleanup
    destroy() {
        this.processingQueue.clear();
        this.activeJobs.clear();
        
        // Unsubscribe from real-time updates
        if (this.supabase) {
            this.supabase.removeAllChannels();
        }
    }
}

// Initialize Meshroom Integration
window.MeshroomIntegration = new MeshroomIntegration(); 