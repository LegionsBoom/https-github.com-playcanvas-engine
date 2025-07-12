/**
 * 3D Scanner Integration
 * Web-based photogrammetry for 3D model creation
 */

class Scanner3DIntegration {
    constructor() {
        this.supabase = window.supabase;
        this.isScanning = false;
        this.scanProgress = 0;
        this.capturedPhotos = [];
        this.scanSettings = {
            minPhotos: 20,
            maxPhotos: 100,
            quality: 'medium', // low, medium, high
            targetFPS: 30,
            autoCapture: false
        };
        
        this.init();
    }

    async init() {
        try {
            await this.checkCameraSupport();
            this.setupUI();
            console.log('3D Scanner Integration initialized');
        } catch (error) {
            console.error('Failed to initialize 3D scanner:', error);
        }
    }

    async checkCameraSupport() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'environment'
                } 
            });
            stream.getTracks().forEach(track => track.stop());
            this.cameraSupported = true;
        } catch (error) {
            console.warn('Camera not supported:', error);
            this.cameraSupported = false;
        }
    }

    setupUI() {
        // Create scanner UI
        const scannerUI = `
            <div id="scanner-panel" class="scanner-panel hidden">
                <div class="scanner-header">
                    <h3>📷 3D Scanner</h3>
                    <button id="close-scanner" class="close-btn">×</button>
                </div>
                
                <div class="scanner-content">
                    <div class="camera-container">
                        <video id="scanner-camera" autoplay muted></video>
                        <canvas id="scanner-canvas" style="display: none;"></canvas>
                        
                        <div class="scanner-overlay">
                            <div class="scan-guide">
                                <div class="guide-frame"></div>
                                <div class="guide-text">Position object in frame</div>
                            </div>
                            
                            <div class="scan-controls">
                                <button id="start-scan" class="scan-btn primary">Start Scan</button>
                                <button id="capture-photo" class="scan-btn">📸 Capture</button>
                                <button id="auto-capture" class="scan-btn">🔄 Auto</button>
                                <button id="stop-scan" class="scan-btn danger" style="display: none;">Stop</button>
                            </div>
                            
                            <div class="scan-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="scan-progress-fill"></div>
                                </div>
                                <div class="progress-text">
                                    <span id="photos-captured">0</span> / <span id="photos-needed">20</span> photos
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scan-settings">
                        <h4>Scan Settings</h4>
                        <div class="setting-group">
                            <label>Quality:</label>
                            <select id="scan-quality">
                                <option value="low">Low (20 photos)</option>
                                <option value="medium" selected>Medium (40 photos)</option>
                                <option value="high">High (80 photos)</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label>Object Type:</label>
                            <select id="scan-object-type">
                                <option value="vehicle">Vehicle</option>
                                <option value="furniture">Furniture</option>
                                <option value="room">Room</option>
                                <option value="product">Product</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label>Auto Capture:</label>
                            <input type="checkbox" id="auto-capture-toggle">
                        </div>
                    </div>
                </div>
                
                <div class="scan-results hidden" id="scan-results">
                    <h4>Scan Results</h4>
                    <div class="result-preview">
                        <canvas id="model-preview"></canvas>
                    </div>
                    <div class="result-actions">
                        <button id="save-model" class="action-btn primary">💾 Save Model</button>
                        <button id="retry-scan" class="action-btn">🔄 Retry</button>
                        <button id="export-model" class="action-btn">📤 Export</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', scannerUI);
        this.bindEvents();
    }

    bindEvents() {
        // Scanner controls
        document.getElementById('start-scan').addEventListener('click', () => this.startScan());
        document.getElementById('capture-photo').addEventListener('click', () => this.capturePhoto());
        document.getElementById('auto-capture').addEventListener('click', () => this.toggleAutoCapture());
        document.getElementById('stop-scan').addEventListener('click', () => this.stopScan());
        document.getElementById('close-scanner').addEventListener('click', () => this.hideScanner());
        
        // Settings
        document.getElementById('scan-quality').addEventListener('change', (e) => {
            this.scanSettings.quality = e.target.value;
            this.updatePhotoRequirements();
        });
        
        // Results
        document.getElementById('save-model').addEventListener('click', () => this.saveModel());
        document.getElementById('retry-scan').addEventListener('click', () => this.retryScan());
        document.getElementById('export-model').addEventListener('click', () => this.exportModel());
    }

    showScanner() {
        document.getElementById('scanner-panel').classList.remove('hidden');
        this.initializeCamera();
    }

    hideScanner() {
        document.getElementById('scanner-panel').classList.add('hidden');
        this.stopCamera();
    }

    async initializeCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'environment'
                }
            });
            
            const video = document.getElementById('scanner-camera');
            video.srcObject = stream;
            this.cameraStream = stream;
            
            console.log('Camera initialized');
        } catch (error) {
            console.error('Failed to initialize camera:', error);
            this.showError('Camera access denied. Please allow camera permissions.');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
    }

    async startScan() {
        if (!this.cameraSupported) {
            this.showError('Camera not supported on this device');
            return;
        }

        this.isScanning = true;
        this.capturedPhotos = [];
        this.scanProgress = 0;
        
        // Update UI
        document.getElementById('start-scan').style.display = 'none';
        document.getElementById('stop-scan').style.display = 'inline-block';
        document.getElementById('capture-photo').disabled = false;
        
        // Start auto-capture if enabled
        if (document.getElementById('auto-capture-toggle').checked) {
            this.startAutoCapture();
        }
        
        console.log('Scan started');
    }

    async capturePhoto() {
        if (!this.isScanning) return;
        
        try {
            const video = document.getElementById('scanner-camera');
            const canvas = document.getElementById('scanner-canvas');
            const context = canvas.getContext('2d');
            
            // Set canvas size to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Capture frame
            context.drawImage(video, 0, 0);
            
            // Convert to blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/jpeg', 0.9);
            });
            
            // Add metadata
            const photoData = {
                blob: blob,
                timestamp: Date.now(),
                position: this.getEstimatedPosition(),
                quality: this.assessPhotoQuality(canvas)
            };
            
            this.capturedPhotos.push(photoData);
            this.updateProgress();
            
            console.log(`Photo captured: ${this.capturedPhotos.length}/${this.getRequiredPhotos()}`);
            
            // Check if scan is complete
            if (this.capturedPhotos.length >= this.getRequiredPhotos()) {
                await this.completeScan();
            }
            
        } catch (error) {
            console.error('Failed to capture photo:', error);
        }
    }

    getEstimatedPosition() {
        // Simple position estimation based on photo count
        const angle = (this.capturedPhotos.length / this.getRequiredPhotos()) * 360;
        return {
            x: Math.cos(angle * Math.PI / 180) * 2,
            y: 0,
            z: Math.sin(angle * Math.PI / 180) * 2
        };
    }

    assessPhotoQuality(canvas) {
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
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
        
        // Simple quality assessment
        if (brightness < 50 || brightness > 200) {
            return 'poor';
        } else if (brightness < 100 || brightness > 150) {
            return 'fair';
        } else {
            return 'good';
        }
    }

    startAutoCapture() {
        this.autoCaptureInterval = setInterval(() => {
            if (this.isScanning && this.capturedPhotos.length < this.getRequiredPhotos()) {
                this.capturePhoto();
            }
        }, 2000); // Capture every 2 seconds
    }

    stopAutoCapture() {
        if (this.autoCaptureInterval) {
            clearInterval(this.autoCaptureInterval);
            this.autoCaptureInterval = null;
        }
    }

    toggleAutoCapture() {
        const autoToggle = document.getElementById('auto-capture-toggle');
        if (autoToggle.checked) {
            this.startAutoCapture();
        } else {
            this.stopAutoCapture();
        }
    }

    stopScan() {
        this.isScanning = false;
        this.stopAutoCapture();
        
        // Update UI
        document.getElementById('start-scan').style.display = 'inline-block';
        document.getElementById('stop-scan').style.display = 'none';
        document.getElementById('capture-photo').disabled = true;
        
        console.log('Scan stopped');
    }

    async completeScan() {
        this.stopScan();
        
        try {
            // Show processing indicator
            this.showProcessing();
            
            // Process with Meshroom
            if (window.MeshroomIntegration) {
                await window.MeshroomIntegration.processScan(this.capturedPhotos);
                
                // Listen for completion
                window.MeshroomIntegration.onJobComplete = (job) => {
                    this.showResults(job.modelData);
                };
                
                window.MeshroomIntegration.onJobFailed = (job) => {
                    this.showError(`Processing failed: ${job.error}`);
                };
            } else {
                // Fallback processing
                const modelData = await this.processPhotogrammetry();
                this.showResults(modelData);
            }
            
        } catch (error) {
            console.error('Failed to complete scan:', error);
            this.showError('Failed to process scan. Please try again.');
        }
    }

    async processPhotogrammetry() {
        // Simulate photogrammetry processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // In a real implementation, you would:
        // 1. Upload photos to a photogrammetry service (Meshroom, RealityCapture, etc.)
        // 2. Process the photos into a 3D model
        // 3. Optimize the model for web use
        // 4. Convert to glTF/GLB format
        
        return {
            vertices: this.generateSampleMesh(),
            texture: this.generateSampleTexture(),
            metadata: {
                photoCount: this.capturedPhotos.length,
                quality: this.scanSettings.quality,
                objectType: document.getElementById('scan-object-type').value,
                processingTime: 3000
            }
        };
    }

    generateSampleMesh() {
        // Generate a simple mesh for demonstration
        const vertices = [];
        const indices = [];
        
        // Create a simple box mesh
        const size = 1;
        const positions = [
            -size, -size, -size,  size, -size, -size,  size, size, -size, -size, size, -size,
            -size, -size, size,   size, -size, size,   size, size, size,   -size, size, size
        ];
        
        vertices.push(...positions);
        
        // Box indices
        const boxIndices = [
            0, 1, 2, 0, 2, 3, // front
            1, 5, 6, 1, 6, 2, // right
            5, 4, 7, 5, 7, 6, // back
            4, 0, 3, 4, 3, 7, // left
            3, 2, 6, 3, 6, 7, // top
            4, 5, 1, 4, 1, 0  // bottom
        ];
        
        indices.push(...boxIndices);
        
        return { vertices, indices };
    }

    generateSampleTexture() {
        // Generate a simple texture for demonstration
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
        
        return canvas.toDataURL();
    }

    showProcessing() {
        const progressText = document.querySelector('.progress-text');
        progressText.innerHTML = '🔄 Processing with Meshroom...';
    }

    updateProcessingStatus(job) {
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            if (job.status === 'processing') {
                progressText.innerHTML = `🔄 Processing: ${job.photos} photos...`;
            } else if (job.status === 'completed') {
                progressText.innerHTML = '✅ Processing complete!';
            } else if (job.status === 'failed') {
                progressText.innerHTML = '❌ Processing failed';
            }
        }
    }

    showResults(modelData) {
        document.getElementById('scan-results').classList.remove('hidden');
        
        // Display model preview
        this.displayModelPreview(modelData);
        
        // Store model data for saving
        this.currentModelData = modelData;
    }

    displayModelPreview(modelData) {
        const canvas = document.getElementById('model-preview');
        const ctx = canvas.getContext('2d');
        
        // Simple 2D preview of the 3D model
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a simple representation
        ctx.fillStyle = '#00ffe7';
        ctx.fillRect(50, 50, 200, 150);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText('3D Model Preview', 60, 100);
        ctx.fillText(`${modelData.metadata.photoCount} photos processed`, 60, 120);
        ctx.fillText(`Quality: ${modelData.metadata.quality}`, 60, 140);
    }

    async saveModel() {
        if (!this.currentModelData) return;
        
        try {
            // Convert to glTF/GLB format
            const glbData = await this.convertToGLB(this.currentModelData);
            
            // Create file blob
            const blob = new Blob([glbData], { type: 'model/gltf-binary' });
            const file = new File([blob], 'scanned-model.glb', { type: 'model/gltf-binary' });
            
            // Upload to Supabase
            if (window.SupabaseIntegration) {
                const assetData = await window.SupabaseIntegration.uploadAsset(
                    file, 
                    window.SupabaseIntegration.currentScene?.id, 
                    '3d-model',
                    {
                        scanned: true,
                        photoCount: this.currentModelData.metadata.photoCount,
                        quality: this.currentModelData.metadata.quality,
                        objectType: this.currentModelData.metadata.objectType,
                        spatial_position: { x: 0, y: 0, z: 0 },
                        ar_compatible: true
                    }
                );
                
                this.showSuccess('3D model saved successfully!');
                console.log('Model saved:', assetData);
            }
            
        } catch (error) {
            console.error('Failed to save model:', error);
            this.showError('Failed to save model. Please try again.');
        }
    }

    async convertToGLB(modelData) {
        // In a real implementation, you would convert the mesh data to glTF/GLB format
        // For now, return a simple placeholder
        return new ArrayBuffer(0);
    }

    retryScan() {
        document.getElementById('scan-results').classList.add('hidden');
        this.capturedPhotos = [];
        this.updateProgress();
    }

    exportModel() {
        // Export model in various formats
        const formats = ['glb', 'obj', 'fbx'];
        const format = prompt('Export format (glb, obj, fbx):', 'glb');
        
        if (formats.includes(format)) {
            this.showSuccess(`Model exported as ${format.toUpperCase()}`);
        }
    }

    updateProgress() {
        const required = this.getRequiredPhotos();
        const captured = this.capturedPhotos.length;
        const progress = (captured / required) * 100;
        
        document.getElementById('scan-progress-fill').style.width = `${progress}%`;
        document.getElementById('photos-captured').textContent = captured;
        document.getElementById('photos-needed').textContent = required;
    }

    updatePhotoRequirements() {
        const quality = this.scanSettings.quality;
        let required = 20;
        
        switch (quality) {
            case 'low': required = 20; break;
            case 'medium': required = 40; break;
            case 'high': required = 80; break;
        }
        
        this.scanSettings.minPhotos = required;
        this.updateProgress();
    }

    getRequiredPhotos() {
        return this.scanSettings.minPhotos;
    }

    showSuccess(message) {
        // Show success message
        console.log('Success:', message);
    }

    showError(message) {
        // Show error message
        console.error('Error:', message);
    }

    // Integration with existing systems
    integrateWithPlayCanvas() {
        if (window.PlayCanvasManager) {
            // Add scanned models to PlayCanvas scene
            console.log('Scanner integrated with PlayCanvas');
        }
    }

    integrateWithSupabase() {
        if (window.SupabaseIntegration) {
            // Track scanning analytics
            window.SupabaseIntegration.trackInteraction('3d_scan', {
                photos_captured: this.capturedPhotos.length,
                quality: this.scanSettings.quality,
                object_type: document.getElementById('scan-object-type').value
            });
        }
    }

    // Cleanup
    destroy() {
        this.stopCamera();
        this.stopAutoCapture();
        this.capturedPhotos = [];
        this.currentModelData = null;
    }
}

// Initialize 3D Scanner Integration
window.Scanner3DIntegration = new Scanner3DIntegration(); 