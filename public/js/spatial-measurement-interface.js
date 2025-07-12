/**
 * Spatial Measurement Interface
 * UI for comprehensive spatial measurements beyond axis-based coordinates
 * Developed by Fungai Taranhike
 */

class SpatialMeasurementInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.measurementSystem = null;
        this.interface = null;
        this.currentMeasurement = null;
        this.init();
    }
    
    init() {
        console.log('📏 Initializing Spatial Measurement Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.setupEventListeners();
        this.initializeMeasurementSystem();
        
        console.log('✅ Spatial Measurement Interface Active');
    }
    
    createInterface() {
        // Create spatial measurement panel
        const panel = document.createElement('div');
        panel.className = 'spatial-measurement-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3><i class="fas fa-ruler-combined"></i> Spatial Measurement System</h3>
                <div class="creator-signature">
                    <span>By Fungai Taranhike</span>
                </div>
            </div>
            
            <div class="spatial-measurement-content">
                <!-- Measurement Type Selection -->
                <div class="measurement-section">
                    <h4>Measurement Type</h4>
                    <div class="measurement-selection">
                        <select id="measurement-type">
                            <option value="SPATIAL_DISTANCE">Spatial Distance</option>
                            <option value="SPATIAL_VOLUME">Spatial Volume</option>
                            <option value="SPATIAL_TIME">Spatial Time</option>
                            <option value="SPATIAL_ENERGY">Spatial Energy</option>
                            <option value="QUANTUM_SPATIAL_STATE">Quantum Spatial State</option>
                            <option value="QUANTUM_SPATIAL_ENTANGLEMENT">Quantum Spatial Entanglement</option>
                            <option value="QUANTUM_SPATIAL_UNCERTAINTY">Quantum Spatial Uncertainty</option>
                            <option value="CONSCIOUSNESS_SPATIAL_AWARENESS">Consciousness Spatial Awareness</option>
                            <option value="CONSCIOUSNESS_SPATIAL_PERCEPTION">Consciousness Spatial Perception</option>
                            <option value="CONSCIOUSNESS_SPATIAL_CREATION">Consciousness Spatial Creation</option>
                            <option value="DIMENSIONAL_SPATIAL_DEPTH">Dimensional Spatial Depth</option>
                            <option value="DIMENSIONAL_SPATIAL_BREACH">Dimensional Spatial Breach</option>
                            <option value="DIMENSIONAL_SPATIAL_FOLD">Dimensional Spatial Fold</option>
                            <option value="REALITY_SPATIAL_STABILITY">Reality Spatial Stability</option>
                            <option value="REALITY_SPATIAL_MANIPULATION">Reality Spatial Manipulation</option>
                            <option value="REALITY_SPATIAL_COHERENCE">Reality Spatial Coherence</option>
                        </select>
                    </div>
                </div>
                
                <!-- Unit Selection -->
                <div class="measurement-section">
                    <h4>Measurement Unit</h4>
                    <div class="unit-selection">
                        <select id="measurement-unit">
                            <option value="spatial_meter">Spatial Meter (sm)</option>
                            <option value="spatial_cubic_meter">Spatial Cubic Meter (scm³)</option>
                            <option value="spatial_second">Spatial Second (ss)</option>
                            <option value="spatial_joule">Spatial Joule (sj)</option>
                            <option value="quantum_spatial_unit">Quantum Spatial Unit (qsu)</option>
                            <option value="quantum_entanglement_unit">Quantum Entanglement Unit (qeu)</option>
                            <option value="quantum_uncertainty_unit">Quantum Uncertainty Unit (quu)</option>
                            <option value="consciousness_awareness_unit">Consciousness Awareness Unit (cau)</option>
                            <option value="consciousness_perception_unit">Consciousness Perception Unit (cpu)</option>
                            <option value="consciousness_creation_unit">Consciousness Creation Unit (ccu)</option>
                            <option value="dimensional_depth_unit">Dimensional Depth Unit (ddu)</option>
                            <option value="dimensional_breach_unit">Dimensional Breach Unit (dbu)</option>
                            <option value="dimensional_fold_unit">Dimensional Fold Unit (dfu)</option>
                            <option value="reality_stability_unit">Reality Stability Unit (rsu)</option>
                            <option value="reality_manipulation_unit">Reality Manipulation Unit (rmu)</option>
                            <option value="reality_coherence_unit">Reality Coherence Unit (rcu)</option>
                        </select>
                    </div>
                </div>
                
                <!-- Measurement Parameters -->
                <div class="measurement-section">
                    <h4>Measurement Parameters</h4>
                    <div class="parameter-inputs">
                        <div class="input-group">
                            <label>Value:</label>
                            <input type="number" id="measurement-value" value="1.0" step="0.1">
                        </div>
                        <div class="input-group">
                            <label>Precision:</label>
                            <input type="number" id="measurement-precision" value="0.001" step="0.001" min="0.000001" max="1.0">
                        </div>
                        <div class="input-group">
                            <label>Point A (X, Y, Z):</label>
                            <div class="coordinate-inputs">
                                <input type="number" id="point-a-x" value="0" step="0.1" placeholder="X">
                                <input type="number" id="point-a-y" value="0" step="0.1" placeholder="Y">
                                <input type="number" id="point-a-z" value="0" step="0.1" placeholder="Z">
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Point B (X, Y, Z):</label>
                            <div class="coordinate-inputs">
                                <input type="number" id="point-b-x" value="1" step="0.1" placeholder="X">
                                <input type="number" id="point-b-y" value="1" step="0.1" placeholder="Y">
                                <input type="number" id="point-b-z" value="1" step="0.1" placeholder="Z">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Measurement Actions -->
                <div class="measurement-section">
                    <h4>Measurement Actions</h4>
                    <div class="measurement-actions">
                        <button class="measure-btn" id="perform-measurement">
                            <i class="fas fa-ruler"></i> Perform Measurement
                        </button>
                        <button class="convert-btn" id="convert-measurement">
                            <i class="fas fa-exchange-alt"></i> Convert Unit
                        </button>
                        <button class="compare-btn" id="compare-measurements">
                            <i class="fas fa-balance-scale"></i> Compare Measurements
                        </button>
                    </div>
                </div>
                
                <!-- Measurement Results -->
                <div class="measurement-section">
                    <h4>Measurement Results</h4>
                    <div class="results-display">
                        <div id="measurement-result" class="result-text">Ready for measurement...</div>
                        <div id="measurement-details" class="details-display">
                            <div class="detail-item">
                                <span class="detail-label">Value:</span>
                                <span class="detail-value" id="result-value">-</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Unit:</span>
                                <span class="detail-value" id="result-unit">-</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Uncertainty:</span>
                                <span class="detail-value" id="result-uncertainty">-</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value" id="result-type">-</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Advanced Measurements -->
                <div class="measurement-section">
                    <h4>Advanced Measurements</h4>
                    <div class="advanced-measurements">
                        <div class="advanced-group">
                            <button class="advanced-btn" data-measurement="quantum-entanglement">
                                <i class="fas fa-atom"></i> Quantum Entanglement
                            </button>
                            <button class="advanced-btn" data-measurement="consciousness-awareness">
                                <i class="fas fa-brain"></i> Consciousness Awareness
                            </button>
                            <button class="advanced-btn" data-measurement="dimensional-depth">
                                <i class="fas fa-cube"></i> Dimensional Depth
                            </button>
                        </div>
                        <div class="advanced-group">
                            <button class="advanced-btn" data-measurement="reality-stability">
                                <i class="fas fa-globe"></i> Reality Stability
                            </button>
                            <button class="advanced-btn" data-measurement="spatial-volume">
                                <i class="fas fa-cube"></i> Spatial Volume
                            </button>
                            <button class="advanced-btn" data-measurement="spatial-energy">
                                <i class="fas fa-bolt"></i> Spatial Energy
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Measurement History -->
                <div class="measurement-section">
                    <h4>Measurement History</h4>
                    <div class="history-display">
                        <div id="measurement-history" class="history-list">
                            <div class="no-history">No measurements performed yet</div>
                        </div>
                    </div>
                </div>
                
                <!-- System Status -->
                <div class="measurement-section">
                    <h4>System Status</h4>
                    <div class="status-display">
                        <div class="status-item">
                            <span class="status-label">Creator:</span>
                            <span class="status-value" id="creator-status">Fungai Taranhike</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">System:</span>
                            <span class="status-value" id="system-status">Spatial Measurement v6.0.0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Current Unit:</span>
                            <span class="status-value" id="current-unit">spatial_meter</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Precision:</span>
                            <span class="status-value" id="current-precision">0.001</span>
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
        // Measurement type change
        const measurementTypeSelect = document.getElementById('measurement-type');
        if (measurementTypeSelect) {
            measurementTypeSelect.addEventListener('change', () => {
                this.updateUnitOptions();
            });
        }
        
        // Perform measurement
        const performBtn = document.getElementById('perform-measurement');
        if (performBtn) {
            performBtn.addEventListener('click', () => {
                this.performMeasurement();
            });
        }
        
        // Convert measurement
        const convertBtn = document.getElementById('convert-measurement');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => {
                this.convertMeasurement();
            });
        }
        
        // Compare measurements
        const compareBtn = document.getElementById('compare-measurements');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.compareMeasurements();
            });
        }
        
        // Advanced measurement buttons
        const advancedBtns = document.querySelectorAll('.advanced-btn');
        advancedBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.performAdvancedMeasurement(e.target.dataset.measurement);
            });
        });
    }
    
    initializeMeasurementSystem() {
        // Initialize the spatial measurement system
        this.measurementSystem = new SpatialMeasurementSystem();
        
        console.log('📏 Spatial Measurement System initialized');
    }
    
    updateUnitOptions() {
        const measurementType = document.getElementById('measurement-type').value;
        const unitSelect = document.getElementById('measurement-unit');
        
        if (!unitSelect) return;
        
        // Clear current options
        unitSelect.innerHTML = '';
        
        // Get measurement types
        const measurementTypes = this.measurementSystem.getMeasurementTypes();
        const spatialUnits = this.measurementSystem.getSpatialUnits();
        
        if (measurementTypes[measurementType]) {
            const baseUnit = measurementTypes[measurementType].baseUnit;
            
            // Add relevant units
            Object.entries(spatialUnits).forEach(([unitKey, unit]) => {
                if (unit.type === measurementType) {
                    const option = document.createElement('option');
                    option.value = unitKey;
                    option.textContent = `${unit.name} (${unit.symbol})`;
                    unitSelect.appendChild(option);
                }
            });
        }
    }
    
    performMeasurement() {
        const measurementType = document.getElementById('measurement-type').value;
        const unit = document.getElementById('measurement-unit').value;
        const value = parseFloat(document.getElementById('measurement-value').value);
        const precision = parseFloat(document.getElementById('measurement-precision').value);
        
        if (!measurementType || !unit || isNaN(value)) {
            this.displayError('Please fill in all measurement parameters');
            return;
        }
        
        console.log('📏 Performing measurement:', measurementType, value, unit);
        
        try {
            let measurement;
            
            // Perform measurement based on type
            switch (measurementType) {
                case 'SPATIAL_DISTANCE':
                    const pointA = {
                        x: parseFloat(document.getElementById('point-a-x').value),
                        y: parseFloat(document.getElementById('point-a-y').value),
                        z: parseFloat(document.getElementById('point-b-z').value)
                    };
                    const pointB = {
                        x: parseFloat(document.getElementById('point-b-x').value),
                        y: parseFloat(document.getElementById('point-b-y').value),
                        z: parseFloat(document.getElementById('point-b-z').value)
                    };
                    measurement = this.measurementSystem.measureSpatialDistance(pointA, pointB, unit);
                    break;
                    
                case 'SPATIAL_VOLUME':
                    const dimensions = {
                        length: value,
                        width: value,
                        height: value
                    };
                    measurement = this.measurementSystem.measureSpatialVolume(dimensions, unit);
                    break;
                    
                case 'QUANTUM_SPATIAL_ENTANGLEMENT':
                    measurement = this.measurementSystem.measureQuantumEntanglement(value, value * 0.5, unit);
                    break;
                    
                case 'CONSCIOUSNESS_SPATIAL_AWARENESS':
                    measurement = this.measurementSystem.measureConsciousnessAwareness({ intensity: value }, unit);
                    break;
                    
                case 'DIMENSIONAL_SPATIAL_DEPTH':
                    measurement = this.measurementSystem.measureDimensionalDepth({ level: value, complexity: 1 }, unit);
                    break;
                    
                case 'REALITY_SPATIAL_STABILITY':
                    measurement = this.measurementSystem.measureRealityStability({ coherence: value, consistency: 1 }, unit);
                    break;
                    
                default:
                    // Standard measurement
                    measurement = this.measurementSystem.measureStandardSpatial(value, unit);
                    break;
            }
            
            this.displayMeasurementResult(measurement);
            this.addToHistory(measurement);
            this.currentMeasurement = measurement;
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    performAdvancedMeasurement(type) {
        console.log('🔬 Performing advanced measurement:', type);
        
        try {
            let measurement;
            
            switch (type) {
                case 'quantum-entanglement':
                    measurement = this.measurementSystem.measureQuantumEntanglement(1.0, 0.5, 'quantum_entanglement_unit');
                    break;
                    
                case 'consciousness-awareness':
                    measurement = this.measurementSystem.measureConsciousnessAwareness({ intensity: 0.8 }, 'consciousness_awareness_unit');
                    break;
                    
                case 'dimensional-depth':
                    measurement = this.measurementSystem.measureDimensionalDepth({ level: 3, complexity: 2 }, 'dimensional_depth_unit');
                    break;
                    
                case 'reality-stability':
                    measurement = this.measurementSystem.measureRealityStability({ coherence: 0.9, consistency: 0.8 }, 'reality_stability_unit');
                    break;
                    
                case 'spatial-volume':
                    measurement = this.measurementSystem.measureSpatialVolume({ length: 2, width: 2, height: 2 }, 'spatial_cubic_meter');
                    break;
                    
                case 'spatial-energy':
                    measurement = this.measurementSystem.measureStandardSpatial(1000, 'spatial_joule');
                    break;
                    
                default:
                    throw new Error('Unknown advanced measurement type');
            }
            
            this.displayMeasurementResult(measurement);
            this.addToHistory(measurement);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    convertMeasurement() {
        if (!this.currentMeasurement) {
            this.displayError('No measurement to convert. Please perform a measurement first.');
            return;
        }
        
        const targetUnit = document.getElementById('measurement-unit').value;
        
        try {
            const convertedMeasurement = this.measurementSystem.convertMeasurement(this.currentMeasurement, targetUnit);
            this.displayMeasurementResult(convertedMeasurement);
            this.addToHistory(convertedMeasurement);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    compareMeasurements() {
        // Get last two measurements from history
        const history = this.getMeasurementHistory();
        
        if (history.length < 2) {
            this.displayError('Need at least 2 measurements to compare');
            return;
        }
        
        const measurement1 = history[history.length - 2];
        const measurement2 = history[history.length - 1];
        
        const comparison = {
            measurement1: measurement1,
            measurement2: measurement2,
            difference: measurement2.value - measurement1.value,
            ratio: measurement2.value / measurement1.value,
            percentageChange: ((measurement2.value - measurement1.value) / measurement1.value) * 100
        };
        
        this.displayComparisonResult(comparison);
    }
    
    displayMeasurementResult(measurement) {
        const resultText = document.getElementById('measurement-result');
        const resultValue = document.getElementById('result-value');
        const resultUnit = document.getElementById('result-unit');
        const resultUncertainty = document.getElementById('result-uncertainty');
        const resultType = document.getElementById('result-type');
        
        if (resultText) {
            resultText.textContent = `Measurement: ${measurement.value.toFixed(6)} ${measurement.unit}`;
        }
        
        if (resultValue) {
            resultValue.textContent = measurement.value.toFixed(6);
        }
        
        if (resultUnit) {
            resultValue.textContent = measurement.unit;
        }
        
        if (resultUncertainty) {
            resultUncertainty.textContent = measurement.uncertainty ? measurement.uncertainty.toFixed(6) : 'N/A';
        }
        
        if (resultType) {
            resultType.textContent = measurement.type;
        }
    }
    
    displayComparisonResult(comparison) {
        const resultText = document.getElementById('measurement-result');
        
        if (resultText) {
            resultText.innerHTML = `
                <div class="comparison-result">
                    <div class="comparison-item">
                        <span class="comparison-label">Measurement 1:</span>
                        <span class="comparison-value">${comparison.measurement1.value.toFixed(6)} ${comparison.measurement1.unit}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Measurement 2:</span>
                        <span class="comparison-value">${comparison.measurement2.value.toFixed(6)} ${comparison.measurement2.unit}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Difference:</span>
                        <span class="comparison-value">${comparison.difference.toFixed(6)}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Ratio:</span>
                        <span class="comparison-value">${comparison.ratio.toFixed(3)}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Change:</span>
                        <span class="comparison-value">${comparison.percentageChange.toFixed(2)}%</span>
                    </div>
                </div>
            `;
        }
    }
    
    addToHistory(measurement) {
        const history = this.getMeasurementHistory();
        history.push({
            ...measurement,
            timestamp: new Date()
        });
        
        // Keep only last 10 measurements
        if (history.length > 10) {
            history.shift();
        }
        
        localStorage.setItem('spatialMeasurementHistory', JSON.stringify(history));
        this.updateHistoryDisplay();
    }
    
    getMeasurementHistory() {
        const history = localStorage.getItem('spatialMeasurementHistory');
        return history ? JSON.parse(history) : [];
    }
    
    updateHistoryDisplay() {
        const historyContainer = document.getElementById('measurement-history');
        const history = this.getMeasurementHistory();
        
        if (!historyContainer) return;
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">No measurements performed yet</div>';
            return;
        }
        
        let html = '';
        history.slice().reverse().forEach((measurement, index) => {
            html += `
                <div class="history-item">
                    <div class="history-value">${measurement.value.toFixed(4)} ${measurement.unit}</div>
                    <div class="history-type">${measurement.type}</div>
                    <div class="history-time">${new Date(measurement.timestamp).toLocaleTimeString()}</div>
                </div>
            `;
        });
        
        historyContainer.innerHTML = html;
    }
    
    displayError(errorMessage) {
        console.error('❌ Measurement Error:', errorMessage);
        
        const resultText = document.getElementById('measurement-result');
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
    getMeasurementSystem() {
        return this.measurementSystem;
    }
    
    getInterface() {
        return this.interface;
    }
    
    // Cleanup
    destroy() {
        console.log('📏 Destroying Spatial Measurement Interface...');
        
        if (this.interface) {
            this.interface.remove();
        }
        
        if (this.measurementSystem) {
            this.measurementSystem.destroy();
        }
    }
}

// Initialize Spatial Measurement Interface
window.SpatialMeasurementInterface = SpatialMeasurementInterface; 