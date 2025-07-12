class SMeditor {
    constructor() {
        this.currentTemplate = 'grid-3x3';
        this.currentWorld = 'flat';
        this.currentIndustry = 'general';
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
        
        // Initialize undo manager
        this.undoManager = window.UndoManager;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateContainers();
        this.setupDragAndDrop();
        this.updateSceneStats();
        this.initializeValidation();
        this.setupUndoRedoListeners();
        this.showFeedback('🚀 SMeditor Cockpit Initialized - Ready for spatial content creation!');
    }

    setupUndoRedoListeners() {
        // Undo/Redo button listeners
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                this.undoManager.undo();
                this.addFeedbackAnimation(undoBtn);
            });
        }
        
        if (redoBtn) {
            redoBtn.addEventListener('click', () => {
                this.undoManager.redo();
                this.addFeedbackAnimation(redoBtn);
            });
        }
        
        // Load undo history from localStorage
        this.undoManager.loadFromLocalStorage();
    }
    
    addFeedbackAnimation(button) {
        button.classList.add('feedback');
        setTimeout(() => {
            button.classList.remove('feedback');
        }, 300);
    }

    // Test method for undo/redo system
    testUndoSystem() {
        console.log('Undo System Stats:', this.undoManager.getStats());
        this.showFeedback(`Undo system: ${this.undoManager.history.length} actions, can undo: ${this.undoManager.canUndo()}, can redo: ${this.undoManager.canRedo()}`);
    }

    // Debug method to show undo history
    showUndoHistory() {
        const stats = this.undoManager.getStats();
        const history = this.undoManager.history.map((action, index) => {
            const isCurrent = index === this.undoManager.currentIndex;
            return `${isCurrent ? '→' : ' '} ${action.description}`;
        }).join('\n');
        
        console.log('Undo History:', history);
        console.log('Stats:', stats);
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
            this.updateBrandSettings('primaryColor', e.target.value);
        });

        document.getElementById('company-name').addEventListener('input', (e) => {
            this.updateBrandSettings('companyName', e.target.value);
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

        // Industry Mode Switching
        document.getElementById('general-mode').addEventListener('click', () => {
            this.switchIndustryMode('general');
        });

        document.getElementById('automotive-mode').addEventListener('click', () => {
            this.switchIndustryMode('automotive');
        });

        document.getElementById('realestate-mode').addEventListener('click', () => {
            this.switchIndustryMode('realestate');
        });

        // Interface Toggle
        document.getElementById('simple-mode').addEventListener('click', () => {
            this.switchInterfaceMode('simple');
        });

        document.getElementById('advanced-mode').addEventListener('click', () => {
            this.switchInterfaceMode('advanced');
        });

        // Simple Content Buttons
        document.querySelectorAll('.content-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contentType = e.currentTarget.dataset.type;
                this.handleContentButtonClick(contentType);
            });
        });

        // File Upload
        document.getElementById('upload-content').addEventListener('click', () => {
            this.openFileUpload();
        });

        // File Upload Drop Zone
        this.setupFileUploadDropZone();

        // Add tooltips to cockpit interface
        this.setupTooltips();
    }

    setupTooltips() {
        // Add tooltips to key interface elements
        const tooltipElements = [
            {
                selector: '#undo-btn',
                text: 'Undo last action (Ctrl+Z)',
                position: 'top'
            },
            {
                selector: '#redo-btn',
                text: 'Redo last undone action (Ctrl+Shift+Z)',
                position: 'top'
            },
            {
                selector: '#start-walkthrough',
                text: 'Start creating a guided 3D walkthrough by placing waypoints',
                position: 'top'
            },
            {
                selector: '#finish-walkthrough',
                text: 'Complete the walkthrough and save the camera path',
                position: 'top'
            },
            {
                selector: '#play-walkthrough',
                text: 'Play the recorded walkthrough animation',
                position: 'top'
            },
            {
                selector: '#open-color-picker',
                text: 'Open advanced color picker for vehicle customization',
                position: 'left'
            },
            {
                selector: '#add-hotspot',
                text: 'Add interactive hotspots to highlight vehicle features',
                position: 'left'
            },
            {
                selector: '#preview-hotspots',
                text: 'Show all hotspots in the 3D scene',
                position: 'left'
            },
            {
                selector: '#launch-ar',
                text: 'Launch AR experience for mobile devices',
                position: 'left'
            },
            {
                selector: '#playcanvas-canvas',
                text: '3D scene view - drag content here or click to place waypoints',
                position: 'top'
            }
        ];

        tooltipElements.forEach(({ selector, text, position }) => {
            const element = document.querySelector(selector);
            if (element && window.TooltipManager) {
                window.TooltipManager.addTooltip(element, text, position);
            }
        });
    }

    switchTemplate(template) {
        if (template === this.currentTemplate) return;
        
        // Store old state for undo
        const oldTemplate = this.currentTemplate;
        
        this.currentTemplate = template;
        
        // Update active template visual
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-template="${template}"]`).classList.add('active');
        
        this.generateContainers();
        this.updateSceneStats();
        this.updateContainerList();
        this.validateScene();
        
        // Reset selected container
        this.selectedContainer = null;
        this.showContentEditor(null);
        
        // Record undo action
        const action = new TemplateAction(oldTemplate, template);
        this.undoManager.recordAction(action);
        
        this.showFeedback(`Template switched to ${template}`);
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
        
        // Use industry-specific forms
        const industryForm = this.generateIndustryContentForm(containerData);
        
        editorContent.innerHTML = industryForm + `
            <button class="save-content-btn" onclick="smeditor.saveContainerContent(${index})">
                💾 Save Content
            </button>
        `;
        
        // Add industry-specific event listeners
        this.setupIndustryEventListeners(containerData.type);
    }

    saveContainerContent(index) {
        const containerData = this.containers.get(index);
        const content = {};
        
        // Store old content for undo
        const oldContent = containerData ? { ...containerData.content } : {};
        
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
        
        // Record undo action for content changes
        const action = new ContentAction(index, 'content', oldContent, content);
        this.undoManager.recordAction(action);
    }

    updateContainerData(index, content) {
        const containerData = this.containers.get(index);
        if (containerData) {
            containerData.content = content;
            this.containers.set(index, containerData);
        }
        
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

    uploadLogo(file) {
        // Store old logo for undo
        const oldLogo = this.brandSettings.logo;
        
        // Simulate logo upload
        const reader = new FileReader();
        reader.onload = (e) => {
            this.brandSettings.logo = e.target.result;
            
            // Record undo action
            const action = new BrandAction('logo', oldLogo, e.target.result);
            this.undoManager.recordAction(action);
            
            this.updateBrandPreview();
            this.showFeedback('Logo uploaded successfully');
        };
        reader.readAsDataURL(file);
    }

    updateBrandPreview() {
        // Update brand preview in UI
        const brandPreview = document.getElementById('brand-preview');
        if (brandPreview) {
            brandPreview.style.setProperty('--primary-color', this.brandSettings.primaryColor);
        }
        
        // Update company name display
        const companyNameDisplay = document.getElementById('company-name-display');
        if (companyNameDisplay) {
            companyNameDisplay.textContent = this.brandSettings.companyName || 'Your Company';
        }
        
        this.validateScene();
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
        // Use the scene manager to handle publishing if available
        if (window.sceneManager) {
            await window.sceneManager.publishScene();
        } else {
            // Fallback to original method
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
        // Store old state for undo
        const oldContainers = new Map(this.containers);
        
        this.containers.clear();
        this.selectedContainer = null;
        
        // Clear visual containers
        document.querySelectorAll('.container-slot').forEach(slot => {
            slot.innerHTML = '';
            slot.classList.remove('filled', 'selected');
        });
        
        // Record undo action
        const action = new ContainerAction(0, 'clear', oldContainers, null);
        this.undoManager.recordAction(action);
        
        this.updateSceneStats();
        this.validateScene();
        this.showFeedback('All containers cleared');
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

    // Industry Mode Management
    switchIndustryMode(industry) {
        // Update active mode
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${industry}-mode`).classList.add('active');
        
        this.currentIndustry = industry;
        this.updateDataBallVisibility();
        this.updateIndustryContent();
        this.showFeedback(`Switched to ${industry} mode`);
    }

    switchInterfaceMode(mode) {
        // Update interface toggle buttons
        document.querySelectorAll('.mode-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${mode}-mode`).classList.add('active');
        
        // Update interface visibility
        document.querySelectorAll('.content-interface').forEach(interface => {
            interface.classList.remove('active');
        });
        document.getElementById(`${mode}-content`).classList.add('active');
        
        this.showFeedback(`Switched to ${mode} interface`);
    }

    updateIndustryContent() {
        // Hide all industry content
        document.querySelectorAll('.industry-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show relevant industry content
        if (this.currentIndustry === 'automotive') {
            document.getElementById('automotive-content').style.display = 'block';
        } else if (this.currentIndustry === 'realestate') {
            document.getElementById('realestate-content').style.display = 'block';
        }
    }

    handleContentButtonClick(contentType) {
        if (this.selectedContainer !== null) {
            // Add content to selected container
            this.addDataToContainer(this.selectedContainer, contentType);
        } else {
            // Show container selection prompt
            this.showFeedback('Please select a container first, then click a content type');
            this.highlightEmptyContainers();
        }
    }

    highlightEmptyContainers() {
        document.querySelectorAll('.container-slot').forEach(slot => {
            if (!slot.classList.contains('filled')) {
                slot.classList.add('highlight');
                setTimeout(() => {
                    slot.classList.remove('highlight');
                }, 2000);
            }
        });
    }

    openFileUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*,video/*,.pdf,.doc,.docx,.txt';
        
        input.addEventListener('change', (e) => {
            Array.from(e.target.files).forEach(file => {
                this.handleFileUpload(file);
            });
        });
        
        input.click();
    }

    setupFileUploadDropZone() {
        const uploadBtn = document.getElementById('upload-content');
        
        uploadBtn.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBtn.classList.add('drag-over');
        });
        
        uploadBtn.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadBtn.classList.remove('drag-over');
        });
        
        uploadBtn.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBtn.classList.remove('drag-over');
            
            Array.from(e.dataTransfer.files).forEach(file => {
                this.handleFileUpload(file);
            });
        });
    }

    async handleFileUpload(file) {
        try {
            this.showFeedback(`Processing ${file.name}...`);
            
            // Auto-detect content type
            const contentType = this.autoDetectContentType(file);
            
            // Find next empty container
            const emptyContainer = this.findEmptyContainer();
            if (!emptyContainer) {
                this.showFeedback('No empty containers available. Please clear some content first.');
                return;
            }
            
            // Upload file
            const uploadResult = await this.uploadFile(file);
            if (!uploadResult.success) {
                this.showFeedback('File upload failed. Please try again.');
                return;
            }
            
            // Add content to container
            const containerIndex = parseInt(emptyContainer.dataset.index);
            this.addDataToContainer(containerIndex, contentType, {
                file: file,
                url: uploadResult.url,
                filename: file.name
            });
            
            this.showFeedback(`${contentType} content added from ${file.name}`);
            
        } catch (error) {
            console.error('File upload error:', error);
            this.showFeedback('Error processing file. Please try again.');
        }
    }

    autoDetectContentType(file) {
        const mimeType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        
        // Image files
        if (mimeType.startsWith('image/')) {
            return 'image';
        }
        
        // Video files
        if (mimeType.startsWith('video/')) {
            return 'video';
        }
        
        // 3D model files
        if (fileName.includes('.gltf') || fileName.includes('.glb') || 
            fileName.includes('.obj') || fileName.includes('.fbx')) {
            return '3d-model';
        }
        
        // Document files
        if (mimeType.includes('pdf') || fileName.includes('.pdf')) {
            return 'text';
        }
        
        if (mimeType.includes('document') || fileName.includes('.doc') || 
            fileName.includes('.docx') || fileName.includes('.txt')) {
            return 'text';
        }
        
        // Default to text for unknown types
        return 'text';
    }

    findEmptyContainer() {
        const containers = document.querySelectorAll('.container-slot');
        for (let container of containers) {
            if (!container.classList.contains('filled')) {
                return container;
            }
        }
        return null;
    }

    addDataToContainer(containerIndex, dataType, fileData = null) {
        const container = document.querySelector(`[data-index="${containerIndex}"]`);
        
        if (!container) return;
        
        // Store old state for undo
        const oldData = this.containers.get(containerIndex);
        
        // Create content based on type
        let content = this.createContentForType(dataType, fileData);
        
        // Update container visual
        container.innerHTML = content.html;
        container.classList.add('filled');
        
        // Store container data
        this.containers.set(containerIndex, {
            type: dataType,
            content: content.data
        });

        // Record undo action
        const action = new ContainerAction(containerIndex, 'add', oldData, {
            html: content.html,
            containerData: {
                type: dataType,
                content: content.data
            }
        });
        this.undoManager.recordAction(action);

        // Update cockpit systems
        this.updateSceneStats();
        this.updateContainerList();
        this.validateScene();

        // Auto-select for editing
        this.selectContainer(containerIndex);
        
        this.showFeedback(`${dataType.replace('-', ' ').toUpperCase()} content added to container ${containerIndex + 1}`);
    }



    createContentForType(dataType, fileData = null) {
        const contentMap = {
            'image': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24)"></div>
                    <span>IMAGE</span>
                    ${fileData ? `<small>${fileData.filename}</small>` : ''}
                </div>`,
                data: fileData ? { url: fileData.url, filename: fileData.filename } : {}
            },
            'text': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #4ecdc4, #44a08d)"></div>
                    <span>TEXT</span>
                    ${fileData ? `<small>${fileData.filename}</small>` : ''}
                </div>`,
                data: fileData ? { url: fileData.url, filename: fileData.filename } : {}
            },
            'video': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #5f27cd, #00d2d3)"></div>
                    <span>VIDEO</span>
                    ${fileData ? `<small>${fileData.filename}</small>` : ''}
                </div>`,
                data: fileData ? { url: fileData.url, filename: fileData.filename } : {}
            },
            'contact': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #feca57, #ff9ff3)"></div>
                    <span>CONTACT</span>
                </div>`,
                data: {}
            },
            'car-model': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #e74c3c, #c0392b)"></div>
                    <span>🚗 CAR MODEL</span>
                </div>`,
                data: {}
            },
            'car-specs': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #3498db, #2980b9)"></div>
                    <span>📊 SPECS</span>
                </div>`,
                data: {}
            },
            'price-calc': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #27ae60, #229954)"></div>
                    <span>💰 PRICING</span>
                </div>`,
                data: {}
            },
            'property-info': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #2ecc71, #27ae60)"></div>
                    <span>🏠 PROPERTY</span>
                </div>`,
                data: {}
            },
            'virtual-tour': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #e67e22, #d35400)"></div>
                    <span>🎥 TOUR</span>
                </div>`,
                data: {}
            },
            'floor-plan': {
                html: `<div class="slot-content">
                    <div class="slot-ball" style="background: linear-gradient(135deg, #34495e, #2c3e50)"></div>
                    <span>📐 FLOOR PLAN</span>
                </div>`,
                data: {}
            }
        };
        
        return contentMap[dataType] || contentMap['text'];
    }

    // Industry-Specific Content Forms
    generateIndustryContentForm(containerData) {
        const { type } = containerData;
        
        switch (this.currentIndustry) {
            case 'automotive':
                return this.generateAutomotiveForm(type);
            case 'realestate':
                return this.generateRealEstateForm(type);
            default:
                return this.generateGeneralForm(type);
        }
    }

    generateAutomotiveForm(type) {
        switch (type) {
            case 'color-picker':
                return `
                    <div class="automotive-form">
                        <div class="form-section">
                            <h4>🎨 Color Options</h4>
                            <div class="form-row single">
                                <div class="form-field">
                                    <label>Available Colors</label>
                                    <div class="color-palette">
                                        <div class="color-option" style="background: #1a1a1a" data-color="Midnight Black" title="Midnight Black"></div>
                                        <div class="color-option" style="background: #ffffff; border-color: #ccc" data-color="Pearl White" title="Pearl White"></div>
                                        <div class="color-option" style="background: #c41e3a" data-color="Ruby Red" title="Ruby Red"></div>
                                        <div class="color-option" style="background: #2e4bb3" data-color="Ocean Blue" title="Ocean Blue"></div>
                                        <div class="color-option" style="background: #8b9dc3" data-color="Silver Metallic" title="Silver Metallic"></div>
                                        <div class="color-option" style="background: #4a4a4a" data-color="Charcoal Gray" title="Charcoal Gray"></div>
                                        <div class="color-option" style="background: #d4af37" data-color="Gold Metallic" title="Gold Metallic"></div>
                                        <div class="color-option" style="background: #228b22" data-color="Forest Green" title="Forest Green"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Selected Color</label>
                                    <input type="text" id="selected-color" readonly placeholder="Select a color above">
                                </div>
                                <div class="form-field">
                                    <label>Color Premium</label>
                                    <input type="number" id="color-premium" placeholder="Additional cost" min="0">
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'car-features':
                return `
                    <div class="automotive-form">
                        <div class="form-section">
                            <h4>⚙️ Vehicle Features</h4>
                            <div class="feature-grid">
                                <div class="feature-item">
                                    <input type="checkbox" id="feature-heated-seats">
                                    <label for="feature-heated-seats">Heated Seats</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="feature-sunroof">
                                    <label for="feature-sunroof">Sunroof</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="feature-nav">
                                    <label for="feature-nav">Navigation</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="feature-backup-cam">
                                    <label for="feature-backup-cam">Backup Camera</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="feature-bluetooth">
                                    <label for="feature-bluetooth">Bluetooth</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="feature-cruise">
                                    <label for="feature-cruise">Cruise Control</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="feature-leather">
                                    <label for="feature-leather">Leather Interior</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="feature-keyless">
                                    <label for="feature-keyless">Keyless Entry</label>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'pricing':
                return `
                    <div class="automotive-form">
                        <div class="form-section">
                            <h4>💰 Pricing Information</h4>
                            <div class="pricing-calculator">
                                <div class="price-display">
                                    <div class="base-price">$<span id="display-price">25,000</span></div>
                                    <div class="monthly-payment">Est. $<span id="monthly-payment">350</span>/month</div>
                                </div>
                                <div class="form-row">
                                    <div class="form-field">
                                        <label>MSRP</label>
                                        <input type="number" id="vehicle-msrp" placeholder="25000" min="0">
                                    </div>
                                    <div class="form-field">
                                        <label>Sale Price</label>
                                        <input type="number" id="vehicle-price" placeholder="23000" min="0">
                                    </div>
                                </div>
                                <div class="financing-options">
                                    <div class="form-field">
                                        <label>Down Payment</label>
                                        <input type="number" id="down-payment" placeholder="3000" min="0">
                                    </div>
                                    <div class="form-field">
                                        <label>APR (%)</label>
                                        <input type="number" id="apr" placeholder="4.5" step="0.1" min="0">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'ar-view':
                return `
                    <div class="automotive-form">
                        <div class="form-section">
                            <h4>📱 Augmented Reality</h4>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>3D Model Upload</label>
                                    <input type="file" id="ar-model" accept=".glb,.gltf">
                                </div>
                                <div class="form-field">
                                    <label>Model Scale</label>
                                    <input type="range" id="ar-scale" min="0.1" max="2" step="0.1" value="1">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>AR Instructions</label>
                                    <textarea id="ar-instructions" placeholder="Point your camera at a flat surface and tap to place the vehicle"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'dealer-info':
                return `
                    <div class="automotive-form">
                        <div class="form-section">
                            <h4>🏢 Dealership Information</h4>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Dealership Name</label>
                                    <input type="text" id="dealer-name" placeholder="ABC Motors">
                                </div>
                                <div class="form-field">
                                    <label>Sales Rep</label>
                                    <input type="text" id="sales-rep" placeholder="John Smith">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Phone</label>
                                    <input type="tel" id="dealer-phone" placeholder="(555) 123-4567">
                                </div>
                                <div class="form-field">
                                    <label>Email</label>
                                    <input type="email" id="dealer-email" placeholder="sales@abcmotors.com">
                                </div>
                            </div>
                            <div class="form-row single">
                                <div class="form-field">
                                    <label>Address</label>
                                    <textarea id="dealer-address" placeholder="123 Main St, City, State 12345"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            default:
                return this.generateGeneralForm(type);
        }
    }

    generateRealEstateForm(type) {
        switch (type) {
            case 'property-details':
                return `
                    <div class="realestate-form">
                        <div class="form-section">
                            <h4>🏠 Property Details</h4>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Property Type</label>
                                    <select id="property-type">
                                        <option value="">Select...</option>
                                        <option value="single-family">Single Family</option>
                                        <option value="condo">Condominium</option>
                                        <option value="townhouse">Townhouse</option>
                                        <option value="multi-family">Multi-Family</option>
                                    </select>
                                </div>
                                <div class="form-field">
                                    <label>Year Built</label>
                                    <input type="number" id="year-built" min="1800" max="2024">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Bedrooms</label>
                                    <input type="number" id="bedrooms" min="0" max="10">
                                </div>
                                <div class="form-field">
                                    <label>Bathrooms</label>
                                    <input type="number" id="bathrooms" min="0" max="10" step="0.5">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Square Feet</label>
                                    <input type="number" id="square-feet" placeholder="2000">
                                </div>
                                <div class="form-field">
                                    <label>Lot Size (acres)</label>
                                    <input type="number" id="lot-size" step="0.01" placeholder="0.25">
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'location-info':
                return `
                    <div class="realestate-form">
                        <div class="form-section">
                            <h4>📍 Location Information</h4>
                            <div class="form-row single">
                                <div class="form-field">
                                    <label>Address</label>
                                    <input type="text" id="property-address" placeholder="123 Main St, City, State 12345">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>School District</label>
                                    <input type="text" id="school-district" placeholder="Springfield Elementary">
                                </div>
                                <div class="form-field">
                                    <label>Walk Score</label>
                                    <input type="number" id="walk-score" min="0" max="100" placeholder="75">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Nearby Amenities</label>
                                    <textarea id="amenities" placeholder="Shopping center, parks, restaurants..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'financial-info':
                return `
                    <div class="realestate-form">
                        <div class="form-section">
                            <h4>💵 Financial Information</h4>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>List Price</label>
                                    <input type="number" id="list-price" placeholder="450000">
                                </div>
                                <div class="form-field">
                                    <label>Property Tax (Annual)</label>
                                    <input type="number" id="property-tax" placeholder="5400">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>HOA Fees (Monthly)</label>
                                    <input type="number" id="hoa-fees" placeholder="150">
                                </div>
                                <div class="form-field">
                                    <label>Est. Monthly Payment</label>
                                    <input type="number" id="monthly-payment-est" placeholder="2100" readonly>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'virtual-tour':
                return `
                    <div class="realestate-form">
                        <div class="form-section">
                            <h4>🎥 Virtual Tour</h4>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Tour Type</label>
                                    <select id="tour-type">
                                        <option value="video">Video Tour</option>
                                        <option value="360">360° Images</option>
                                        <option value="3d">3D Walkthrough</option>
                                    </select>
                                </div>
                                <div class="form-field">
                                    <label>Duration (minutes)</label>
                                    <input type="number" id="tour-duration" min="1" max="30" value="5">
                                </div>
                            </div>
                            <div class="form-row single">
                                <div class="form-field">
                                    <label>Tour Description</label>
                                    <textarea id="tour-description" placeholder="Guided tour through this beautiful home..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'neighborhood':
                return `
                    <div class="realestate-form">
                        <div class="form-section">
                            <h4>🌳 Neighborhood</h4>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Neighborhood Name</label>
                                    <input type="text" id="neighborhood-name" placeholder="Oak Hills">
                                </div>
                                <div class="form-field">
                                    <label>Safety Rating</label>
                                    <select id="safety-rating">
                                        <option value="5">Excellent</option>
                                        <option value="4">Very Good</option>
                                        <option value="3">Good</option>
                                        <option value="2">Fair</option>
                                        <option value="1">Poor</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row single">
                                <div class="form-field">
                                    <label>Neighborhood Description</label>
                                    <textarea id="neighborhood-desc" placeholder="Quiet family-friendly neighborhood with tree-lined streets..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'agent-contact':
                return `
                    <div class="realestate-form">
                        <div class="form-section">
                            <h4>👤 Agent Contact</h4>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Agent Name</label>
                                    <input type="text" id="agent-name" placeholder="Jane Smith">
                                </div>
                                <div class="form-field">
                                    <label>License #</label>
                                    <input type="text" id="agent-license" placeholder="RE123456">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Phone</label>
                                    <input type="tel" id="agent-phone" placeholder="(555) 123-4567">
                                </div>
                                <div class="form-field">
                                    <label>Email</label>
                                    <input type="email" id="agent-email" placeholder="jane@realty.com">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Brokerage</label>
                                    <input type="text" id="brokerage" placeholder="ABC Realty">
                                </div>
                                <div class="form-field">
                                    <label>Years Experience</label>
                                    <input type="number" id="years-exp" min="0" max="50" placeholder="10">
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            default:
                return this.generateGeneralForm(type);
        }
    }

    generateGeneralForm(type) {
        // Keep existing general form generation logic
        switch (type) {
            case 'image':
                return `
                    <div class="editor-field">
                        <label>Image Upload</label>
                        <input type="file" id="content-image" accept="image/*">
                    </div>
                    <div class="editor-field">
                        <label>Alt Text</label>
                        <input type="text" id="content-alt" placeholder="Describe the image">
                    </div>
                `;
                
            case 'text':
                return `
                    <div class="editor-field">
                        <label>Title</label>
                        <input type="text" id="content-title" placeholder="Enter title">
                    </div>
                    <div class="editor-field">
                        <label>Message</label>
                        <textarea id="content-message" placeholder="Enter your message for users"></textarea>
                    </div>
                `;
                
            case 'contact':
                return `
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
                
            case 'video':
                return `
                    <div class="editor-field">
                        <label>Video Upload</label>
                        <input type="file" id="content-video" accept="video/*">
                    </div>
                    <div class="editor-field">
                        <label>Video Title</label>
                        <input type="text" id="content-video-title" placeholder="Video title">
                    </div>
                `;
                
            case '3d-model':
                return `
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
                
                         default:
                 return '<p>Unknown content type</p>';
         }
     }

     // Industry-Specific Event Listeners
     setupIndustryEventListeners(type) {
         if (this.currentIndustry === 'automotive') {
             this.setupAutomotiveEventListeners(type);
         } else if (this.currentIndustry === 'realestate') {
             this.setupRealEstateEventListeners(type);
         }
     }

     setupAutomotiveEventListeners(type) {
         switch (type) {
             case 'color-picker':
                 // Color selection functionality
                 document.querySelectorAll('.color-option').forEach(option => {
                     option.addEventListener('click', () => {
                         // Remove previous selection
                         document.querySelectorAll('.color-option').forEach(opt => {
                             opt.classList.remove('selected');
                         });
                         
                         // Add selection to clicked option
                         option.classList.add('selected');
                         
                         // Update selected color field
                         const colorName = option.dataset.color;
                         const selectedColorInput = document.getElementById('selected-color');
                         if (selectedColorInput) {
                             selectedColorInput.value = colorName;
                         }
                         
                         this.showFeedback(`Selected color: ${colorName}`);
                     });
                 });
                 break;

             case 'pricing':
                 // Real-time pricing calculations
                 const priceInputs = ['vehicle-msrp', 'vehicle-price', 'down-payment', 'apr'];
                 priceInputs.forEach(inputId => {
                     const input = document.getElementById(inputId);
                     if (input) {
                         input.addEventListener('input', () => {
                             this.calculateMonthlyPayment();
                         });
                     }
                 });
                 break;

             case 'car-features':
                 // Feature selection tracking
                 document.querySelectorAll('.feature-item input[type="checkbox"]').forEach(checkbox => {
                     checkbox.addEventListener('change', () => {
                         const featureCount = document.querySelectorAll('.feature-item input[type="checkbox"]:checked').length;
                         this.showFeedback(`${featureCount} features selected`);
                     });
                 });
                 break;
         }
     }

     setupRealEstateEventListeners(type) {
         switch (type) {
             case 'financial-info':
                 // Real estate payment calculations
                 const reInputs = ['list-price', 'property-tax', 'hoa-fees'];
                 reInputs.forEach(inputId => {
                     const input = document.getElementById(inputId);
                     if (input) {
                         input.addEventListener('input', () => {
                             this.calculatePropertyPayment();
                         });
                     }
                 });
                 break;
         }
     }

     calculateMonthlyPayment() {
         const msrp = parseFloat(document.getElementById('vehicle-msrp')?.value) || 0;
         const price = parseFloat(document.getElementById('vehicle-price')?.value) || msrp;
         const downPayment = parseFloat(document.getElementById('down-payment')?.value) || 0;
         const apr = parseFloat(document.getElementById('apr')?.value) || 4.5;
         
         const loanAmount = price - downPayment;
         const monthlyRate = (apr / 100) / 12;
         const numPayments = 72; // 6 years
         
         let monthlyPayment = 0;
         if (monthlyRate > 0) {
             monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                             (Math.pow(1 + monthlyRate, numPayments) - 1);
         } else {
             monthlyPayment = loanAmount / numPayments;
         }
         
         // Update display
         const displayPrice = document.getElementById('display-price');
         const monthlyDisplay = document.getElementById('monthly-payment');
         
         if (displayPrice) displayPrice.textContent = price.toLocaleString();
         if (monthlyDisplay) monthlyDisplay.textContent = Math.round(monthlyPayment).toLocaleString();
     }

     calculatePropertyPayment() {
         const listPrice = parseFloat(document.getElementById('list-price')?.value) || 0;
         const propertyTax = parseFloat(document.getElementById('property-tax')?.value) || 0;
         const hoaFees = parseFloat(document.getElementById('hoa-fees')?.value) || 0;
         
         // Rough mortgage calculation (assuming 20% down, 30-year loan, 6.5% APR)
         const loanAmount = listPrice * 0.8; // 20% down
         const monthlyRate = 0.065 / 12;
         const numPayments = 360; // 30 years
         
         let monthlyMortgage = 0;
         if (monthlyRate > 0) {
             monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1);
         }
         
         const monthlyTax = propertyTax / 12;
         const totalMonthly = monthlyMortgage + monthlyTax + hoaFees;
         
         // Update display
         const monthlyPaymentEst = document.getElementById('monthly-payment-est');
         if (monthlyPaymentEst) {
             monthlyPaymentEst.value = Math.round(totalMonthly).toLocaleString();
         }
     }

    updateBrandSettings(key, value) {
        // Store old value for undo
        const oldValue = this.brandSettings[key];
        
        this.brandSettings[key] = value;
        
        // Record undo action
        const action = new BrandAction(key, oldValue, value);
        this.undoManager.recordAction(action);
        
        this.updateBrandPreview();
        this.showFeedback(`Brand ${key} updated to ${value}`);
    }
}

// Initialize the editor when the page loads
let smeditor;
window.addEventListener('DOMContentLoaded', () => {
    smeditor = new SMeditor();
});