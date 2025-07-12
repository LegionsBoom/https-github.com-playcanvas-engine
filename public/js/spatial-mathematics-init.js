/**
 * Spatial Mathematics Initialization
 * Initializes SMSI (Spatial Mathematics and Self-Improving Intelligence) in the editor
 * Developed by Fungai Taranhike
 */

class SpatialMathematicsInitializer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.interface = null;
        this.system = null;
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Spatial Mathematics System (SMSI)...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeSMSI();
            });
        } else {
            this.initializeSMSI();
        }
    }
    
    initializeSMSI() {
        try {
            // Initialize the spatial mathematics interface
            this.interface = new SpatialMathematicsInterface();
            this.system = this.interface.getSystem();
            
            console.log('✅ SMSI Successfully Initialized');
            console.log('🧠 System: ' + this.system.getSystemName());
            console.log('👨‍💻 Creator: ' + this.system.getCreator());
            console.log('🌐 Version: ' + this.system.getVersion());
            
            // Add to global scope for debugging
            window.SMSI = this.system;
            window.SMSIInterface = this.interface;
            
            // Display welcome message
            this.displayWelcomeMessage();
            
            // Start continuous learning
            this.startContinuousLearning();
            
        } catch (error) {
            console.error('❌ Failed to initialize SMSI:', error);
            this.displayErrorMessage(error.message);
        }
    }
    
    displayWelcomeMessage() {
        const welcomeMessage = `
            🧠 SMSI (Spatial Mathematics and Self-Improving Intelligence) Active
            
            👨‍💻 Creator: ${this.system.getCreator()}
            🌐 System: ${this.system.getSystemName()}
            📊 Version: ${this.system.getVersion()}
            
            🚀 Features Available:
            • Spatial Algebra Operations
            • Spatial Geometry Calculations
            • Spatial Calculus Functions
            • Quantum Mathematics
            • Self-Improvement Systems
            • Continuous Learning
            
            🎯 Ready for mathematical exploration and spatial reasoning!
        `;
        
        console.log(welcomeMessage);
        
        // Update the result display with welcome message
        const resultElement = document.getElementById('math-result');
        if (resultElement) {
            resultElement.textContent = 'SMSI Active - Ready for spatial mathematics operations';
            resultElement.className = 'result-text success';
        }
    }
    
    displayErrorMessage(message) {
        console.error('❌ SMSI Error:', message);
        
        const resultElement = document.getElementById('math-result');
        if (resultElement) {
            resultElement.textContent = `SMSI Error: ${message}`;
            resultElement.className = 'result-text error';
        }
    }
    
    startContinuousLearning() {
        // Start continuous learning process
        setInterval(() => {
            if (this.system) {
                // Trigger self-improvement
                this.system.triggerSelfImprovement({
                    operation: 'continuous_learning',
                    timestamp: new Date(),
                    success: true
                });
                
                // Update consciousness level
                if (this.system.consciousnessEngine) {
                    this.system.consciousnessEngine.consciousnessLevel += 0.001;
                }
                
                // Update adaptation rate
                if (this.system.adaptationEngine) {
                    this.system.adaptationEngine.adaptationRate += 0.0001;
                }
                
                // Update status display
                this.updateStatusDisplay();
            }
        }, 5000); // Every 5 seconds
        
        console.log('🔄 Continuous learning started');
    }
    
    updateStatusDisplay() {
        if (!this.system) return;
        
        // Update consciousness status
        const consciousnessStatus = document.getElementById('consciousness-status');
        if (consciousnessStatus && this.system.consciousnessEngine) {
            consciousnessStatus.textContent = this.system.consciousnessEngine.consciousnessLevel.toFixed(3);
        }
        
        // Update learning status
        const learningStatus = document.getElementById('learning-status');
        if (learningStatus && this.system.adaptationEngine) {
            learningStatus.textContent = this.system.adaptationEngine.adaptationRate.toFixed(3);
        }
    }
    
    // Public API methods
    getSystem() {
        return this.system;
    }
    
    getInterface() {
        return this.interface;
    }
    
    // Execute mathematical operation
    executeMathOperation(operation, ...args) {
        if (!this.system) {
            throw new Error('SMSI System not initialized');
        }
        
        return this.system.execute(operation, ...args);
    }
    
    // Get system status
    getSystemStatus() {
        if (!this.system) return null;
        
        return {
            creator: this.system.getCreator(),
            systemName: this.system.getSystemName(),
            version: this.system.getVersion(),
            consciousnessLevel: this.system.consciousnessEngine ? 
                this.system.consciousnessEngine.consciousnessLevel : 0,
            adaptationRate: this.system.adaptationEngine ? 
                this.system.adaptationEngine.adaptationRate : 0,
            mathematicalState: this.system.getMathematicalState().size,
            spatialVariables: this.system.getSpatialVariables().size,
            quantumStates: this.system.getQuantumStates().size,
            consciousnessLevels: this.system.getConsciousnessLevels().size
        };
    }
    
    // Cleanup
    destroy() {
        console.log('🚀 Destroying Spatial Mathematics Initializer...');
        
        if (this.interface) {
            this.interface.destroy();
        }
        
        // Remove from global scope
        delete window.SMSI;
        delete window.SMSIInterface;
    }
}

// Initialize when script loads
const smsiInitializer = new SpatialMathematicsInitializer();

// Make available globally
window.SMSIInitializer = smsiInitializer; 