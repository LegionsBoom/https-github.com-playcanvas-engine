/**
 * AI Image Cleaner
 * Integration with open source AI models for image enhancement
 */

class AIImageCleaner {
    constructor() {
        this.models = new Map();
        this.currentModel = null;
        this.processingQueue = [];
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.loadAIModels();
        this.setupProcessingQueue();
        this.initializeUI();
    }

    loadAIModels() {
        // Real-ESRGAN - High-quality image upscaling
        this.models.set('real-esrgan', {
            name: 'Real-ESRGAN',
            description: 'High-quality image upscaling and restoration',
            capabilities: ['upscaling', 'denoising', 'restoration'],
            apiEndpoint: '/api/ai/real-esrgan',
            parameters: {
                scale: 4,
                tile_size: 400,
                tile_pad: 10,
                pre_pad: 0,
                half: true
            }
        });

        // GFPGAN - Face restoration and enhancement
        this.models.set('gfpgan', {
            name: 'GFPGAN',
            description: 'Face restoration and enhancement',
            capabilities: ['face_restoration', 'enhancement', 'denoising'],
            apiEndpoint: '/api/ai/gfpgan',
            parameters: {
                version: '1.4',
                upscale: 2,
                arch: 'clean',
                channel_multiplier: 2,
                bg_upsampler: 'realesrgan'
            }
        });

        // CodeFormer - Face restoration with codebook
        this.models.set('codeformer', {
            name: 'CodeFormer',
            description: 'Face restoration with codebook prior',
            capabilities: ['face_restoration', 'codebook_prior', 'enhancement'],
            apiEndpoint: '/api/ai/codeformer',
            parameters: {
                upscale: 2,
                codeformer_fidelity: 0.7,
                background_enhance: true,
                face_upsample: true
            }
        });

        // RestoreFormer - Image restoration
        this.models.set('restoreformer', {
            name: 'RestoreFormer',
            description: 'General image restoration and enhancement',
            capabilities: ['restoration', 'enhancement', 'denoising'],
            apiEndpoint: '/api/ai/restoreformer',
            parameters: {
                scale: 1,
                window_size: 8,
                num_blocks: [1, 1, 1, 28]
            }
        });

        // SwinIR - Image restoration with Swin Transformer
        this.models.set('swinir', {
            name: 'SwinIR',
            description: 'Image restoration using Swin Transformer',
            capabilities: ['restoration', 'upscaling', 'denoising'],
            apiEndpoint: '/api/ai/swinir',
            parameters: {
                scale: 4,
                window_size: 8,
                task: 'real_sr'
            }
        });

        // Set default model
        this.currentModel = 'real-esrgan';
    }

    setupProcessingQueue() {
        this.processingQueue = [];
        this.isProcessing = false;
    }

    initializeUI() {
        // Create AI Image Cleaner UI
        this.createCleanerUI();
        this.setupEventListeners();
    }

