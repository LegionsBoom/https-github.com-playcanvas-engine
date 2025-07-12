/**
 * Spatial Flight Calculator Initialization
 * Sets up the flight calculator interface and runs initial calculations
 * Developed by Fungai Taranhike
 */

class SpatialFlightInit {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.flightInterface = null;
        this.calculator = null;
        this.init();
    }
    
    init() {
        console.log('✈️ Initializing Spatial Flight Calculator System...');
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
            // Initialize the spatial flight calculator
            this.calculator = new SpatialFlightCalculator();
            
            // Initialize the interface
            this.flightInterface = new SpatialFlightInterface();
            
            // Run initial analysis
            this.runInitialAnalysis();
            
            // Set up demo calculations
            this.setupDemoCalculations();
            
            console.log('✅ Spatial Flight Calculator System Active');
            
        } catch (error) {
            console.error('❌ Error initializing Spatial Flight Calculator:', error);
        }
    }
    
    runInitialAnalysis() {
        console.log('✈️ Running initial flight analysis...');
        
        try {
            // Get the calculator instance
            const calculator = this.flightInterface.getCalculator();
            
            if (!calculator) {
                console.warn('⚠️ Calculator not available for initial analysis');
                return;
            }
            
            // Run comprehensive analysis
            const analysis = calculator.runFlightAnalysis();
            
            // Display initial results
            this.displayInitialResults(analysis);
            
            console.log('✅ Initial analysis complete');
            
        } catch (error) {
            console.error('❌ Error running initial analysis:', error);
        }
    }
    
    displayInitialResults(analysis) {
        console.log('📊 Initial Analysis Results:');
        console.log('📋 Creator:', analysis.creator);
        console.log('⏰ Timestamp:', analysis.timestamp);
        console.log('📈 Models Analyzed:', analysis.summary.totalModels);
        console.log('🧮 Regular Advantages:', analysis.summary.regularAdvantage);
        console.log('🌐 Spatial Advantages:', analysis.summary.spatialAdvantage);
        
        // Display recommendations
        console.log('💡 Recommendations:');
        analysis.summary.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });
        
        // Log detailed model comparisons
        Object.entries(analysis.models).forEach(([modelKey, model]) => {
            console.log(`\n✈️ ${model.model}:`);
            console.log(`   Regular Distance: ${model.regular.distance?.toFixed(0) || 'N/A'} m`);
            console.log(`   Spatial Distance: ${model.spatial.spatialDistance?.magnitude?.toFixed(0) || 'N/A'} m`);
            console.log(`   Regular Kinetic Energy: ${model.regular.kineticEnergy?.toFixed(0) || 'N/A'} J`);
            console.log(`   Spatial Kinetic Energy: ${model.spatial.spatialKineticEnergy?.scalar?.toFixed(0) || 'N/A'} J`);
        });
    }
    
    setupDemoCalculations() {
        console.log('🎯 Setting up demo calculations...');
        
        // Create demo flight scenarios
        const demoScenarios = {
            'COMMERCIAL_DEMO': {
                name: 'Commercial Flight Demo',
                mass: 80000,
                velocity: 250,
                altitude: 10000,
                thrust: 200000
            },
            'FIGHTER_DEMO': {
                name: 'Fighter Jet Demo',
                mass: 15000,
                velocity: 600,
                altitude: 15000,
                thrust: 100000
            },
            'SPACECRAFT_DEMO': {
                name: 'Spacecraft Demo',
                mass: 5000,
                velocity: 7800,
                altitude: 400000,
                thrust: 50000
            }
        };
        
        // Run demo calculations
        Object.entries(demoScenarios).forEach(([key, scenario]) => {
            this.runDemoCalculation(scenario);
        });
    }
    
    runDemoCalculation(scenario) {
        try {
            const calculator = this.flightInterface.getCalculator();
            
            if (!calculator) return;
            
            // Create flight model for demo
            const demoModel = {
                name: scenario.name,
                mass: scenario.mass,
                cruiseSpeed: scenario.velocity,
                altitude: scenario.altitude,
                thrust: scenario.thrust,
                liftCoefficient: 0.3,
                dragCoefficient: 0.02,
                wingArea: 100,
                spatialMass: { scalar: scenario.mass, dimensional: 3 },
                spatialVelocity: { x: scenario.velocity, y: 0, z: 0 },
                spatialAltitude: { x: 0, y: 0, z: scenario.altitude }
            };
            
            // Run comparison
            const comparison = calculator.compareCalculations(demoModel);
            
            // Log demo results
            console.log(`\n🎯 ${scenario.name} Demo Results:`);
            console.log(`   Regular Distance: ${comparison.regular.distance?.toFixed(0) || 'N/A'} m`);
            console.log(`   Spatial Distance: ${comparison.spatial.spatialDistance?.magnitude?.toFixed(0) || 'N/A'} m`);
            console.log(`   Difference: ${comparison.differences.distance?.percentage?.toFixed(2) || 'N/A'}%`);
            
        } catch (error) {
            console.error(`❌ Error in demo calculation for ${scenario.name}:`, error);
        }
    }
    
    // Public API methods
    getCalculator() {
        return this.calculator;
    }
    
    getInterface() {
        return this.flightInterface;
    }
    
    // Run custom analysis
    runCustomAnalysis(parameters) {
        try {
            const calculator = this.flightInterface.getCalculator();
            
            if (!calculator) {
                throw new Error('Calculator not available');
            }
            
            const customModel = {
                name: 'Custom Analysis',
                mass: parameters.mass || 80000,
                cruiseSpeed: parameters.velocity || 250,
                altitude: parameters.altitude || 10000,
                thrust: parameters.thrust || 200000,
                liftCoefficient: 0.3,
                dragCoefficient: 0.02,
                wingArea: 100,
                spatialMass: { scalar: parameters.mass || 80000, dimensional: 3 },
                spatialVelocity: { x: parameters.velocity || 250, y: 0, z: 0 },
                spatialAltitude: { x: 0, y: 0, z: parameters.altitude || 10000 }
            };
            
            return calculator.compareCalculations(customModel);
            
        } catch (error) {
            console.error('❌ Error in custom analysis:', error);
            throw error;
        }
    }
    
    // Get system information
    getSystemInfo() {
        return {
            creator: this.creator,
            calculator: this.calculator ? this.calculator.getSystemName() : 'Not available',
            interface: this.flightInterface ? 'Active' : 'Not available',
            version: this.calculator ? this.calculator.getVersion() : 'Unknown'
        };
    }
    
    // Cleanup
    destroy() {
        console.log('✈️ Destroying Spatial Flight Calculator System...');
        
        if (this.flightInterface) {
            this.flightInterface.destroy();
        }
        
        if (this.calculator) {
            this.calculator.destroy();
        }
    }
}

// Initialize the system when the script loads
const spatialFlightSystem = new SpatialFlightInit();

// Make it available globally
window.SpatialFlightInit = SpatialFlightInit;
window.spatialFlightSystem = spatialFlightSystem;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpatialFlightInit, spatialFlightSystem };
} 