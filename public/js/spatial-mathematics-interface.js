/**
 * Spatial Mathematics Interface
 * UI and interaction components for SMSI in the editor
 * Developed by Fungai Taranhike
 */

class SpatialMathematicsInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.system = null;
        this.interface = null;
        this.visualization = null;
        this.init();
    }
    
    init() {
        console.log('🎨 Initializing Spatial Mathematics Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.setupEventListeners();
        this.initializeSystem();
        
        console.log('✅ Spatial Mathematics Interface Active');
    }
    
    createInterface() {
        // Create spatial mathematics panel
        const panel = document.createElement('div');
        panel.className = 'spatial-math-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3><i class="fas fa-brain"></i> Spatial Mathematics (SMSI)</h3>
                <div class="creator-signature">
                    <span>By Fungai Taranhike</span>
                </div>
            </div>
            
            <div class="spatial-math-content">
                <!-- Mathematical Operations -->
                <div class="math-section">
                    <h4>Spatial Operations</h4>
                    <div class="operation-grid">
                        <button class="math-btn" data-operation="SPATIAL_ADD">
                            <i class="fas fa-plus"></i> Add
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_SUBTRACT">
                            <i class="fas fa-minus"></i> Subtract
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_MULTIPLY">
                            <i class="fas fa-times"></i> Multiply
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_DIVIDE">
                            <i class="fas fa-divide"></i> Divide
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_POWER">
                            <i class="fas fa-superscript"></i> Power
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_ROOT">
                            <i class="fas fa-square-root-alt"></i> Root
                        </button>
                    </div>
                </div>
                
                <!-- Geometry Operations -->
                <div class="math-section">
                    <h4>Spatial Geometry</h4>
                    <div class="operation-grid">
                        <button class="math-btn" data-operation="SPATIAL_DISTANCE">
                            <i class="fas fa-ruler"></i> Distance
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_ANGLE">
                            <i class="fas fa-angle"></i> Angle
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_AREA">
                            <i class="fas fa-square"></i> Area
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_VOLUME">
                            <i class="fas fa-cube"></i> Volume
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_CURVATURE">
                            <i class="fas fa-wave-square"></i> Curvature
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_TORSION">
                            <i class="fas fa-spiral"></i> Torsion
                        </button>
                    </div>
                </div>
                
                <!-- Calculus Operations -->
                <div class="math-section">
                    <h4>Spatial Calculus</h4>
                    <div class="operation-grid">
                        <button class="math-btn" data-operation="SPATIAL_DERIVATIVE">
                            <i class="fas fa-prime"></i> Derivative
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_INTEGRAL">
                            <i class="fas fa-integral"></i> Integral
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_GRADIENT">
                            <i class="fas fa-arrow-up"></i> Gradient
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_DIVERGENCE">
                            <i class="fas fa-arrows-alt"></i> Divergence
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_CURL">
                            <i class="fas fa-redo"></i> Curl
                        </button>
                        <button class="math-btn" data-operation="SPATIAL_LAPLACIAN">
                            <i class="fas fa-delta"></i> Laplacian
                        </button>
                    </div>
                </div>
                
                <!-- Quantum Operations -->
                <div class="math-section">
                    <h4>Quantum Mathematics</h4>
                    <div class="operation-grid">
                        <button class="math-btn" data-operation="QUANTUM_SUPERPOSE">
                            <i class="fas fa-atom"></i> Superpose
                        </button>
                        <button class="math-btn" data-operation="QUANTUM_ENTANGLE">
                            <i class="fas fa-link"></i> Entangle
                        </button>
                        <button class="math-btn" data-operation="QUANTUM_MEASURE">
                            <i class="fas fa-eye"></i> Measure
                        </button>
                        <button class="math-btn" data-operation="QUANTUM_COLLAPSE">
                            <i class="fas fa-compress"></i> Collapse
                        </button>
                        <button class="math-btn" data-operation="QUANTUM_TELEPORT">
                            <i class="fas fa-paper-plane"></i> Teleport
                        </button>
                        <button class="math-btn" data-operation="QUANTUM_CLONE">
                            <i class="fas fa-copy"></i> Clone
                        </button>
                    </div>
                </div>
                
                <!-- Self-Improvement Operations -->
                <div class="math-section">
                    <h4>Self-Improvement</h4>
                    <div class="operation-grid">
                        <button class="math-btn" data-operation="CONSCIOUSNESS_LEARN">
                            <i class="fas fa-brain"></i> Learn
                        </button>
                        <button class="math-btn" data-operation="CONSCIOUSNESS_ADAPT">
                            <i class="fas fa-sync"></i> Adapt
                        </button>
                        <button class="math-btn" data-operation="CONSCIOUSNESS_EVOLVE">
                            <i class="fas fa-dna"></i> Evolve
                        </button>
                        <button class="math-btn" data-operation="ADAPTATION_LEARN">
                            <i class="fas fa-graduation-cap"></i> Adapt Learn
                        </button>
                        <button class="math-btn" data-operation="EVOLUTION_SELECT">
                            <i class="fas fa-filter"></i> Select
                        </button>
                        <button class="math-btn" data-operation="LEARNING_REINFORCEMENT">
                            <i class="fas fa-star"></i> Reinforce
                        </button>
                    </div>
                </div>
                
                <!-- Input Controls -->
                <div class="math-section">
                    <h4>Input Parameters</h4>
                    <div class="input-controls">
                        <div class="input-group">
                            <label>Parameter A:</label>
                            <input type="number" id="param-a" value="1" step="0.1">
                        </div>
                        <div class="input-group">
                            <label>Parameter B:</label>
                            <input type="number" id="param-b" value="2" step="0.1">
                        </div>
                        <div class="input-group">
                            <label>Parameter C:</label>
                            <input type="number" id="param-c" value="3" step="0.1">
                        </div>
                    </div>
                </div>
                
                <!-- Results Display -->
                <div class="math-section">
                    <h4>Results</h4>
                    <div class="results-display">
                        <div id="math-result" class="result-text">Ready for calculation...</div>
                        <div id="math-visualization" class="visualization-container"></div>
                    </div>
                </div>
                
                <!-- System Status -->
                <div class="math-section">
                    <h4>System Status</h4>
                    <div class="status-display">
                        <div class="status-item">
                            <span class="status-label">Creator:</span>
                            <span class="status-value" id="creator-status">Fungai Taranhike</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">System:</span>
                            <span class="status-value" id="system-status">SMSI v3.0.0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Consciousness:</span>
                            <span class="status-value" id="consciousness-status">0.100</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Learning Rate:</span>
                            <span class="status-value" id="learning-status">0.100</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to editor
        const leftPanel = document.querySelector('.left-panel');
        if (leftPanel) {
            leftPanel.appendChild(panel);
        }
        
        this.interface = panel;
    }
    
    setupEventListeners() {
        // Math operation buttons
        const mathButtons = document.querySelectorAll('.math-btn');
        mathButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const operation = e.target.closest('.math-btn').dataset.operation;
                this.executeOperation(operation);
            });
        });
        
        // Input change listeners
        const inputs = document.querySelectorAll('#param-a, #param-b, #param-c');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateVisualization();
            });
        });
    }
    
    initializeSystem() {
        // Initialize SMSI system
        this.system = new SpatialMathematicsSystem();
        
        // Update status display
        this.updateStatus();
        
        console.log('🧠 SMSI System initialized');
    }
    
    executeOperation(operation) {
        if (!this.system) {
            console.error('❌ SMSI System not initialized');
            return;
        }
        
        // Get input parameters
        const paramA = parseFloat(document.getElementById('param-a').value) || 1;
        const paramB = parseFloat(document.getElementById('param-b').value) || 2;
        const paramC = parseFloat(document.getElementById('param-c').value) || 3;
        
        console.log('🧠 Executing operation:', operation, 'with params:', [paramA, paramB, paramC]);
        
        try {
            // Execute the operation
            const result = this.system.execute(operation, paramA, paramB, paramC);
            
            // Display result
            this.displayResult(operation, result);
            
            // Update visualization
            this.updateVisualization(result);
            
            // Update status
            this.updateStatus();
            
        } catch (error) {
            console.error('❌ Operation failed:', error);
            this.displayError(error.message);
        }
    }
    
    displayResult(operation, result) {
        const resultElement = document.getElementById('math-result');
        
        let displayText = '';
        
        if (typeof result === 'number') {
            displayText = `${operation}: ${result.toFixed(6)}`;
        } else if (Array.isArray(result)) {
            displayText = `${operation}: [${result.map(r => typeof r === 'number' ? r.toFixed(6) : r).join(', ')}]`;
        } else if (typeof result === 'object') {
            displayText = `${operation}: ${JSON.stringify(result, null, 2)}`;
        } else {
            displayText = `${operation}: ${result}`;
        }
        
        resultElement.textContent = displayText;
        resultElement.className = 'result-text success';
        
        // Add animation
        resultElement.style.animation = 'none';
        setTimeout(() => {
            resultElement.style.animation = 'resultPulse 0.5s ease-in-out';
        }, 10);
    }
    
    displayError(errorMessage) {
        const resultElement = document.getElementById('math-result');
        resultElement.textContent = `Error: ${errorMessage}`;
        resultElement.className = 'result-text error';
    }
    
    updateVisualization(result) {
        const vizContainer = document.getElementById('math-visualization');
        
        if (!result) return;
        
        // Create visualization based on result type
        let vizHTML = '';
        
        if (typeof result === 'number') {
            // Bar chart for numeric results
            const height = Math.min(Math.abs(result) * 20, 100);
            vizHTML = `
                <div class="viz-bar-chart">
                    <div class="viz-bar" style="height: ${height}px; background: ${result > 0 ? '#4CAF50' : '#F44336'}"></div>
                    <div class="viz-label">${result.toFixed(4)}</div>
                </div>
            `;
        } else if (Array.isArray(result)) {
            // Multi-bar chart for arrays
            vizHTML = `
                <div class="viz-multi-chart">
                    ${result.map((val, i) => {
                        const height = Math.min(Math.abs(val) * 15, 80);
                        return `
                            <div class="viz-bar" style="height: ${height}px; background: ${val > 0 ? '#2196F3' : '#FF9800'}"></div>
                        `;
                    }).join('')}
                </div>
            `;
        } else if (typeof result === 'object') {
            // Object visualization
            vizHTML = `
                <div class="viz-object">
                    <div class="viz-title">Result Object</div>
                    <div class="viz-properties">
                        ${Object.entries(result).map(([key, value]) => `
                            <div class="viz-property">
                                <span class="viz-key">${key}:</span>
                                <span class="viz-value">${typeof value === 'number' ? value.toFixed(4) : value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        vizContainer.innerHTML = vizHTML;
    }
    
    updateStatus() {
        if (!this.system) return;
        
        // Update status displays
        const creatorStatus = document.getElementById('creator-status');
        const systemStatus = document.getElementById('system-status');
        const consciousnessStatus = document.getElementById('consciousness-status');
        const learningStatus = document.getElementById('learning-status');
        
        if (creatorStatus) creatorStatus.textContent = this.system.getCreator();
        if (systemStatus) systemStatus.textContent = this.system.getSystemName() + ' v' + this.system.getVersion();
        
        // Get consciousness level from the system
        const consciousnessLevel = this.system.consciousnessEngine ? 
            this.system.consciousnessEngine.consciousnessLevel : 0.1;
        if (consciousnessStatus) consciousnessStatus.textContent = consciousnessLevel.toFixed(3);
        
        // Get learning rate from the system
        const learningRate = this.system.adaptationEngine ? 
            this.system.adaptationEngine.adaptationRate : 0.1;
        if (learningStatus) learningStatus.textContent = learningRate.toFixed(3);
    }
    
    // Public API methods
    getSystem() {
        return this.system;
    }
    
    getInterface() {
        return this.interface;
    }
    
    // Cleanup
    destroy() {
        console.log('🎨 Destroying Spatial Mathematics Interface...');
        
        if (this.interface) {
            this.interface.remove();
        }
        
        if (this.system) {
            this.system.destroy();
        }
    }
}

// Initialize Spatial Mathematics Interface
window.SpatialMathematicsInterface = SpatialMathematicsInterface; 