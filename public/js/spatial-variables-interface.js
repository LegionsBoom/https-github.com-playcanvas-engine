/**
 * Spatial Variables Interface
 * UI and interaction components for spatial variables in the editor
 * Developed by Fungai Taranhike
 */

class SpatialVariablesInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.system = null;
        this.interface = null;
        this.variables = new Map();
        this.init();
    }
    
    init() {
        console.log('🌐 Initializing Spatial Variables Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.setupEventListeners();
        this.initializeSystem();
        
        console.log('✅ Spatial Variables Interface Active');
    }
    
    createInterface() {
        // Create spatial variables panel
        const panel = document.createElement('div');
        panel.className = 'spatial-variables-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3><i class="fas fa-globe"></i> Spatial Variables</h3>
                <div class="creator-signature">
                    <span>By Fungai Taranhike</span>
                </div>
            </div>
            
            <div class="spatial-variables-content">
                <!-- Variable Creation -->
                <div class="variable-section">
                    <h4>Create Spatial Variable</h4>
                    <div class="variable-creation">
                        <div class="input-group">
                            <label>Variable Name:</label>
                            <input type="text" id="var-name" placeholder="my_spatial_var">
                        </div>
                        <div class="input-group">
                            <label>Variable Type:</label>
                            <select id="var-type">
                                <option value="SPATIAL_SCALAR">Spatial Scalar</option>
                                <option value="SPATIAL_VECTOR">Spatial Vector</option>
                                <option value="SPATIAL_MATRIX">Spatial Matrix</option>
                                <option value="SPATIAL_TENSOR">Spatial Tensor</option>
                                <option value="QUANTUM_SPATIAL_STATE">Quantum Spatial State</option>
                                <option value="QUANTUM_SPATIAL_OPERATOR">Quantum Spatial Operator</option>
                                <option value="CONSCIOUSNESS_SPATIAL_STATE">Consciousness Spatial State</option>
                                <option value="CONSCIOUSNESS_SPATIAL_PATTERN">Consciousness Spatial Pattern</option>
                                <option value="DIMENSIONAL_SPATIAL_OBJECT">Dimensional Spatial Object</option>
                                <option value="DIMENSIONAL_SPATIAL_REALITY">Dimensional Spatial Reality</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Initial Value:</label>
                            <input type="text" id="var-value" placeholder="1.0">
                        </div>
                        <button class="create-btn" id="create-variable">
                            <i class="fas fa-plus"></i> Create Variable
                        </button>
                    </div>
                </div>
                
                <!-- Variable Management -->
                <div class="variable-section">
                    <h4>Variable Operations</h4>
                    <div class="variable-operations">
                        <div class="operation-group">
                            <button class="var-btn" data-operation="GET_VARIABLE">
                                <i class="fas fa-eye"></i> Get
                            </button>
                            <button class="var-btn" data-operation="SET_VARIABLE">
                                <i class="fas fa-edit"></i> Set
                            </button>
                            <button class="var-btn" data-operation="DELETE_VARIABLE">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                        <div class="operation-group">
                            <button class="var-btn" data-operation="LIST_VARIABLES">
                                <i class="fas fa-list"></i> List All
                            </button>
                            <button class="var-btn" data-operation="CLEAR_VARIABLES">
                                <i class="fas fa-broom"></i> Clear All
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Communication Operations -->
                <div class="variable-section">
                    <h4>Spatial Communication</h4>
                    <div class="communication-operations">
                        <div class="operation-group">
                            <button class="comm-btn" data-operation="SEND_MESSAGE">
                                <i class="fas fa-paper-plane"></i> Send
                            </button>
                            <button class="comm-btn" data-operation="RECEIVE_MESSAGE">
                                <i class="fas fa-download"></i> Receive
                            </button>
                            <button class="comm-btn" data-operation="BROADCAST_VARIABLE">
                                <i class="fas fa-broadcast-tower"></i> Broadcast
                            </button>
                        </div>
                        <div class="operation-group">
                            <button class="comm-btn" data-operation="CONNECT_NODE">
                                <i class="fas fa-plug"></i> Connect
                            </button>
                            <button class="comm-btn" data-operation="DISCONNECT_NODE">
                                <i class="fas fa-unplug"></i> Disconnect
                            </button>
                            <button class="comm-btn" data-operation="ROUTE_DATA">
                                <i class="fas fa-route"></i> Route
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Quantum Operations -->
                <div class="variable-section">
                    <h4>Quantum Operations</h4>
                    <div class="quantum-operations">
                        <div class="operation-group">
                            <button class="quantum-btn" data-operation="QUANTUM_SUPERPOSE">
                                <i class="fas fa-atom"></i> Superpose
                            </button>
                            <button class="quantum-btn" data-operation="QUANTUM_ENTANGLE">
                                <i class="fas fa-link"></i> Entangle
                            </button>
                            <button class="quantum-btn" data-operation="QUANTUM_MEASURE">
                                <i class="fas fa-eye"></i> Measure
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Consciousness Operations -->
                <div class="variable-section">
                    <h4>Consciousness Operations</h4>
                    <div class="consciousness-operations">
                        <div class="operation-group">
                            <button class="consciousness-btn" data-operation="CONSCIOUSNESS_PERCEIVE">
                                <i class="fas fa-brain"></i> Perceive
                            </button>
                            <button class="consciousness-btn" data-operation="CONSCIOUSNESS_INTERPRET">
                                <i class="fas fa-lightbulb"></i> Interpret
                            </button>
                            <button class="consciousness-btn" data-operation="CONSCIOUSNESS_CREATE">
                                <i class="fas fa-magic"></i> Create
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Dimensional Operations -->
                <div class="variable-section">
                    <h4>Dimensional Operations</h4>
                    <div class="dimensional-operations">
                        <div class="operation-group">
                            <button class="dimensional-btn" data-operation="DIMENSIONAL_NAVIGATE">
                                <i class="fas fa-compass"></i> Navigate
                            </button>
                            <button class="dimensional-btn" data-operation="DIMENSIONAL_CREATE">
                                <i class="fas fa-cube"></i> Create
                            </button>
                            <button class="dimensional-btn" data-operation="DIMENSIONAL_DESTROY">
                                <i class="fas fa-bomb"></i> Destroy
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Variable Display -->
                <div class="variable-section">
                    <h4>Variable Display</h4>
                    <div class="variable-display">
                        <div id="variable-list" class="variable-list">
                            <div class="no-variables">No variables created yet</div>
                        </div>
                    </div>
                </div>
                
                <!-- Communication Status -->
                <div class="variable-section">
                    <h4>Communication Status</h4>
                    <div class="communication-status">
                        <div class="status-item">
                            <span class="status-label">Connected Nodes:</span>
                            <span class="status-value" id="connected-nodes">0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Active Protocols:</span>
                            <span class="status-value" id="active-protocols">0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Messages Sent:</span>
                            <span class="status-value" id="messages-sent">0</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Messages Received:</span>
                            <span class="status-value" id="messages-received">0</span>
                        </div>
                    </div>
                </div>
                
                <!-- Results Display -->
                <div class="variable-section">
                    <h4>Results</h4>
                    <div class="results-display">
                        <div id="var-result" class="result-text">Ready for spatial variable operations...</div>
                        <div id="var-visualization" class="visualization-container"></div>
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
        // Variable creation
        const createBtn = document.getElementById('create-variable');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createVariable();
            });
        }
        
        // Variable operations
        const varButtons = document.querySelectorAll('.var-btn');
        varButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const operation = e.target.closest('.var-btn').dataset.operation;
                this.executeVariableOperation(operation);
            });
        });
        
        // Communication operations
        const commButtons = document.querySelectorAll('.comm-btn');
        commButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const operation = e.target.closest('.comm-btn').dataset.operation;
                this.executeCommunicationOperation(operation);
            });
        });
        
        // Quantum operations
        const quantumButtons = document.querySelectorAll('.quantum-btn');
        quantumButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const operation = e.target.closest('.quantum-btn').dataset.operation;
                this.executeQuantumOperation(operation);
            });
        });
        
        // Consciousness operations
        const consciousnessButtons = document.querySelectorAll('.consciousness-btn');
        consciousnessButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const operation = e.target.closest('.consciousness-btn').dataset.operation;
                this.executeConsciousnessOperation(operation);
            });
        });
        
        // Dimensional operations
        const dimensionalButtons = document.querySelectorAll('.dimensional-btn');
        dimensionalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const operation = e.target.closest('.dimensional-btn').dataset.operation;
                this.executeDimensionalOperation(operation);
            });
        });
    }
    
    initializeSystem() {
        // Initialize spatial variables system
        this.system = new SpatialVariablesSystem();
        
        // Update status display
        this.updateStatus();
        
        console.log('🌐 Spatial Variables System initialized');
    }
    
    createVariable() {
        const name = document.getElementById('var-name').value;
        const type = document.getElementById('var-type').value;
        const value = document.getElementById('var-value').value;
        
        if (!name || !type || !value) {
            this.displayError('Please fill in all fields');
            return;
        }
        
        try {
            const variable = this.system.createSpatialVariable(name, type, value);
            this.variables.set(name, variable);
            
            this.displayResult('Variable created successfully', variable);
            this.updateVariableList();
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    executeVariableOperation(operation) {
        const varName = prompt('Enter variable name:');
        if (!varName) return;
        
        try {
            let result;
            
            switch (operation) {
                case 'GET_VARIABLE':
                    result = this.system.getSpatialVariable(varName);
                    break;
                case 'SET_VARIABLE':
                    const newValue = prompt('Enter new value:');
                    result = this.system.setSpatialVariable(varName, newValue);
                    break;
                case 'DELETE_VARIABLE':
                    result = this.system.deleteSpatialVariable(varName);
                    this.variables.delete(varName);
                    break;
                case 'LIST_VARIABLES':
                    result = Array.from(this.system.getSpatialVariables().entries());
                    break;
                case 'CLEAR_VARIABLES':
                    this.system.getSpatialVariables().clear();
                    this.variables.clear();
                    result = 'All variables cleared';
                    break;
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }
            
            this.displayResult(`${operation} completed`, result);
            this.updateVariableList();
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    executeCommunicationOperation(operation) {
        try {
            let result;
            
            switch (operation) {
                case 'SEND_MESSAGE':
                    const varName = prompt('Enter variable name to send:');
                    const destination = prompt('Enter destination:');
                    if (varName && destination) {
                        const variable = this.system.getSpatialVariable(varName);
                        result = this.system.sendSpatialMessage(variable, destination);
                    }
                    break;
                case 'RECEIVE_MESSAGE':
                    const source = prompt('Enter source:');
                    if (source) {
                        result = this.system.receiveSpatialMessage(source);
                    }
                    break;
                case 'BROADCAST_VARIABLE':
                    const broadcastVar = prompt('Enter variable name to broadcast:');
                    if (broadcastVar) {
                        const variable = this.system.getSpatialVariable(broadcastVar);
                        result = this.system.broadcastSpatialVariable(variable);
                    }
                    break;
                case 'CONNECT_NODE':
                    const nodeName = prompt('Enter node name:');
                    if (nodeName) {
                        const node = { name: nodeName, protocol: 'SPATIAL_SYNC' };
                        result = this.system.connectSpatialNode(node);
                    }
                    break;
                case 'DISCONNECT_NODE':
                    const disconnectNode = prompt('Enter node name to disconnect:');
                    if (disconnectNode) {
                        const node = { name: disconnectNode };
                        result = this.system.disconnectSpatialNode(node);
                    }
                    break;
                case 'ROUTE_DATA':
                    const data = prompt('Enter data to route:');
                    const routeDest = prompt('Enter destination:');
                    if (data && routeDest) {
                        result = this.system.routeSpatialData({ id: data, content: data }, routeDest);
                    }
                    break;
                default:
                    throw new Error(`Unknown communication operation: ${operation}`);
            }
            
            this.displayResult(`${operation} completed`, result);
            this.updateStatus();
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    executeQuantumOperation(operation) {
        try {
            let result;
            
            switch (operation) {
                case 'QUANTUM_SUPERPOSE':
                    const states = prompt('Enter states (comma-separated):').split(',');
                    result = this.system.spatialQuantumVariables.superpose(states);
                    break;
                case 'QUANTUM_ENTANGLE':
                    const vars = prompt('Enter variables to entangle (comma-separated):').split(',');
                    result = this.system.spatialQuantumVariables.entangle(vars);
                    break;
                case 'QUANTUM_MEASURE':
                    const measureVar = prompt('Enter variable to measure:');
                    if (measureVar) {
                        const variable = { name: measureVar };
                        result = this.system.spatialQuantumVariables.measure(variable);
                    }
                    break;
                default:
                    throw new Error(`Unknown quantum operation: ${operation}`);
            }
            
            this.displayResult(`${operation} completed`, result);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    executeConsciousnessOperation(operation) {
        try {
            let result;
            
            switch (operation) {
                case 'CONSCIOUSNESS_PERCEIVE':
                    const perceiveVar = prompt('Enter variable to perceive:');
                    if (perceiveVar) {
                        const variable = { name: perceiveVar };
                        result = this.system.spatialConsciousnessVariables.perceive(variable);
                    }
                    break;
                case 'CONSCIOUSNESS_INTERPRET':
                    const interpretVar = prompt('Enter variable to interpret:');
                    if (interpretVar) {
                        const variable = { name: interpretVar };
                        result = this.system.spatialConsciousnessVariables.interpret(variable);
                    }
                    break;
                case 'CONSCIOUSNESS_CREATE':
                    const concept = prompt('Enter concept to create:');
                    if (concept) {
                        result = this.system.spatialConsciousnessVariables.create(concept);
                    }
                    break;
                default:
                    throw new Error(`Unknown consciousness operation: ${operation}`);
            }
            
            this.displayResult(`${operation} completed`, result);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    executeDimensionalOperation(operation) {
        try {
            let result;
            
            switch (operation) {
                case 'DIMENSIONAL_NAVIGATE':
                    const navVar = prompt('Enter variable to navigate:');
                    const destination = prompt('Enter destination:');
                    if (navVar && destination) {
                        const variable = { name: navVar };
                        result = this.system.spatialDimensionalVariables.navigate(variable, destination);
                    }
                    break;
                case 'DIMENSIONAL_CREATE':
                    const dimensions = parseInt(prompt('Enter number of dimensions:'));
                    if (dimensions) {
                        result = this.system.spatialDimensionalVariables.create(dimensions);
                    }
                    break;
                case 'DIMENSIONAL_DESTROY':
                    const destroyDim = prompt('Enter dimension to destroy:');
                    if (destroyDim) {
                        result = this.system.spatialDimensionalVariables.destroy(destroyDim);
                    }
                    break;
                default:
                    throw new Error(`Unknown dimensional operation: ${operation}`);
            }
            
            this.displayResult(`${operation} completed`, result);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }
    
    displayResult(operation, result) {
        const resultElement = document.getElementById('var-result');
        
        let displayText = '';
        
        if (typeof result === 'string') {
            displayText = `${operation}: ${result}`;
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
        const resultElement = document.getElementById('var-result');
        resultElement.textContent = `Error: ${errorMessage}`;
        resultElement.className = 'result-text error';
    }
    
    updateVariableList() {
        const listElement = document.getElementById('variable-list');
        
        if (this.variables.size === 0) {
            listElement.innerHTML = '<div class="no-variables">No variables created yet</div>';
            return;
        }
        
        let html = '';
        this.variables.forEach((variable, name) => {
            html += `
                <div class="variable-item">
                    <div class="variable-name">${name}</div>
                    <div class="variable-type">${variable.type}</div>
                    <div class="variable-value">${variable.value}</div>
                    <div class="variable-actions">
                        <button class="action-btn" onclick="this.getVariable('${name}')">Get</button>
                        <button class="action-btn" onclick="this.deleteVariable('${name}')">Delete</button>
                    </div>
                </div>
            `;
        });
        
        listElement.innerHTML = html;
    }
    
    updateStatus() {
        if (!this.system) return;
        
        // Update communication status
        const connectedNodes = document.getElementById('connected-nodes');
        const activeProtocols = document.getElementById('active-protocols');
        const messagesSent = document.getElementById('messages-sent');
        const messagesReceived = document.getElementById('messages-received');
        
        if (connectedNodes) connectedNodes.textContent = this.system.spatialNetworks.nodes.size;
        if (activeProtocols) activeProtocols.textContent = this.system.spatialProtocols.activeProtocols.size;
        if (messagesSent) messagesSent.textContent = this.system.spatialCommunication.messages.size;
        if (messagesReceived) messagesReceived.textContent = this.system.spatialCommunication.messages.size;
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
        console.log('🌐 Destroying Spatial Variables Interface...');
        
        if (this.interface) {
            this.interface.remove();
        }
        
        if (this.system) {
            this.system.destroy();
        }
    }
}

// Initialize Spatial Variables Interface
window.SpatialVariablesInterface = SpatialVariablesInterface; 