    createCleanerUI() {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');

        title.textContent = 'AI Image Cleaner';
        content.innerHTML = `
            <div class="ai-cleaner-container">
                <div class="cleaner-header">
                    <h3>AI Image Enhancement</h3>
                    <p>Clean and enhance scanned images using advanced AI models</p>
                </div>

                <div class="model-selection">
                    <h4>Select AI Model</h4>
                    <div class="model-grid">
                        ${this.createModelSelectionHTML()}
                    </div>
                </div>

                <div class="image-upload">
                    <h4>Upload Images</h4>
                    <div class="upload-area" id="upload-area">
                        <div class="upload-prompt">
                            <span class="upload-icon">📷</span>
                            <p>Drag & drop images here or click to browse</p>
                            <input type="file" id="image-upload" multiple accept="image/*" style="display: none;">
                            <button id="browse-images" class="upload-btn">Browse Images</button>
                        </div>
                    </div>
                </div>

                <div class="processing-options">
                    <h4>Processing Options</h4>
                    <div class="options-grid">
                        <div class="option-group">
                            <label>Upscale Factor</label>
                            <select id="upscale-factor">
                                <option value="2">2x</option>
                                <option value="4" selected>4x</option>
                                <option value="8">8x</option>
                            </select>
                        </div>
                        <div class="option-group">
                            <label>Quality</label>
                            <select id="quality-level">
                                <option value="fast">Fast</option>
                                <option value="balanced" selected>Balanced</option>
                                <option value="high">High Quality</option>
                            </select>
                        </div>
                        <div class="option-group">
                            <label>Enhancement Type</label>
                            <select id="enhancement-type">
                                <option value="general">General Enhancement</option>
                                <option value="face">Face Restoration</option>
                                <option value="texture">Texture Enhancement</option>
                                <option value="color">Color Correction</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="batch-processing">
                    <h4>Batch Processing</h4>
                    <div class="batch-controls">
                        <button id="process-all" class="process-btn">Process All Images</button>
                        <button id="process-selected" class="process-btn">Process Selected</button>
                        <button id="clear-queue" class="clear-btn">Clear Queue</button>
                    </div>
                </div>

                <div class="processing-status">
                    <h4>Processing Status</h4>
                    <div class="status-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                        <div class="status-text" id="status-text">Ready to process</div>
                    </div>
                </div>

                <div class="results-gallery">
                    <h4>Enhanced Images</h4>
                    <div class="gallery-grid" id="results-gallery">
                        <!-- Enhanced images will appear here -->
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    createModelSelectionHTML() {
        let html = '';
        this.models.forEach((model, key) => {
            const isSelected = key === this.currentModel;
            html += `
                <div class="model-card ${isSelected ? 'selected' : ''}" data-model="${key}">
                    <div class="model-header">
                        <h5>${model.name}</h5>
                        <div class="model-badge">${model.capabilities.join(', ')}</div>
                    </div>
                    <div class="model-description">${model.description}</div>
                    <div class="model-capabilities">
                        ${model.capabilities.map(cap => `<span class="capability">${cap}</span>`).join('')}
                    </div>
                </div>
            `;
        });
        return html;
    }

    setupEventListeners() {
        // Model selection
        document.querySelectorAll('.model-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectModel(e.currentTarget.dataset.model);
            });
        });

        // File upload
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('image-upload');
        const browseBtn = document.getElementById('browse-images');

        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                const files = Array.from(e.dataTransfer.files);
                this.handleImageUpload(files);
            });
        }

        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.handleImageUpload(files);
            });
        }

        // Processing buttons
        document.getElementById('process-all')?.addEventListener('click', () => {
            this.processAllImages();
        });

        document.getElementById('process-selected')?.addEventListener('click', () => {
            this.processSelectedImages();
        });

        document.getElementById('clear-queue')?.addEventListener('click', () => {
            this.clearProcessingQueue();
        });
    }

    selectModel(modelKey) {
        this.currentModel = modelKey;
        
        // Update UI
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-model="${modelKey}"]`)?.classList.add('selected');
        
