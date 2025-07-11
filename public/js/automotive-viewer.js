class AutomotiveViewer {
    constructor(viewer) {
        this.viewer = viewer;
        this.activeHotspots = new Map();
        this.vehicleConfiguration = null;
        this.colorChangeSystem = null;
        this.hotspotRenderer = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeColorSystem();
        this.initializeHotspotSystem();
        this.checkForAutomotiveContent();
    }

    setupEventListeners() {
        // Listen for automotive messages from editor
        window.addEventListener('storage', (e) => {
            if (e.key === 'automotive_message') {
                const message = JSON.parse(e.newValue);
                this.handleAutomotiveMessage(message);
            }
        });

        // Touch gestures for automotive features
        this.setupAutomotiveTouchControls();
    }

    handleAutomotiveMessage(message) {
        const { action, data } = message;
        
        switch (action) {
            case 'colorChange':
                this.handleColorChange(data);
                break;
            case 'wheelChange':
                this.handleWheelChange(data);
                break;
            case 'trimChange':
                this.handleTrimChange(data);
                break;
            case 'hotspotUpdate':
                this.updateHotspot(data);
                break;
            case 'hotspotDelete':
                this.removeHotspot(data);
                break;
            case 'previewHotspots':
                this.showAllHotspots(data);
                break;
            case 'modeChange':
                this.switchViewerMode(data);
                break;
            case 'launchAR':
                this.handleARLaunch(data);
                break;
        }
    }

    initializeColorSystem() {
        this.colorChangeSystem = {
            exteriorMaterial: null,
            interiorMaterial: null,
            wheelMaterial: null,
            currentColors: {
                exterior: null,
                interior: null
            }
        };
    }

    initializeHotspotSystem() {
        this.hotspotRenderer = {
            hotspotEntities: new Map(),
            activeHotspot: null,
            animationSpeed: 2000
        };
    }

    checkForAutomotiveContent() {
        // Check if scene contains automotive content
        if (this.viewer.sceneData && this.viewer.sceneData.containers) {
            Object.values(this.viewer.sceneData.containers).forEach(container => {
                if (container.type === '3d-model' && container.content && 
                    container.content.name && container.content.name.toLowerCase().includes('car')) {
                    this.initializeAutomotiveMode();
                }
            });
        }
    }

    initializeAutomotiveMode() {
        // Add automotive-specific UI elements to viewer
        this.addAutomotiveControls();
        this.setupVehicleInteractions();
    }

    addAutomotiveControls() {
        const uiOverlay = document.querySelector('.ui-overlay');
        const automotiveControls = document.createElement('div');
        automotiveControls.className = 'automotive-controls-overlay';
        automotiveControls.innerHTML = `
            <!-- Color Change Panel -->
            <div class="color-picker-panel hidden" id="color-picker">
                <div class="panel-header">
                    <h4>Customize Colors</h4>
                    <button class="close-color-picker">×</button>
                </div>
                <div class="color-tabs">
                    <button class="color-tab active" data-type="exterior">Exterior</button>
                    <button class="color-tab" data-type="interior">Interior</button>
                </div>
                <div class="mobile-color-grid" id="mobile-color-grid">
                    <!-- Dynamic color options -->
                </div>
            </div>

            <!-- Hotspot Info Panel -->
            <div class="hotspot-info-panel hidden" id="hotspot-info">
                <div class="panel-header">
                    <h4 id="hotspot-title">Feature</h4>
                    <button class="close-hotspot-info">×</button>
                </div>
                <div class="hotspot-content">
                    <p id="hotspot-description">Feature description</p>
                    <div class="hotspot-actions">
                        <button class="hotspot-action-btn" id="hotspot-specs">Specifications</button>
                        <button class="hotspot-action-btn" id="hotspot-demo">Demo</button>
                    </div>
                </div>
            </div>

            <!-- Floating Action Buttons -->
            <div class="floating-actions">
                <button class="fab" id="color-fab" title="Change Colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M21.17 8.17l-8-8a1.41 1.41 0 0 0-2 0l-8 8a1.41 1.41 0 0 0 0 2l8 8a1.41 1.41 0 0 0 2 0l8-8a1.41 1.41 0 0 0 0-2z"></path>
                    </svg>
                </button>
                <button class="fab" id="hotspot-fab" title="Show Features">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </button>
                <button class="fab" id="ar-fab" title="AR View">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10 9 9 5.16 1 9-3.45 9-9V7l-10-5z"></path>
                        <path d="M12 22V12"></path>
                        <path d="M2 7l10 5 10-5"></path>
                    </svg>
                </button>
            </div>

            <!-- Vehicle Configuration Display -->
            <div class="config-display" id="config-display">
                <div class="config-item">
                    <span class="config-label">Exterior:</span>
                    <span class="config-value" id="exterior-color">Select Color</span>
                </div>
                <div class="config-item">
                    <span class="config-label">Interior:</span>
                    <span class="config-value" id="interior-color">Select Color</span>
                </div>
                <div class="config-item price-item">
                    <span class="config-label">Price:</span>
                    <span class="config-value" id="vehicle-price">$35,000</span>
                </div>
            </div>
        `;
        
        uiOverlay.appendChild(automotiveControls);
        this.setupAutomotiveControlListeners();
    }

    setupAutomotiveControlListeners() {
        // Color picker FAB
        document.getElementById('color-fab').addEventListener('click', () => {
            this.toggleColorPicker();
        });

        // Hotspot FAB
        document.getElementById('hotspot-fab').addEventListener('click', () => {
            this.toggleHotspots();
        });

        // AR FAB
        document.getElementById('ar-fab').addEventListener('click', () => {
            this.launchMobileAR();
        });

        // Color tabs
        document.querySelectorAll('.color-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchColorTab(e.target.dataset.type);
            });
        });

        // Close buttons
        document.querySelector('.close-color-picker').addEventListener('click', () => {
            document.getElementById('color-picker').classList.add('hidden');
        });

        document.querySelector('.close-hotspot-info').addEventListener('click', () => {
            document.getElementById('hotspot-info').classList.add('hidden');
        });
    }

    setupAutomotiveTouchControls() {
        // Double tap to change colors
        let lastTap = 0;
        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                this.handleDoubleTap(e);
            }
            lastTap = currentTime;
        });

        // Long press for hotspot info
        let pressTimer = null;
        document.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                this.handleLongPress(e);
            }, 800);
        });

        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
    }

    setupVehicleInteractions() {
        // Add click handlers to vehicle parts for hotspots
        if (this.viewer.app && this.viewer.containers) {
            this.viewer.containers.forEach((container, index) => {
                if (container.element) {
                    container.element.on('click', () => {
                        this.handleVehiclePartClick(index);
                    });
                }
            });
        }
    }

    handleColorChange(data) {
        const { type, color, name } = data;
        
        // Update the 3D model materials
        this.applyColorToModel(type, color);
        
        // Update UI display
        document.getElementById(`${type}-color`).textContent = name;
        
        // Store current configuration
        this.colorChangeSystem.currentColors[type] = { color, name };
        
        // Show feedback
        this.showColorChangeEffect(type, color);
    }

    applyColorToModel(type, color) {
        if (!this.viewer.app) return;
        
        // Find vehicle model in the scene
        const vehicleContainer = this.findVehicleContainer();
        if (!vehicleContainer) return;
        
        // Apply color change to materials
        const materials = this.getVehicleMaterials(vehicleContainer, type);
        materials.forEach(material => {
            if (material) {
                const colorObj = new pc.Color().fromString(color);
                material.diffuse = colorObj;
                material.update();
            }
        });
    }

    findVehicleContainer() {
        // Find the container with a vehicle 3D model
        let vehicleContainer = null;
        this.viewer.containers.forEach(container => {
            if (container.script && container.script.scripts && 
                container.script.scripts.length > 0) {
                vehicleContainer = container;
            }
        });
        return vehicleContainer;
    }

    getVehicleMaterials(container, type) {
        const materials = [];
        
        // This would traverse the model hierarchy to find appropriate materials
        // For demo purposes, we'll return placeholder materials
        
        if (type === 'exterior') {
            // Find body panels, doors, etc.
            const bodyMaterial = new pc.StandardMaterial();
            materials.push(bodyMaterial);
        } else if (type === 'interior') {
            // Find seats, dashboard, etc.
            const interiorMaterial = new pc.StandardMaterial();
            materials.push(interiorMaterial);
        }
        
        return materials;
    }

    showColorChangeEffect(type, color) {
        // Create a brief color flash effect
        const effect = document.createElement('div');
        effect.className = 'color-change-effect';
        effect.style.background = color;
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.classList.add('fade-out');
            setTimeout(() => effect.remove(), 300);
        }, 500);
    }

    createHotspot(hotspotData) {
        if (!this.viewer.app) return;
        
        const { id, title, description, position, type } = hotspotData;
        
        // Create 3D hotspot entity
        const hotspot = new pc.Entity(`hotspot-${id}`);
        hotspot.setPosition(position.x, position.y, position.z);
        
        // Add visual representation
        hotspot.addComponent('model', {
            type: 'sphere'
        });
        hotspot.setLocalScale(0.2, 0.2, 0.2);
        
        // Add pulsing animation
        const material = new pc.StandardMaterial();
        material.diffuse = this.getHotspotColor(type);
        material.emissive = material.diffuse.clone().scale(0.3);
        hotspot.model.material = material;
        
        // Add click interaction
        hotspot.addComponent('element', {
            type: 'image',
            width: 50,
            height: 50,
            useInput: true
        });
        
        hotspot.element.on('click', () => {
            this.showHotspotInfo(hotspotData);
        });
        
        // Add pulsing animation
        hotspot.tween = this.viewer.app.tween(hotspot.getLocalScale())
            .to({ x: 0.3, y: 0.3, z: 0.3 }, 1000, pc.SineInOut)
            .yoyo(true)
            .repeat(-1);
        hotspot.tween.start();
        
        this.viewer.app.root.addChild(hotspot);
        this.hotspotRenderer.hotspotEntities.set(id, hotspot);
    }

    getHotspotColor(type) {
        const colors = {
            'info': new pc.Color(0.4, 0.8, 1),
            'feature': new pc.Color(1, 0.8, 0.2),
            'safety': new pc.Color(1, 0.2, 0.2),
            'performance': new pc.Color(0.8, 0.2, 1),
            'luxury': new pc.Color(1, 0.6, 0.8)
        };
        return colors[type] || new pc.Color(0.5, 0.5, 0.5);
    }

    showHotspotInfo(hotspotData) {
        const panel = document.getElementById('hotspot-info');
        const title = document.getElementById('hotspot-title');
        const description = document.getElementById('hotspot-description');
        
        title.textContent = hotspotData.title;
        description.textContent = hotspotData.description;
        
        panel.classList.remove('hidden');
        
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }

    toggleColorPicker() {
        const panel = document.getElementById('color-picker');
        const isHidden = panel.classList.contains('hidden');
        
        if (isHidden) {
            this.populateColorGrid('exterior');
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    populateColorGrid(type) {
        const grid = document.getElementById('mobile-color-grid');
        const colors = type === 'exterior' ? this.getExteriorColors() : this.getInteriorColors();
        
        grid.innerHTML = colors.map(color => `
            <div class="mobile-color-option" 
                 data-color="${color.color}"
                 data-name="${color.name}"
                 data-type="${type}"
                 style="background: ${color.color}"
                 onclick="automotiveViewer.selectColor('${type}', '${color.color}', '${color.name}')">
                <div class="color-name">${color.name}</div>
            </div>
        `).join('');
    }

    selectColor(type, color, name) {
        this.handleColorChange({ type, color, name });
        document.getElementById('color-picker').classList.add('hidden');
    }

    switchColorTab(type) {
        // Update active tab
        document.querySelectorAll('.color-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // Update color grid
        this.populateColorGrid(type);
    }

    toggleHotspots() {
        const isVisible = this.hotspotRenderer.hotspotEntities.size > 0;
        
        if (isVisible) {
            this.hideAllHotspots();
        } else {
            this.showAllHotspots();
        }
    }

    showAllHotspots(hotspotsData) {
        if (hotspotsData && Array.isArray(hotspotsData)) {
            hotspotsData.forEach(hotspot => {
                this.createHotspot(hotspot);
            });
        }
    }

    hideAllHotspots() {
        this.hotspotRenderer.hotspotEntities.forEach((entity, id) => {
            if (entity.tween) {
                entity.tween.stop();
            }
            entity.destroy();
        });
        this.hotspotRenderer.hotspotEntities.clear();
    }

    launchMobileAR() {
        // Enhanced AR experience for automotive
        this.viewer.showARModal();
        
        // Add automotive-specific AR instructions
        const arModal = document.getElementById('ar-modal');
        const instructions = arModal.querySelector('.ar-instructions p');
        instructions.textContent = 'Point your camera at the ground to place a full-size vehicle model. Walk around to explore all angles and features.';
    }

    handleDoubleTap(e) {
        // Quick color change on double tap
        this.toggleColorPicker();
    }

    handleLongPress(e) {
        // Show nearest hotspot on long press
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.tagName === 'CANVAS') {
            this.findNearestHotspot(touch.clientX, touch.clientY);
        }
    }

    findNearestHotspot(x, y) {
        // Convert screen coordinates to world coordinates and find nearest hotspot
        // This is a simplified implementation
        if (this.hotspotRenderer.hotspotEntities.size > 0) {
            const firstHotspot = this.hotspotRenderer.hotspotEntities.values().next().value;
            if (firstHotspot) {
                // Show info for first hotspot (simplified)
                this.showHotspotInfo({
                    title: 'Vehicle Feature',
                    description: 'Detailed information about this vehicle feature.'
                });
            }
        }
    }

    getExteriorColors() {
        return [
            { name: 'Pearl White', color: '#F8F8FF' },
            { name: 'Midnight Black', color: '#1C1C1C' },
            { name: 'Racing Red', color: '#DC143C' },
            { name: 'Ocean Blue', color: '#1E90FF' },
            { name: 'Silver Metallic', color: '#C0C0C0' },
            { name: 'Sunset Orange', color: '#FF4500' }
        ];
    }

    getInteriorColors() {
        return [
            { name: 'Black Leather', color: '#2F2F2F' },
            { name: 'Tan Leather', color: '#D2691E' },
            { name: 'Gray Fabric', color: '#696969' },
            { name: 'Beige Luxury', color: '#F5F5DC' },
            { name: 'Red Sport', color: '#8B0000' }
        ];
    }
}

// Initialize automotive viewer features
let automotiveViewer;
window.addEventListener('DOMContentLoaded', () => {
    // Wait for main viewer to initialize
    setTimeout(() => {
        if (typeof viewer !== 'undefined') {
            automotiveViewer = new AutomotiveViewer(viewer);
            console.log('🚗 Automotive viewer features initialized');
        }
    }, 2000);
});