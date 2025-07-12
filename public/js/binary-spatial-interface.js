/**
 * Binary Spatial Interface
 * UI controls for consciousness-aware spatial computing
 * Provides intuitive interface for binary mathematics and spatial intelligence
 */

class BinarySpatialInterface {
    constructor() {
        this.binaryEngine = null;
        this.interface = null;
        this.consciousnessPanel = null;
        this.quantumPanel = null;
        this.spatialPanel = null;
        this.binaryPanel = null;
        
        this.init();
    }
    
    init() {
        console.log('🔢 Initializing Binary Spatial Interface...');
        
        // Wait for binary engine to be available
        this.waitForBinaryEngine();
        
        // Create interface elements
        this.createInterface();
        this.setupEventListeners();
        
        console.log('✅ Binary Spatial Interface Ready');
    }
    
    waitForBinaryEngine() {
        const checkEngine = () => {
            if (window.BinarySpatialEngine) {
                this.binaryEngine = new window.BinarySpatialEngine();
                this.initializeInterface();
            } else {
                setTimeout(checkEngine, 100);
            }
        };
        checkEngine();
    }
    
    initializeInterface() {
        // Initialize consciousness controls
        this.updateConsciousnessControls();
        this.updateQuantumControls();
        this.updateSpatialControls();
        this.updateBinaryControls();
        
        // Start real-time updates
        this.startRealTimeUpdates();
    }
    
