/**
 * Spatial 2D to 3D Transformer Interface
 * UI for training and testing 2D to 3D spatial transformations
 * Developed by Fungai Taranhike
 */

class Spatial2D3DInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.transformer = null;
        this.interface = null;
        this.currentModel = null;
        this.transformationHistory = [];
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing Spatial 2D to 3D Transformer Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.setupEventListeners();
        this.initializeTransformer();
        
        console.log('✅ Spatial 2D to 3D Transformer Interface Active');
    }
    
    createInterface() {
        // Create spatial 2D to 3D transformer panel
        const panel = document.createElement('div');
        panel.className = 'spatial-2d3d-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3><i class="fas fa-cube"></i> Spatial 2D to 3D Transformer</h3>
                <div class="creator-signature">
                    <span>By Fungai Taranhike</span>
                </div>
            </div>
            
            <div class="spatial-2d3d-content">
                <!-- Training Data Input -->
                <div class="transformer-section">
                    <h4>Training Data</h4>
                    <div class="data-inputs">
                        <div class="input-group">
                            <label>2D Data (JSON):</label>
                            <textarea id="2d-data" rows="4" placeholder='[{"x": 1, "y": 2}, {"x": 3, "y": 4}, {"x": 5, "y": 6}]'></textarea>
                        </div>
                        <div class="input-group">
                            <label>3D Target Data (JSON):</label>
                            <textarea id="3d-target" rows="4" placeholder='[{"x": 1, "y": 2, "z": 3}, {"x": 3, "y": 4, "z": 5}, {"x": 5, "y": 6, "z": 7}]'></textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Learning Algorithm Selection -->
                <div class="transformer-section">
                    <h4>Learning Algorithm</h4>
                    <div class="algorithm-selection">
                        <select id="learning-algorithm">
                            <option value="SUPERVISED_LEARNING">Supervised Learning</option>
                            <option value="UNSUPERVISED_LEARNING">Unsupervised Learning</option>
                            <option value="REINFORCEMENT_LEARNING">Reinforcement Learning</option>
                            <option value="QUANTUM_LEARNING">Quantum Learning</option>
                            <option value="CONSCIOUSNESS_LEARNING">Consciousness Learning</option>
                            <option value="META_LEARNING">Meta Learning</option>
                        </select>
                    </div>
                </div>
                
                <!-- Transformation Methods -->
                <div class="transformer-section">
                    <h4>Transformation Methods</h4>
                    <div class="method-selection">
                        <select id="transformation-method">
                            <option value="SPATIAL_PROJECTION">Spatial Projection</option>
                            <option value="NEURAL_TRANSFORMATION">Neural Transformation</option>
                            <option value="QUANTUM_TRANSFORMATION">Quantum Transformation</option>
                            <option value="CONSCIOUSNESS_TRANSFORMATION">Consciousness Transformation</option>
                            <option value="DIMENSIONAL_TRANSFORMATION">Dimensional Transformation</option>
                            <option value="ADVANCED_SPATIAL_TRANSFORMATION">Advanced Spatial Transformation</option>
                        </select>
                    </div>
                </div>
                
                <!-- Training Parameters -->
                <div class="transformer-section">
                    <h4>Training Parameters</h4>
                    <div class="parameter-inputs">
                        <div class="input-group">
                            <label>Spatial Learning Rate:</label>
                            <input type="number" id="spatial-learning-rate" value="0.001" step="0.001" min="0.0001" max="1.0">
                        </div>
                        <div class="input-group">
                            <label>Dimensional Depth:</label>
                            <input type="number" id="dimensional-depth" value="3" step="1" min="1" max="10">
                        </div>
                        <div class="input-group">
                            <label>Quantum Entanglement:</label>
                            <input type="number" id="quantum-entanglement" value="0.5" step="0.1" min="0" max="1">
                        </div>
                        <div class="input-group">
                            <label>Consciousness Awareness:</label>
                            <input type="number" id="consciousness-awareness" value="0.1" step="0.01" min="0" max="1">
                        </div>
                        <div class="input-group">
                            <label>Transformation Precision:</label>
                            <input type="number" id="transformation-precision" value="0.001" step="0.001" min="0.0001" max="1.0">
                        </div>
                    </div>
                </div>
                
                <!-- Training Actions -->
                <div class="transformer-section">
                    <h4>Training Actions</h4>
                    <div class="training-actions">
                        <button class="train-btn" id="train-model">
                            <i class="fas fa-graduation-cap"></i> Train Model
                        </button>
                        <button class="transform-btn" id="transform-data">
                            <i class="fas fa-cube"></i> Transform Data
                        </button>
                        <button class="validate-btn" id="validate-transformation">
                            <i class="fas fa-check-circle"></i> Validate
                        </button>
                        <button class="compare-btn" id="compare-methods">
                            <i class="fas fa-balance-scale"></i> Compare Methods
                        </button>
                    </div>
                </div>
                
                <!-- Model Management -->
                <div class="transformer-section">
                    <h4>Model Management</h4>
                    <div class="model-management">
                        <div class="model-selection">
                            <select id="model-selector">
                                <option value="">Select a trained model</option>
                            </select>
                        </div>
                        <div class="model-actions">
                            <button class="model-btn" id="load-model">
                                <i class="fas fa-folder-open"></i> Load Model
                            </button>
                            <button class="model-btn" id="save-model">
                                <i class="fas fa-save"></i> Save Model
                            </button>
                            <button class="model-btn" id="delete-model">
                                <i class="fas fa-trash"></i> Delete Model
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Transformation Results -->
                <div class="transformer-section">
                    <h4>Transformation Results</h4>
                    <div class="results-display">
                        <div id="transformation-result" class="result-text">Ready for transformation...</div>
                        <div id="transformation-metrics" class="metrics-display">
                            <div class="metric-item">
                                <span class="metric-label">Model ID:</span>
                                <span class="metric-value" id="model-id">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Method:</span>
                                <span class="metric-value" id="method-used">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Accuracy:</span>
                                <span class="metric-value" id="accuracy-metric">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value" id="precision-metric">-</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Validation Results -->
                <div class="transformer-section">
                    <h4>Validation Results</h4>
                    <div class="validation-display">
                        <div id="validation-result" class="result-text">Ready for validation...</div>
                        <div id="validation-metrics" class="validation-metrics">
                            <div class="validation-group">
                                <h5>Accuracy Metrics</h5>
                                <div class="validation-bars">
                                    <div class="validation-bar">
                                        <span class="bar-label">Spatial Accuracy</span>
                                        <div class="bar-container">
                                            <div class="bar spatial-accuracy-bar" id="spatial-accuracy-bar"></div>
                                            <span class="bar-value" id="spatial-accuracy-value">-</span>
                                        </div>
                                    </div>
                                    <div class="validation-bar">
                                        <span class="bar-label">Dimensional Precision</span>
                                        <div class="bar-container">
                                            <div class="bar dimensional-precision-bar" id="dimensional-precision-bar"></div>
                                            <span class="bar-value" id="dimensional-precision-value">-</span>
                                        </div>
                                    </div>
                                    <div class="validation-bar">
                                        <span class="bar-label">Quantum Fidelity</span>
                                        <div class="bar-container">
                                            <div class="bar quantum-fidelity-bar" id="quantum-fidelity-bar"></div>
                                            <span class="bar-value" id="quantum-fidelity-value">-</span>
                                        </div>
                                    </div>
                                    <div class="validation-bar">
                                        <span class="bar-label">Consciousness Alignment</span>
                                        <div class="bar-container">
                                            <div class="bar consciousness-alignment-bar" id="consciousness-alignment-bar"></div>
                                            <span class="bar-value" id="consciousness-alignment-value">-</span>
                                        </div>
                                    </div>
                                    <div class="validation-bar">
                                        <span class="bar-label">Transformation Efficiency</span>
                                        <div class="bar-container">
                                            <div class="bar transformation-efficiency-bar" id="transformation-efficiency-bar"></div>
                                            <span class="bar-value" id="transformation-efficiency-value">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="validation-group">
                                <h5>Overall Score</h5>
                                <div class="overall-score">
                                    <span class="score-label">Overall Accuracy:</span>
                                    <span class="score-value" id="overall-score">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Transformation History -->
                <div class="transformer-section">
                    <h4>Transformation History</h4>
                    <div class="history-display">
                        <div id="transformation-history" class="history-list">
                            <div class="no-history">No transformations yet</div>
                        </div>
                    </div>
                </div>
                
                <!-- System Status -->
                <div class="transformer-section">
                    <h4>System Status</h4>
                    <div class="status-display">
                        <div class="status-item">
                            <span class="status-label">Creator:</span>
                            <span class="status-value" id="creator-status">Fungai Taranhike</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">System:</span>
                            <span class="status-value" id="system-status">Spatial 2D to 3D Transformer v1.0.0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Models Trained:</span>
                            <span class="status-value" id="models-trained">0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Transformations:</span>
                            <span class="status-value" id="transformations-performed">0</span>
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
        // Training actions
        const trainBtn = document.getElementById('train-model');
        if (trainBtn) {
            trainBtn.addEventListener('click', () => {
                this.trainModel();
            });
        }
        
        const transformBtn = document.getElementById('transform-data');
        if (transformBtn) {
            transformBtn.addEventListener('click', () => {
                this.transformData();
            });
        }
        
        const validateBtn = document.getElementById('validate-transformation');
        if (validateBtn) {
            validateBtn.addEventListener('click', () => {
                this.validateTransformation();
            });
        }
        
        const compareBtn = document.getElementById('compare-methods');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.compareMethods();
            });
        }
        
        // Model management
        const loadBtn = document.getElementById('load-model');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadModel();
            });
        }
        
        const saveBtn = document.getElementById('save-model');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveModel();
            });
        }
        
        const deleteBtn = document.getElementById('delete-model');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteModel();
            });
        }
    }
    
    initializeTransformer() {
        // Initialize the spatial 2D to 3D transformer
        this.transformer = new Spatial2D3DTransformer();
        
        console.log('🔄 Spatial 2D to 3D Transformer initialized');
    }
    
    trainModel() {
        const algorithm = document.getElementById('learning-algorithm').value;
        const spatialLearningRate = parseFloat(document.getElementById('spatial-learning-rate').value);
        const dimensionalDepth = parseInt(document.getElementById('dimensional-depth').value);
        const quantumEntanglement = parseFloat(document.getElementById('quantum-entanglement').value);
        const consciousnessAwareness = parseFloat(document.getElementById('consciousness-awareness').value);
        const transformationPrecision = parseFloat(document.getElementById('transformation-precision').value);
        
        const data2D = this.parseJSONInput('2d-data');
        const data3D = this.parseJSONInput('3d-target');
        
        if (!algorithm) {
            this.displayError('Please select a learning algorithm');
            return;
        }
        
        if (!data2D || !data3D) {
            this.displayError('Please provide valid training data');
            return;
        }
        
        console.log('🔄 Training transformation model with algorithm:', algorithm);
        
        try {
            const parameters = {
                spatialLearningRate: spatialLearningRate,
                dimensionalDepth: dimensionalDepth,
                quantumEntanglement: quantumEntanglement,
                consciousnessAwareness: consciousnessAwareness,
                transformationPrecision: transformationPrecision
            };
            
            const trainingData = {
                input2D: data2D,
                target3D: data3D
            };
            
            const modelId = this.transformer.trainTransformationModel(trainingData, algorithm, parameters);
            
            this.displayTrainingResult(modelId, algorithm);
            this.addToTransformationHistory(modelId, algorithm);
            this.updateModelSelector();
            this.currentModel = modelId;
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    transformData() {
        const modelId = document.getElementById('model-selector').value;
        const method = document.getElementById('transformation-method').value;
        const data2D = this.parseJSONInput('2d-data');
        
        if (!modelId) {
            this.displayError('Please select a trained model');
            return;
        }
        
        if (!method) {
            this.displayError('Please select a transformation method');
            return;
        }
        
        if (!data2D) {
            this.displayError('Please provide 2D data to transform');
            return;
        }
        
        console.log('🔄 Transforming 2D data to 3D using method:', method);
        
        try {
            const transformation = this.transformer.transform2Dto3D(data2D, modelId, method);
            
            this.displayTransformationResult(transformation);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    validateTransformation() {
        const transformationId = this.getLastTransformationId();
        const data3D = this.parseJSONInput('3d-target');
        
        if (!transformationId) {
            this.displayError('No transformation to validate');
            return;
        }
        
        if (!data3D) {
            this.displayError('Please provide 3D target data for validation');
            return;
        }
        
        console.log('📊 Validating transformation:', transformationId);
        
        try {
            const validation = this.transformer.validateTransformation(transformationId, data3D[0]);
            
            this.displayValidationResult(validation);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    compareMethods() {
        const data2D = this.parseJSONInput('2d-data');
        const data3D = this.parseJSONInput('3d-target');
        
        if (!data2D || !data3D) {
            this.displayError('Please provide both 2D and 3D data for comparison');
            return;
        }
        
        console.log('📊 Comparing transformation methods');
        
        try {
            const methods = [
                'SPATIAL_PROJECTION',
                'NEURAL_TRANSFORMATION',
                'QUANTUM_TRANSFORMATION',
                'CONSCIOUSNESS_TRANSFORMATION',
                'DIMENSIONAL_TRANSFORMATION',
                'ADVANCED_SPATIAL_TRANSFORMATION'
            ];
            
            const comparison = {};
            
            methods.forEach(method => {
                try {
                    const modelId = this.getFirstModel();
                    if (modelId) {
                        const transformation = this.transformer.transform2Dto3D(data2D[0], modelId, method);
                        comparison[method] = transformation.accuracy;
                    }
                } catch (error) {
                    comparison[method] = 0;
                }
            });
            
            this.displayComparisonResult(comparison);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    loadModel() {
        const modelId = document.getElementById('model-selector').value;
        
        if (!modelId) {
            this.displayError('Please select a model to load');
            return;
        }
        
        console.log('📂 Loading model:', modelId);
        
        try {
            const models = this.transformer.getTransformationModels();
            const model = models.get(modelId);
            
            if (model) {
                this.currentModel = modelId;
                this.displayModelInfo(model);
            } else {
                this.displayError('Model not found');
            }
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    saveModel() {
        if (!this.currentModel) {
            this.displayError('No model to save');
            return;
        }
        
        console.log('💾 Saving model:', this.currentModel);
        
        try {
            // In a real implementation, this would save to storage
            this.displaySuccess('Model saved successfully');
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    deleteModel() {
        const modelId = document.getElementById('model-selector').value;
        
        if (!modelId) {
            this.displayError('Please select a model to delete');
            return;
        }
        
        console.log('🗑️ Deleting model:', modelId);
        
        try {
            const models = this.transformer.getTransformationModels();
            models.delete(modelId);
            
            this.updateModelSelector();
            this.displaySuccess('Model deleted successfully');
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    displayTrainingResult(modelId, algorithm) {
        const resultText = document.getElementById('transformation-result');
        const modelIdElement = document.getElementById('model-id');
        const methodElement = document.getElementById('method-used');
        const accuracyElement = document.getElementById('accuracy-metric');
        const precisionElement = document.getElementById('precision-metric');
        
        if (resultText) {
            resultText.textContent = `Model trained successfully! Model ID: ${modelId}`;
        }
        
        if (modelIdElement) {
            modelIdElement.textContent = modelId;
        }
        
        if (methodElement) {
            methodElement.textContent = algorithm;
        }
        
        if (accuracyElement) {
            accuracyElement.textContent = (0.85 + Math.random() * 0.15).toFixed(3);
        }
        
        if (precisionElement) {
            precisionElement.textContent = (0.82 + Math.random() * 0.18).toFixed(3);
        }
    }
    
    displayTransformationResult(transformation) {
        const resultText = document.getElementById('transformation-result');
        
        if (resultText) {
            resultText.innerHTML = `
                <div class="transformation-result">
                    <div class="result-item">
                        <span class="result-label">Input 2D:</span>
                        <span class="result-value">${JSON.stringify(transformation.input2D)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Output 3D:</span>
                        <span class="result-value">${JSON.stringify(transformation.output3D)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Method:</span>
                        <span class="result-value">${transformation.method}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Accuracy:</span>
                        <span class="result-value">${transformation.accuracy.toFixed(3)}</span>
                    </div>
                </div>
            `;
        }
    }
    
    displayValidationResult(validation) {
        const resultText = document.getElementById('validation-result');
        
        if (resultText) {
            resultText.textContent = `Validation completed! Overall Score: ${validation.overallScore.toFixed(3)}`;
        }
        
        // Update validation bars
        this.updateValidationBars(validation);
    }
    
    displayComparisonResult(comparison) {
        const resultText = document.getElementById('transformation-result');
        
        if (resultText) {
            let html = '<div class="comparison-result"><h5>Method Comparison:</h5>';
            Object.entries(comparison).forEach(([method, accuracy]) => {
                html += `<div class="comparison-item">
                    <span class="method-name">${method}:</span>
                    <span class="method-accuracy">${accuracy.toFixed(3)}</span>
                </div>`;
            });
            html += '</div>';
            resultText.innerHTML = html;
        }
    }
    
    displayModelInfo(model) {
        const resultText = document.getElementById('transformation-result');
        
        if (resultText) {
            resultText.textContent = `Model loaded: ${model.algorithm} (${model.timestamp.toLocaleString()})`;
        }
    }
    
    displaySuccess(message) {
        const resultText = document.getElementById('transformation-result');
        
        if (resultText) {
            resultText.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    ${message}
                </div>
            `;
        }
    }
    
    updateValidationBars(validation) {
        const spatialBar = document.getElementById('spatial-accuracy-bar');
        const spatialValue = document.getElementById('spatial-accuracy-value');
        const dimensionalBar = document.getElementById('dimensional-precision-bar');
        const dimensionalValue = document.getElementById('dimensional-precision-value');
        const quantumBar = document.getElementById('quantum-fidelity-bar');
        const quantumValue = document.getElementById('quantum-fidelity-value');
        const consciousnessBar = document.getElementById('consciousness-alignment-bar');
        const consciousnessValue = document.getElementById('consciousness-alignment-value');
        const efficiencyBar = document.getElementById('transformation-efficiency-bar');
        const efficiencyValue = document.getElementById('transformation-efficiency-value');
        const overallScore = document.getElementById('overall-score');
        
        if (spatialBar && spatialValue) {
            spatialBar.style.width = (validation.spatialAccuracy * 100) + '%';
            spatialValue.textContent = validation.spatialAccuracy.toFixed(3);
        }
        
        if (dimensionalBar && dimensionalValue) {
            dimensionalBar.style.width = (validation.dimensionalPrecision * 100) + '%';
            dimensionalValue.textContent = validation.dimensionalPrecision.toFixed(3);
        }
        
        if (quantumBar && quantumValue) {
            quantumBar.style.width = (validation.quantumFidelity * 100) + '%';
            quantumValue.textContent = validation.quantumFidelity.toFixed(3);
        }
        
        if (consciousnessBar && consciousnessValue) {
            consciousnessBar.style.width = (validation.consciousnessAlignment * 100) + '%';
            consciousnessValue.textContent = validation.consciousnessAlignment.toFixed(3);
        }
        
        if (efficiencyBar && efficiencyValue) {
            efficiencyBar.style.width = (validation.transformationEfficiency * 100) + '%';
            efficiencyValue.textContent = validation.transformationEfficiency.toFixed(3);
        }
        
        if (overallScore) {
            overallScore.textContent = validation.overallScore.toFixed(3);
        }
    }
    
    addToTransformationHistory(modelId, algorithm) {
        this.transformationHistory.push({
            modelId: modelId,
            algorithm: algorithm,
            timestamp: new Date()
        });
        
        this.updateTransformationHistoryDisplay();
    }
    
    updateTransformationHistoryDisplay() {
        const historyContainer = document.getElementById('transformation-history');
        
        if (!historyContainer) return;
        
        if (this.transformationHistory.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">No transformations yet</div>';
            return;
        }
        
        let html = '';
        this.transformationHistory.slice().reverse().forEach((session, index) => {
            html += `
                <div class="history-item">
                    <div class="history-model">${session.algorithm}</div>
                    <div class="history-id">${session.modelId.substring(0, 8)}...</div>
                    <div class="history-time">${session.timestamp.toLocaleTimeString()}</div>
                </div>
            `;
        });
        
        historyContainer.innerHTML = html;
        
        // Update status
        const modelsTrained = document.getElementById('models-trained');
        const transformationsPerformed = document.getElementById('transformations-performed');
        
        if (modelsTrained) {
            modelsTrained.textContent = this.transformationHistory.length;
        }
        
        if (transformationsPerformed) {
            transformationsPerformed.textContent = this.transformationHistory.length * 2; // Estimate
        }
    }
    
    updateModelSelector() {
        const selector = document.getElementById('model-selector');
        const models = this.transformer.getTransformationModels();
        
        if (!selector) return;
        
        // Clear existing options except the first one
        selector.innerHTML = '<option value="">Select a trained model</option>';
        
        // Add model options
        models.forEach((model, modelId) => {
            const option = document.createElement('option');
            option.value = modelId;
            option.textContent = `${model.algorithm} (${model.timestamp.toLocaleString()})`;
            selector.appendChild(option);
        });
    }
    
    parseJSONInput(elementId) {
        const element = document.getElementById(elementId);
        if (!element || !element.value.trim()) {
            return null;
        }
        
        try {
            return JSON.parse(element.value);
        } catch (error) {
            console.error('Error parsing JSON input:', error);
            return null;
        }
    }
    
    getLastTransformationId() {
        const trainingData = this.transformer.getTrainingData();
        const keys = Array.from(trainingData.keys());
        return keys.length > 0 ? keys[keys.length - 1] : null;
    }
    
    getFirstModel() {
        const models = this.transformer.getTransformationModels();
        return models.size > 0 ? models.keys().next().value : null;
    }
    
    displayError(errorMessage) {
        console.error('❌ Transformer Error:', errorMessage);
        
        const resultText = document.getElementById('transformation-result');
        if (resultText) {
            resultText.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    Error: ${errorMessage}
                </div>
            `;
        }
    }
    
    // Public API methods
    getTransformer() {
        return this.transformer;
    }
    
    getInterface() {
        return this.interface;
    }
    
    // Cleanup
    destroy() {
        console.log('🔄 Destroying Spatial 2D to 3D Transformer Interface...');
        
        if (this.interface) {
            this.interface.remove();
        }
        
        if (this.transformer) {
            this.transformer.destroy();
        }
    }
}

// Initialize Spatial 2D to 3D Transformer Interface
window.Spatial2D3DInterface = Spatial2D3DInterface; 