/**
 * Spatial Variables Initialization
 * Initializes Spatial Variables and Communication System in the editor
 * Developed by Fungai Taranhike
 */

class SpatialVariablesInitializer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.interface = null;
        this.system = null;
        this.init();
    }
    
    init() {
        console.log('🌐 Initializing Spatial Variables System...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeSpatialVariables();
            });
        } else {
            this.initializeSpatialVariables();
        }
    }
    
    initializeSpatialVariables() {
        try {
            // Initialize the spatial variables interface
            this.interface = new SpatialVariablesInterface();
            this.system = this.interface.getSystem();
            
            console.log('✅ Spatial Variables System Successfully Initialized');
            console.log('🌐 System: ' + this.system.getSystemName());
            console.log('👨‍💻 Creator: ' + this.system.getCreator());
            console.log('🔧 Version: ' + this.system.getVersion());
            
            // Add to global scope for debugging
            window.SpatialVariables = this.system;
            window.SpatialVariablesInterface = this.interface;
            
            // Display welcome message
            this.displayWelcomeMessage();
            
            // Start communication monitoring
            this.startCommunicationMonitoring();
            
        } catch (error) {
            console.error('❌ Failed to initialize Spatial Variables System:', error);
            this.displayErrorMessage(error.message);
        }
    }
    
    displayWelcomeMessage() {
        const welcomeMessage = `
            🌐 Spatial Variables and Communication System Active
            
            👨‍💻 Creator: ${this.system.getCreator()}
            🌐 System: ${this.system.getSystemName()}
            📊 Version: ${this.system.getVersion()}
            
            🚀 Features Available:
            • Spatial Variable Management
            • Spatial Communication Protocols
            • Quantum Spatial Variables
            • Consciousness Spatial Variables
            • Dimensional Spatial Variables
            • Network Management
            • Message Routing
            
            🎯 Ready for spatial variable operations and communication!
        `;
        
        console.log(welcomeMessage);
        
        // Update the result display with welcome message
        const resultElement = document.getElementById('var-result');
        if (resultElement) {
            resultElement.textContent = 'Spatial Variables System Active - Ready for variable operations and communication';
            resultElement.className = 'result-text success';
        }
    }
    
    displayErrorMessage(message) {
        console.error('❌ Spatial Variables Error:', message);
        
        const resultElement = document.getElementById('var-result');
        if (resultElement) {
            resultElement.textContent = `Spatial Variables Error: ${message}`;
            resultElement.className = 'result-text error';
        }
    }
    
    startCommunicationMonitoring() {
        // Start communication monitoring process
        setInterval(() => {
            if (this.system) {
                // Update communication status
                this.updateCommunicationStatus();
                
                // Monitor network activity
                this.monitorNetworkActivity();
                
                // Check for new messages
                this.checkForNewMessages();
            }
        }, 3000); // Every 3 seconds
        
        console.log('📡 Communication monitoring started');
    }
    
    updateCommunicationStatus() {
        if (!this.system) return;
        
        // Update connected nodes count
        const connectedNodes = document.getElementById('connected-nodes');
        if (connectedNodes && this.system.spatialNetworks) {
            connectedNodes.textContent = this.system.spatialNetworks.nodes.size;
        }
        
        // Update active protocols count
        const activeProtocols = document.getElementById('active-protocols');
        if (activeProtocols && this.system.spatialProtocols) {
            activeProtocols.textContent = this.system.spatialProtocols.activeProtocols.size;
        }
        
        // Update messages sent count
        const messagesSent = document.getElementById('messages-sent');
        if (messagesSent && this.system.spatialCommunication) {
            messagesSent.textContent = this.system.spatialCommunication.messages.size;
        }
        
        // Update messages received count
        const messagesReceived = document.getElementById('messages-received');
        if (messagesReceived && this.system.spatialCommunication) {
            messagesReceived.textContent = this.system.spatialCommunication.messages.size;
        }
    }
    
    monitorNetworkActivity() {
        if (!this.system || !this.system.spatialNetworks) return;
        
        const nodes = this.system.spatialNetworks.getAllNodes();
        const connections = this.system.spatialNetworks.getAllConnections();
        
        console.log('🌐 Network Status:', {
            nodes: nodes.length,
            connections: connections.length,
            topology: this.system.spatialNetworks.getTopology()
        });
    }
    
    checkForNewMessages() {
        if (!this.system || !this.system.spatialCommunication) return;
        
        const messages = Array.from(this.system.spatialCommunication.messages.values());
        const broadcasts = Array.from(this.system.spatialCommunication.broadcasts.values());
        
        if (messages.length > 0 || broadcasts.length > 0) {
            console.log('📡 Communication Activity:', {
                messages: messages.length,
                broadcasts: broadcasts.length
            });
        }
    }
    
    // Public API methods
    getSystem() {
        return this.system;
    }
    
    getInterface() {
        return this.interface;
    }
    
    // Create spatial variable
    createSpatialVariable(name, type, value) {
        if (!this.system) {
            throw new Error('Spatial Variables System not initialized');
        }
        
        return this.system.createSpatialVariable(name, type, value);
    }
    
    // Get spatial variable
    getSpatialVariable(name) {
        if (!this.system) {
            throw new Error('Spatial Variables System not initialized');
        }
        
        return this.system.getSpatialVariable(name);
    }
    
    // Send spatial message
    sendSpatialMessage(variable, destination, protocol = 'SPATIAL_SYNC') {
        if (!this.system) {
            throw new Error('Spatial Variables System not initialized');
        }
        
        return this.system.sendSpatialMessage(variable, destination, protocol);
    }
    
    // Get system status
    getSystemStatus() {
        if (!this.system) return null;
        
        return {
            creator: this.system.getCreator(),
            systemName: this.system.getSystemName(),
            version: this.system.getVersion(),
            variables: this.system.getSpatialVariables().size,
            types: this.system.getSpatialTypes(),
            operators: this.system.getSpatialOperators(),
            functions: this.system.getSpatialFunctions()
        };
    }
    
    // Cleanup
    destroy() {
        console.log('🌐 Destroying Spatial Variables Initializer...');
        
        if (this.interface) {
            this.interface.destroy();
        }
        
        // Remove from global scope
        delete window.SpatialVariables;
        delete window.SpatialVariablesInterface;
    }
}

// Initialize when script loads
const spatialVariablesInitializer = new SpatialVariablesInitializer();

// Make available globally
window.SpatialVariablesInitializer = spatialVariablesInitializer; 