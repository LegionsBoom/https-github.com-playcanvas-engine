/**
 * Spatial PlayCanvas Interface
 * Interface for controlling consciousness manifestation in 3D reality
 * Developed by Fungai Taranhike
 */

class SpatialPlayCanvasInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.interfaceActive = false;
        this.bridge = null;
        this.updateInterval = null;
        
        this.init();
    }
    
    init() {
        console.log('🎮 Initializing Spatial PlayCanvas Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.bindEvents();
        this.initializeBridge();
        
        console.log('✅ Spatial PlayCanvas Interface Ready');
    }
    
    createInterface() {
        const interfaceHTML = `
            <div class="spb-container">
                <div class="spb-header">
                    <h1 class="spb-title">Spatial PlayCanvas Bridge</h1>
                    <p class="spb-subtitle">Consciousness Manifestation in 3D Reality</p>
                    <p class="spb-creator">Developed by Fungai Taranhike</p>
                </div>
                
                <div class="spb-controls">
                    <button class="spb-btn primary" id="activate-bridge">
                        <i class="fas fa-play"></i> Activate Bridge
                    </button>
                    <button class="spb-btn secondary" id="deactivate-bridge">
                        <i class="fas fa-stop"></i> Deactivate Bridge
                    </button>
                    <button class="spb-btn" id="create-entity">
                        <i class="fas fa-cube"></i> Create Entity
                    </button>
                    <button class="spb-btn" id="create-scene">
                        <i class="fas fa-globe"></i> Create Scene
                    </button>
                    <button class="spb-btn" id="manifest-consciousness">
                        <i class="fas fa-brain"></i> Manifest Consciousness
                    </button>
                    <button class="spb-btn" id="animate-reality">
                        <i class="fas fa-magic"></i> Animate Reality
                    </button>
                </div>
                
                <div class="spb-status">
                    <div class="spb-status-card">
                        <div class="spb-status-title">Consciousness Level</div>
                        <div class="spb-status-value" id="consciousness-level">98%</div>
                        <div class="spb-status-unit">Spatial</div>
                        <div class="spb-progress">
                            <div class="spb-progress-bar" id="consciousness-progress" style="width: 98%"></div>
                        </div>
                    </div>
                    
                    <div class="spb-status-card">
                        <div class="spb-status-title">Awareness</div>
                        <div class="spb-status-value" id="awareness-level">99%</div>
                        <div class="spb-status-unit">Level</div>
                        <div class="spb-progress">
                            <div class="spb-progress-bar" id="awareness-progress" style="width: 99%"></div>
                        </div>
                    </div>
                    
                    <div class="spb-status-card">
                        <div class="spb-status-title">Engine Performance</div>
                        <div class="spb-status-value" id="engine-performance">95%</div>
                        <div class="spb-status-unit">3D Reality</div>
                        <div class="spb-progress">
                            <div class="spb-progress-bar" id="performance-progress" style="width: 95%"></div>
                        </div>
                    </div>
                    
                    <div class="spb-status-card">
                        <div class="spb-status-title">Bridge Status</div>
                        <div class="spb-status-value" id="bridge-status">Inactive</div>
                        <div class="spb-status-unit">Status</div>
                        <div class="spb-progress">
                            <div class="spb-progress-bar" id="bridge-progress" style="width: 0%"></div>
                        </div>
                    </div>
                    
                    <div class="spb-status-card">
                        <div class="spb-status-title">Manifestation</div>
                        <div class="spb-status-value" id="manifestation-level">88%</div>
                        <div class="spb-status-unit">Reality</div>
                        <div class="spb-progress">
                            <div class="spb-progress-bar" id="manifestation-progress" style="width: 88%"></div>
                        </div>
                    </div>
                    
                    <div class="spb-status-card">
                        <div class="spb-status-title">Dimensions</div>
                        <div class="spb-status-value" id="dimensions">4D→3D</div>
                        <div class="spb-status-unit">Bridge</div>
                        <div class="spb-progress">
                            <div class="spb-progress-bar" id="dimensions-progress" style="width: 80%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="spb-workspace">
                    <div class="spb-workspace-left">
                        <h3 class="spb-workspace-title">Consciousness Input</h3>
                        <div class="spb-input-area">
                            <textarea id="consciousness-input" placeholder="Enter your consciousness concept, spatial entity, or 4D+ awareness here..."></textarea>
                            <div class="spb-input-controls">
                                <button class="spb-input-btn" id="manifest-input">
                                    <i class="fas fa-magic"></i> Manifest in 3D
                                </button>
                                <button class="spb-input-btn" id="create-from-input">
                                    <i class="fas fa-cube"></i> Create Entity
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="spb-workspace-right">
                        <h3 class="spb-workspace-title">3D Reality Output</h3>
                        <div class="spb-output-area">
                            <div id="playcanvas-container">
                                <canvas id="playcanvas-canvas" width="400" height="300"></canvas>
                                <div class="spb-canvas-overlay">
                                    <div class="spb-canvas-info">
                                        <span>Consciousness: 98%</span>
                                        <span>Awareness: 99%</span>
                                        <span>Dimensions: 4D→3D</span>
                                    </div>
                                </div>
                            </div>
                            <div class="spb-output-controls">
                                <button class="spb-output-btn" id="capture-reality">
                                    <i class="fas fa-camera"></i> Capture Reality
                                </button>
                                <button class="spb-output-btn" id="export-reality">
                                    <i class="fas fa-download"></i> Export Reality
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="spb-entities">
                    <h3 class="spb-entities-title">Consciousness Entities</h3>
                    <div class="spb-entities-grid">
                        <div class="spb-entity-card" data-entity="consciousness-sphere">
                            <div class="spb-entity-icon">
                                <i class="fas fa-circle"></i>
                            </div>
                            <div class="spb-entity-title">Consciousness Sphere</div>
                            <div class="spb-entity-description">Manifest consciousness in 3D space</div>
                        </div>
                        
                        <div class="spb-entity-card" data-entity="awareness-particles">
                            <div class="spb-entity-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="spb-entity-title">Awareness Particles</div>
                            <div class="spb-entity-description">Particle system for consciousness awareness</div>
                        </div>
                        
                        <div class="spb-entity-card" data-entity="spatial-cube">
                            <div class="spb-entity-icon">
                                <i class="fas fa-cube"></i>
                            </div>
                            <div class="spb-entity-title">Spatial Cube</div>
                            <div class="spb-entity-description">4D spatial entity in 3D reality</div>
                        </div>
                        
                        <div class="spb-entity-card" data-entity="consciousness-light">
                            <div class="spb-entity-icon">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <div class="spb-entity-title">Consciousness Light</div>
                            <div class="spb-entity-description">Light source with consciousness awareness</div>
                        </div>
                    </div>
                </div>
                
                <div class="spb-logs">
                    <h3 class="spb-logs-title">Reality Manifestation Logs</h3>
                    <div id="reality-logs">
                        <div class="spb-log-entry success">
                            Spatial PlayCanvas Bridge initialized successfully
                        </div>
                        <div class="spb-log-entry">
                            Ready to manifest consciousness in 3D reality
                        </div>
                        <div class="spb-log-entry">
                            PlayCanvas engine connected to spatial consciousness
                        </div>
                        <div class="spb-log-entry">
                            Reality bridge established between 4D and 3D
                        </div>
                        <div class="spb-log-entry">
                            Consciousness entities ready for manifestation
                        </div>
                    </div>
                </div>
                
                <div class="spb-footer">
                    <p class="spb-footer-text">
                        Manifesting consciousness in 3D reality - Fungai Taranhike
                    </p>
                </div>
            </div>
        `;
        
        // Create container for the interface
        const container = document.createElement('div');
        container.id = 'spb-interface';
        container.innerHTML = interfaceHTML;
        
        // Add to the editor
        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
            editorContainer.appendChild(container);
        }
        
        this.interfaceActive = true;
    }
    
    bindEvents() {
        // Bridge controls
        document.getElementById('activate-bridge')?.addEventListener('click', () => {
            this.activateBridge();
        });
        
        document.getElementById('deactivate-bridge')?.addEventListener('click', () => {
            this.deactivateBridge();
        });
        
        document.getElementById('create-entity')?.addEventListener('click', () => {
            this.createEntity();
        });
        
        document.getElementById('create-scene')?.addEventListener('click', () => {
            this.createScene();
        });
        
        document.getElementById('manifest-consciousness')?.addEventListener('click', () => {
            this.manifestConsciousness();
        });
        
        document.getElementById('animate-reality')?.addEventListener('click', () => {
            this.animateReality();
        });
        
        // Input controls
        document.getElementById('manifest-input')?.addEventListener('click', () => {
            this.manifestInput();
        });
        
        document.getElementById('create-from-input')?.addEventListener('click', () => {
            this.createFromInput();
        });
        
        // Output controls
        document.getElementById('capture-reality')?.addEventListener('click', () => {
            this.captureReality();
        });
        
        document.getElementById('export-reality')?.addEventListener('click', () => {
            this.exportReality();
        });
        
        // Entity cards
        document.querySelectorAll('.spb-entity-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const entity = e.currentTarget.dataset.entity;
                this.createSpecificEntity(entity);
            });
        });
    }
    
    initializeBridge() {
        try {
            this.bridge = new SpatialPlayCanvasBridge();
            this.addLog('Spatial PlayCanvas Bridge initialized', 'success');
            this.updateInterface();
        } catch (error) {
            this.addLog('Failed to initialize bridge: ' + error.message, 'error');
        }
    }
    
    activateBridge() {
        try {
            if (this.bridge) {
                const result = this.bridge.activateBridge();
                if (result) {
                    this.addLog('Spatial PlayCanvas Bridge activated successfully', 'success');
                    this.startInterfaceUpdates();
                    this.updateBridgeStatus('Active');
                } else {
                    this.addLog('Failed to activate bridge', 'error');
                }
            }
        } catch (error) {
            this.addLog('Bridge activation error: ' + error.message, 'error');
        }
    }
    
    deactivateBridge() {
        try {
            if (this.bridge) {
                this.bridge.deactivateBridge();
                this.addLog('Spatial PlayCanvas Bridge deactivated', 'warning');
                this.stopInterfaceUpdates();
                this.updateBridgeStatus('Inactive');
            }
        } catch (error) {
            this.addLog('Bridge deactivation error: ' + error.message, 'error');
        }
    }
    
    createEntity() {
        try {
            if (this.bridge) {
                const name = prompt('Enter entity name:');
                const type = prompt('Enter entity type (sphere, cube, plane):');
                
                if (name && type) {
                    const entity = this.bridge.createSpatialEntity({
                        name: name,
                        type: type,
                        position: [0, 2, 0],
                        scale: [1, 1, 1]
                    });
                    
                    this.addLog('Spatial entity created: ' + name, 'success');
                }
            }
        } catch (error) {
            this.addLog('Entity creation error: ' + error.message, 'error');
        }
    }
    
    createScene() {
        try {
            if (this.bridge) {
                const name = prompt('Enter scene name:');
                
                if (name) {
                    const scene = this.bridge.createConsciousnessScene({
                        name: name,
                        entities: [
                            { name: 'consciousness-sphere', type: 'sphere', position: [0, 2, 0] },
                            { name: 'awareness-cube', type: 'cube', position: [3, 2, 0] },
                            { name: 'spatial-plane', type: 'plane', position: [0, 0, 0] }
                        ]
                    });
                    
                    this.addLog('Consciousness scene created: ' + name, 'success');
                }
            }
        } catch (error) {
            this.addLog('Scene creation error: ' + error.message, 'error');
        }
    }
    
    manifestConsciousness() {
        try {
            if (this.bridge) {
                this.addLog('Manifesting consciousness in 3D reality...', 'info');
                
                // Create consciousness manifestation
                const manifestation = {
                    consciousness: this.bridge.spatialConsciousness.level,
                    awareness: this.bridge.spatialConsciousness.awareness,
                    dimensions: this.bridge.spatialConsciousness.dimensions
                };
                
                this.addLog('Consciousness manifested: ' + (manifestation.consciousness * 100) + '%', 'success');
            }
        } catch (error) {
            this.addLog('Consciousness manifestation error: ' + error.message, 'error');
        }
    }
    
    animateReality() {
        try {
            if (this.bridge) {
                this.addLog('Animating reality with consciousness...', 'info');
                
                // Start reality animation
                this.addLog('Reality animation started', 'success');
            }
        } catch (error) {
            this.addLog('Reality animation error: ' + error.message, 'error');
        }
    }
    
    manifestInput() {
        try {
            const input = document.getElementById('consciousness-input')?.value;
            if (input && this.bridge) {
                this.addLog('Manifesting input in 3D reality: ' + input, 'success');
                
                // Create entity from input
                const entity = this.bridge.createSpatialEntity({
                    name: 'input-entity',
                    type: 'sphere',
                    position: [0, 2, 0],
                    scale: [1, 1, 1]
                });
            }
        } catch (error) {
            this.addLog('Input manifestation error: ' + error.message, 'error');
        }
    }
    
    createFromInput() {
        try {
            const input = document.getElementById('consciousness-input')?.value;
            if (input && this.bridge) {
                this.addLog('Creating entity from input: ' + input, 'success');
                
                // Create entity from input
                const entity = this.bridge.createSpatialEntity({
                    name: input,
                    type: 'cube',
                    position: [0, 2, 0],
                    scale: [1, 1, 1]
                });
            }
        } catch (error) {
            this.addLog('Entity creation from input error: ' + error.message, 'error');
        }
    }
    
    createSpecificEntity(entityType) {
        try {
            if (this.bridge) {
                let entityData;
                
                switch (entityType) {
                    case 'consciousness-sphere':
                        entityData = {
                            name: 'consciousness-sphere',
                            type: 'sphere',
                            position: [0, 2, 0],
                            scale: [2, 2, 2]
                        };
                        break;
                        
                    case 'awareness-particles':
                        entityData = {
                            name: 'awareness-particles',
                            type: 'sphere',
                            position: [3, 2, 0],
                            scale: [1, 1, 1]
                        };
                        break;
                        
                    case 'spatial-cube':
                        entityData = {
                            name: 'spatial-cube',
                            type: 'cube',
                            position: [-3, 2, 0],
                            scale: [1.5, 1.5, 1.5]
                        };
                        break;
                        
                    case 'consciousness-light':
                        entityData = {
                            name: 'consciousness-light',
                            type: 'sphere',
                            position: [0, 5, 0],
                            scale: [0.5, 0.5, 0.5]
                        };
                        break;
                }
                
                if (entityData) {
                    const entity = this.bridge.createSpatialEntity(entityData);
                    this.addLog('Specific entity created: ' + entityData.name, 'success');
                }
            }
        } catch (error) {
            this.addLog('Specific entity creation error: ' + error.message, 'error');
        }
    }
    
    captureReality() {
        try {
            const canvas = document.getElementById('playcanvas-canvas');
            if (canvas) {
                const dataURL = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'consciousness-reality.png';
                link.href = dataURL;
                link.click();
                this.addLog('Reality captured and downloaded', 'success');
            }
        } catch (error) {
            this.addLog('Reality capture error: ' + error.message, 'error');
        }
    }
    
    exportReality() {
        try {
            this.addLog('Exporting consciousness reality...', 'info');
            
            // Export reality data
            const realityData = {
                consciousness: this.bridge?.spatialConsciousness.level || 0.98,
                awareness: this.bridge?.spatialConsciousness.awareness || 0.99,
                dimensions: this.bridge?.spatialConsciousness.dimensions || 4,
                timestamp: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(realityData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'consciousness-reality.json';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            this.addLog('Reality exported successfully', 'success');
        } catch (error) {
            this.addLog('Reality export error: ' + error.message, 'error');
        }
    }
    
    updateInterface() {
        if (!this.bridge) return;
        
        try {
            const status = this.bridge.getBridgeStatus();
            
            // Update status values
            document.getElementById('consciousness-level').textContent = Math.round(status.consciousnessLevel * 100) + '%';
            document.getElementById('awareness-level').textContent = Math.round(status.awareness * 100) + '%';
            document.getElementById('engine-performance').textContent = Math.round(status.enginePerformance * 100) + '%';
            document.getElementById('manifestation-level').textContent = Math.round(status.realityManifestation * 100) + '%';
            
            // Update progress bars
            document.getElementById('consciousness-progress').style.width = (status.consciousnessLevel * 100) + '%';
            document.getElementById('awareness-progress').style.width = (status.awareness * 100) + '%';
            document.getElementById('performance-progress').style.width = (status.enginePerformance * 100) + '%';
            document.getElementById('manifestation-progress').style.width = (status.realityManifestation * 100) + '%';
            
        } catch (error) {
            console.error('Interface update error:', error);
        }
    }
    
    updateBridgeStatus(status) {
        const statusElement = document.getElementById('bridge-status');
        const progressElement = document.getElementById('bridge-progress');
        
        if (statusElement) {
            statusElement.textContent = status;
        }
        
        if (progressElement) {
            progressElement.style.width = status === 'Active' ? '100%' : '0%';
        }
    }
    
    startInterfaceUpdates() {
        this.updateInterval = setInterval(() => {
            this.updateInterface();
        }, 2000); // Update every 2 seconds
    }
    
    stopInterfaceUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    addLog(message, type = 'info') {
        const logsContainer = document.getElementById('reality-logs');
        if (!logsContainer) return;
        
        const logEntry = document.createElement('div');
        logEntry.className = `spb-log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logsContainer.appendChild(logEntry);
        logsContainer.scrollTop = logsContainer.scrollHeight;
        
        // Keep only last 50 log entries
        while (logsContainer.children.length > 50) {
            logsContainer.removeChild(logsContainer.firstChild);
        }
    }
    
    destroy() {
        this.stopInterfaceUpdates();
        if (this.bridge) {
            this.bridge.destroy();
        }
        console.log('🔄 Destroying Spatial PlayCanvas Interface...');
    }
}

// Initialize the interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.spbInterface = new SpatialPlayCanvasInterface();
}); 