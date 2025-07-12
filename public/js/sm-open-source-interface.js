/**
 * SM Open Source Integration Interface
 * User interface for managing open source library integrations
 * Developed by Fungai Taranhike
 */

class SMOpenSourceInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.version = '1.0.0';
        this.systemName = 'SM Open Source Integration Interface';
        
        // Interface state
        this.interfaceActive = false;
        this.selectedFeatures = new Set();
        this.activeLibraries = new Set();
        
        // UI elements
        this.interfaceContainer = null;
        this.performanceUI = null;
        this.libraryStatusUI = null;
        this.featureControlsUI = null;
        
        this.init();
    }
    
    init() {
        console.log('🎨 Initializing SM Open Source Integration Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.bindEvents();
        this.updateStatus();
        
        console.log('✅ SM Open Source Integration Interface Ready');
    }
    
    createInterface() {
        // Create main interface container
        this.interfaceContainer = document.createElement('div');
        this.interfaceContainer.id = 'sm-open-source-interface';
        this.interfaceContainer.className = 'sm-open-source-interface';
        this.interfaceContainer.innerHTML = this.getInterfaceHTML();
        
        document.body.appendChild(this.interfaceContainer);
        
        // Create performance monitoring UI
        this.createPerformanceUI();
        
        // Create library status UI
        this.createLibraryStatusUI();
        
        // Create feature controls UI
        this.createFeatureControlsUI();
        
        console.log('✅ Interface created');
    }
    
    getInterfaceHTML() {
        return `
            <div class="sm-osi-header">
                <h2><i class="fas fa-code-branch"></i> Open Source Integration</h2>
                <p>Leveraging open source libraries for enhanced functionality</p>
            </div>
            
            <div class="sm-osi-content">
                <div class="sm-osi-section">
                    <h3><i class="fas fa-cube"></i> 3D Rendering Libraries</h3>
                    <div class="library-grid">
                        <div class="library-card" data-library="threejs">
                            <div class="library-icon">
                                <i class="fas fa-cube"></i>
                            </div>
                            <div class="library-info">
                                <h4>Three.js</h4>
                                <p>Advanced 3D rendering and graphics</p>
                                <div class="library-status">
                                    <span class="status-indicator" id="threejs-status"></span>
                                    <span class="status-text" id="threejs-text">Loading...</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="library-card" data-library="babylonjs">
                            <div class="library-icon">
                                <i class="fas fa-cube"></i>
                            </div>
                            <div class="library-info">
                                <h4>Babylon.js</h4>
                                <p>Powerful 3D engine for the web</p>
                                <div class="library-status">
                                    <span class="status-indicator" id="babylonjs-status"></span>
                                    <span class="status-text" id="babylonjs-text">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="sm-osi-section">
                    <h3><i class="fas fa-atom"></i> Physics Libraries</h3>
                    <div class="library-grid">
                        <div class="library-card" data-library="cannonjs">
                            <div class="library-icon">
                                <i class="fas fa-atom"></i>
                            </div>
                            <div class="library-info">
                                <h4>Cannon.js</h4>
                                <p>3D physics engine for the web</p>
                                <div class="library-status">
                                    <span class="status-indicator" id="cannonjs-status"></span>
                                    <span class="status-text" id="cannonjs-text">Loading...</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="library-card" data-library="ammojs">
                            <div class="library-icon">
                                <i class="fas fa-atom"></i>
                            </div>
                            <div class="library-info">
                                <h4>Ammo.js</h4>
                                <p>Advanced physics simulation</p>
                                <div class="library-status">
                                    <span class="status-indicator" id="ammojs-status"></span>
                                    <span class="status-text" id="ammojs-text">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="sm-osi-section">
                    <h3><i class="fas fa-vr-cardboard"></i> VR/AR Libraries</h3>
                    <div class="library-grid">
                        <div class="library-card" data-library="aframe">
                            <div class="library-icon">
                                <i class="fas fa-vr-cardboard"></i>
                            </div>
                            <div class="library-info">
                                <h4>A-Frame</h4>
                                <p>WebVR framework for VR/AR</p>
                                <div class="library-status">
                                    <span class="status-indicator" id="aframe-status"></span>
                                    <span class="status-text" id="aframe-text">Loading...</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="library-card" data-library="webxr">
                            <div class="library-icon">
                                <i class="fas fa-vr-cardboard"></i>
                            </div>
                            <div class="library-info">
                                <h4>WebXR</h4>
                                <p>Native VR/AR for the web</p>
                                <div class="library-status">
                                    <span class="status-indicator" id="webxr-status"></span>
                                    <span class="status-text" id="webxr-text">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="sm-osi-section">
                    <h3><i class="fas fa-cogs"></i> Feature Controls</h3>
                    <div class="feature-controls">
                        <div class="feature-group">
                            <h4>Physics Features</h4>
                            <div class="feature-buttons">
                                <button class="feature-btn" data-feature="rigidBodies" data-category="physics">
                                    <i class="fas fa-cube"></i> Rigid Bodies
                                </button>
                                <button class="feature-btn" data-feature="softBodies" data-category="physics">
                                    <i class="fas fa-cloud"></i> Soft Bodies
                                </button>
                                <button class="feature-btn" data-feature="vehiclePhysics" data-category="physics">
                                    <i class="fas fa-car"></i> Vehicle Physics
                                </button>
                                <button class="feature-btn" data-feature="fluidSimulation" data-category="physics">
                                    <i class="fas fa-tint"></i> Fluid Simulation
                                </button>
                            </div>
                        </div>
                        
                        <div class="feature-group">
                            <h4>Rendering Features</h4>
                            <div class="feature-buttons">
                                <button class="feature-btn" data-feature="pbrMaterials" data-category="rendering">
                                    <i class="fas fa-palette"></i> PBR Materials
                                </button>
                                <button class="feature-btn" data-feature="realTimeGI" data-category="rendering">
                                    <i class="fas fa-lightbulb"></i> Real-time GI
                                </button>
                                <button class="feature-btn" data-feature="volumetricLighting" data-category="rendering">
                                    <i class="fas fa-sun"></i> Volumetric Lighting
                                </button>
                                <button class="feature-btn" data-feature="screenSpaceReflections" data-category="rendering">
                                    <i class="fas fa-mirror"></i> Screen Space Reflections
                                </button>
                            </div>
                        </div>
                        
                        <div class="feature-group">
                            <h4>Animation Features</h4>
                            <div class="feature-buttons">
                                <button class="feature-btn" data-feature="skeletalAnimation" data-category="animation">
                                    <i class="fas fa-bone"></i> Skeletal Animation
                                </button>
                                <button class="feature-btn" data-feature="morphTargets" data-category="animation">
                                    <i class="fas fa-shapes"></i> Morph Targets
                                </button>
                                <button class="feature-btn" data-feature="proceduralAnimation" data-category="animation">
                                    <i class="fas fa-magic"></i> Procedural Animation
                                </button>
                            </div>
                        </div>
                        
                        <div class="feature-group">
                            <h4>VR/AR Features</h4>
                            <div class="feature-buttons">
                                <button class="feature-btn" data-feature="webXR" data-category="vr">
                                    <i class="fas fa-vr-cardboard"></i> WebXR
                                </button>
                                <button class="feature-btn" data-feature="webAR" data-category="ar">
                                    <i class="fas fa-mobile-alt"></i> WebAR
                                </button>
                                <button class="feature-btn" data-feature="vrControllers" data-category="vr">
                                    <i class="fas fa-gamepad"></i> VR Controllers
                                </button>
                                <button class="feature-btn" data-feature="markerTracking" data-category="ar">
                                    <i class="fas fa-qrcode"></i> Marker Tracking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="sm-osi-section">
                    <h3><i class="fas fa-chart-line"></i> Performance Monitoring</h3>
                    <div class="performance-metrics">
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-tachometer-alt"></i>
                            </div>
                            <div class="metric-info">
                                <h4>FPS</h4>
                                <div class="metric-value" id="fps-display">60</div>
                            </div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-memory"></i>
                            </div>
                            <div class="metric-info">
                                <h4>Memory</h4>
                                <div class="metric-value" id="memory-display">0 MB</div>
                            </div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-paint-brush"></i>
                            </div>
                            <div class="metric-info">
                                <h4>Render Time</h4>
                                <div class="metric-value" id="render-display">0ms</div>
                            </div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-atom"></i>
                            </div>
                            <div class="metric-info">
                                <h4>Physics Time</h4>
                                <div class="metric-value" id="physics-display">0ms</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="sm-osi-footer">
                <button class="sm-osi-btn primary" id="activate-all-features">
                    <i class="fas fa-play"></i> Activate All Features
                </button>
                <button class="sm-osi-btn secondary" id="deactivate-all-features">
                    <i class="fas fa-stop"></i> Deactivate All Features
                </button>
                <button class="sm-osi-btn" id="performance-test">
                    <i class="fas fa-chart-line"></i> Performance Test
                </button>
                <button class="sm-osi-btn" id="export-config">
                    <i class="fas fa-download"></i> Export Config
                </button>
            </div>
        `;
    }
    
    createPerformanceUI() {
        this.performanceUI = document.createElement('div');
        this.performanceUI.id = 'performance-ui';
        this.performanceUI.className = 'performance-ui';
        this.performanceUI.innerHTML = `
            <div class="performance-metrics">
                <div class="metric">
                    <span class="metric-label">FPS:</span>
                    <span class="metric-value" id="fps-value">60</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Memory:</span>
                    <span class="metric-value" id="memory-value">0 MB</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Render:</span>
                    <span class="metric-value" id="render-value">0ms</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Physics:</span>
                    <span class="metric-value" id="physics-value">0ms</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.performanceUI);
    }
    
    createLibraryStatusUI() {
        this.libraryStatusUI = document.createElement('div');
        this.libraryStatusUI.id = 'library-status-ui';
        this.libraryStatusUI.className = 'library-status';
        this.libraryStatusUI.innerHTML = `
            <h3>Library Status</h3>
            <div class="library-list">
                <div class="library-item">
                    <span class="library-name">Three.js</span>
                    <span class="library-status-indicator" id="threejs-status-indicator"></span>
                </div>
                <div class="library-item">
                    <span class="library-name">Cannon.js</span>
                    <span class="library-status-indicator" id="cannonjs-status-indicator"></span>
                </div>
                <div class="library-item">
                    <span class="library-name">Ammo.js</span>
                    <span class="library-status-indicator" id="ammojs-status-indicator"></span>
                </div>
                <div class="library-item">
                    <span class="library-name">Babylon.js</span>
                    <span class="library-status-indicator" id="babylonjs-status-indicator"></span>
                </div>
                <div class="library-item">
                    <span class="library-name">A-Frame</span>
                    <span class="library-status-indicator" id="aframe-status-indicator"></span>
                </div>
                <div class="library-item">
                    <span class="library-name">WebXR</span>
                    <span class="library-status-indicator" id="webxr-status-indicator"></span>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.libraryStatusUI);
    }
    
    createFeatureControlsUI() {
        this.featureControlsUI = document.createElement('div');
        this.featureControlsUI.id = 'feature-controls-ui';
        this.featureControlsUI.className = 'open-source-controls';
        this.featureControlsUI.innerHTML = `
            <h3>Feature Controls</h3>
            <div class="feature-sections">
                <div class="feature-section">
                    <h4>Physics</h4>
                    <div class="feature-grid">
                        <button class="feature-btn" data-physics-feature="rigidBodies">Rigid Bodies</button>
                        <button class="feature-btn" data-physics-feature="softBodies">Soft Bodies</button>
                        <button class="feature-btn" data-physics-feature="vehiclePhysics">Vehicle Physics</button>
                        <button class="feature-btn" data-physics-feature="fluidSimulation">Fluid Simulation</button>
                    </div>
                </div>
                
                <div class="feature-section">
                    <h4>Rendering</h4>
                    <div class="feature-grid">
                        <button class="feature-btn" data-rendering-feature="pbrMaterials">PBR Materials</button>
                        <button class="feature-btn" data-rendering-feature="realTimeGI">Real-time GI</button>
                        <button class="feature-btn" data-rendering-feature="volumetricLighting">Volumetric Lighting</button>
                        <button class="feature-btn" data-rendering-feature="screenSpaceReflections">Screen Space Reflections</button>
                    </div>
                </div>
                
                <div class="feature-section">
                    <h4>Animation</h4>
                    <div class="feature-grid">
                        <button class="feature-btn" data-animation-feature="skeletalAnimation">Skeletal Animation</button>
                        <button class="feature-btn" data-animation-feature="morphTargets">Morph Targets</button>
                        <button class="feature-btn" data-animation-feature="proceduralAnimation">Procedural Animation</button>
                    </div>
                </div>
                
                <div class="feature-section">
                    <h4>VR/AR</h4>
                    <div class="feature-grid">
                        <button class="feature-btn" data-vrar-feature="webXR">WebXR</button>
                        <button class="feature-btn" data-vrar-feature="webAR">WebAR</button>
                        <button class="feature-btn" data-vrar-feature="vrControllers">VR Controllers</button>
                        <button class="feature-btn" data-vrar-feature="markerTracking">Marker Tracking</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.featureControlsUI);
    }
    
    bindEvents() {
        // Bind library card events
        const libraryCards = document.querySelectorAll('.library-card');
        libraryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const library = e.currentTarget.dataset.library;
                this.toggleLibrary(library);
            });
        });
        
        // Bind feature button events
        const featureButtons = document.querySelectorAll('.feature-btn');
        featureButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const feature = e.currentTarget.dataset.feature;
                const category = e.currentTarget.dataset.category;
                this.toggleFeature(feature, category);
            });
        });
        
        // Bind control button events
        document.getElementById('activate-all-features')?.addEventListener('click', () => {
            this.activateAllFeatures();
        });
        
        document.getElementById('deactivate-all-features')?.addEventListener('click', () => {
            this.deactivateAllFeatures();
        });
        
        document.getElementById('performance-test')?.addEventListener('click', () => {
            this.runPerformanceTest();
        });
        
        document.getElementById('export-config')?.addEventListener('click', () => {
            this.exportConfiguration();
        });
        
        console.log('✅ Events bound');
    }
    
    toggleLibrary(library) {
        console.log('🔧 Toggling library:', library);
        
        const card = document.querySelector(`[data-library="${library}"]`);
        const statusIndicator = document.getElementById(`${library}-status`);
        const statusText = document.getElementById(`${library}-text`);
        
        if (this.activeLibraries.has(library)) {
            this.activeLibraries.delete(library);
            card.classList.remove('active');
            statusIndicator.classList.remove('loaded');
            statusIndicator.classList.add('loading');
            statusText.textContent = 'Loading...';
        } else {
            this.activeLibraries.add(library);
            card.classList.add('active');
            statusIndicator.classList.remove('loading');
            statusIndicator.classList.add('loaded');
            statusText.textContent = 'Loaded';
        }
        
        this.updateLibraryStatus();
    }
    
    toggleFeature(feature, category) {
        console.log('🔧 Toggling feature:', feature, 'category:', category);
        
        const button = document.querySelector(`[data-${category}-feature="${feature}"]`);
        
        if (this.selectedFeatures.has(feature)) {
            this.selectedFeatures.delete(feature);
            button.classList.remove('active');
        } else {
            this.selectedFeatures.add(feature);
            button.classList.add('active');
        }
        
        this.updateFeatureStatus();
    }
    
    activateAllFeatures() {
        console.log('🔧 Activating all features...');
        
        const featureButtons = document.querySelectorAll('.feature-btn');
        featureButtons.forEach(button => {
            const feature = button.dataset.feature;
            const category = button.dataset.category;
            
            if (feature && category) {
                this.selectedFeatures.add(feature);
                button.classList.add('active');
            }
        });
        
        this.updateFeatureStatus();
        this.showNotification('All features activated', 'success');
    }
    
    deactivateAllFeatures() {
        console.log('🔧 Deactivating all features...');
        
        const featureButtons = document.querySelectorAll('.feature-btn');
        featureButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        this.selectedFeatures.clear();
        this.updateFeatureStatus();
        this.showNotification('All features deactivated', 'info');
    }
    
    runPerformanceTest() {
        console.log('🔧 Running performance test...');
        
        this.showNotification('Performance test started', 'info');
        
        // Simulate performance test
        setTimeout(() => {
            const results = {
                fps: Math.floor(Math.random() * 30) + 30,
                memory: Math.floor(Math.random() * 100) + 50,
                renderTime: Math.floor(Math.random() * 10) + 5,
                physicsTime: Math.floor(Math.random() * 5) + 2
            };
            
            this.updatePerformanceMetrics(results);
            this.showNotification('Performance test completed', 'success');
        }, 2000);
    }
    
    exportConfiguration() {
        console.log('🔧 Exporting configuration...');
        
        const config = {
            activeLibraries: Array.from(this.activeLibraries),
            selectedFeatures: Array.from(this.selectedFeatures),
            timestamp: new Date().toISOString(),
            creator: this.creator,
            version: this.version
        };
        
        const configBlob = new Blob([JSON.stringify(config, null, 2)], {
            type: 'application/json'
        });
        
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(configBlob);
        downloadLink.download = 'sm-open-source-config.json';
        downloadLink.click();
        
        this.showNotification('Configuration exported', 'success');
    }
    
    updateStatus() {
        this.updateLibraryStatus();
        this.updateFeatureStatus();
        this.updatePerformanceMetrics();
        
        // Update status every second
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 1000);
    }
    
    updateLibraryStatus() {
        const libraries = ['threejs', 'cannonjs', 'ammojs', 'babylonjs', 'aframe', 'webxr'];
        
        libraries.forEach(library => {
            const indicator = document.getElementById(`${library}-status-indicator`);
            const text = document.getElementById(`${library}-text`);
            
            if (window.SMOpenSourceIntegration?.libraries[library]) {
                indicator.classList.remove('loading');
                indicator.classList.add('loaded');
                if (text) text.textContent = 'Loaded';
            } else {
                indicator.classList.remove('loaded');
                indicator.classList.add('loading');
                if (text) text.textContent = 'Loading...';
            }
        });
    }
    
    updateFeatureStatus() {
        const featureButtons = document.querySelectorAll('.feature-btn');
        featureButtons.forEach(button => {
            const feature = button.dataset.feature;
            const category = button.dataset.category;
            
            if (feature && category) {
                if (this.selectedFeatures.has(feature)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });
    }
    
    updatePerformanceMetrics(metrics = null) {
        if (!metrics) {
            // Get metrics from integration if available
            if (window.SMOpenSourceIntegration) {
                metrics = window.SMOpenSourceIntegration.performance;
            } else {
                metrics = {
                    fps: 60,
                    memoryUsage: 0,
                    renderTime: 0,
                    physicsTime: 0
                };
            }
        }
        
        // Update performance displays
        const fpsDisplay = document.getElementById('fps-display');
        const memoryDisplay = document.getElementById('memory-display');
        const renderDisplay = document.getElementById('render-display');
        const physicsDisplay = document.getElementById('physics-display');
        
        if (fpsDisplay) fpsDisplay.textContent = metrics.fps;
        if (memoryDisplay) memoryDisplay.textContent = metrics.memoryUsage.toFixed(1) + ' MB';
        if (renderDisplay) renderDisplay.textContent = metrics.renderTime.toFixed(1) + 'ms';
        if (physicsDisplay) physicsDisplay.textContent = metrics.physicsTime.toFixed(1) + 'ms';
        
        // Update performance UI
        const fpsValue = document.getElementById('fps-value');
        const memoryValue = document.getElementById('memory-value');
        const renderValue = document.getElementById('render-value');
        const physicsValue = document.getElementById('physics-value');
        
        if (fpsValue) fpsValue.textContent = metrics.fps;
        if (memoryValue) memoryValue.textContent = metrics.memoryUsage.toFixed(1) + ' MB';
        if (renderValue) renderValue.textContent = metrics.renderTime.toFixed(1) + 'ms';
        if (physicsValue) physicsValue.textContent = metrics.physicsTime.toFixed(1) + 'ms';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `sm-osi-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    getStatus() {
        return {
            creator: this.creator,
            version: this.version,
            systemName: this.systemName,
            interfaceActive: this.interfaceActive,
            activeLibraries: Array.from(this.activeLibraries),
            selectedFeatures: Array.from(this.selectedFeatures)
        };
    }
    
    destroy() {
        console.log('🗑️ Destroying SM Open Source Integration Interface...');
        
        // Remove UI elements
        if (this.interfaceContainer) {
            this.interfaceContainer.remove();
        }
        
        if (this.performanceUI) {
            this.performanceUI.remove();
        }
        
        if (this.libraryStatusUI) {
            this.libraryStatusUI.remove();
        }
        
        if (this.featureControlsUI) {
            this.featureControlsUI.remove();
        }
        
        console.log('✅ SM Open Source Integration Interface destroyed');
    }
}

// Initialize SM Open Source Integration Interface
window.SMOpenSourceInterface = new SMOpenSourceInterface(); 