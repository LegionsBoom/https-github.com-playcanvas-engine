class StaticMotionViewer {
    constructor() {
        this.sceneId = this.getSceneIdFromURL();
        this.sceneData = null;
        this.app = null;
        this.camera = null;
        this.containers = new Map();
        this.isLoading = true;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadScene();
    }

    getSceneIdFromURL() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    }

    setupEventListeners() {
        // Close buttons
        document.getElementById('close-panel').addEventListener('click', () => {
            this.hideContentPanel();
        });

        // Action buttons
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.resetCamera();
        });

        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.showShareModal();
        });

        document.getElementById('retry-btn').addEventListener('click', () => {
            this.loadScene();
        });

        // Modal controls
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        // Share options
        document.getElementById('copy-url').addEventListener('click', () => {
            this.copyCurrentURL();
        });

        document.getElementById('share-whatsapp').addEventListener('click', () => {
            this.shareViaWhatsApp();
        });

        document.getElementById('share-email').addEventListener('click', () => {
            this.shareViaEmail();
        });

        // AR controls
        document.getElementById('start-ar').addEventListener('click', () => {
            this.startARExperience();
        });

        document.getElementById('cancel-ar').addEventListener('click', () => {
            document.getElementById('ar-modal').classList.add('hidden');
        });

        // Prevent context menu on canvas
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'CANVAS') {
                e.preventDefault();
            }
        });

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.app) {
                    this.app.resizeCanvas();
                }
            }, 500);
        });
    }

    async loadScene() {
        this.showLoading();
        
        try {
            const response = await fetch(`/api/scenes/${this.sceneId}`);
            
            if (!response.ok) {
                throw new Error('Scene not found');
            }
            
            this.sceneData = await response.json();
            this.initializeViewer();
            
        } catch (error) {
            console.error('Failed to load scene:', error);
            this.showError();
        }
    }

    showLoading() {
        document.getElementById('loading-screen').style.display = 'flex';
        document.getElementById('viewer-main').classList.add('hidden');
        document.getElementById('error-screen').classList.add('hidden');
    }

    showError() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('viewer-main').classList.add('hidden');
        document.getElementById('error-screen').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('viewer-main').classList.remove('hidden');
    }

    initializeViewer() {
        // Update brand info
        this.updateBrandInfo();
        
        // Initialize PlayCanvas
        this.setupPlayCanvas();
        
        this.hideLoading();
    }

    updateBrandInfo() {
        const { brandSettings } = this.sceneData;
        
        if (brandSettings.companyName) {
            document.getElementById('company-name').textContent = brandSettings.companyName;
        }
        
        if (brandSettings.logo) {
            const logo = document.getElementById('company-logo');
            logo.src = brandSettings.logo;
            logo.style.display = 'block';
        }
        
        if (brandSettings.primaryColor) {
            document.documentElement.style.setProperty('--brand-color', brandSettings.primaryColor);
        }
    }

    setupPlayCanvas() {
        const canvas = document.getElementById('viewer-canvas');
        
        // Initialize PlayCanvas application
        this.app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(window),
            gamepads: new pc.GamePads(),
            graphicsDeviceOptions: {
                antialias: true,
                preserveDrawingBuffer: false,
                preferWebGl2: true
            }
        });

        // Configure app
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
        
        this.app.start();

        // Setup scene
        this.setupScene();
        
        // Setup camera controls
        this.setupCameraControls();
    }

    setupScene() {
        // Set up lighting
        this.app.scene.ambientLight = new pc.Color(0.4, 0.4, 0.4);
        
        // Create directional light
        const light = new pc.Entity('directional-light');
        light.addComponent('light', {
            type: 'directional',
            color: new pc.Color(1, 1, 1),
            intensity: 1,
            castShadows: true,
            shadowBias: 0.05,
            shadowDistance: 25
        });
        light.setLocalEulerAngles(45, 30, 0);
        this.app.root.addChild(light);

        // Create camera
        this.createCamera();
        
        // Create world environment
        this.createWorldEnvironment();
        
        // Generate content containers
        this.generateContainers();
    }

    createCamera() {
        this.camera = new pc.Entity('camera');
        this.camera.addComponent('camera', {
            clearColor: new pc.Color(0.05, 0.05, 0.1),
            fov: 60,
            nearClip: 0.1,
            farClip: 1000
        });
        
        // Position camera based on template
        this.positionCamera();
        
        this.app.root.addChild(this.camera);
    }

    positionCamera() {
        const template = this.sceneData.template;
        
        switch (template) {
            case 'grid-3x3':
                this.camera.setPosition(0, 0, 12);
                break;
            case 'grid-2x2':
                this.camera.setPosition(0, 0, 8);
                break;
            case 'linear':
                this.camera.setPosition(0, 0, 10);
                break;
            case 'circular':
                this.camera.setPosition(0, 2, 8);
                this.camera.lookAt(0, 0, 0);
                break;
            default:
                this.camera.setPosition(0, 0, 10);
        }
    }

    createWorldEnvironment() {
        const world = this.sceneData.world;
        
        if (world === 'globe') {
            // Create sphere environment
            const globe = new pc.Entity('globe');
            globe.addComponent('model', {
                type: 'sphere'
            });
            globe.setLocalScale(50, 50, 50);
            
            const material = new pc.StandardMaterial();
            material.diffuse = new pc.Color(0.1, 0.1, 0.2);
            material.opacity = 0.3;
            material.blendType = pc.BLEND_NORMAL;
            material.cull = pc.CULLFACE_FRONT;
            globe.model.material = material;
            
            this.app.root.addChild(globe);
        } else {
            // Flat world - create ground plane
            const ground = new pc.Entity('ground');
            ground.addComponent('model', {
                type: 'plane'
            });
            ground.setLocalScale(20, 1, 20);
            ground.setPosition(0, -5, 0);
            
            const material = new pc.StandardMaterial();
            material.diffuse = new pc.Color(0.2, 0.2, 0.3);
            material.opacity = 0.5;
            ground.model.material = material;
            
            this.app.root.addChild(ground);
        }
    }

    generateContainers() {
        const positions = this.getContainerPositions();
        
        Object.entries(this.sceneData.containers).forEach(([index, containerData]) => {
            const position = positions[parseInt(index)];
            if (position && containerData) {
                this.createContainer(parseInt(index), containerData, position);
            }
        });
    }

    getContainerPositions() {
        const positions = {};
        const template = this.sceneData.template;
        
        switch (template) {
            case 'grid-3x3':
                for (let i = 0; i < 9; i++) {
                    const row = Math.floor(i / 3);
                    const col = i % 3;
                    positions[i] = {
                        x: (col - 1) * 4,
                        y: (1 - row) * 4,
                        z: 0
                    };
                }
                break;
                
            case 'grid-2x2':
                for (let i = 0; i < 4; i++) {
                    const row = Math.floor(i / 2);
                    const col = i % 2;
                    positions[i] = {
                        x: (col - 0.5) * 4,
                        y: (0.5 - row) * 4,
                        z: 0
                    };
                }
                break;
                
            case 'linear':
                for (let i = 0; i < 5; i++) {
                    positions[i] = {
                        x: (i - 2) * 4,
                        y: 0,
                        z: 0
                    };
                }
                break;
                
            case 'circular':
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * 2 * Math.PI;
                    positions[i] = {
                        x: 6 * Math.cos(angle),
                        y: 0,
                        z: 6 * Math.sin(angle)
                    };
                }
                break;
        }
        
        return positions;
    }

    createContainer(index, containerData, position) {
        // Create container entity
        const container = new pc.Entity(`container-${index}`);
        container.setPosition(position.x, position.y, position.z);
        
        // Add visual representation
        container.addComponent('model', {
            type: 'box'
        });
        container.setLocalScale(1.5, 1.5, 0.2);
        
        // Material based on content type
        const material = new pc.StandardMaterial();
        const colors = {
            'image': new pc.Color(1, 0.42, 0.42),
            'text': new pc.Color(0.31, 0.8, 0.77),
            'contact': new pc.Color(0.99, 0.79, 0.34),
            'video': new pc.Color(0.37, 0.15, 0.8),
            '3d-model': new pc.Color(0.99, 0.47, 0.66)
        };
        
        material.diffuse = colors[containerData.type] || new pc.Color(0.5, 0.5, 0.5);
        material.metalness = 0.1;
        material.shininess = 0.7;
        container.model.material = material;
        
        // Add glow effect
        material.emissive = new pc.Color().copy(material.diffuse).scale(0.2);
        
        // Add hover animation
        container.addComponent('script');
        container.script.create('containerHover', {
            attributes: {
                hoverScale: 1.1,
                animationSpeed: 2
            }
        });
        
        // Add click interaction
        this.addContainerInteraction(container, index, containerData);
        
        this.app.root.addChild(container);
        this.containers.set(index, container);
    }

    addContainerInteraction(container, index, containerData) {
        // Add click/touch detection
        container.element = container.addComponent('element', {
            type: 'image',
            anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new pc.Vec2(0.5, 0.5),
            width: 150,
            height: 150,
            useInput: true
        });

        container.element.on('click', () => {
            this.onContainerClick(index, containerData);
        });

        // Add floating animation
        this.addFloatingAnimation(container);
    }

    addFloatingAnimation(container) {
        const startY = container.getPosition().y;
        let time = Math.random() * Math.PI * 2; // Random starting phase
        
        container.tween = this.app.tween(container.getPosition())
            .to({ y: startY + 0.3 }, 2000, pc.SineOut)
            .yoyo(true)
            .repeat(-1);
        
        container.tween.start();
    }

    onContainerClick(index, containerData) {
        // Animate camera to focus on container
        this.focusOnContainer(index);
        
        // Show content panel
        this.showContentPanel(containerData);
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    focusOnContainer(index) {
        const container = this.containers.get(index);
        if (!container) return;
        
        const containerPos = container.getPosition();
        const focusDistance = 5;
        
        // Calculate camera position
        const direction = new pc.Vec3().copy(containerPos).normalize();
        const cameraPos = new pc.Vec3().copy(containerPos).add(direction.scale(-focusDistance));
        
        // Animate camera
        this.app.tween(this.camera.getPosition())
            .to(cameraPos, 1000, pc.SineOut)
            .start();
            
        this.app.tween(this.camera.getEulerAngles())
            .to(this.camera.getPosition().clone().sub(containerPos).normalize(), 1000, pc.SineOut)
            .start();
    }

    showContentPanel(containerData) {
        const panel = document.getElementById('content-panel');
        const title = document.getElementById('content-title');
        const body = document.getElementById('content-body');
        
        // Set title based on content type
        title.textContent = this.getContentTitle(containerData);
        
        // Generate content HTML
        body.innerHTML = this.generateContentHTML(containerData);
        
        // Show panel
        panel.classList.remove('hidden');
    }

    hideContentPanel() {
        document.getElementById('content-panel').classList.add('hidden');
        this.resetCamera();
    }

    getContentTitle(containerData) {
        const titles = {
            'image': 'Image Gallery',
            'text': 'Information',
            'contact': 'Contact Details',
            'video': 'Video Content',
            '3d-model': '3D Model'
        };
        
        return titles[containerData.type] || 'Content';
    }

    generateContentHTML(containerData) {
        const { type, content } = containerData;
        
        if (!content) {
            return '<p>No content available</p>';
        }
        
        switch (type) {
            case 'image':
                return `
                    <div class="content-image">
                        ${content.src ? `<img src="${content.src}" alt="${content.alt || 'Image'}">` : ''}
                        ${content.alt ? `<p>${content.alt}</p>` : ''}
                    </div>
                `;
                
            case 'text':
                return `
                    <div class="content-text">
                        ${content.title ? `<h4>${content.title}</h4>` : ''}
                        ${content.message ? `<p>${content.message}</p>` : ''}
                    </div>
                `;
                
            case 'contact':
                return `
                    <div class="content-contact">
                        ${content.name ? `
                            <div class="contact-item">
                                <div class="contact-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div class="contact-info">
                                    <h5>Name</h5>
                                    <p>${content.name}</p>
                                </div>
                            </div>
                        ` : ''}
                        ${content.phone ? `
                            <a href="tel:${content.phone}" class="contact-item">
                                <div class="contact-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </div>
                                <div class="contact-info">
                                    <h5>Phone</h5>
                                    <p>${content.phone}</p>
                                </div>
                            </a>
                        ` : ''}
                        ${content.email ? `
                            <a href="mailto:${content.email}" class="contact-item">
                                <div class="contact-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <div class="contact-info">
                                    <h5>Email</h5>
                                    <p>${content.email}</p>
                                </div>
                            </a>
                        ` : ''}
                    </div>
                `;
                
            case 'video':
                return `
                    <div class="content-video">
                        ${content.title ? `<h4>${content.title}</h4>` : ''}
                        ${content.src ? `<video controls><source src="${content.src}" type="video/mp4"></video>` : ''}
                    </div>
                `;
                
            case '3d-model':
                return `
                    <div class="content-model">
                        ${content.name ? `<h4>${content.name}</h4>` : ''}
                        ${content.arEnabled ? `
                            <button class="ar-trigger" onclick="viewer.showARModal()">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M9 12l2 2 4-4"></path>
                                    <circle cx="12" cy="12" r="10"></circle>
                                </svg>
                                View in AR
                            </button>
                        ` : ''}
                    </div>
                `;
                
            default:
                return '<p>Unknown content type</p>';
        }
    }

    setupCameraControls() {
        // Add orbit camera controls for touch devices
        const script = this.camera.script.create('orbitCamera', {
            attributes: {
                distanceMax: 20,
                distanceMin: 3,
                pitchAngleMax: 90,
                pitchAngleMin: -90,
                inertiaFactor: 0.2,
                focusEntity: this.app.root,
                frameOnStart: false
            }
        });
    }

    resetCamera() {
        this.positionCamera();
        
        // Reset any ongoing tweens
        this.app.tween(this.camera.getPosition())
            .to(this.camera.getPosition(), 1000, pc.SineOut)
            .start();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    showShareModal() {
        document.getElementById('share-modal').classList.remove('hidden');
    }

    showARModal() {
        document.getElementById('ar-modal').classList.remove('hidden');
    }

    copyCurrentURL() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            // Show feedback
            const button = document.getElementById('copy-url');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    }

    shareViaWhatsApp() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Check out this spatial experience!');
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
    }

    shareViaEmail() {
        const subject = encodeURIComponent('Spatial Experience');
        const body = encodeURIComponent(`Check out this spatial experience: ${window.location.href}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    }

    startARExperience() {
        // Check for WebXR support
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                if (supported) {
                    // Launch AR session
                    this.launchARSession();
                } else {
                    alert('AR not supported on this device');
                }
            });
        } else {
            alert('WebXR not supported on this device');
        }
    }

    launchARSession() {
        // This would integrate with WebXR for AR functionality
        // For now, show a placeholder
        alert('AR functionality coming soon!');
        document.getElementById('ar-modal').classList.add('hidden');
    }
}

// Initialize viewer when page loads
let viewer;
window.addEventListener('DOMContentLoaded', () => {
    viewer = new StaticMotionViewer();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (viewer && viewer.app) {
        if (document.hidden) {
            viewer.app.stop();
        } else {
            viewer.app.start();
        }
    }
});