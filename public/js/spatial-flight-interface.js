/**
 * Spatial Flight Interface
 * UI for comparing Spatial Mathematics vs Regular Mathematics for Flight
 * Developed by Fungai Taranhike
 */

class SpatialFlightInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.calculator = null;
        this.interface = null;
        this.currentAnalysis = null;
        this.init();
    }
    
    init() {
        console.log('✈️ Initializing Spatial Flight Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.setupEventListeners();
        this.initializeCalculator();
        
        console.log('✅ Spatial Flight Interface Active');
    }
    
    createInterface() {
        // Create spatial flight panel
        const panel = document.createElement('div');
        panel.className = 'spatial-flight-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3><i class="fas fa-plane"></i> Spatial Flight Calculator</h3>
                <div class="creator-signature">
                    <span>By Fungai Taranhike</span>
                </div>
            </div>
            
            <div class="spatial-flight-content">
                <!-- Flight Model Selection -->
                <div class="flight-section">
                    <h4>Flight Model Selection</h4>
                    <div class="model-selection">
                        <select id="flight-model">
                            <option value="COMMERCIAL_AIRLINER">Commercial Airliner</option>
                            <option value="FIGHTER_JET">Fighter Jet</option>
                            <option value="SPACECRAFT">Spacecraft</option>
                            <option value="QUANTUM_CRAFT">Quantum Craft</option>
                        </select>
                        <button class="analyze-btn" id="analyze-flight">
                            <i class="fas fa-calculator"></i> Analyze Flight
                        </button>
                    </div>
                </div>
                
                <!-- Custom Flight Parameters -->
                <div class="flight-section">
                    <h4>Custom Flight Parameters</h4>
                    <div class="parameter-inputs">
                        <div class="input-group">
                            <label>Mass (kg):</label>
                            <input type="number" id="custom-mass" value="80000" min="1000" max="1000000">
                        </div>
                        <div class="input-group">
                            <label>Velocity (m/s):</label>
                            <input type="number" id="custom-velocity" value="250" min="0" max="300000000">
                        </div>
                        <div class="input-group">
                            <label>Altitude (m):</label>
                            <input type="number" id="custom-altitude" value="10000" min="0" max="1000000">
                        </div>
                        <div class="input-group">
                            <label>Thrust (N):</label>
                            <input type="number" id="custom-thrust" value="200000" min="0" max="10000000">
                        </div>
                    </div>
                    <button class="custom-btn" id="custom-analysis">
                        <i class="fas fa-cog"></i> Custom Analysis
                    </button>
                </div>
                
                <!-- Calculation Comparison -->
                <div class="flight-section">
                    <h4>Calculation Comparison</h4>
                    <div class="comparison-tabs">
                        <button class="tab-btn active" data-tab="basic">Basic Calculations</button>
                        <button class="tab-btn" data-tab="advanced">Advanced Calculations</button>
                        <button class="tab-btn" data-tab="quantum">Quantum Calculations</button>
                    </div>
                    
                    <div class="comparison-content">
                        <div id="basic-comparison" class="comparison-tab active">
                            <div class="comparison-grid">
                                <div class="regular-calc">
                                    <h5>Regular Mathematics</h5>
                                    <div id="regular-results"></div>
                                </div>
                                <div class="spatial-calc">
                                    <h5>Spatial Mathematics</h5>
                                    <div id="spatial-results"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="advanced-comparison" class="comparison-tab">
                            <div class="comparison-grid">
                                <div class="regular-calc">
                                    <h5>Regular Advanced</h5>
                                    <div id="regular-advanced"></div>
                                </div>
                                <div class="spatial-calc">
                                    <h5>Spatial Advanced</h5>
                                    <div id="spatial-advanced"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="quantum-comparison" class="comparison-tab">
                            <div class="comparison-grid">
                                <div class="regular-calc">
                                    <h5>Regular Quantum</h5>
                                    <div id="regular-quantum"></div>
                                </div>
                                <div class="spatial-calc">
                                    <h5>Spatial Quantum</h5>
                                    <div id="spatial-quantum"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Analysis Results -->
                <div class="flight-section">
                    <h4>Analysis Results</h4>
                    <div class="analysis-results">
                        <div id="analysis-summary" class="summary-display">
                            <div class="summary-item">
                                <span class="summary-label">Model:</span>
                                <span class="summary-value" id="model-name">Select a model</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Regular Advantage:</span>
                                <span class="summary-value" id="regular-advantage">-</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Spatial Advantage:</span>
                                <span class="summary-value" id="spatial-advantage">-</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Recommendation:</span>
                                <span class="summary-value" id="recommendation">-</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Flight Visualization -->
                <div class="flight-section">
                    <h4>Flight Visualization</h4>
                    <div class="visualization-container">
                        <div id="flight-visualization" class="flight-viz">
                            <div class="viz-placeholder">Flight visualization will appear here</div>
                        </div>
                    </div>
                </div>
                
                <!-- Detailed Results -->
                <div class="flight-section">
                    <h4>Detailed Results</h4>
                    <div class="detailed-results">
                        <div id="detailed-comparison" class="detailed-display">
                            <div class="no-results">Run an analysis to see detailed results</div>
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
        // Flight model analysis
        const analyzeBtn = document.getElementById('analyze-flight');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeSelectedModel();
            });
        }
        
        // Custom analysis
        const customBtn = document.getElementById('custom-analysis');
        if (customBtn) {
            customBtn.addEventListener('click', () => {
                this.analyzeCustomParameters();
            });
        }
        
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
    }
    
    initializeCalculator() {
        // Initialize the spatial flight calculator
        this.calculator = new SpatialFlightCalculator();
        
        console.log('✈️ Spatial Flight Calculator initialized');
    }
    
    analyzeSelectedModel() {
        const modelSelect = document.getElementById('flight-model');
        const selectedModel = modelSelect.value;
        
        if (!selectedModel) {
            this.displayError('Please select a flight model');
            return;
        }
        
        const model = this.calculator.getFlightModels()[selectedModel];
        if (!model) {
            this.displayError('Selected model not found');
            return;
        }
        
        console.log('✈️ Analyzing flight model:', model.name);
        
        try {
            const comparison = this.calculator.compareCalculations(model);
            this.displayResults(comparison);
            this.currentAnalysis = comparison;
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    analyzeCustomParameters() {
        const mass = parseFloat(document.getElementById('custom-mass').value);
        const velocity = parseFloat(document.getElementById('custom-velocity').value);
        const altitude = parseFloat(document.getElementById('custom-altitude').value);
        const thrust = parseFloat(document.getElementById('custom-thrust').value);
        
        if (!mass || !velocity || !altitude || !thrust) {
            this.displayError('Please fill in all custom parameters');
            return;
        }
        
        const customModel = {
            name: 'Custom Flight Model',
            mass: mass,
            cruiseSpeed: velocity,
            altitude: altitude,
            thrust: thrust,
            liftCoefficient: 0.3,
            dragCoefficient: 0.02,
            wingArea: 100,
            spatialMass: { scalar: mass, dimensional: 3 },
            spatialVelocity: { x: velocity, y: 0, z: 0 },
            spatialAltitude: { x: 0, y: 0, z: altitude }
        };
        
        console.log('✈️ Analyzing custom flight model');
        
        try {
            const comparison = this.calculator.compareCalculations(customModel);
            this.displayResults(comparison);
            this.currentAnalysis = comparison;
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    displayResults(comparison) {
        // Update model name
        const modelName = document.getElementById('model-name');
        if (modelName) modelName.textContent = comparison.model;
        
        // Display basic comparison
        this.displayBasicComparison(comparison);
        
        // Display advanced comparison
        this.displayAdvancedComparison(comparison);
        
        // Display quantum comparison
        this.displayQuantumComparison(comparison);
        
        // Update analysis summary
        this.updateAnalysisSummary(comparison);
        
        // Update detailed results
        this.updateDetailedResults(comparison);
        
        // Create visualization
        this.createFlightVisualization(comparison);
    }
    
    displayBasicComparison(comparison) {
        const regularResults = document.getElementById('regular-results');
        const spatialResults = document.getElementById('spatial-results');
        
        if (regularResults) {
            regularResults.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Distance:</span>
                    <span class="result-value">${comparison.regular.distance?.toFixed(2) || 'N/A'} m</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Kinetic Energy:</span>
                    <span class="result-value">${comparison.regular.kineticEnergy?.toFixed(2) || 'N/A'} J</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Potential Energy:</span>
                    <span class="result-value">${comparison.regular.potentialEnergy?.toFixed(2) || 'N/A'} J</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Lift Force:</span>
                    <span class="result-value">${comparison.regular.liftForce?.toFixed(2) || 'N/A'} N</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Drag Force:</span>
                    <span class="result-value">${comparison.regular.dragForce?.toFixed(2) || 'N/A'} N</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Flight Time:</span>
                    <span class="result-value">${comparison.regular.flightTime?.toFixed(2) || 'N/A'} s</span>
                </div>
            `;
        }
        
        if (spatialResults) {
            spatialResults.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Spatial Distance:</span>
                    <span class="result-value">${comparison.spatial.spatialDistance?.magnitude?.toFixed(2) || 'N/A'} m</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Spatial Kinetic Energy:</span>
                    <span class="result-value">${comparison.spatial.spatialKineticEnergy?.scalar?.toFixed(2) || 'N/A'} J</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Spatial Potential Energy:</span>
                    <span class="result-value">${comparison.spatial.spatialPotentialEnergy?.scalar?.toFixed(2) || 'N/A'} J</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Spatial Lift Force:</span>
                    <span class="result-value">${comparison.spatial.spatialLiftForce?.magnitude?.toFixed(2) || 'N/A'} N</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Spatial Drag Force:</span>
                    <span class="result-value">${comparison.spatial.spatialDragForce?.magnitude?.toFixed(2) || 'N/A'} N</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Spatial Flight Time:</span>
                    <span class="result-value">${comparison.spatial.spatialFlightTime?.toFixed(2) || 'N/A'} s</span>
                </div>
            `;
        }
    }
    
    displayAdvancedComparison(comparison) {
        const regularAdvanced = document.getElementById('regular-advanced');
        const spatialAdvanced = document.getElementById('spatial-advanced');
        
        if (regularAdvanced) {
            regularAdvanced.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Thrust Force:</span>
                    <span class="result-value">${comparison.regular.thrustForce?.toFixed(2) || 'N/A'} N</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Fuel Consumption:</span>
                    <span class="result-value">${comparison.regular.fuelConsumption?.toFixed(2) || 'N/A'} kg</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Trajectory:</span>
                    <span class="result-value">Not available</span>
                </div>
            `;
        }
        
        if (spatialAdvanced) {
            spatialAdvanced.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Spatial Thrust Force:</span>
                    <span class="result-value">${comparison.spatial.spatialThrustForce?.magnitude?.toFixed(2) || 'N/A'} N</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Spatial Fuel Consumption:</span>
                    <span class="result-value">${comparison.spatial.spatialFuelConsumption?.scalar?.toFixed(2) || 'N/A'} kg</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Spatial Trajectory:</span>
                    <span class="result-value">${comparison.spatial.spatialTrajectory ? 'Available' : 'Not available'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Orbital Mechanics:</span>
                    <span class="result-value">${comparison.spatial.spatialOrbitalMechanics ? 'Available' : 'Not available'}</span>
                </div>
            `;
        }
    }
    
    displayQuantumComparison(comparison) {
        const regularQuantum = document.getElementById('regular-quantum');
        const spatialQuantum = document.getElementById('spatial-quantum');
        
        if (regularQuantum) {
            regularQuantum.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Quantum Calculations:</span>
                    <span class="result-value">Not available</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Consciousness Calculations:</span>
                    <span class="result-value">Not available</span>
                </div>
            `;
        }
        
        if (spatialQuantum) {
            spatialQuantum.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Quantum Flight:</span>
                    <span class="result-value">${comparison.spatial.spatialQuantumFlight ? 'Available' : 'Not available'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Consciousness Flight:</span>
                    <span class="result-value">${comparison.spatial.spatialConsciousnessFlight ? 'Available' : 'Not available'}</span>
                </div>
            `;
        }
    }
    
    updateAnalysisSummary(comparison) {
        const regularAdvantage = document.getElementById('regular-advantage');
        const spatialAdvantage = document.getElementById('spatial-advantage');
        const recommendation = document.getElementById('recommendation');
        
        if (regularAdvantage) {
            const regularCount = comparison.advantages.regular.length;
            regularAdvantage.textContent = `${regularCount} advantages`;
        }
        
        if (spatialAdvantage) {
            const spatialCount = comparison.advantages.spatial.length;
            spatialAdvantage.textContent = `${spatialCount} advantages`;
        }
        
        if (recommendation) {
            recommendation.textContent = comparison.advantages.overall;
        }
    }
    
    updateDetailedResults(comparison) {
        const detailedComparison = document.getElementById('detailed-comparison');
        
        if (detailedComparison) {
            let html = '<div class="detailed-grid">';
            
            // Differences
            html += '<div class="differences-section">';
            html += '<h5>Key Differences</h5>';
            
            Object.entries(comparison.differences).forEach(([key, diff]) => {
                html += `
                    <div class="difference-item">
                        <span class="difference-label">${key}:</span>
                        <span class="difference-value">${diff.percentage.toFixed(2)}% ${diff.spatialHigher ? 'higher' : 'lower'} in spatial</span>
                    </div>
                `;
            });
            
            html += '</div>';
            
            // Advantages
            html += '<div class="advantages-section">';
            html += '<h5>Advantages</h5>';
            
            html += '<div class="regular-advantages">';
            html += '<h6>Regular Mathematics:</h6>';
            comparison.advantages.regular.forEach(advantage => {
                html += `<div class="advantage-item">• ${advantage}</div>`;
            });
            html += '</div>';
            
            html += '<div class="spatial-advantages">';
            html += '<h6>Spatial Mathematics:</h6>';
            comparison.advantages.spatial.forEach(advantage => {
                html += `<div class="advantage-item">• ${advantage}</div>`;
            });
            html += '</div>';
            
            html += '</div>';
            html += '</div>';
            
            detailedComparison.innerHTML = html;
        }
    }
    
    createFlightVisualization(comparison) {
        const visualization = document.getElementById('flight-visualization');
        
        if (visualization) {
            // Create a simple flight path visualization
            const html = `
                <div class="flight-path">
                    <div class="path-line"></div>
                    <div class="aircraft-icon">✈️</div>
                    <div class="flight-info">
                        <div class="info-item">Model: ${comparison.model}</div>
                        <div class="info-item">Regular Distance: ${comparison.regular.distance?.toFixed(0) || 'N/A'} m</div>
                        <div class="info-item">Spatial Distance: ${comparison.spatial.spatialDistance?.magnitude?.toFixed(0) || 'N/A'} m</div>
                    </div>
                </div>
            `;
            
            visualization.innerHTML = html;
        }
    }
    
    switchTab(tabName) {
        // Remove active class from all tabs
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to selected tab
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedTab) selectedTab.classList.add('active');
        
        // Hide all tab content
        const tabContents = document.querySelectorAll('.comparison-tab');
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show selected tab content
        const selectedContent = document.getElementById(`${tabName}-comparison`);
        if (selectedContent) selectedContent.classList.add('active');
    }
    
    displayError(errorMessage) {
        console.error('❌ Flight Analysis Error:', errorMessage);
        
        const summary = document.getElementById('analysis-summary');
        if (summary) {
            summary.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    Error: ${errorMessage}
                </div>
            `;
        }
    }
    
    // Public API methods
    getCalculator() {
        return this.calculator;
    }
    
    getInterface() {
        return this.interface;
    }
    
    // Cleanup
    destroy() {
        console.log('✈️ Destroying Spatial Flight Interface...');
        
        if (this.interface) {
            this.interface.remove();
        }
        
        if (this.calculator) {
            this.calculator.destroy();
        }
    }
}

// Initialize Spatial Flight Interface
window.SpatialFlightInterface = SpatialFlightInterface; 