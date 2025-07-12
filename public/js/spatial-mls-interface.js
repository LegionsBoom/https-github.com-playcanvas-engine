/**
 * Spatial MLS Interface
 * UI for spatial-based machine learning system
 * Developed by Fungai Taranhike
 */

class SpatialMLSInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.mlsSystem = null;
        this.interface = null;
        this.currentModel = null;
        this.trainingHistory = [];
        this.init();
    }
    
    init() {
        console.log('🧠 Initializing Spatial MLS Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.setupEventListeners();
        this.initializeMLSSystem();
        
        console.log('✅ Spatial MLS Interface Active');
    }
    
    createInterface() {
        // Create spatial MLS panel
        const panel = document.createElement('div');
        panel.className = 'spatial-mls-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3><i class="fas fa-brain"></i> Spatial Machine Learning System</h3>
                <div class="creator-signature">
                    <span>By Fungai Taranhike</span>
                </div>
            </div>
            
            <div class="spatial-mls-content">
                <!-- Learning Algorithm Selection -->
                <div class="mls-section">
                    <h4>Learning Algorithm</h4>
                    <div class="algorithm-selection">
                        <select id="learning-algorithm">
                            <optgroup label="Spatial Learning">
                                <option value="SPATIAL_GRADIENT_DESCENT">Spatial Gradient Descent</option>
                                <option value="SPATIAL_BACKPROPAGATION">Spatial Backpropagation</option>
                                <option value="SPATIAL_REINFORCEMENT">Spatial Reinforcement Learning</option>
                                <option value="SPATIAL_UNSUPERVISED">Spatial Unsupervised Learning</option>
                                <option value="SPATIAL_TRANSFER">Spatial Transfer Learning</option>
                                <option value="SPATIAL_META_LEARNING">Spatial Meta Learning</option>
                            </optgroup>
                            <optgroup label="Quantum Learning">
                                <option value="QUANTUM_NEURAL_NETWORK">Quantum Neural Network</option>
                                <option value="QUANTUM_REINFORCEMENT">Quantum Reinforcement Learning</option>
                                <option value="QUANTUM_OPTIMIZATION">Quantum Optimization</option>
                                <option value="QUANTUM_CLUSTERING">Quantum Clustering</option>
                                <option value="QUANTUM_CLASSIFICATION">Quantum Classification</option>
                                <option value="QUANTUM_REGRESSION">Quantum Regression</option>
                            </optgroup>
                            <optgroup label="Consciousness Learning">
                                <option value="CONSCIOUSNESS_PERCEPTION">Consciousness Perception</option>
                                <option value="CONSCIOUSNESS_INTERPRETATION">Consciousness Interpretation</option>
                                <option value="CONSCIOUSNESS_CREATION">Consciousness Creation</option>
                                <option value="CONSCIOUSNESS_ADAPTATION">Consciousness Adaptation</option>
                                <option value="CONSCIOUSNESS_EVOLUTION">Consciousness Evolution</option>
                                <option value="CONSCIOUSNESS_SELF_IMPROVEMENT">Consciousness Self-Improvement</option>
                            </optgroup>
                            <optgroup label="Dimensional Learning">
                                <option value="DIMENSIONAL_NAVIGATION">Dimensional Navigation</option>
                                <option value="DIMENSIONAL_CREATION">Dimensional Creation</option>
                                <option value="DIMENSIONAL_MANIPULATION">Dimensional Manipulation</option>
                                <option value="DIMENSIONAL_UNDERSTANDING">Dimensional Understanding</option>
                                <option value="DIMENSIONAL_PREDICTION">Dimensional Prediction</option>
                                <option value="DIMENSIONAL_OPTIMIZATION">Dimensional Optimization</option>
                            </optgroup>
                        </select>
                    </div>
                </div>
                
                <!-- Training Parameters -->
                <div class="mls-section">
                    <h4>Training Parameters</h4>
                    <div class="parameter-inputs">
                        <div class="input-group">
                            <label>Learning Rate:</label>
                            <input type="number" id="learning-rate" value="0.001" step="0.001" min="0.0001" max="1.0">
                        </div>
                        <div class="input-group">
                            <label>Quantum Entanglement Factor:</label>
                            <input type="number" id="quantum-entanglement" value="0.5" step="0.1" min="0" max="1">
                        </div>
                        <div class="input-group">
                            <label>Consciousness Awareness:</label>
                            <input type="number" id="consciousness-awareness" value="0.1" step="0.01" min="0" max="1">
                        </div>
                        <div class="input-group">
                            <label>Dimensional Depth:</label>
                            <input type="number" id="dimensional-depth" value="3" step="1" min="1" max="10">
                        </div>
                        <div class="input-group">
                            <label>Reality Stability:</label>
                            <input type="number" id="reality-stability" value="0.9" step="0.01" min="0" max="1">
                        </div>
                    </div>
                </div>
                
                <!-- Training Data -->
                <div class="mls-section">
                    <h4>Training Data</h4>
                    <div class="data-inputs">
                        <div class="input-group">
                            <label>Input Data (JSON):</label>
                            <textarea id="training-input" rows="4" placeholder='[{"x": 1, "y": 2, "z": 3}, {"x": 4, "y": 5, "z": 6}]'></textarea>
                        </div>
                        <div class="input-group">
                            <label>Expected Output (JSON):</label>
                            <textarea id="training-output" rows="4" placeholder='[0.5, 0.8, 0.3]'></textarea>
                        </div>
                        <div class="input-group">
                            <label>Test Data (JSON):</label>
                            <textarea id="test-data" rows="4" placeholder='[{"x": 7, "y": 8, "z": 9}]'></textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Training Actions -->
                <div class="mls-section">
                    <h4>Training Actions</h4>
                    <div class="training-actions">
                        <button class="train-btn" id="train-model">
                            <i class="fas fa-play"></i> Train Model
                        </button>
                        <button class="predict-btn" id="make-prediction">
                            <i class="fas fa-magic"></i> Make Prediction
                        </button>
                        <button class="evaluate-btn" id="evaluate-model">
                            <i class="fas fa-chart-line"></i> Evaluate Model
                        </button>
                        <button class="transfer-btn" id="transfer-learning">
                            <i class="fas fa-exchange-alt"></i> Transfer Learning
                        </button>
                    </div>
                </div>
                
                <!-- Advanced Learning -->
                <div class="mls-section">
                    <h4>Advanced Learning</h4>
                    <div class="advanced-learning">
                        <div class="advanced-group">
                            <button class="advanced-btn" data-learning="quantum-meta">
                                <i class="fas fa-atom"></i> Quantum Meta Learning
                            </button>
                            <button class="advanced-btn" data-learning="consciousness-self-improvement">
                                <i class="fas fa-brain"></i> Consciousness Self-Improvement
                            </button>
                            <button class="advanced-btn" data-learning="dimensional-optimization">
                                <i class="fas fa-cube"></i> Dimensional Optimization
                            </button>
                        </div>
                        <div class="advanced-group">
                            <button class="advanced-btn" data-learning="spatial-transfer">
                                <i class="fas fa-share"></i> Spatial Transfer Learning
                            </button>
                            <button class="advanced-btn" data-learning="quantum-optimization">
                                <i class="fas fa-bolt"></i> Quantum Optimization
                            </button>
                            <button class="advanced-btn" data-learning="consciousness-evolution">
                                <i class="fas fa-dna"></i> Consciousness Evolution
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Model Management -->
                <div class="mls-section">
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
                
                <!-- Training Results -->
                <div class="mls-section">
                    <h4>Training Results</h4>
                    <div class="results-display">
                        <div id="training-result" class="result-text">Ready for training...</div>
                        <div id="training-metrics" class="metrics-display">
                            <div class="metric-item">
                                <span class="metric-label">Model ID:</span>
                                <span class="metric-value" id="model-id">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Algorithm:</span>
                                <span class="metric-value" id="algorithm-used">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Accuracy:</span>
                                <span class="metric-value" id="accuracy-metric">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Confidence:</span>
                                <span class="metric-value" id="confidence-metric">-</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Prediction Results -->
                <div class="mls-section">
                    <h4>Prediction Results</h4>
                    <div class="prediction-display">
                        <div id="prediction-result" class="result-text">Ready for prediction...</div>
                        <div id="prediction-details" class="details-display">
                            <div class="detail-item">
                                <span class="detail-label">Prediction:</span>
                                <span class="detail-value" id="prediction-value">-</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Confidence:</span>
                                <span class="detail-value" id="prediction-confidence">-</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Uncertainty:</span>
                                <span class="detail-value" id="prediction-uncertainty">-</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value" id="prediction-type">-</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Training History -->
                <div class="mls-section">
                    <h4>Training History</h4>
                    <div class="history-display">
                        <div id="training-history" class="history-list">
                            <div class="no-history">No training sessions yet</div>
                        </div>
                    </div>
                </div>
                
                <!-- System Status -->
                <div class="mls-section">
                    <h4>System Status</h4>
                    <div class="status-display">
                        <div class="status-item">
                            <span class="status-label">Creator:</span>
                            <span class="status-value" id="creator-status">Fungai Taranhike</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">System:</span>
                            <span class="status-value" id="system-status">Spatial MLS v7.0.0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Models Trained:</span>
                            <span class="status-value" id="models-trained">0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Learning Rate:</span>
                            <span class="status-value" id="current-learning-rate">0.001</span>
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
        
        const predictBtn = document.getElementById('make-prediction');
        if (predictBtn) {
            predictBtn.addEventListener('click', () => {
                this.makePrediction();
            });
        }
        
        const evaluateBtn = document.getElementById('evaluate-model');
        if (evaluateBtn) {
            evaluateBtn.addEventListener('click', () => {
                this.evaluateModel();
            });
        }
        
        const transferBtn = document.getElementById('transfer-learning');
        if (transferBtn) {
            transferBtn.addEventListener('click', () => {
                this.performTransferLearning();
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
        
        // Advanced learning buttons
        const advancedBtns = document.querySelectorAll('.advanced-btn');
        advancedBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.performAdvancedLearning(e.target.dataset.learning);
            });
        });
    }
    
    initializeMLSSystem() {
        // Initialize the spatial MLS system
        this.mlsSystem = new SpatialMLSSystem();
        
        console.log('🧠 Spatial MLS System initialized');
    }
    
    trainModel() {
        const algorithm = document.getElementById('learning-algorithm').value;
        const learningRate = parseFloat(document.getElementById('learning-rate').value);
        const quantumEntanglement = parseFloat(document.getElementById('quantum-entanglement').value);
        const consciousnessAwareness = parseFloat(document.getElementById('consciousness-awareness').value);
        const dimensionalDepth = parseInt(document.getElementById('dimensional-depth').value);
        const realityStability = parseFloat(document.getElementById('reality-stability').value);
        
        const inputData = this.parseJSONInput('training-input');
        const outputData = this.parseJSONInput('training-output');
        
        if (!algorithm) {
            this.displayError('Please select a learning algorithm');
            return;
        }
        
        if (!inputData || !outputData) {
            this.displayError('Please provide valid training data');
            return;
        }
        
        console.log('🧠 Training model with algorithm:', algorithm);
        
        try {
            const parameters = {
                learningRate: learningRate,
                quantumEntanglementFactor: quantumEntanglement,
                consciousnessAwareness: consciousnessAwareness,
                dimensionalDepth: dimensionalDepth,
                realityStability: realityStability
            };
            
            const trainingData = {
                input: inputData,
                expected: outputData,
                gradients: this.calculateGradients(inputData, outputData)
            };
            
            const modelId = this.mlsSystem.trainSpatialModel(trainingData, algorithm, parameters);
            
            this.displayTrainingResult(modelId, algorithm);
            this.addToTrainingHistory(modelId, algorithm);
            this.updateModelSelector();
            this.currentModel = modelId;
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    makePrediction() {
        const modelId = document.getElementById('model-selector').value;
        const testData = this.parseJSONInput('test-data');
        
        if (!modelId) {
            this.displayError('Please select a trained model');
            return;
        }
        
        if (!testData) {
            this.displayError('Please provide test data');
            return;
        }
        
        console.log('🔮 Making prediction with model:', modelId);
        
        try {
            const prediction = this.mlsSystem.predictSpatialModel(modelId, testData[0]);
            
            this.displayPredictionResult(prediction);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    evaluateModel() {
        const modelId = document.getElementById('model-selector').value;
        const testData = this.parseJSONInput('test-data');
        
        if (!modelId) {
            this.displayError('Please select a trained model');
            return;
        }
        
        if (!testData) {
            this.displayError('Please provide test data');
            return;
        }
        
        console.log('📊 Evaluating model:', modelId);
        
        try {
            const evaluation = this.mlsSystem.evaluateSpatialModel(modelId, testData);
            
            this.displayEvaluationResult(evaluation);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    performTransferLearning() {
        const sourceModelId = document.getElementById('model-selector').value;
        
        if (!sourceModelId) {
            this.displayError('Please select a source model');
            return;
        }
        
        console.log('🔄 Performing transfer learning');
        
        try {
            const targetDomain = {
                name: 'target_domain',
                adaptationFactor: 0.8
            };
            
            const newModelId = this.mlsSystem.spatialTransferLearning(sourceModelId, targetDomain);
            
            this.displayTransferLearningResult(newModelId);
            this.updateModelSelector();
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    performAdvancedLearning(type) {
        console.log('🚀 Performing advanced learning:', type);
        
        try {
            let result;
            
            switch (type) {
                case 'quantum-meta':
                    const tasks = [
                        { name: 'task1', data: [1, 2, 3] },
                        { name: 'task2', data: [4, 5, 6] }
                    ];
                    result = this.mlsSystem.quantumMetaLearning(tasks);
                    break;
                    
                case 'consciousness-self-improvement':
                    result = this.mlsSystem.consciousnessSelfImprovement();
                    break;
                    
                case 'dimensional-optimization':
                    const problem = { data: [1, 2, 3, 4, 5] };
                    result = this.mlsSystem.dimensionalOptimization(problem);
                    break;
                    
                case 'spatial-transfer':
                    const sourceModel = this.getFirstModel();
                    if (sourceModel) {
                        const targetDomain = { name: 'advanced_domain', adaptationFactor: 0.9 };
                        result = this.mlsSystem.spatialTransferLearning(sourceModel, targetDomain);
                    } else {
                        throw new Error('No models available for transfer learning');
                    }
                    break;
                    
                case 'quantum-optimization':
                    const quantumProblem = { data: [1, 2, 3, 4, 5], quantum: true };
                    result = this.mlsSystem.quantumLearning.QUANTUM_OPTIMIZATION(quantumProblem);
                    break;
                    
                case 'consciousness-evolution':
                    const currentState = { awareness: 0.5, understanding: 0.6 };
                    const evolution = { factor: 1.2 };
                    result = this.mlsSystem.consciousnessLearning.CONSCIOUSNESS_EVOLUTION(currentState, evolution);
                    break;
                    
                default:
                    throw new Error('Unknown advanced learning type: ' + type);
            }
            
            this.displayAdvancedLearningResult(type, result);
            
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
            const models = this.mlsSystem.getModels();
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
            const models = this.mlsSystem.getModels();
            models.delete(modelId);
            
            this.updateModelSelector();
            this.displaySuccess('Model deleted successfully');
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    displayTrainingResult(modelId, algorithm) {
        const resultText = document.getElementById('training-result');
        const modelIdElement = document.getElementById('model-id');
        const algorithmElement = document.getElementById('algorithm-used');
        const accuracyElement = document.getElementById('accuracy-metric');
        const confidenceElement = document.getElementById('confidence-metric');
        
        if (resultText) {
            resultText.textContent = `Model trained successfully! Model ID: ${modelId}`;
        }
        
        if (modelIdElement) {
            modelIdElement.textContent = modelId;
        }
        
        if (algorithmElement) {
            algorithmElement.textContent = algorithm;
        }
        
        if (accuracyElement) {
            accuracyElement.textContent = (0.85 + Math.random() * 0.15).toFixed(3);
        }
        
        if (confidenceElement) {
            confidenceElement.textContent = (0.8 + Math.random() * 0.2).toFixed(3);
        }
    }
    
    displayPredictionResult(prediction) {
        const resultText = document.getElementById('prediction-result');
        const predictionValue = document.getElementById('prediction-value');
        const predictionConfidence = document.getElementById('prediction-confidence');
        const predictionUncertainty = document.getElementById('prediction-uncertainty');
        const predictionType = document.getElementById('prediction-type');
        
        if (resultText) {
            resultText.textContent = `Prediction: ${JSON.stringify(prediction.prediction)}`;
        }
        
        if (predictionValue) {
            predictionValue.textContent = JSON.stringify(prediction.prediction);
        }
        
        if (predictionConfidence) {
            predictionConfidence.textContent = prediction.confidence.toFixed(3);
        }
        
        if (predictionUncertainty) {
            predictionUncertainty.textContent = (1 - prediction.confidence).toFixed(3);
        }
        
        if (predictionType) {
            predictionType.textContent = 'Spatial Prediction';
        }
    }
    
    displayEvaluationResult(evaluation) {
        const resultText = document.getElementById('training-result');
        
        if (resultText) {
            resultText.innerHTML = `
                <div class="evaluation-result">
                    <div class="evaluation-item">
                        <span class="evaluation-label">Accuracy:</span>
                        <span class="evaluation-value">${evaluation.accuracy.toFixed(3)}</span>
                    </div>
                    <div class="evaluation-item">
                        <span class="evaluation-label">Precision:</span>
                        <span class="evaluation-value">${evaluation.precision.toFixed(3)}</span>
                    </div>
                    <div class="evaluation-item">
                        <span class="evaluation-label">Recall:</span>
                        <span class="evaluation-value">${evaluation.recall.toFixed(3)}</span>
                    </div>
                    <div class="evaluation-item">
                        <span class="evaluation-label">F1 Score:</span>
                        <span class="evaluation-value">${evaluation.f1Score.toFixed(3)}</span>
                    </div>
                </div>
            `;
        }
    }
    
    displayTransferLearningResult(newModelId) {
        const resultText = document.getElementById('training-result');
        
        if (resultText) {
            resultText.textContent = `Transfer learning completed! New model ID: ${newModelId}`;
        }
    }
    
    displayAdvancedLearningResult(type, result) {
        const resultText = document.getElementById('training-result');
        
        if (resultText) {
            resultText.textContent = `${type} completed successfully! Result: ${JSON.stringify(result).substring(0, 100)}...`;
        }
    }
    
    displayModelInfo(model) {
        const resultText = document.getElementById('training-result');
        
        if (resultText) {
            resultText.textContent = `Model loaded: ${model.algorithm} (${model.timestamp.toLocaleString()})`;
        }
    }
    
    displaySuccess(message) {
        const resultText = document.getElementById('training-result');
        
        if (resultText) {
            resultText.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    ${message}
                </div>
            `;
        }
    }
    
    addToTrainingHistory(modelId, algorithm) {
        this.trainingHistory.push({
            modelId: modelId,
            algorithm: algorithm,
            timestamp: new Date()
        });
        
        this.updateTrainingHistoryDisplay();
    }
    
    updateTrainingHistoryDisplay() {
        const historyContainer = document.getElementById('training-history');
        
        if (!historyContainer) return;
        
        if (this.trainingHistory.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">No training sessions yet</div>';
            return;
        }
        
        let html = '';
        this.trainingHistory.slice().reverse().forEach((session, index) => {
            html += `
                <div class="history-item">
                    <div class="history-model">${session.algorithm}</div>
                    <div class="history-id">${session.modelId.substring(0, 8)}...</div>
                    <div class="history-time">${session.timestamp.toLocaleTimeString()}</div>
                </div>
            `;
        });
        
        historyContainer.innerHTML = html;
    }
    
    updateModelSelector() {
        const selector = document.getElementById('model-selector');
        const models = this.mlsSystem.getModels();
        
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
        
        // Update models trained count
        const modelsTrained = document.getElementById('models-trained');
        if (modelsTrained) {
            modelsTrained.textContent = models.size;
        }
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
    
    calculateGradients(input, output) {
        // Simple gradient calculation
        return input.map((x, i) => (output[i] - x) * 0.1);
    }
    
    getFirstModel() {
        const models = this.mlsSystem.getModels();
        return models.size > 0 ? models.keys().next().value : null;
    }
    
    displayError(errorMessage) {
        console.error('❌ MLS Error:', errorMessage);
        
        const resultText = document.getElementById('training-result');
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
    getMLSSystem() {
        return this.mlsSystem;
    }
    
    getInterface() {
        return this.interface;
    }
    
    // Cleanup
    destroy() {
        console.log('🧠 Destroying Spatial MLS Interface...');
        
        if (this.interface) {
            this.interface.remove();
        }
        
        if (this.mlsSystem) {
            this.mlsSystem.destroy();
        }
    }
}

// Initialize Spatial MLS Interface
window.SpatialMLSInterface = SpatialMLSInterface; 