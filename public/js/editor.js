class SMeditor {
    constructor() {
        this.currentTemplate = 'grid-3x3';
        this.currentWorld = 'flat';
        this.containers = new Map();
        this.selectedContainer = null;
        this.physicsMode = 'floating';
        this.containerSpacing = 4;
        this.containerScale = 1;
        this.sceneAnalytics = {
            totalSize: 0,
            completionPercentage: 0,
            estimatedLoadTime: 0
        };
        this.brandSettings = {
            primaryColor: '#007bff',
            companyName: '',
            logo: null
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateContainers();
        this.setupDragAndDrop();
        this.updateSceneStats();
        this.initializeValidation();
        this.showFeedback('🚀 SMeditor Cockpit Initialized - Ready for spatial content creation!');
    }

    setupEventListeners() {
        // Template selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.switchTemplate(template);
            });
        });

        // World toggle
        document.querySelectorAll('.world-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const world = e.target.id.replace('-world', '');
                this.switchWorld(world);
            });
        });

        // Brand settings
        document.getElementById('primary-color').addEventListener('change', (e) => {
            this.brandSettings.primaryColor = e.target.value;
            this.updateBrandPreview();
        });

        document.getElementById('company-name').addEventListener('input', (e) => {
            this.brandSettings.companyName = e.target.value;
            this.validateScene();
        });

        document.getElementById('logo-upload').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.uploadLogo(e.target.files[0]);
            }
        });

        // Preview and publish buttons
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.openPreview();
        });

        document.getElementById('publish-btn').addEventListener('click', () => {
            this.publishScene();
        });

        // Modal controls
        document.querySelectorAll('.close').forEach(close => {
            close.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        document.getElementById('copy-link').addEventListener('click', () => {
            this.copyShareLink();
        });

        // Cockpit Controls
        document.getElementById('physics-mode').addEventListener('change', (e) => {
            this.physicsMode = e.target.value;
            this.updatePhysics();
            this.showFeedback(`Physics mode changed to: ${e.target.value}`);
        });

        document.getElementById('container-spacing').addEventListener('input', (e) => {
            this.containerSpacing = parseFloat(e.target.value);
            this.updateContainerLayout();
        });

        document.getElementById('container-scale').addEventListener('input', (e) => {
            this.containerScale = parseFloat(e.target.value);
            this.updateContainerScale();
        });

        // Quick Actions
        document.getElementById('clear-all').addEventListener('click', () => {
            this.clearAllContainers();
        });

        document.getElementById('auto-fill').addEventListener('click', () => {
            this.autoFillContainers();
        });

        document.getElementById('randomize').addEventListener('click', () => {
            this.randomizeContainers();
        });
    }

    switchTemplate(template) {
        // Update active template
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-template="${template}"]`).classList.add('active');
        
        this.currentTemplate = template;
        this.generateContainers();
        this.updateSceneStats();
        this.updateContainerList();
        this.validateScene();
        this.showFeedback(`Template changed to ${template.replace('-', ' ')}`);
        
        // Reset selected container
        this.selectedContainer = null;
        this.showContentEditor(null);
    }

    switchWorld(world) {
        // Update active world
        document.querySelectorAll('.world-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${world}-world`).classList.add('active');
        
        this.currentWorld = world;
    }

    generateContainers() {
        const grid = document.getElementById('container-grid');
        grid.className = `container-grid ${this.currentTemplate}`;
        grid.innerHTML = '';
        
        const containerCounts = {
            'grid-3x3': 9,
            'grid-2x2': 4,
            'linear': 5,
            'circular': 6
        };

        const count = containerCounts[this.currentTemplate];
        
        for (let i = 0; i < count; i++) {
            const container = this.createContainer(i);
            grid.appendChild(container);
        }

        // Special layout for circular
        if (this.currentTemplate === 'circular') {
            this.arrangeCircularContainers();
        }
    }

    createContainer(index) {
        const container = document.createElement('div');
        container.className = 'container-slot';
        container.dataset.index = index;
        
        container.addEventListener('click', () => {
            this.selectContainer(index);
        });

        return container;
    }

    arrangeCircularContainers() {
        const grid = document.getElementById('container-grid');
        const containers = grid.children;
        const radius = 120;
        const centerX = grid.offsetWidth / 2;
        const centerY = grid.offsetHeight / 2;

        for (let i = 0; i < containers.length; i++) {
            const angle = (i / containers.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle) - 50;
            const y = centerY + radius * Math.sin(angle) - 50;
            
            containers[i].style.position = 'absolute';
            containers[i].style.left = `${x}px`;
            containers[i].style.top = `${y}px`;
            containers[i].style.width = '100px';
            containers[i].style.height = '100px';
        }
    }

    setupDragAndDrop() {
        // Make data balls draggable
        document.querySelectorAll('.data-ball').forEach(ball => {
            ball.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', ball.dataset.type);
                ball.style.opacity = '0.5';
            });

            ball.addEventListener('dragend', (e) => {
                ball.style.opacity = '1';
            });
        });

        // Make container slots drop targets
        document.addEventListener('dragover', (e) => {
            if (e.target.classList.contains('container-slot')) {
                e.preventDefault();
                e.target.classList.add('drag-over');
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('container-slot')) {
                e.target.classList.remove('drag-over');
            }
        });

        document.addEventListener('drop', (e) => {
            if (e.target.classList.contains('container-slot')) {
                e.preventDefault();
                e.target.classList.remove('drag-over');
                
                const dataType = e.dataTransfer.getData('text/plain');
                const containerIndex = parseInt(e.target.dataset.index);
                
                this.addDataToContainer(containerIndex, dataType);
            }
        });
    }

    addDataToContainer(containerIndex, dataType) {
        const container = document.querySelector(`[data-index="${containerIndex}"]`);
        
        // Create ball visual
        const ballColors = {
            'image': 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
            'text': 'linear-gradient(135deg, #4ecdc4, #44a08d)',
            'contact': 'linear-gradient(135deg, #feca57, #ff9ff3)',
            'video': 'linear-gradient(135deg, #5f27cd, #00d2d3)',
            '3d-model': 'linear-gradient(135deg, #fd79a8, #6c5ce7)'
        };

        container.innerHTML = `
            <div class="slot-content">
                <div class="slot-ball" style="background: ${ballColors[dataType]}"></div>
                <span>${dataType.replace('-', ' ').toUpperCase()}</span>
            </div>
        `;
        
        container.classList.add('filled');
        
        // Store container data
        this.containers.set(containerIndex, {
            type: dataType,
            content: null
        });

        // Update cockpit systems
        this.updateSceneStats();
        this.updateContainerList();
        this.validateScene();

        // Auto-select for editing
        this.selectContainer(containerIndex);
        
        this.showFeedback(`${dataType.replace('-', ' ').toUpperCase()} data added to container ${containerIndex + 1}`);
    }

    selectContainer(index) {
        // Highlight selected container
        document.querySelectorAll('.container-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        const container = document.querySelector(`[data-index="${index}"]`);
        if (container) {
            container.classList.add('selected');
        }
        
        // Update container list highlighting
        document.querySelectorAll('.container-item').forEach(item => {
            item.classList.remove('active');
        });
        
        this.selectedContainer = index;
        this.showContentEditor(index);
        this.updateContainerList();
        
        // Update selected container info
        const containerData = this.containers.get(index);
        const infoEl = document.getElementById('selected-container-info');
        if (containerData) {
            infoEl.textContent = `Container ${index + 1} - ${containerData.type.replace('-', ' ')}`;
        } else {
            infoEl.textContent = '';
        }
    }

    showContentEditor(index) {
        const editorContent = document.getElementById('editor-content');
        const containerData = this.containers.get(index);
        
        if (!containerData) {
            editorContent.innerHTML = `
                <div class="validation-message warning">
                    <strong>No Container Selected</strong><br>
                    Click a container in the layout builder to edit its content.
                </div>
            `;
            return;
        }

        let editorHTML = '';
        
        switch (containerData.type) {
            case 'image':
                editorHTML = `
                    <div class="editor-field">
                        <label>Image Upload</label>
                        <input type="file" id="content-image" accept="image/*">
                    </div>
                    <div class="editor-field">
                        <label>Alt Text</label>
                        <input type="text" id="content-alt" placeholder="Describe the image">
                    </div>
                `;
                break;
                
            case 'text':
                editorHTML = `
                    <div class="editor-field">
                        <label>Title</label>
                        <input type="text" id="content-title" placeholder="Enter title">
                    </div>
                    <div class="editor-field">
                        <label>Message</label>
                        <textarea id="content-message" placeholder="Enter your message for users"></textarea>
                    </div>
                `;
                break;
                
            case 'contact':
                editorHTML = `
                    <div class="editor-field">
                        <label>Name</label>
                        <input type="text" id="content-name" placeholder="Your name">
                    </div>
                    <div class="editor-field">
                        <label>Phone</label>
                        <input type="tel" id="content-phone" placeholder="Phone number">
                    </div>
                    <div class="editor-field">
                        <label>Email</label>
                        <input type="email" id="content-email" placeholder="Email address">
                    </div>
                `;
                break;
                
            case 'video':
                editorHTML = `
                    <div class="editor-field">
                        <label>Video Upload</label>
                        <input type="file" id="content-video" accept="video/*">
                    </div>
                    <div class="editor-field">
                        <label>Video Title</label>
                        <input type="text" id="content-video-title" placeholder="Video title">
                    </div>
                `;
                break;
                
            case '3d-model':
                editorHTML = `
                    <div class="editor-field">
                        <label>3D Model Upload</label>
                        <input type="file" id="content-model" accept=".glb,.gltf">
                    </div>
                    <div class="editor-field">
                        <label>Model Name</label>
                        <input type="text" id="content-model-name" placeholder="Model name">
                    </div>
                    <div class="editor-field">
                        <label>Enable AR View</label>
                        <input type="checkbox" id="content-ar-enabled" checked>
                    </div>
                `;
                break;
        }
        
        editorContent.innerHTML = editorHTML + `
            <button class="btn-primary" onclick="smeditor.saveContainerContent(${index})">
                Save Content
            </button>
        `;
    }

    saveContainerContent(index) {
        const containerData = this.containers.get(index);
        const content = {};
        
        // Gather content based on type
        switch (containerData.type) {
            case 'image':
                const imageFile = document.getElementById('content-image').files[0];
                content.alt = document.getElementById('content-alt').value;
                if (imageFile) {
                    this.uploadFile(imageFile).then(path => {
                        content.src = path;
                        this.updateContainerData(index, content);
                    });
                } else {
                    this.updateContainerData(index, content);
                }
                break;
                
            case 'text':
                content.title = document.getElementById('content-title').value;
                content.message = document.getElementById('content-message').value;
                this.updateContainerData(index, content);
                break;
                
            case 'contact':
                content.name = document.getElementById('content-name').value;
                content.phone = document.getElementById('content-phone').value;
                content.email = document.getElementById('content-email').value;
                this.updateContainerData(index, content);
                break;
                
            case 'video':
                const videoFile = document.getElementById('content-video').files[0];
                content.title = document.getElementById('content-video-title').value;
                if (videoFile) {
                    this.uploadFile(videoFile).then(path => {
                        content.src = path;
                        this.updateContainerData(index, content);
                    });
                } else {
                    this.updateContainerData(index, content);
                }
                break;
                
            case '3d-model':
                const modelFile = document.getElementById('content-model').files[0];
                content.name = document.getElementById('content-model-name').value;
                content.arEnabled = document.getElementById('content-ar-enabled').checked;
                if (modelFile) {
                    this.uploadFile(modelFile).then(path => {
                        content.src = path;
                        this.updateContainerData(index, content);
                    });
                } else {
                    this.updateContainerData(index, content);
                }
                break;
        }
    }

    updateContainerData(index, content) {
        const containerData = this.containers.get(index);
        containerData.content = content;
        this.containers.set(index, containerData);
        
        // Update cockpit systems
        this.updateSceneStats();
        this.validateScene();
        
        this.showFeedback(`Content saved for container ${index + 1}`);
        console.log('Container updated:', index, containerData);
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            return result.path;
        } catch (error) {
            console.error('Upload failed:', error);
            return null;
        }
    }

    async uploadLogo(file) {
        const path = await this.uploadFile(file);
        if (path) {
            this.brandSettings.logo = path;
            this.updateBrandPreview();
        }
    }

    updateBrandPreview() {
        document.documentElement.style.setProperty('--brand-color', this.brandSettings.primaryColor);
    }

    openPreview() {
        const modal = document.getElementById('preview-modal');
        modal.style.display = 'block';
        
        // Initialize PlayCanvas preview
        this.initializePreview();
    }

    initializePreview() {
        const canvas = document.getElementById('preview-canvas');
        
        // PlayCanvas app initialization
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(window)
        });

        app.start();
        
        // Set up basic scene
        this.setupPreviewScene(app);
    }

    setupPreviewScene(app) {
        // Create camera
        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        camera.setPosition(0, 0, 10);
        app.root.addChild(camera);

        // Create light
        const light = new pc.Entity('light');
        light.addComponent('light');
        light.setPosition(2, 1, 5);
        app.root.addChild(light);

        // Generate content containers in 3D space
        this.generatePreviewContainers(app);
    }

    generatePreviewContainers(app) {
        const positions = this.getContainerPositions();
        
        this.containers.forEach((containerData, index) => {
            if (positions[index]) {
                this.createPreviewContainer(app, containerData, positions[index], index);
            }
        });
    }

    getContainerPositions() {
        const positions = {};
        
        switch (this.currentTemplate) {
            case 'grid-3x3':
                for (let i = 0; i < 9; i++) {
                    const row = Math.floor(i / 3);
                    const col = i % 3;
                    positions[i] = {
                        x: (col - 1) * 3,
                        y: (1 - row) * 3,
                        z: 0
                    };
                }
                break;
                
            case 'grid-2x2':
                for (let i = 0; i < 4; i++) {
                    const row = Math.floor(i / 2);
                    const col = i % 2;
                    positions[i] = {
                        x: (col - 0.5) * 3,
                        y: (0.5 - row) * 3,
                        z: 0
                    };
                }
                break;
                
            case 'linear':
                for (let i = 0; i < 5; i++) {
                    positions[i] = {
                        x: (i - 2) * 3,
                        y: 0,
                        z: 0
                    };
                }
                break;
                
            case 'circular':
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * 2 * Math.PI;
                    positions[i] = {
                        x: 4 * Math.cos(angle),
                        y: 4 * Math.sin(angle),
                        z: 0
                    };
                }
                break;
        }
        
        return positions;
    }

    createPreviewContainer(app, containerData, position, index) {
        // Create container entity
        const container = new pc.Entity(`container-${index}`);
        container.setPosition(position.x, position.y, position.z);
        
        // Add visual representation
        container.addComponent('model', {
            type: 'box'
        });
        
        // Add material based on content type
        const material = new pc.StandardMaterial();
        const colors = {
            'image': new pc.Color(1, 0.42, 0.42),
            'text': new pc.Color(0.31, 0.8, 0.77),
            'contact': new pc.Color(0.99, 0.79, 0.34),
            'video': new pc.Color(0.37, 0.15, 0.8),
            '3d-model': new pc.Color(0.99, 0.47, 0.66)
        };
        
        material.diffuse = colors[containerData.type] || new pc.Color(0.5, 0.5, 0.5);
        container.model.material = material;
        
        // Add click interaction
        container.addComponent('element', {
            type: 'image',
            width: 200,
            height: 200
        });
        
        app.root.addChild(container);
    }

    async publishScene() {
        const sceneData = {
            template: this.currentTemplate,
            world: this.currentWorld,
            containers: Object.fromEntries(this.containers),
            brandSettings: this.brandSettings
        };

        try {
            const response = await fetch('/api/scenes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sceneData)
            });

            const result = await response.json();
            
            // Generate QR code
            const qrResponse = await fetch(`/api/qrcode/${result.sceneId}`, {
                method: 'POST'
            });
            const qrResult = await qrResponse.json();
            
            // Show publish modal
            document.getElementById('qr-code').innerHTML = `<img src="${qrResult.qrCode}" alt="QR Code">`;
            document.getElementById('share-link').value = qrResult.url;
            document.getElementById('publish-modal').style.display = 'block';
            
        } catch (error) {
            console.error('Publish failed:', error);
            alert('Failed to publish scene. Please try again.');
        }
    }

    copyShareLink() {
        const linkInput = document.getElementById('share-link');
        linkInput.select();
        document.execCommand('copy');
        
        const button = document.getElementById('copy-link');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }

    // Cockpit Methods
    showFeedback(message, duration = 3000) {
        const feedback = document.getElementById('interactive-feedback');
        const text = document.getElementById('feedback-text');
        
        text.textContent = message;
        feedback.classList.add('show');
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, duration);
    }

    updateSceneStats() {
        const containerCount = this.containers.size;
        const contentCount = Array.from(this.containers.values()).filter(c => c.content).length;
        const completion = containerCount > 0 ? (contentCount / containerCount) * 100 : 0;
        
        document.getElementById('container-count').textContent = containerCount;
        document.getElementById('content-count').textContent = contentCount;
        document.getElementById('scene-progress').style.width = `${completion}%`;
        document.getElementById('completion-progress').style.width = `${completion}%`;
        
        // Calculate file size estimate
        let totalSize = 0;
        this.containers.forEach(container => {
            if (container.content) {
                totalSize += this.estimateContentSize(container);
            }
        });
        
        document.getElementById('scene-size').textContent = this.formatFileSize(totalSize);
        document.getElementById('total-file-size').textContent = this.formatFileSize(totalSize);
        document.getElementById('estimated-load-time').textContent = `~${Math.ceil(totalSize / 1024)}s`;
        
        this.sceneAnalytics = {
            totalSize,
            completionPercentage: completion,
            estimatedLoadTime: Math.ceil(totalSize / 1024)
        };
    }

    estimateContentSize(container) {
        let size = 1; // Base size in KB
        
        switch (container.type) {
            case 'image': size += 50; break;
            case 'video': size += 500; break;
            case '3d-model': size += 200; break;
            case 'text': size += 2; break;
            case 'contact': size += 1; break;
        }
        
        return size;
    }

    formatFileSize(kb) {
        if (kb < 1024) return `${Math.round(kb)}KB`;
        return `${(kb / 1024).toFixed(1)}MB`;
    }

    updateContainerList() {
        const containerList = document.getElementById('container-list');
        containerList.innerHTML = '';
        
        this.containers.forEach((container, index) => {
            const item = document.createElement('div');
            item.className = `container-item ${this.selectedContainer === index ? 'active' : ''}`;
            item.addEventListener('click', () => this.selectContainer(index));
            
            const ballColors = {
                'image': '#ff6b6b',
                'text': '#4ecdc4',
                'contact': '#feca57',
                'video': '#5f27cd',
                '3d-model': '#fd79a8'
            };
            
            item.innerHTML = `
                <div class="container-preview" style="background: ${ballColors[container.type] || '#ddd'}"></div>
                <div class="container-info">
                    <div class="container-name">Container ${index + 1}</div>
                    <div class="container-type">${container.type.replace('-', ' ')}</div>
                </div>
            `;
            
            containerList.appendChild(item);
        });
    }

    initializeValidation() {
        this.validateScene();
    }

    validateScene() {
        const validationContainer = document.getElementById('validation-messages');
        const messages = [];
        
        // Check for empty containers
        const totalContainers = this.getContainerCount();
        const filledContainers = this.containers.size;
        
        if (filledContainers === 0) {
            messages.push({
                type: 'warning',
                message: 'No content added yet. Start by dragging data balls into containers.'
            });
        } else if (filledContainers < totalContainers) {
            messages.push({
                type: 'warning',
                message: `${totalContainers - filledContainers} containers are still empty.`
            });
        }
        
        // Check for incomplete content
        let incompleteContent = 0;
        this.containers.forEach(container => {
            if (!container.content || Object.keys(container.content).length === 0) {
                incompleteContent++;
            }
        });
        
        if (incompleteContent > 0) {
            messages.push({
                type: 'error',
                message: `${incompleteContent} containers have no content. Click to edit them.`
            });
        }
        
        // Check brand settings
        if (!this.brandSettings.companyName) {
            messages.push({
                type: 'warning',
                message: 'Add your company name for better branding.'
            });
        }
        
        // Show success if everything is complete
        if (messages.length === 0) {
            messages.push({
                type: 'success',
                message: '✅ Scene is complete and ready to publish!'
            });
        }
        
        // Render messages
        validationContainer.innerHTML = messages.map(msg => `
            <div class="validation-message ${msg.type}">
                ${msg.message}
            </div>
        `).join('');
    }

    getContainerCount() {
        const counts = {
            'grid-3x3': 9,
            'grid-2x2': 4,
            'linear': 5,
            'circular': 6
        };
        return counts[this.currentTemplate] || 9;
    }

    updatePhysics() {
        // Update physics mode for containers
        document.querySelectorAll('.container-slot').forEach(slot => {
            slot.style.transition = this.physicsMode === 'static' ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        // Update physics indicator
        const indicator = document.querySelector('.physics-indicator');
        if (indicator) {
            indicator.style.background = this.physicsMode === 'static' ? '#ffc107' : '#28a745';
        }
    }

    updateContainerLayout() {
        if (this.currentTemplate === 'circular') {
            this.arrangeCircularContainers();
        }
        this.showFeedback(`Container spacing adjusted to ${this.containerSpacing}`);
    }

    updateContainerScale() {
        document.querySelectorAll('.container-slot').forEach(slot => {
            slot.style.transform = `scale(${this.containerScale})`;
        });
        this.showFeedback(`Container scale set to ${this.containerScale}x`);
    }

    clearAllContainers() {
        if (this.containers.size === 0) {
            this.showFeedback('No containers to clear');
            return;
        }
        
        if (confirm('Are you sure you want to clear all containers? This action cannot be undone.')) {
            this.containers.clear();
            this.selectedContainer = null;
            this.generateContainers();
            this.updateSceneStats();
            this.updateContainerList();
            this.validateScene();
            this.showContentEditor(null);
            this.showFeedback('🗑️ All containers cleared');
        }
    }

    autoFillContainers() {
        const dataTypes = ['image', 'text', 'contact', 'video', '3d-model'];
        const containerCount = this.getContainerCount();
        
        for (let i = 0; i < containerCount; i++) {
            if (!this.containers.has(i)) {
                const randomType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
                this.addDataToContainer(i, randomType);
            }
        }
        
        this.updateSceneStats();
        this.updateContainerList();
        this.validateScene();
        this.showFeedback('🎯 Auto-filled empty containers with random data types');
    }

    randomizeContainers() {
        if (this.containers.size === 0) {
            this.showFeedback('No containers to randomize. Add some content first.');
            return;
        }
        
        const dataTypes = ['image', 'text', 'contact', 'video', '3d-model'];
        
        this.containers.forEach((container, index) => {
            const randomType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
            container.type = randomType;
            
            // Update visual
            const containerEl = document.querySelector(`[data-index="${index}"]`);
            if (containerEl) {
                const ballColors = {
                    'image': 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                    'text': 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    'contact': 'linear-gradient(135deg, #feca57, #ff9ff3)',
                    'video': 'linear-gradient(135deg, #5f27cd, #00d2d3)',
                    '3d-model': 'linear-gradient(135deg, #fd79a8, #6c5ce7)'
                };
                
                containerEl.innerHTML = `
                    <div class="slot-content">
                        <div class="slot-ball" style="background: ${ballColors[randomType]}"></div>
                        <span>${randomType.replace('-', ' ').toUpperCase()}</span>
                    </div>
                `;
            }
        });
        
        this.updateContainerList();
        this.showFeedback('🎲 Randomized all container types');
    }
}

// Initialize the editor when the page loads
let smeditor;
window.addEventListener('DOMContentLoaded', () => {
    smeditor = new SMeditor();
});