        this.showFeedback(`Selected AI model: ${this.models.get(modelKey).name}`);
    }

    handleImageUpload(files) {
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                this.addImageToQueue(file);
            }
        });
        
        this.showFeedback(`Added ${files.length} image(s) to processing queue`);
    }

    addImageToQueue(file) {
        const imageItem = {
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: file.size,
            status: 'queued',
            originalUrl: null,
            enhancedUrl: null
        };

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imageItem.originalUrl = e.target.result;
            this.updateQueueDisplay();
        };
        reader.readAsDataURL(file);

        this.processingQueue.push(imageItem);
    }

    updateQueueDisplay() {
        const queueContainer = document.getElementById('processing-queue');
        if (!queueContainer) return;

        queueContainer.innerHTML = this.processingQueue.map(item => `
            <div class="queue-item ${item.status}" data-id="${item.id}">
                <div class="item-preview">
                    <img src="${item.originalUrl}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-size">${this.formatFileSize(item.size)}</div>
                    <div class="item-status">${item.status}</div>
                </div>
                <div class="item-actions">
                    <button class="process-single" data-id="${item.id}">Process</button>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async processAllImages() {
        if (this.processingQueue.length === 0) {
            this.showFeedback('No images in queue to process');
            return;
        }

        this.isProcessing = true;
        this.updateStatus('Starting batch processing...');

        for (let i = 0; i < this.processingQueue.length; i++) {
            const item = this.processingQueue[i];
            if (item.status === 'queued') {
                await this.processImage(item, i + 1, this.processingQueue.length);
            }
        }

        this.isProcessing = false;
        this.updateStatus('Batch processing completed');
        this.showFeedback(`Enhanced ${this.processingQueue.filter(item => item.status === 'completed').length} images`);
    }

    async processSelectedImages() {
        const selectedItems = this.processingQueue.filter(item => 
            document.querySelector(`[data-id="${item.id}"]`)?.classList.contains('selected')
        );

        if (selectedItems.length === 0) {
            this.showFeedback('No images selected for processing');
            return;
        }

        this.isProcessing = true;
        this.updateStatus('Processing selected images...');

        for (let i = 0; i < selectedItems.length; i++) {
            const item = selectedItems[i];
            await this.processImage(item, i + 1, selectedItems.length);
        }

        this.isProcessing = false;
        this.updateStatus('Selected images processing completed');
    }

    async processImage(item, current, total) {
        item.status = 'processing';
        this.updateQueueDisplay();
        this.updateStatus(`Processing ${item.name} (${current}/${total})`);

        try {
            // Get processing options
            const options = this.getProcessingOptions();
            
            // Process with AI model
            const enhancedImage = await this.processWithAIModel(item.file, options);
            
            item.enhancedUrl = enhancedImage;
            item.status = 'completed';
            
            this.updateProgress((current / total) * 100);
            this.addToResultsGallery(item);
            
        } catch (error) {
            console.error('Image processing error:', error);
            item.status = 'error';
            this.showFeedback(`Error processing ${item.name}: ${error.message}`);
        }

        this.updateQueueDisplay();
    }

    getProcessingOptions() {
        return {
            model: this.currentModel,
            upscaleFactor: parseInt(document.getElementById('upscale-factor').value),
            qualityLevel: document.getElementById('quality-level').value,
            enhancementType: document.getElementById('enhancement-type').value,
            modelParams: this.models.get(this.currentModel).parameters
        };
    }

    async processWithAIModel(imageFile, options) {
        // Simulate AI processing with different models
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // In a real implementation, this would call the AI model API
                    const enhancedImage = this.simulateAIProcessing(imageFile, options);
                    resolve(enhancedImage);
                } catch (error) {
                    reject(error);
                }
            }, 2000 + Math.random() * 3000); // Simulate processing time
        });
    }

    simulateAIProcessing(imageFile, options) {
        // Create a canvas to simulate AI enhancement
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create enhanced image (simulated)
        const img = new Image();
        img.onload = () => {
            const scale = options.upscaleFactor;
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            // Apply simulated AI enhancements based on model
            ctx.filter = this.getEnhancementFilter(options.model, options.enhancementType);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Add some simulated AI effects
            this.applySimulatedAIEffects(ctx, options);
        };
        
        img.src = URL.createObjectURL(imageFile);
        
        return canvas.toDataURL('image/jpeg', 0.9);
    }

    getEnhancementFilter(model, enhancementType) {
        const filters = {
            'real-esrgan': 'contrast(1.2) brightness(1.1) saturate(1.1)',
            'gfpgan': 'contrast(1.1) brightness(1.05) saturate(1.05)',
            'codeformer': 'contrast(1.15) brightness(1.08) saturate(1.08)',
            'restoreformer': 'contrast(1.1) brightness(1.05) saturate(1.05)',
            'swinir': 'contrast(1.2) brightness(1.1) saturate(1.1)'
        };
        
        return filters[model] || 'contrast(1.1) brightness(1.05)';
    }

    applySimulatedAIEffects(ctx, options) {
        // Apply different effects based on enhancement type
        switch (options.enhancementType) {
            case 'face':
                // Simulate face restoration
                this.simulateFaceRestoration(ctx);
                break;
            case 'texture':
                // Simulate texture enhancement
                this.simulateTextureEnhancement(ctx);
                break;
            case 'color':
                // Simulate color correction
                this.simulateColorCorrection(ctx);
                break;
            default:
                // General enhancement
                this.simulateGeneralEnhancement(ctx);
        }
    }

    simulateFaceRestoration(ctx) {
        // Simulate face restoration effects
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Enhance skin tones
            if (data[i] > data[i + 1] && data[i] > data[i + 2]) {
                data[i] = Math.min(255, data[i] * 1.1); // Enhance red channel
            }
            // Smooth skin texture
            if (i > 0 && i < data.length - 4) {
                data[i] = (data[i] + data[i - 4] + data[i + 4]) / 3;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    simulateTextureEnhancement(ctx) {
        // Simulate texture enhancement
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Enhance contrast for texture
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128));
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128));
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    simulateColorCorrection(ctx) {
        // Simulate color correction
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Auto white balance
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = Math.min(255, data[i] * (128 / avg));
            data[i + 1] = Math.min(255, data[i + 1] * (128 / avg));
            data[i + 2] = Math.min(255, data[i + 2] * (128 / avg));
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    simulateGeneralEnhancement(ctx) {
        // Simulate general image enhancement
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Enhance overall image quality
            data[i] = Math.min(255, data[i] * 1.05);
            data[i + 1] = Math.min(255, data[i + 1] * 1.05);
            data[i + 2] = Math.min(255, data[i + 2] * 1.05);
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    addToResultsGallery(item) {
        const gallery = document.getElementById('results-gallery');
        if (!gallery) return;

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-preview">
                <img src="${item.enhancedUrl}" alt="${item.name}">
            </div>
            <div class="result-info">
                <div class="result-name">${item.name}</div>
                <div class="result-model">${this.models.get(this.currentModel).name}</div>
            </div>
            <div class="result-actions">
                <button class="download-result" data-id="${item.id}">Download</button>
                <button class="compare-result" data-id="${item.id}">Compare</button>
            </div>
        `;

        gallery.appendChild(resultItem);
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    updateStatus(message) {
        const statusText = document.getElementById('status-text');
        if (statusText) {
            statusText.textContent = message;
        }
    }

    clearProcessingQueue() {
        this.processingQueue = [];
        this.updateQueueDisplay();
        this.updateStatus('Queue cleared');
        this.showFeedback('Processing queue cleared');
    }

    showFeedback(message) {
        if (window.SMeditor) {
            window.SMeditor.showFeedback(message);
        } else {
            console.log(message);
        }
    }

    // Integration with 3D Scanner
    integrateWithScanner(scannedImages) {
        scannedImages.forEach(image => {
            this.addImageToQueue(image);
        });
        
        this.showFeedback(`Added ${scannedImages.length} scanned images to AI cleaner queue`);
    }

    // Export enhanced images
    exportEnhancedImages() {
        const enhancedImages = this.processingQueue.filter(item => item.status === 'completed');
        
        if (enhancedImages.length === 0) {
            this.showFeedback('No enhanced images to export');
            return;
        }

        // Create zip file with enhanced images
        this.createImageZip(enhancedImages);
    }

    async createImageZip(images) {
        // In a real implementation, this would create a zip file
        // For now, we'll simulate the download
        this.showFeedback(`Preparing ${images.length} enhanced images for download...`);
        
        setTimeout(() => {
            this.showFeedback('Enhanced images ready for download!');
        }, 2000);
    }
}

// Initialize AI Image Cleaner
window.AIImageCleaner = new AIImageCleaner(); 