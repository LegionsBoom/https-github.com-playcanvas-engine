/**
 * Spatial 2D to 3D Transformer Initialization
 * Sets up the transformer system and provides demo functionality
 * Developed by Fungai Taranhike
 */

class Spatial2D3DInit {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.transformer = null;
        this.interface = null;
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing Spatial 2D to 3D Transformer System...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupSystem();
            });
        } else {
            this.setupSystem();
        }
    }
    
    setupSystem() {
        try {
            // Initialize the transformer
            this.transformer = new Spatial2D3DTransformer();
            
            // Initialize the interface
            this.interface = new Spatial2D3DInterface();
            
            // Set up demo data
            this.setupDemoData();
            
            // Set up event listeners for demo functionality
            this.setupDemoEventListeners();
            
            console.log('✅ Spatial 2D to 3D Transformer System Active');
            
            // Run initial demo
            setTimeout(() => {
                this.runInitialDemo();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error initializing Spatial 2D to 3D Transformer:', error);
        }
    }
    
    setupDemoData() {
        // Set up demo 2D data
        const demo2DData = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 },
            { x: 7, y: 8 },
            { x: 9, y: 10 }
        ];
        
        // Set up demo 3D target data
        const demo3DData = [
            { x: 1, y: 2, z: 3 },
            { x: 3, y: 4, z: 5 },
            { x: 5, y: 6, z: 7 },
            { x: 7, y: 8, z: 9 },
            { x: 9, y: 10, z: 11 }
        ];
        
        // Store demo data for easy access
        this.demoData = {
            input2D: demo2DData,
            target3D: demo3DData
        };
    }
    
    setupDemoEventListeners() {
        // Add demo buttons to the interface
        this.addDemoButtons();
        
        // Set up demo data loading
        this.setupDemoDataLoading();
    }
    
    addDemoButtons() {
        const trainingSection = document.querySelector('.spatial-2d3d-panel .transformer-section:nth-child(1)');
        
        if (trainingSection) {
            const demoButtons = document.createElement('div');
            demoButtons.className = 'demo-buttons';
            demoButtons.innerHTML = `
                <div class="demo-actions">
                    <button class="demo-btn" id="load-demo-data">
                        <i class="fas fa-download"></i> Load Demo Data
                    </button>
                    <button class="demo-btn" id="run-demo-training">
                        <i class="fas fa-play"></i> Run Demo Training
                    </button>
                    <button class="demo-btn" id="run-demo-transformation">
                        <i class="fas fa-cube"></i> Demo Transformation
                    </button>
                </div>
            `;
            
            trainingSection.appendChild(demoButtons);
            
            // Add event listeners
            const loadDemoBtn = document.getElementById('load-demo-data');
            const runTrainingBtn = document.getElementById('run-demo-training');
            const runTransformBtn = document.getElementById('run-demo-transformation');
            
            if (loadDemoBtn) {
                loadDemoBtn.addEventListener('click', () => {
                    this.loadDemoData();
                });
            }
            
            if (runTrainingBtn) {
                runTrainingBtn.addEventListener('click', () => {
                    this.runDemoTraining();
                });
            }
            
            if (runTransformBtn) {
                runTransformBtn.addEventListener('click', () => {
                    this.runDemoTransformation();
                });
            }
        }
    }
    
    setupDemoDataLoading() {
        // Auto-load demo data when interface is ready
        setTimeout(() => {
            this.loadDemoData();
        }, 2000);
    }
    
    loadDemoData() {
        const data2DInput = document.getElementById('2d-data');
        const data3DInput = document.getElementById('3d-target');
        
        if (data2DInput && data3DInput) {
            data2DInput.value = JSON.stringify(this.demoData.input2D, null, 2);
            data3DInput.value = JSON.stringify(this.demoData.target3D, null, 2);
            
            console.log('📊 Demo data loaded successfully');
            
            // Show success message
            this.showDemoMessage('Demo data loaded successfully!', 'success');
        }
    }
    
    runDemoTraining() {
        console.log('🎓 Running demo training...');
        
        try {
            // Set up training parameters
            const algorithm = 'SUPERVISED_LEARNING';
            const parameters = {
                spatialLearningRate: 0.001,
                dimensionalDepth: 3,
                quantumEntanglement: 0.5,
                consciousnessAwareness: 0.1,
                transformationPrecision: 0.001
            };
            
            // Train the model
            const modelId = this.transformer.trainTransformationModel(
                this.demoData,
                algorithm,
                parameters
            );
            
            console.log('✅ Demo training completed. Model ID:', modelId);
            
            // Update interface
            this.updateInterfaceAfterTraining(modelId, algorithm);
            
            // Show success message
            this.showDemoMessage(`Demo training completed! Model ID: ${modelId}`, 'success');
            
        } catch (error) {
            console.error('❌ Demo training failed:', error);
            this.showDemoMessage('Demo training failed: ' + error.message, 'error');
        }
    }
    
    runDemoTransformation() {
        console.log('🔄 Running demo transformation...');
        
        try {
            // Get the first trained model
            const models = this.transformer.getTransformationModels();
            const modelId = models.size > 0 ? models.keys().next().value : null;
            
            if (!modelId) {
                this.showDemoMessage('No trained models available. Please train a model first.', 'error');
                return;
            }
            
            // Transform demo data
            const method = 'SPATIAL_PROJECTION';
            const transformation = this.transformer.transform2Dto3D(
                this.demoData.input2D[0],
                modelId,
                method
            );
            
            console.log('✅ Demo transformation completed:', transformation);
            
            // Update interface
            this.updateInterfaceAfterTransformation(transformation);
            
            // Show success message
            this.showDemoMessage('Demo transformation completed successfully!', 'success');
            
        } catch (error) {
            console.error('❌ Demo transformation failed:', error);
            this.showDemoMessage('Demo transformation failed: ' + error.message, 'error');
        }
    }
    
    runInitialDemo() {
        console.log('🚀 Running initial demo...');
        
        // Load demo data
        this.loadDemoData();
        
        // Run demo training after a short delay
        setTimeout(() => {
            this.runDemoTraining();
        }, 1000);
        
        // Run demo transformation after training
        setTimeout(() => {
            this.runDemoTransformation();
        }, 3000);
    }
    
    updateInterfaceAfterTraining(modelId, algorithm) {
        // Update model selector
        const modelSelector = document.getElementById('model-selector');
        if (modelSelector) {
            const option = document.createElement('option');
            option.value = modelId;
            option.textContent = `${algorithm} (Demo - ${new Date().toLocaleTimeString()})`;
            modelSelector.appendChild(option);
            modelSelector.value = modelId;
        }
        
        // Update status
        const modelsTrained = document.getElementById('models-trained');
        if (modelsTrained) {
            const currentCount = parseInt(modelsTrained.textContent) || 0;
            modelsTrained.textContent = currentCount + 1;
        }
    }
    
    updateInterfaceAfterTransformation(transformation) {
        // Update transformation result
        const resultText = document.getElementById('transformation-result');
        if (resultText) {
            resultText.innerHTML = `
                <div class="transformation-result">
                    <div class="result-item">
                        <span class="result-label">Demo Input 2D:</span>
                        <span class="result-value">${JSON.stringify(transformation.input2D)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Demo Output 3D:</span>
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
        
        // Update status
        const transformationsPerformed = document.getElementById('transformations-performed');
        if (transformationsPerformed) {
            const currentCount = parseInt(transformationsPerformed.textContent) || 0;
            transformationsPerformed.textContent = currentCount + 1;
        }
    }
    
    showDemoMessage(message, type) {
        const resultText = document.getElementById('transformation-result');
        
        if (resultText) {
            const messageClass = type === 'success' ? 'success-message' : 'error-message';
            const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
            
            resultText.innerHTML = `
                <div class="${messageClass}">
                    <i class="${icon}"></i>
                    ${message}
                </div>
            `;
        }
        
        console.log(`📢 Demo Message (${type}):`, message);
    }
    
    // Advanced demo methods
    
    runAdvancedDemo() {
        console.log('🚀 Running advanced demo with multiple methods...');
        
        try {
            // Train multiple models with different algorithms
            const algorithms = [
                'SUPERVISED_LEARNING',
                'QUANTUM_LEARNING',
                'CONSCIOUSNESS_LEARNING'
            ];
            
            const modelIds = [];
            
            algorithms.forEach((algorithm, index) => {
                setTimeout(() => {
                    const modelId = this.transformer.trainTransformationModel(
                        this.demoData,
                        algorithm,
                        {
                            spatialLearningRate: 0.001 + (index * 0.0005),
                            dimensionalDepth: 3,
                            quantumEntanglement: 0.5 + (index * 0.1),
                            consciousnessAwareness: 0.1 + (index * 0.05),
                            transformationPrecision: 0.001
                        }
                    );
                    
                    modelIds.push(modelId);
                    console.log(`✅ Trained ${algorithm} model:`, modelId);
                    
                    // Transform with this model
                    const methods = [
                        'SPATIAL_PROJECTION',
                        'NEURAL_TRANSFORMATION',
                        'QUANTUM_TRANSFORMATION'
                    ];
                    
                    methods.forEach((method, methodIndex) => {
                        setTimeout(() => {
                            try {
                                const transformation = this.transformer.transform2Dto3D(
                                    this.demoData.input2D[0],
                                    modelId,
                                    method
                                );
                                
                                console.log(`✅ ${method} transformation with ${algorithm}:`, transformation);
                                
                            } catch (error) {
                                console.error(`❌ ${method} transformation failed:`, error);
                            }
                        }, methodIndex * 500);
                    });
                    
                }, index * 1000);
            });
            
        } catch (error) {
            console.error('❌ Advanced demo failed:', error);
        }
    }
    
    // Performance testing methods
    
    runPerformanceTest() {
        console.log('⚡ Running performance test...');
        
        const testData = {
            input2D: Array(100).fill().map((_, i) => ({ x: i, y: i * 2 })),
            target3D: Array(100).fill().map((_, i) => ({ x: i, y: i * 2, z: i * 3 }))
        };
        
        const startTime = performance.now();
        
        try {
            // Train model
            const modelId = this.transformer.trainTransformationModel(
                testData,
                'SUPERVISED_LEARNING',
                {
                    spatialLearningRate: 0.001,
                    dimensionalDepth: 3,
                    quantumEntanglement: 0.5,
                    consciousnessAwareness: 0.1,
                    transformationPrecision: 0.001
                }
            );
            
            // Transform all test data
            testData.input2D.forEach((data2D, index) => {
                const transformation = this.transformer.transform2Dto3D(
                    data2D,
                    modelId,
                    'SPATIAL_PROJECTION'
                );
            });
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            console.log(`⚡ Performance test completed in ${duration.toFixed(2)}ms`);
            console.log(`📊 Processed ${testData.input2D.length} transformations`);
            console.log(`🚀 Average time per transformation: ${(duration / testData.input2D.length).toFixed(2)}ms`);
            
            this.showDemoMessage(`Performance test completed! Processed ${testData.input2D.length} transformations in ${duration.toFixed(2)}ms`, 'success');
            
        } catch (error) {
            console.error('❌ Performance test failed:', error);
            this.showDemoMessage('Performance test failed: ' + error.message, 'error');
        }
    }
    
    // Public API methods
    
    getTransformer() {
        return this.transformer;
    }
    
    getInterface() {
        return this.interface;
    }
    
    getDemoData() {
        return this.demoData;
    }
    
    // Cleanup
    destroy() {
        console.log('🔄 Destroying Spatial 2D to 3D Transformer Initialization...');
        
        if (this.interface) {
            this.interface.destroy();
        }
        
        if (this.transformer) {
            this.transformer.destroy();
        }
    }
}

// Initialize Spatial 2D to 3D Transformer System
window.Spatial2D3DInit = Spatial2D3DInit;

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    window.spatial2D3DInit = new Spatial2D3DInit();
}); 