    createInterface() {
        // Create main interface container
        this.interface = document.createElement('div');
        this.interface.className = 'binary-spatial-interface';
        this.interface.innerHTML = `
            <div class="binary-interface-header">
                <h3><i class="fas fa-microchip"></i> Binary Spatial Engine</h3>
                <button class="binary-toggle-btn" id="binary-toggle">
                    <i class="fas fa-power-off"></i>
                </button>
            </div>
            
            <div class="binary-interface-content">
                <!-- Consciousness Panel -->
                <div class="binary-panel" id="consciousness-panel">
                    <div class="panel-header">
                        <h4><i class="fas fa-brain"></i> Consciousness</h4>
                        <span class="binary-state" id="consciousness-state">00000000</span>
                    </div>
                    <div class="panel-content">
                        <div class="control-group">
                            <label>Consciousness Level</label>
                            <input type="range" id="consciousness-level" min="0" max="1" step="0.1" value="0.5">
                            <span class="value-display" id="consciousness-level-value">0.5</span>
                        </div>
                        <div class="control-group">
                            <label>Emotional State</label>
                            <select id="emotional-state">
                                <option value="excited">Excited</option>
                                <option value="calm">Calm</option>
                                <option value="focused">Focused</option>
                                <option value="creative">Creative</option>
                            </select>
                        </div>
                        <div class="binary-bits">
                            <div class="bit-group">
                                <span class="bit-label">Aware</span>
                                <div class="bit-indicator" id="consciousness-aware-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Emotional</span>
                                <div class="bit-indicator" id="consciousness-emotional-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Memory</span>
                                <div class="bit-indicator" id="consciousness-memory-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Neural</span>
                                <div class="bit-indicator" id="consciousness-neural-bit"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quantum Panel -->
                <div class="binary-panel" id="quantum-panel">
                    <div class="panel-header">
                        <h4><i class="fas fa-atom"></i> Quantum</h4>
                        <span class="binary-state" id="quantum-state">00000000</span>
                    </div>
                    <div class="panel-content">
                        <div class="control-group">
                            <label>Quantum State</label>
                            <input type="range" id="quantum-level" min="0" max="1" step="0.1" value="0.3">
                            <span class="value-display" id="quantum-level-value">0.3</span>
                        </div>
                        <div class="control-group">
                            <label>Entanglement Strength</label>
                            <input type="range" id="entanglement-strength" min="0" max="1" step="0.1" value="0.5">
                            <span class="value-display" id="entanglement-strength-value">0.5</span>
                        </div>
                        <div class="binary-bits">
                            <div class="bit-group">
                                <span class="bit-label">Active</span>
                                <div class="bit-indicator" id="quantum-active-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Entangled</span>
                                <div class="bit-indicator" id="quantum-entangled-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Coherent</span>
                                <div class="bit-indicator" id="quantum-coherent-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Superposed</span>
                                <div class="bit-indicator" id="quantum-superposed-bit"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Spatial Panel -->
                <div class="binary-panel" id="spatial-panel">
                    <div class="panel-header">
                        <h4><i class="fas fa-cube"></i> Spatial</h4>
                        <span class="binary-state" id="spatial-state">00000000</span>
                    </div>
                    <div class="panel-content">
                        <div class="control-group">
                            <label>Spatial Awareness</label>
                            <input type="range" id="spatial-awareness" min="0" max="1" step="0.1" value="0.7">
                            <span class="value-display" id="spatial-awareness-value">0.7</span>
                        </div>
                        <div class="control-group">
                            <label>Optimization Level</label>
                            <input type="range" id="optimization-level" min="0" max="1" step="0.1" value="0.8">
                            <span class="value-display" id="optimization-level-value">0.8</span>
                        </div>
                        <div class="binary-bits">
                            <div class="bit-group">
                                <span class="bit-label">Aware</span>
                                <div class="bit-indicator" id="spatial-aware-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Optimized</span>
                                <div class="bit-indicator" id="spatial-optimized-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Binary</span>
                                <div class="bit-indicator" id="spatial-binary-bit"></div>
                            </div>
                            <div class="bit-group">
                                <span class="bit-label">Enhanced</span>
                                <div class="bit-indicator" id="spatial-enhanced-bit"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Binary Operations Panel -->
                <div class="binary-panel" id="binary-panel">
                    <div class="panel-header">
                        <h4><i class="fas fa-code"></i> Binary Operations</h4>
                        <span class="binary-state" id="binary-state">00000000</span>
                    </div>
                    <div class="panel-content">
                        <div class="binary-operations">
                            <button class="binary-op-btn" data-operation="CONSCIOUSNESS_AWARE">
                                <i class="fas fa-brain"></i> Consciousness
                            </button>
                            <button class="binary-op-btn" data-operation="SPATIAL_AWARE">
                                <i class="fas fa-cube"></i> Spatial
                            </button>
                            <button class="binary-op-btn" data-operation="QUANTUM_ACTIVE">
                                <i class="fas fa-atom"></i> Quantum
                            </button>
                            <button class="binary-op-btn" data-operation="BINARY_OPTIMIZED">
                                <i class="fas fa-microchip"></i> Optimized
                            </button>
                            <button class="binary-op-btn" data-operation="NEURAL_ENHANCED">
                                <i class="fas fa-network-wired"></i> Neural
                            </button>
                            <button class="binary-op-btn" data-operation="EMOTIONAL_AWARE">
                                <i class="fas fa-heart"></i> Emotional
                            </button>
                            <button class="binary-op-btn" data-operation="MEMORY_ACTIVE">
                                <i class="fas fa-memory"></i> Memory
                            </button>
                            <button class="binary-op-btn" data-operation="QUANTUM_ENTANGLED">
                                <i class="fas fa-link"></i> Entangled
                            </button>
                        </div>
                        <div class="binary-matrix">
                            <h5>Binary Matrix</h5>
                            <div class="matrix-display" id="binary-matrix">
                                <div class="matrix-row">
                                    <span class="matrix-cell">1</span>
                                    <span class="matrix-cell">0</span>
                                    <span class="matrix-cell">1</span>
                                    <span class="matrix-cell">0</span>
                                </div>
                                <div class="matrix-row">
                                    <span class="matrix-cell">0</span>
                                    <span class="matrix-cell">1</span>
                                    <span class="matrix-cell">0</span>
                                    <span class="matrix-cell">1</span>
                                </div>
                                <div class="matrix-row">
                                    <span class="matrix-cell">1</span>
                                    <span class="matrix-cell">1</span>
                                    <span class="matrix-cell">0</span>
                                    <span class="matrix-cell">0</span>
                                </div>
                                <div class="matrix-row">
                                    <span class="matrix-cell">0</span>
                                    <span class="matrix-cell">0</span>
                                    <span class="matrix-cell">1</span>
                                    <span class="matrix-cell">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to editor
        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
            editorContainer.appendChild(this.interface);
        }
        
        // Store panel references
        this.consciousnessPanel = document.getElementById('consciousness-panel');
        this.quantumPanel = document.getElementById('quantum-panel');
        this.spatialPanel = document.getElementById('spatial-panel');
        this.binaryPanel = document.getElementById('binary-panel');
    }
    
    setupEventListeners() {
        // Consciousness controls
        const consciousnessLevel = document.getElementById('consciousness-level');
        if (consciousnessLevel) {
            consciousnessLevel.addEventListener('input', (e) => {
                this.updateConsciousnessLevel(parseFloat(e.target.value));
            });
        }
        
        const emotionalState = document.getElementById('emotional-state');
        if (emotionalState) {
            emotionalState.addEventListener('change', (e) => {
                this.updateEmotionalState(e.target.value);
            });
        }
        
        // Quantum controls
        const quantumLevel = document.getElementById('quantum-level');
        if (quantumLevel) {
            quantumLevel.addEventListener('input', (e) => {
                this.updateQuantumLevel(parseFloat(e.target.value));
            });
        }
        
        const entanglementStrength = document.getElementById('entanglement-strength');
        if (entanglementStrength) {
            entanglementStrength.addEventListener('input', (e) => {
                this.updateEntanglementStrength(parseFloat(e.target.value));
            });
        }
        
        // Spatial controls
        const spatialAwareness = document.getElementById('spatial-awareness');
        if (spatialAwareness) {
            spatialAwareness.addEventListener('input', (e) => {
                this.updateSpatialAwareness(parseFloat(e.target.value));
            });
        }
        
        const optimizationLevel = document.getElementById('optimization-level');
        if (optimizationLevel) {
            optimizationLevel.addEventListener('input', (e) => {
                this.updateOptimizationLevel(parseFloat(e.target.value));
            });
        }
        
        // Binary operation buttons
        const binaryOpBtns = document.querySelectorAll('.binary-op-btn');
        binaryOpBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const operation = e.target.closest('.binary-op-btn').dataset.operation;
                this.activateBinaryOperation(operation);
            });
        });
        
        // Toggle button
        const toggleBtn = document.getElementById('binary-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleBinaryEngine();
            });
        }
    }
    
    updateConsciousnessLevel(level) {
        if (this.binaryEngine) {
            this.binaryEngine.setConsciousnessLevel(level);
            this.updateConsciousnessControls();
        }
        
        const valueDisplay = document.getElementById('consciousness-level-value');
        if (valueDisplay) {
            valueDisplay.textContent = level.toFixed(2);
        }
    }
    
    updateEmotionalState(emotion) {
        if (this.binaryEngine) {
            this.binaryEngine.setEmotionalState(emotion);
            this.updateConsciousnessControls();
        }
    }
    
    updateQuantumLevel(level) {
        if (this.binaryEngine) {
            this.binaryEngine.setQuantumState(level);
            this.updateQuantumControls();
        }
        
        const valueDisplay = document.getElementById('quantum-level-value');
        if (valueDisplay) {
            valueDisplay.textContent = level.toFixed(2);
        }
    }
    
    updateEntanglementStrength(strength) {
        if (this.binaryEngine) {
            // Update entanglement strength
            this.updateQuantumControls();
        }
        
        const valueDisplay = document.getElementById('entanglement-strength-value');
        if (valueDisplay) {
            valueDisplay.textContent = strength.toFixed(2);
        }
    }
    
    updateSpatialAwareness(awareness) {
        if (this.binaryEngine) {
            // Update spatial awareness
            this.updateSpatialControls();
        }
        
        const valueDisplay = document.getElementById('spatial-awareness-value');
        if (valueDisplay) {
            valueDisplay.textContent = awareness.toFixed(2);
        }
    }
    
    updateOptimizationLevel(level) {
        if (this.binaryEngine) {
            // Update optimization level
            this.updateSpatialControls();
        }
        
        const valueDisplay = document.getElementById('optimization-level-value');
        if (valueDisplay) {
            valueDisplay.textContent = level.toFixed(2);
        }
    }
    
    activateBinaryOperation(operation) {
        if (this.binaryEngine) {
            const success = this.binaryEngine.activateFeature(operation);
            if (success) {
                this.updateAllControls();
                this.highlightBinaryOperation(operation);
            }
        }
    }
    
    highlightBinaryOperation(operation) {
        // Highlight the activated operation
        const btn = document.querySelector(`[data-operation="${operation}"]`);
        if (btn) {
            btn.classList.add('active');
            setTimeout(() => {
                btn.classList.remove('active');
            }, 1000);
        }
    }
    
    toggleBinaryEngine() {
        const toggleBtn = document.getElementById('binary-toggle');
        if (toggleBtn) {
            const isActive = toggleBtn.classList.contains('active');
            if (isActive) {
                this.deactivateBinaryEngine();
            } else {
                this.activateBinaryEngine();
            }
        }
    }
    
    activateBinaryEngine() {
        const toggleBtn = document.getElementById('binary-toggle');
        if (toggleBtn) {
            toggleBtn.classList.add('active');
            toggleBtn.innerHTML = '<i class="fas fa-power-off"></i>';
        }
        
        // Activate core features
        if (this.binaryEngine) {
            this.binaryEngine.activateFeature('CONSCIOUSNESS_AWARE');
            this.binaryEngine.activateFeature('SPATIAL_AWARE');
            this.binaryEngine.activateFeature('BINARY_OPTIMIZED');
        }
        
        this.updateAllControls();
    }
    
    deactivateBinaryEngine() {
        const toggleBtn = document.getElementById('binary-toggle');
        if (toggleBtn) {
            toggleBtn.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fas fa-power-off"></i>';
        }
        
        // Deactivate features
        if (this.binaryEngine) {
            this.binaryEngine.binaryState = 0b00000000;
        }
        
        this.updateAllControls();
    }
    
    updateConsciousnessControls() {
        if (!this.binaryEngine) return;
        
        const consciousnessState = document.getElementById('consciousness-state');
        if (consciousnessState) {
            consciousnessState.textContent = this.binaryEngine.consciousnessBits.toString(2).padStart(8, '0');
        }
        
        // Update bit indicators
        this.updateBitIndicator('consciousness-aware-bit', this.binaryEngine.isConsciousnessAware(this.binaryEngine.binaryState));
        this.updateBitIndicator('consciousness-emotional-bit', this.binaryEngine.isEmotionalAware(this.binaryEngine.binaryState));
        this.updateBitIndicator('consciousness-memory-bit', this.binaryEngine.isMemoryActive(this.binaryEngine.binaryState));
        this.updateBitIndicator('consciousness-neural-bit', this.binaryEngine.isNeuralEnhanced(this.binaryEngine.binaryState));
    }
    
    updateQuantumControls() {
        if (!this.binaryEngine) return;
        
        const quantumState = document.getElementById('quantum-state');
        if (quantumState) {
            quantumState.textContent = this.binaryEngine.quantumBits.toString(2).padStart(8, '0');
        }
        
        // Update bit indicators
        this.updateBitIndicator('quantum-active-bit', this.binaryEngine.isQuantumActive(this.binaryEngine.binaryState));
        this.updateBitIndicator('quantum-entangled-bit', this.binaryEngine.isQuantumEntangled(this.binaryEngine.binaryState));
        this.updateBitIndicator('quantum-coherent-bit', (this.binaryEngine.quantumBits & 0b00000100) !== 0);
        this.updateBitIndicator('quantum-superposed-bit', (this.binaryEngine.quantumBits & 0b00001000) !== 0);
    }
    
    updateSpatialControls() {
        if (!this.binaryEngine) return;
        
        const spatialState = document.getElementById('spatial-state');
        if (spatialState) {
            spatialState.textContent = this.binaryEngine.spatialBits.toString(2).padStart(8, '0');
        }
        
        // Update bit indicators
        this.updateBitIndicator('spatial-aware-bit', this.binaryEngine.isSpatialAware(this.binaryEngine.binaryState));
        this.updateBitIndicator('spatial-optimized-bit', this.binaryEngine.isBinaryOptimized(this.binaryEngine.binaryState));
        this.updateBitIndicator('spatial-binary-bit', (this.binaryEngine.spatialBits & 0b00000100) !== 0);
        this.updateBitIndicator('spatial-enhanced-bit', (this.binaryEngine.spatialBits & 0b00001000) !== 0);
    }
    
    updateBinaryControls() {
        if (!this.binaryEngine) return;
        
        const binaryState = document.getElementById('binary-state');
        if (binaryState) {
            binaryState.textContent = this.binaryEngine.binaryState.toString(2).padStart(8, '0');
        }
        
        // Update binary matrix
        this.updateBinaryMatrix();
    }
    
    updateBitIndicator(bitId, isActive) {
        const indicator = document.getElementById(bitId);
        if (indicator) {
            if (isActive) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        }
    }
    
    updateBinaryMatrix() {
        if (!this.binaryEngine) return;
        
        const matrix = document.getElementById('binary-matrix');
        if (matrix) {
            const spatialMatrix = this.binaryEngine.getSpatialMatrix();
            const consciousnessMatrix = this.binaryEngine.getConsciousnessMatrix();
            
            // Update matrix display with binary values
            const cells = matrix.querySelectorAll('.matrix-cell');
            for (let i = 0; i < Math.min(cells.length, 16); i++) {
                const value = spatialMatrix[i] > 0.5 ? '1' : '0';
                cells[i].textContent = value;
                cells[i].className = `matrix-cell ${value === '1' ? 'active' : ''}`;
            }
        }
    }
    
    updateAllControls() {
        this.updateConsciousnessControls();
        this.updateQuantumControls();
        this.updateSpatialControls();
        this.updateBinaryControls();
    }
    
    startRealTimeUpdates() {
        // Update controls every 100ms for real-time feedback
        setInterval(() => {
            if (this.binaryEngine) {
                this.updateAllControls();
            }
        }, 100);
    }
    
    // Public API methods
    
    getBinaryEngine() {
        return this.binaryEngine;
    }
    
    setConsciousnessLevel(level) {
        this.updateConsciousnessLevel(level);
    }
    
    setEmotionalState(emotion) {
        this.updateEmotionalState(emotion);
    }
    
    setQuantumState(state) {
        this.updateQuantumLevel(state);
    }
    
    activateFeature(feature) {
        this.activateBinaryOperation(feature);
    }
    
    // Cleanup
    destroy() {
        console.log('🔢 Destroying Binary Spatial Interface...');
        
        if (this.interface && this.interface.parentNode) {
            this.interface.parentNode.removeChild(this.interface);
        }
        
        this.binaryEngine = null;
        this.interface = null;
        this.consciousnessPanel = null;
        this.quantumPanel = null;
        this.spatialPanel = null;
        this.binaryPanel = null;
    }
}

// Initialize Binary Spatial Interface
window.BinarySpatialInterface = BinarySpatialInterface;