/**
 * Spatial Pattern Recognition Interface
 * UI for comparing normal vs spatial pattern recognition
 * Developed by Fungai Taranhike
 */

class SpatialPatternInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.patternSystem = null;
        this.interface = null;
        this.currentAnalysis = null;
        this.analysisHistory = [];
        this.init();
    }
    
    init() {
        console.log('🔍 Initializing Spatial Pattern Recognition Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.setupEventListeners();
        this.initializePatternSystem();
        
        console.log('✅ Spatial Pattern Recognition Interface Active');
    }
    
    createInterface() {
        // Create spatial pattern recognition panel
        const panel = document.createElement('div');
        panel.className = 'spatial-pattern-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3><i class="fas fa-chart-line"></i> Spatial Pattern Recognition</h3>
                <div class="creator-signature">
                    <span>By Fungai Taranhike</span>
                </div>
            </div>
            
            <div class="spatial-pattern-content">
                <!-- Stock Selection -->
                <div class="pattern-section">
                    <h4>Stock Analysis</h4>
                    <div class="stock-selection">
                        <div class="input-group">
                            <label>Stock Symbol:</label>
                            <input type="text" id="stock-symbol" value="AAPL" placeholder="Enter stock symbol">
                        </div>
                        <div class="input-group">
                            <label>Time Frame:</label>
                            <select id="time-frame">
                                <option value="1D">1 Day</option>
                                <option value="1W">1 Week</option>
                                <option value="1M">1 Month</option>
                                <option value="3M">3 Months</option>
                                <option value="6M">6 Months</option>
                                <option value="1Y">1 Year</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Pattern Recognition Methods -->
                <div class="pattern-section">
                    <h4>Pattern Recognition Methods</h4>
                    <div class="recognition-methods">
                        <div class="method-group">
                            <h5>Normal Analysis</h5>
                            <div class="method-buttons">
                                <button class="method-btn normal-btn" data-method="NORMAL_TREND_ANALYSIS">
                                    <i class="fas fa-chart-line"></i> Trend Analysis
                                </button>
                                <button class="method-btn normal-btn" data-method="NORMAL_SUPPORT_RESISTANCE">
                                    <i class="fas fa-level-up-alt"></i> Support/Resistance
                                </button>
                                <button class="method-btn normal-btn" data-method="NORMAL_CHART_PATTERNS">
                                    <i class="fas fa-shapes"></i> Chart Patterns
                                </button>
                                <button class="method-btn normal-btn" data-method="NORMAL_VOLUME_ANALYSIS">
                                    <i class="fas fa-chart-bar"></i> Volume Analysis
                                </button>
                            </div>
                        </div>
                        
                        <div class="method-group">
                            <h5>Spatial Analysis</h5>
                            <div class="method-buttons">
                                <button class="method-btn spatial-btn" data-method="SPATIAL_TREND_ANALYSIS">
                                    <i class="fas fa-cube"></i> Spatial Trend
                                </button>
                                <button class="method-btn spatial-btn" data-method="SPATIAL_SUPPORT_RESISTANCE">
                                    <i class="fas fa-cube"></i> Spatial S/R
                                </button>
                                <button class="method-btn spatial-btn" data-method="SPATIAL_CHART_PATTERNS">
                                    <i class="fas fa-cube"></i> Spatial Patterns
                                </button>
                                <button class="method-btn spatial-btn" data-method="SPATIAL_VOLUME_ANALYSIS">
                                    <i class="fas fa-cube"></i> Spatial Volume
                                </button>
                            </div>
                        </div>
                        
                        <div class="method-group">
                            <h5>Quantum Analysis</h5>
                            <div class="method-buttons">
                                <button class="method-btn quantum-btn" data-method="QUANTUM_TREND_ANALYSIS">
                                    <i class="fas fa-atom"></i> Quantum Trend
                                </button>
                                <button class="method-btn quantum-btn" data-method="QUANTUM_PATTERN_SUPERPOSITION">
                                    <i class="fas fa-atom"></i> Superposition
                                </button>
                                <button class="method-btn quantum-btn" data-method="QUANTUM_ENTANGLED_PATTERNS">
                                    <i class="fas fa-atom"></i> Entangled Patterns
                                </button>
                            </div>
                        </div>
                        
                        <div class="method-group">
                            <h5>Consciousness Analysis</h5>
                            <div class="method-buttons">
                                <button class="method-btn consciousness-btn" data-method="CONSCIOUSNESS_MARKET_SENTIMENT">
                                    <i class="fas fa-brain"></i> Market Sentiment
                                </button>
                                <button class="method-btn consciousness-btn" data-method="CONSCIOUSNESS_PATTERN_INTUITION">
                                    <i class="fas fa-brain"></i> Pattern Intuition
                                </button>
                                <button class="method-btn consciousness-btn" data-method="CONSCIOUSNESS_PREDICTIVE_INSIGHT">
                                    <i class="fas fa-brain"></i> Predictive Insight
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Analysis Actions -->
                <div class="pattern-section">
                    <h4>Analysis Actions</h4>
                    <div class="analysis-actions">
                        <button class="analyze-btn" id="compare-patterns">
                            <i class="fas fa-balance-scale"></i> Compare All Methods
                        </button>
                        <button class="analyze-btn" id="analyze-stock">
                            <i class="fas fa-chart-line"></i> Analyze Stock
                        </button>
                        <button class="analyze-btn" id="pattern-history">
                            <i class="fas fa-history"></i> View History
                        </button>
                        <button class="analyze-btn" id="export-results">
                            <i class="fas fa-download"></i> Export Results
                        </button>
                    </div>
                </div>
                
                <!-- Pattern Recognition Results -->
                <div class="pattern-section">
                    <h4>Recognition Results</h4>
                    <div class="results-display">
                        <div id="pattern-result" class="result-text">Ready for pattern recognition...</div>
                        <div id="pattern-metrics" class="metrics-display">
                            <div class="metric-item">
                                <span class="metric-label">Method:</span>
                                <span class="metric-value" id="method-used">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Accuracy:</span>
                                <span class="metric-value" id="accuracy-metric">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Confidence:</span>
                                <span class="metric-value" id="confidence-metric">-</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Precision:</span>
                                <span class="metric-value" id="precision-metric">-</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Comparison Results -->
                <div class="pattern-section">
                    <h4>Comparison Results</h4>
                    <div class="comparison-display">
                        <div id="comparison-result" class="result-text">Ready for comparison...</div>
                        <div id="comparison-metrics" class="comparison-metrics">
                            <div class="comparison-group">
                                <h5>Accuracy Comparison</h5>
                                <div class="comparison-bars">
                                    <div class="comparison-bar">
                                        <span class="bar-label">Normal</span>
                                        <div class="bar-container">
                                            <div class="bar normal-bar" id="normal-accuracy-bar"></div>
                                            <span class="bar-value" id="normal-accuracy-value">-</span>
                                        </div>
                                    </div>
                                    <div class="comparison-bar">
                                        <span class="bar-label">Spatial</span>
                                        <div class="bar-container">
                                            <div class="bar spatial-bar" id="spatial-accuracy-bar"></div>
                                            <span class="bar-value" id="spatial-accuracy-value">-</span>
                                        </div>
                                    </div>
                                    <div class="comparison-bar">
                                        <span class="bar-label">Quantum</span>
                                        <div class="bar-container">
                                            <div class="bar quantum-bar" id="quantum-accuracy-bar"></div>
                                            <span class="bar-value" id="quantum-accuracy-value">-</span>
                                        </div>
                                    </div>
                                    <div class="comparison-bar">
                                        <span class="bar-label">Consciousness</span>
                                        <div class="bar-container">
                                            <div class="bar consciousness-bar" id="consciousness-accuracy-bar"></div>
                                            <span class="bar-value" id="consciousness-accuracy-value">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="comparison-group">
                                <h5>Improvement Metrics</h5>
                                <div class="improvement-metrics">
                                    <div class="improvement-item">
                                        <span class="improvement-label">Spatial vs Normal:</span>
                                        <span class="improvement-value" id="spatial-improvement">-</span>
                                    </div>
                                    <div class="improvement-item">
                                        <span class="improvement-label">Quantum vs Normal:</span>
                                        <span class="improvement-value" id="quantum-improvement">-</span>
                                    </div>
                                    <div class="improvement-item">
                                        <span class="improvement-label">Consciousness vs Normal:</span>
                                        <span class="improvement-value" id="consciousness-improvement">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Stock Analysis Results -->
                <div class="pattern-section">
                    <h4>Stock Analysis Results</h4>
                    <div class="stock-analysis-display">
                        <div id="stock-result" class="result-text">Ready for stock analysis...</div>
                        <div id="stock-recommendations" class="recommendations-display">
                            <div class="recommendations-list" id="recommendations-list">
                                <!-- Recommendations will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Analysis History -->
                <div class="pattern-section">
                    <h4>Analysis History</h4>
                    <div class="history-display">
                        <div id="analysis-history" class="history-list">
                            <div class="no-history">No analysis sessions yet</div>
                        </div>
                    </div>
                </div>
                
                <!-- System Status -->
                <div class="pattern-section">
                    <h4>System Status</h4>
                    <div class="status-display">
                        <div class="status-item">
                            <span class="status-label">Creator:</span>
                            <span class="status-value" id="creator-status">Fungai Taranhike</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">System:</span>
                            <span class="status-value" id="system-status">Spatial Pattern Recognition v8.0.0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Analyses Performed:</span>
                            <span class="status-value" id="analyses-performed">0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Patterns Recognized:</span>
                            <span class="status-value" id="patterns-recognized">0</span>
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
        // Analysis actions
        const compareBtn = document.getElementById('compare-patterns');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.comparePatternRecognition();
            });
        }
        
        const analyzeBtn = document.getElementById('analyze-stock');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeStockPattern();
            });
        }
        
        const historyBtn = document.getElementById('pattern-history');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                this.showAnalysisHistory();
            });
        }
        
        const exportBtn = document.getElementById('export-results');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportResults();
            });
        }
        
        // Method buttons
        const methodBtns = document.querySelectorAll('.method-btn');
        methodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.recognizePattern(e.target.dataset.method);
            });
        });
    }
    
    initializePatternSystem() {
        // Initialize the spatial pattern recognition system
        this.patternSystem = new SpatialPatternRecognition();
        
        console.log('🔍 Spatial Pattern Recognition System initialized');
    }
    
    recognizePattern(method) {
        const stockSymbol = document.getElementById('stock-symbol').value;
        const timeFrame = document.getElementById('time-frame').value;
        
        if (!stockSymbol) {
            this.displayError('Please enter a stock symbol');
            return;
        }
        
        console.log('🔍 Recognizing pattern with method:', method);
        
        try {
            const stockData = this.patternSystem.generateStockData(stockSymbol, timeFrame);
            const resultId = this.patternSystem.recognizePatterns(stockData, method);
            
            this.displayPatternResult(resultId, method);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    comparePatternRecognition() {
        const stockSymbol = document.getElementById('stock-symbol').value;
        const timeFrame = document.getElementById('time-frame').value;
        
        if (!stockSymbol) {
            this.displayError('Please enter a stock symbol');
            return;
        }
        
        console.log('📊 Comparing pattern recognition methods');
        
        try {
            const stockData = this.patternSystem.generateStockData(stockSymbol, timeFrame);
            const comparison = this.patternSystem.comparePatternRecognition(stockData);
            
            this.displayComparisonResult(comparison);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    analyzeStockPattern() {
        const stockSymbol = document.getElementById('stock-symbol').value;
        const timeFrame = document.getElementById('time-frame').value;
        
        if (!stockSymbol) {
            this.displayError('Please enter a stock symbol');
            return;
        }
        
        console.log('📈 Analyzing stock pattern for:', stockSymbol);
        
        try {
            const analysis = this.patternSystem.analyzeStockPattern(stockSymbol, timeFrame);
            
            this.displayStockAnalysis(analysis);
            this.addToAnalysisHistory(analysis);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    showAnalysisHistory() {
        const history = this.patternSystem.getPatternHistory();
        this.updateAnalysisHistoryDisplay(history);
    }
    
    exportResults() {
        if (!this.currentAnalysis) {
            this.displayError('No analysis results to export');
            return;
        }
        
        console.log('📤 Exporting analysis results');
        
        try {
            const exportData = {
                analysis: this.currentAnalysis,
                timestamp: new Date(),
                creator: this.creator
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `pattern_analysis_${Date.now()}.json`;
            link.click();
            
            this.displaySuccess('Analysis results exported successfully');
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    displayPatternResult(resultId, method) {
        const resultText = document.getElementById('pattern-result');
        const methodUsed = document.getElementById('method-used');
        const accuracyMetric = document.getElementById('accuracy-metric');
        const confidenceMetric = document.getElementById('confidence-metric');
        const precisionMetric = document.getElementById('precision-metric');
        
        const results = this.patternSystem.getRecognitionResults();
        const result = results.get(resultId);
        
        if (resultText) {
            resultText.textContent = `Pattern recognition completed using ${method}`;
        }
        
        if (methodUsed) {
            methodUsed.textContent = method;
        }
        
        if (accuracyMetric) {
            accuracyMetric.textContent = (result.recognition.accuracy || 0.75).toFixed(3);
        }
        
        if (confidenceMetric) {
            confidenceMetric.textContent = (result.recognition.confidence || 0.70).toFixed(3);
        }
        
        if (precisionMetric) {
            precisionMetric.textContent = (result.recognition.precision || 0.72).toFixed(3);
        }
    }
    
    displayComparisonResult(comparison) {
        const resultText = document.getElementById('comparison-result');
        
        if (resultText) {
            resultText.textContent = 'Pattern recognition comparison completed successfully';
        }
        
        // Update comparison bars
        this.updateComparisonBars(comparison.comparison.accuracy);
        this.updateImprovementMetrics(comparison.comparison.improvement);
        
        this.currentAnalysis = comparison;
    }
    
    displayStockAnalysis(analysis) {
        const resultText = document.getElementById('stock-result');
        const recommendationsList = document.getElementById('recommendations-list');
        
        if (resultText) {
            resultText.textContent = `Stock analysis completed for ${analysis.symbol} (${analysis.timeFrame})`;
        }
        
        if (recommendationsList) {
            let html = '';
            analysis.recommendations.forEach(rec => {
                html += `
                    <div class="recommendation-item">
                        <div class="recommendation-type">${rec.type}</div>
                        <div class="recommendation-message">${rec.message}</div>
                        <div class="recommendation-improvement">Improvement: ${rec.improvement}</div>
                    </div>
                `;
            });
            recommendationsList.innerHTML = html;
        }
        
        this.currentAnalysis = analysis;
    }
    
    updateComparisonBars(accuracies) {
        const normalBar = document.getElementById('normal-accuracy-bar');
        const spatialBar = document.getElementById('spatial-accuracy-bar');
        const quantumBar = document.getElementById('quantum-accuracy-bar');
        const consciousnessBar = document.getElementById('consciousness-accuracy-bar');
        
        const normalValue = document.getElementById('normal-accuracy-value');
        const spatialValue = document.getElementById('spatial-accuracy-value');
        const quantumValue = document.getElementById('quantum-accuracy-value');
        const consciousnessValue = document.getElementById('consciousness-accuracy-value');
        
        if (normalBar && normalValue) {
            normalBar.style.width = (accuracies.normal * 100) + '%';
            normalValue.textContent = accuracies.normal.toFixed(3);
        }
        
        if (spatialBar && spatialValue) {
            spatialBar.style.width = (accuracies.spatial * 100) + '%';
            spatialValue.textContent = accuracies.spatial.toFixed(3);
        }
        
        if (quantumBar && quantumValue) {
            quantumBar.style.width = (accuracies.quantum * 100) + '%';
            quantumValue.textContent = accuracies.quantum.toFixed(3);
        }
        
        if (consciousnessBar && consciousnessValue) {
            consciousnessBar.style.width = (accuracies.consciousness * 100) + '%';
            consciousnessValue.textContent = accuracies.consciousness.toFixed(3);
        }
    }
    
    updateImprovementMetrics(improvements) {
        const spatialImprovement = document.getElementById('spatial-improvement');
        const quantumImprovement = document.getElementById('quantum-improvement');
        const consciousnessImprovement = document.getElementById('consciousness-improvement');
        
        if (spatialImprovement) {
            spatialImprovement.textContent = improvements.spatialVsNormal.toFixed(2) + '%';
        }
        
        if (quantumImprovement) {
            quantumImprovement.textContent = improvements.quantumVsNormal.toFixed(2) + '%';
        }
        
        if (consciousnessImprovement) {
            consciousnessImprovement.textContent = improvements.consciousnessVsNormal.toFixed(2) + '%';
        }
    }
    
    addToAnalysisHistory(analysis) {
        this.analysisHistory.push({
            symbol: analysis.symbol,
            timeFrame: analysis.timeFrame,
            timestamp: new Date()
        });
        
        this.updateAnalysisHistoryDisplay(this.analysisHistory);
    }
    
    updateAnalysisHistoryDisplay(history) {
        const historyContainer = document.getElementById('analysis-history');
        
        if (!historyContainer) return;
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">No analysis sessions yet</div>';
            return;
        }
        
        let html = '';
        history.slice().reverse().forEach((session, index) => {
            html += `
                <div class="history-item">
                    <div class="history-symbol">${session.symbol}</div>
                    <div class="history-timeframe">${session.timeFrame}</div>
                    <div class="history-time">${session.timestamp.toLocaleTimeString()}</div>
                </div>
            `;
        });
        
        historyContainer.innerHTML = html;
        
        // Update status
        const analysesPerformed = document.getElementById('analyses-performed');
        const patternsRecognized = document.getElementById('patterns-recognized');
        
        if (analysesPerformed) {
            analysesPerformed.textContent = history.length;
        }
        
        if (patternsRecognized) {
            patternsRecognized.textContent = history.length * 4; // 4 methods per analysis
        }
    }
    
    displaySuccess(message) {
        const resultText = document.getElementById('pattern-result');
        
        if (resultText) {
            resultText.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    ${message}
                </div>
            `;
        }
    }
    
    displayError(errorMessage) {
        console.error('❌ Pattern Recognition Error:', errorMessage);
        
        const resultText = document.getElementById('pattern-result');
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
    getPatternSystem() {
        return this.patternSystem;
    }
    
    getInterface() {
        return this.interface;
    }
    
    // Cleanup
    destroy() {
        console.log('🔍 Destroying Spatial Pattern Recognition Interface...');
        
        if (this.interface) {
            this.interface.remove();
        }
        
        if (this.patternSystem) {
            this.patternSystem.destroy();
        }
    }
}

// Initialize Spatial Pattern Recognition Interface
window.SpatialPatternInterface = SpatialPatternInterface; 