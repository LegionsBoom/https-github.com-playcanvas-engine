class AutomotiveFeatures {
    constructor(smeditor) {
        this.smeditor = smeditor;
        this.activeVehicle = null;
        this.vehicleConfigurator = null;
        this.hotspots = new Map();
        this.colorPalettes = {
            'exterior': [
                { name: 'Pearl White', color: '#F8F8FF', metallic: true },
                { name: 'Midnight Black', color: '#1C1C1C', metallic: true },
                { name: 'Racing Red', color: '#DC143C', metallic: false },
                { name: 'Ocean Blue', color: '#1E90FF', metallic: true },
                { name: 'Silver Metallic', color: '#C0C0C0', metallic: true },
                { name: 'Sunset Orange', color: '#FF4500', metallic: false },
                { name: 'Forest Green', color: '#228B22', metallic: true },
                { name: 'Royal Purple', color: '#6A0DAD', metallic: true }
            ],
            'interior': [
                { name: 'Black Leather', color: '#2F2F2F', material: 'leather' },
                { name: 'Tan Leather', color: '#D2691E', material: 'leather' },
                { name: 'Gray Fabric', color: '#696969', material: 'fabric' },
                { name: 'Beige Luxury', color: '#F5F5DC', material: 'leather' },
                { name: 'Red Sport', color: '#8B0000', material: 'alcantara' }
            ]
        };
        this.vehicleOptions = {
            wheels: [
                { name: '18" Standard', price: 0, model: 'standard_18' },
                { name: '19" Sport', price: 1500, model: 'sport_19' },
                { name: '20" Premium', price: 2500, model: 'premium_20' },
                { name: '21" Performance', price: 3500, model: 'performance_21' }
            ],
            trim: [
                { name: 'Base', price: 0 },
                { name: 'Luxury', price: 5000 },
                { name: 'Sport', price: 7500 },
                { name: 'Performance', price: 12000 }
            ]
        };
        this.basePrice = 35000;
        
        this.init();
    }

    init() {
        this.createAutomotiveUI();
        this.setupEventListeners();
    }

    createAutomotiveUI() {
        // Add automotive-specific panel to the editor
        const leftPanel = document.querySelector('.left-panel');
        const automotiveSection = document.createElement('div');
        automotiveSection.className = 'panel-section automotive-section';
        automotiveSection.innerHTML = `
            <h3 class="cockpit-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                    <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"></path>
                </svg>
                Automotive Features
                <div class="status-light active" title="Automotive Mode Active"></div>
            </h3>
            
            <!-- Vehicle Configurator -->
            <div class="automotive-controls">
                <div class="control-group">
                    <span class="control-label">Mode:</span>
                    <select class="control-input" id="automotive-mode">
                        <option value="showroom">Showroom</option>
                        <option value="configurator">Configurator</option>
                        <option value="comparison">Comparison</option>
                    </select>
                </div>
                
                <!-- Color Changer -->
                <div class="color-section">
                    <h4>Exterior Colors</h4>
                    <div class="color-palette" id="exterior-colors">
                        ${this.generateColorPalette('exterior')}
                    </div>
                    
                    <h4>Interior Colors</h4>
                    <div class="color-palette" id="interior-colors">
                        ${this.generateColorPalette('interior')}
                    </div>
                </div>
                
                <!-- Vehicle Options -->
                <div class="options-section">
                    <h4>Vehicle Options</h4>
                    <div class="control-group">
                        <span class="control-label">Wheels:</span>
                        <select class="control-input" id="wheel-options">
                            ${this.vehicleOptions.wheels.map(wheel => 
                                `<option value="${wheel.model}" data-price="${wheel.price}">${wheel.name} (+$${wheel.price.toLocaleString()})</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <span class="control-label">Trim:</span>
                        <select class="control-input" id="trim-options">
                            ${this.vehicleOptions.trim.map(trim => 
                                `<option value="${trim.name.toLowerCase()}" data-price="${trim.price}">${trim.name} (+$${trim.price.toLocaleString()})</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <!-- Hotspot Manager -->
                <div class="hotspot-section">
                    <h4>Interactive Hotspots</h4>
                    <div class="hotspot-controls">
                        <button class="quick-btn" id="add-hotspot">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            Add Hotspot
                        </button>
                        <button class="quick-btn" id="preview-hotspots">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Preview
                        </button>
                    </div>
                    <div class="hotspot-list" id="hotspot-list">
                        <!-- Dynamic hotspot list -->
                    </div>
                </div>
                
                <!-- Price Calculator -->
                <div class="price-section">
                    <h4>Price Calculator</h4>
                    <div class="price-breakdown">
                        <div class="price-line">
                            <span>Base Price:</span>
                            <span id="base-price">$${this.basePrice.toLocaleString()}</span>
                        </div>
                        <div class="price-line">
                            <span>Options:</span>
                            <span id="options-price">$0</span>
                        </div>
                        <div class="price-line total">
                            <span>Total Price:</span>
                            <span id="total-price">$${this.basePrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <!-- AR Controls -->
                <div class="ar-section">
                    <h4>AR Experience</h4>
                    <div class="control-group">
                        <span class="control-label">AR Mode:</span>
                        <select class="control-input" id="ar-mode">
                            <option value="scale">Scale Model</option>
                            <option value="fullsize">Full Size</option>
                            <option value="interior">Interior View</option>
                        </select>
                    </div>
                    <button class="quick-btn ar-trigger" id="launch-ar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10 9 9 5.16 1 9-3.45 9-9V7l-10-5z"></path>
                            <path d="M12 22V12"></path>
                            <path d="M2 7l10 5 10-5"></path>
                        </svg>
                        Launch AR View
                    </button>
                </div>
            </div>
        `;
        
        leftPanel.appendChild(automotiveSection);
    }

    generateColorPalette(type) {
        return this.colorPalettes[type].map(color => `
            <div class="color-option" 
                 data-color="${color.color}" 
                 data-name="${color.name}"
                 data-type="${type}"
                 style="background: ${color.color}"
                 title="${color.name}">
                <div class="color-overlay">
                    ${color.metallic ? '<span class="metallic-indicator">●</span>' : ''}
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Color palette clicks
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                const name = e.target.dataset.name;
                const type = e.target.dataset.type;
                this.changeVehicleColor(type, color, name);
            });
        });

        // Vehicle options
        document.getElementById('wheel-options').addEventListener('change', (e) => {
            this.changeWheels(e.target.value);
            this.updatePricing();
        });

        document.getElementById('trim-options').addEventListener('change', (e) => {
            this.changeTrim(e.target.value);
            this.updatePricing();
        });

        // Automotive mode
        document.getElementById('automotive-mode').addEventListener('change', (e) => {
            this.switchMode(e.target.value);
        });

        // Hotspot controls
        document.getElementById('add-hotspot').addEventListener('click', () => {
            this.addHotspot();
        });

        document.getElementById('preview-hotspots').addEventListener('click', () => {
            this.previewHotspots();
        });

        // AR controls
        document.getElementById('launch-ar').addEventListener('click', () => {
            this.launchARExperience();
        });
    }

    changeVehicleColor(type, color, name) {
        // This would integrate with the 3D model in the viewer
        this.smeditor.showFeedback(`${type.charAt(0).toUpperCase() + type.slice(1)} color changed to ${name}`);
        
        // Update active selection
        document.querySelectorAll(`.color-option[data-type="${type}"]`).forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector(`.color-option[data-color="${color}"][data-type="${type}"]`).classList.add('selected');
        
        // Store color change for the vehicle configurator
        if (!this.vehicleConfigurator) {
            this.vehicleConfigurator = {};
        }
        this.vehicleConfigurator[type + 'Color'] = { color, name };
        
        // Broadcast color change to viewer if active
        this.broadcastToViewer('colorChange', { type, color, name });
    }

    changeWheels(wheelModel) {
        const wheelOption = this.vehicleOptions.wheels.find(w => w.model === wheelModel);
        if (wheelOption) {
            this.smeditor.showFeedback(`Wheels changed to ${wheelOption.name}`);
            if (!this.vehicleConfigurator) this.vehicleConfigurator = {};
            this.vehicleConfigurator.wheels = wheelOption;
            this.broadcastToViewer('wheelChange', wheelOption);
        }
    }

    changeTrim(trimLevel) {
        const trimOption = this.vehicleOptions.trim.find(t => t.name.toLowerCase() === trimLevel);
        if (trimOption) {
            this.smeditor.showFeedback(`Trim level changed to ${trimOption.name}`);
            if (!this.vehicleConfigurator) this.vehicleConfigurator = {};
            this.vehicleConfigurator.trim = trimOption;
            this.broadcastToViewer('trimChange', trimOption);
        }
    }

    updatePricing() {
        let optionsPrice = 0;
        
        if (this.vehicleConfigurator) {
            if (this.vehicleConfigurator.wheels) {
                optionsPrice += this.vehicleConfigurator.wheels.price;
            }
            if (this.vehicleConfigurator.trim) {
                optionsPrice += this.vehicleConfigurator.trim.price;
            }
        }
        
        const totalPrice = this.basePrice + optionsPrice;
        
        document.getElementById('options-price').textContent = `$${optionsPrice.toLocaleString()}`;
        document.getElementById('total-price').textContent = `$${totalPrice.toLocaleString()}`;
    }

    switchMode(mode) {
        this.smeditor.showFeedback(`Switched to ${mode} mode`);
        
        switch (mode) {
            case 'showroom':
                this.enableShowroomMode();
                break;
            case 'configurator':
                this.enableConfiguratorMode();
                break;
            case 'comparison':
                this.enableComparisonMode();
                break;
        }
        
        this.broadcastToViewer('modeChange', mode);
    }

    enableShowroomMode() {
        // Enable showroom lighting and camera movements
        document.querySelector('.automotive-section').classList.add('showroom-mode');
    }

    enableConfiguratorMode() {
        // Enable all configurator options
        document.querySelector('.automotive-section').classList.add('configurator-mode');
    }

    enableComparisonMode() {
        // Enable side-by-side comparison
        document.querySelector('.automotive-section').classList.add('comparison-mode');
    }

    addHotspot() {
        const hotspotId = `hotspot_${Date.now()}`;
        const hotspot = {
            id: hotspotId,
            title: 'New Hotspot',
            description: 'Click to edit this hotspot',
            position: { x: 0, y: 0, z: 0 },
            type: 'info'
        };
        
        this.hotspots.set(hotspotId, hotspot);
        this.updateHotspotList();
        this.editHotspot(hotspotId);
        this.smeditor.showFeedback('Hotspot added - click to edit');
    }

    updateHotspotList() {
        const hotspotList = document.getElementById('hotspot-list');
        hotspotList.innerHTML = '';
        
        this.hotspots.forEach((hotspot, id) => {
            const item = document.createElement('div');
            item.className = 'hotspot-item';
            item.innerHTML = `
                <div class="hotspot-info">
                    <div class="hotspot-title">${hotspot.title}</div>
                    <div class="hotspot-type">${hotspot.type}</div>
                </div>
                <div class="hotspot-actions">
                    <button class="hotspot-btn edit" onclick="automotive.editHotspot('${id}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="hotspot-btn delete" onclick="automotive.deleteHotspot('${id}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6"></path>
                        </svg>
                    </button>
                </div>
            `;
            hotspotList.appendChild(item);
        });
    }

    editHotspot(hotspotId) {
        const hotspot = this.hotspots.get(hotspotId);
        if (!hotspot) return;
        
        // Create hotspot editor modal
        const modal = document.createElement('div');
        modal.className = 'modal hotspot-editor-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Hotspot</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="editor-field">
                        <label>Title</label>
                        <input type="text" id="hotspot-title" value="${hotspot.title}">
                    </div>
                    <div class="editor-field">
                        <label>Description</label>
                        <textarea id="hotspot-description">${hotspot.description}</textarea>
                    </div>
                    <div class="editor-field">
                        <label>Type</label>
                        <select id="hotspot-type">
                            <option value="info" ${hotspot.type === 'info' ? 'selected' : ''}>Information</option>
                            <option value="feature" ${hotspot.type === 'feature' ? 'selected' : ''}>Feature Highlight</option>
                            <option value="safety" ${hotspot.type === 'safety' ? 'selected' : ''}>Safety Feature</option>
                            <option value="performance" ${hotspot.type === 'performance' ? 'selected' : ''}>Performance</option>
                            <option value="luxury" ${hotspot.type === 'luxury' ? 'selected' : ''}>Luxury Feature</option>
                        </select>
                    </div>
                    <div class="editor-field">
                        <label>Position (X, Y, Z)</label>
                        <div class="position-controls">
                            <input type="number" id="hotspot-x" value="${hotspot.position.x}" step="0.1">
                            <input type="number" id="hotspot-y" value="${hotspot.position.y}" step="0.1">
                            <input type="number" id="hotspot-z" value="${hotspot.position.z}" step="0.1">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="automotive.saveHotspot('${hotspotId}')">Save Hotspot</button>
                    <button class="btn-secondary" onclick="automotive.closeHotspotEditor()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Close button handler
        modal.querySelector('.close-btn').addEventListener('click', () => {
            this.closeHotspotEditor();
        });
    }

    saveHotspot(hotspotId) {
        const hotspot = this.hotspots.get(hotspotId);
        if (!hotspot) return;
        
        hotspot.title = document.getElementById('hotspot-title').value;
        hotspot.description = document.getElementById('hotspot-description').value;
        hotspot.type = document.getElementById('hotspot-type').value;
        hotspot.position = {
            x: parseFloat(document.getElementById('hotspot-x').value),
            y: parseFloat(document.getElementById('hotspot-y').value),
            z: parseFloat(document.getElementById('hotspot-z').value)
        };
        
        this.hotspots.set(hotspotId, hotspot);
        this.updateHotspotList();
        this.closeHotspotEditor();
        this.smeditor.showFeedback(`Hotspot "${hotspot.title}" saved`);
        
        // Broadcast to viewer
        this.broadcastToViewer('hotspotUpdate', hotspot);
    }

    closeHotspotEditor() {
        const modal = document.querySelector('.hotspot-editor-modal');
        if (modal) {
            modal.remove();
        }
    }

    deleteHotspot(hotspotId) {
        if (confirm('Are you sure you want to delete this hotspot?')) {
            this.hotspots.delete(hotspotId);
            this.updateHotspotList();
            this.smeditor.showFeedback('Hotspot deleted');
            this.broadcastToViewer('hotspotDelete', hotspotId);
        }
    }

    previewHotspots() {
        this.smeditor.showFeedback(`Previewing ${this.hotspots.size} hotspots`);
        this.broadcastToViewer('previewHotspots', Array.from(this.hotspots.values()));
    }

    launchARExperience() {
        const arMode = document.getElementById('ar-mode').value;
        this.smeditor.showFeedback(`Launching AR in ${arMode} mode`);
        
        // This would integrate with WebXR
        const arConfig = {
            mode: arMode,
            vehicleConfig: this.vehicleConfigurator,
            hotspots: Array.from(this.hotspots.values())
        };
        
        this.broadcastToViewer('launchAR', arConfig);
    }

    broadcastToViewer(action, data) {
        // This would send data to the viewer via WebSocket or storage
        const message = { action, data, timestamp: Date.now() };
        
        // Store for viewer pickup
        localStorage.setItem('automotive_message', JSON.stringify(message));
        
        console.log('Broadcasting to viewer:', message);
    }

    // Method to get current vehicle configuration
    getVehicleConfiguration() {
        return {
            configurator: this.vehicleConfigurator,
            hotspots: Array.from(this.hotspots.values()),
            pricing: {
                base: this.basePrice,
                options: this.calculateOptionsPrice(),
                total: this.basePrice + this.calculateOptionsPrice()
            }
        };
    }

    calculateOptionsPrice() {
        let total = 0;
        if (this.vehicleConfigurator) {
            if (this.vehicleConfigurator.wheels) total += this.vehicleConfigurator.wheels.price;
            if (this.vehicleConfigurator.trim) total += this.vehicleConfigurator.trim.price;
        }
        return total;
    }
}

// Initialize automotive features when page loads
let automotive;
window.addEventListener('DOMContentLoaded', () => {
    // Wait for SMeditor to initialize
    setTimeout(() => {
        if (typeof smeditor !== 'undefined') {
            automotive = new AutomotiveFeatures(smeditor);
            console.log('🚗 Automotive features initialized');
        }
    }, 1000);
});