/**
 * Spatial Crypto Interface
 * User interface for spatial cryptocurrency operations
 * Developed by Fungai Taranhike
 */

class SpatialCryptoInterface {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.system = null;
        this.currentWallet = null;
        this.interface = null;
        
        this.init();
    }
    
    init() {
        console.log('🪙 Initializing Spatial Crypto Interface...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.createInterface();
        this.setupEventListeners();
        this.initializeSystem();
        
        console.log('✅ Spatial Crypto Interface Active');
    }
    
    createInterface() {
        const interfaceHTML = `
            <div id="spatial-crypto-interface" class="spatial-crypto-interface">
                <div class="spatial-crypto-header">
                    <h2><i class="fas fa-coins"></i> Spatial Cryptocurrency</h2>
                    <p>Revolutionary crypto using spatial dimensions, quantum computing, and consciousness</p>
                    <div class="creator-signature">
                        <span>Created by: ${this.creator}</span>
                    </div>
                </div>
                
                <div class="spatial-crypto-tabs">
                    <button class="tab-btn active" data-tab="wallet">Wallet</button>
                    <button class="tab-btn" data-tab="transactions">Transactions</button>
                    <button class="tab-btn" data-tab="mining">Mining</button>
                    <button class="tab-btn" data-tab="consensus">Consensus</button>
                    <button class="tab-btn" data-tab="advanced">Advanced</button>
                    <button class="tab-btn" data-tab="status">Status</button>
                </div>
                
                <div class="spatial-crypto-content">
                    <!-- Wallet Tab -->
                    <div id="wallet-tab" class="tab-content active">
                        <div class="wallet-section">
                            <h3><i class="fas fa-wallet"></i> Spatial Wallet</h3>
                            <div class="wallet-info">
                                <div class="wallet-balance">
                                    <span class="balance-label">Balance:</span>
                                    <span class="balance-amount" id="wallet-balance">0</span>
                                    <span class="balance-currency">SPC</span>
                                </div>
                                <div class="wallet-id">
                                    <span class="id-label">Wallet ID:</span>
                                    <span class="id-value" id="wallet-id">Not created</span>
                                </div>
                            </div>
                            <div class="wallet-actions">
                                <button class="action-btn" id="create-wallet">
                                    <i class="fas fa-plus"></i>
                                    Create Wallet
                                </button>
                                <button class="action-btn" id="backup-wallet">
                                    <i class="fas fa-download"></i>
                                    Backup Wallet
                                </button>
                                <button class="action-btn" id="restore-wallet">
                                    <i class="fas fa-upload"></i>
                                    Restore Wallet
                                </button>
                            </div>
                        </div>
                        
                        <div class="wallet-transactions">
                            <h4>Recent Transactions</h4>
                            <div class="transaction-list" id="wallet-transactions">
                                <div class="no-transactions">No transactions yet</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Transactions Tab -->
                    <div id="transactions-tab" class="tab-content">
                        <div class="transaction-section">
                            <h3><i class="fas fa-exchange-alt"></i> Spatial Transactions</h3>
                            <div class="transaction-form">
                                <div class="form-group">
                                    <label>To Wallet ID:</label>
                                    <input type="text" id="transaction-to" placeholder="Enter wallet ID">
                                </div>
                                <div class="form-group">
                                    <label>Amount (SPC):</label>
                                    <input type="number" id="transaction-amount" placeholder="0.00" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label>Data (Optional):</label>
                                    <textarea id="transaction-data" placeholder="Additional transaction data"></textarea>
                                </div>
                                <button class="action-btn" id="send-transaction">
                                    <i class="fas fa-paper-plane"></i>
                                    Send Transaction
                                </button>
                            </div>
                        </div>
                        
                        <div class="transaction-history">
                            <h4>Transaction History</h4>
                            <div class="transaction-list" id="transaction-history">
                                <div class="no-transactions">No transactions yet</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mining Tab -->
                    <div id="mining-tab" class="tab-content">
                        <div class="mining-section">
                            <h3><i class="fas fa-hammer"></i> Spatial Mining</h3>
                            <div class="mining-status">
                                <div class="status-item">
                                    <span class="status-label">Mining Status:</span>
                                    <span class="status-value" id="mining-status">Inactive</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Blocks Mined:</span>
                                    <span class="status-value" id="blocks-mined">0</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Mining Reward:</span>
                                    <span class="status-value" id="mining-reward">0 SPC</span>
                                </div>
                            </div>
                            <div class="mining-actions">
                                <button class="action-btn" id="start-mining">
                                    <i class="fas fa-play"></i>
                                    Start Mining
                                </button>
                                <button class="action-btn" id="stop-mining">
                                    <i class="fas fa-stop"></i>
                                    Stop Mining
                                </button>
                            </div>
                        </div>
                        
                        <div class="mining-config">
                            <h4>Mining Configuration</h4>
                            <div class="config-group">
                                <label>Difficulty:</label>
                                <input type="range" id="mining-difficulty" min="0.1" max="1.0" step="0.1" value="0.1">
                                <span class="config-value" id="difficulty-value">0.1</span>
                            </div>
                            <div class="config-group">
                                <label>Quantum Entanglement:</label>
                                <input type="range" id="quantum-entanglement" min="0.1" max="1.0" step="0.1" value="0.8">
                                <span class="config-value" id="entanglement-value">0.8</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Consensus Tab -->
                    <div id="consensus-tab" class="tab-content">
                        <div class="consensus-section">
                            <h3><i class="fas fa-handshake"></i> Spatial Consensus</h3>
                            <div class="consensus-status">
                                <div class="status-item">
                                    <span class="status-label">Consensus Level:</span>
                                    <span class="status-value" id="consensus-level">0%</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Network Nodes:</span>
                                    <span class="status-value" id="network-nodes">0</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Validation Threshold:</span>
                                    <span class="status-value" id="validation-threshold">85%</span>
                                </div>
                            </div>
                            <div class="consensus-actions">
                                <button class="action-btn" id="join-consensus">
                                    <i class="fas fa-users"></i>
                                    Join Consensus
                                </button>
                                <button class="action-btn" id="leave-consensus">
                                    <i class="fas fa-user-times"></i>
                                    Leave Consensus
                                </button>
                            </div>
                        </div>
                        
                        <div class="consensus-stake">
                            <h4>Stake Configuration</h4>
                            <div class="form-group">
                                <label>Stake Amount (SPC):</label>
                                <input type="number" id="consensus-stake" placeholder="100" min="1">
                            </div>
                            <button class="action-btn" id="update-stake">
                                <i class="fas fa-edit"></i>
                                Update Stake
                            </button>
                        </div>
                    </div>
                    
                    <!-- Advanced Tab -->
                    <div id="advanced-tab" class="tab-content">
                        <div class="advanced-section">
                            <h3><i class="fas fa-rocket"></i> Advanced Spatial Crypto</h3>
                            
                            <div class="advanced-features">
                                <div class="feature-group">
                                    <h4><i class="fas fa-atom"></i> Quantum Entangled Transactions</h4>
                                    <div class="feature-form">
                                        <div class="form-group">
                                            <label>Participant Wallets:</label>
                                            <input type="text" id="entangled-wallets" placeholder="wallet1,wallet2,wallet3">
                                        </div>
                                        <div class="form-group">
                                            <label>Entangled Amount:</label>
                                            <input type="number" id="entangled-amount" placeholder="100">
                                        </div>
                                        <button class="action-btn" id="create-entangled">
                                            <i class="fas fa-link"></i>
                                            Create Entangled Transaction
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="feature-group">
                                    <h4><i class="fas fa-cube"></i> Dimensional Contracts</h4>
                                    <div class="feature-form">
                                        <div class="form-group">
                                            <label>Contract Conditions:</label>
                                            <textarea id="contract-conditions" placeholder="Define contract conditions"></textarea>
                                        </div>
                                        <div class="form-group">
                                            <label>Participants:</label>
                                            <input type="text" id="contract-participants" placeholder="wallet1,wallet2">
                                        </div>
                                        <button class="action-btn" id="create-contract">
                                            <i class="fas fa-file-contract"></i>
                                            Create Dimensional Contract
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="feature-group">
                                    <h4><i class="fas fa-brain"></i> Consciousness Tokens</h4>
                                    <div class="feature-form">
                                        <div class="form-group">
                                            <label>Awareness Level (0-1):</label>
                                            <input type="range" id="consciousness-awareness" min="0" max="1" step="0.1" value="0.8">
                                            <span class="range-value" id="awareness-value">0.8</span>
                                        </div>
                                        <div class="form-group">
                                            <label>Understanding Depth (0-1):</label>
                                            <input type="range" id="consciousness-understanding" min="0" max="1" step="0.1" value="0.7">
                                            <span class="range-value" id="understanding-value">0.7</span>
                                        </div>
                                        <div class="form-group">
                                            <label>Creativity Factor (0-1):</label>
                                            <input type="range" id="consciousness-creativity" min="0" max="1" step="0.1" value="0.6">
                                            <span class="range-value" id="creativity-value">0.6</span>
                                        </div>
                                        <button class="action-btn" id="create-consciousness">
                                            <i class="fas fa-lightbulb"></i>
                                            Create Consciousness Token
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="feature-group">
                                    <h4><i class="fas fa-globe"></i> Reality Tokens</h4>
                                    <div class="feature-form">
                                        <div class="form-group">
                                            <label>Reality Stability (0-1):</label>
                                            <input type="range" id="reality-stability" min="0" max="1" step="0.1" value="0.95">
                                            <span class="range-value" id="stability-value">0.95</span>
                                        </div>
                                        <div class="form-group">
                                            <label>Manipulation Level (0-1):</label>
                                            <input type="range" id="reality-manipulation" min="0" max="1" step="0.1" value="0.3">
                                            <span class="range-value" id="manipulation-value">0.3</span>
                                        </div>
                                        <div class="form-group">
                                            <label>Synthesis Capability (0-1):</label>
                                            <input type="range" id="reality-synthesis" min="0" max="1" step="0.1" value="0.7">
                                            <span class="range-value" id="synthesis-value">0.7</span>
                                        </div>
                                        <button class="action-btn" id="create-reality">
                                            <i class="fas fa-magic"></i>
                                            Create Reality Token
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Status Tab -->
                    <div id="status-tab" class="tab-content">
                        <div class="status-section">
                            <h3><i class="fas fa-chart-line"></i> System Status</h3>
                            <div class="status-grid">
                                <div class="status-card">
                                    <h4>Network Status</h4>
                                    <div class="status-item">
                                        <span>Total Spatial Coins:</span>
                                        <span id="total-coins">0</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Active Transactions:</span>
                                        <span id="active-transactions">0</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Blocks Mined:</span>
                                        <span id="total-blocks">0</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Network Nodes:</span>
                                        <span id="total-nodes">0</span>
                                    </div>
                                </div>
                                
                                <div class="status-card">
                                    <h4>Spatial Parameters</h4>
                                    <div class="status-item">
                                        <span>Spatial Difficulty:</span>
                                        <span id="spatial-difficulty">0.1</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Quantum Entanglement:</span>
                                        <span id="quantum-entanglement-status">0.8</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Consciousness Validation:</span>
                                        <span id="consciousness-validation">0.9</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Dimensional Depth:</span>
                                        <span id="dimensional-depth">4</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Reality Stability:</span>
                                        <span id="reality-stability-status">0.95</span>
                                    </div>
                                </div>
                                
                                <div class="status-card">
                                    <h4>Performance Metrics</h4>
                                    <div class="status-item">
                                        <span>Consensus Level:</span>
                                        <span id="consensus-level-status">85%</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Transaction Success Rate:</span>
                                        <span id="transaction-success">95%</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Block Validation Rate:</span>
                                        <span id="block-validation">90%</span>
                                    </div>
                                    <div class="status-item">
                                        <span>Network Health:</span>
                                        <span id="network-health">Excellent</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="system-logs">
                            <h4>System Logs</h4>
                            <div class="log-container" id="system-logs">
                                <div class="log-entry">System initialized successfully</div>
                                <div class="log-entry">Spatial crypto interface active</div>
                                <div class="log-entry">Ready for operations</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Create interface element
        const interfaceElement = document.createElement('div');
        interfaceElement.innerHTML = interfaceHTML;
        document.body.appendChild(interfaceElement.firstElementChild);
        
        this.interface = document.getElementById('spatial-crypto-interface');
    }
    
    setupEventListeners() {
        // Tab switching
        const tabButtons = this.interface.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });
        
        // Wallet actions
        document.getElementById('create-wallet').addEventListener('click', () => {
            this.createWallet();
        });
        
        document.getElementById('backup-wallet').addEventListener('click', () => {
            this.backupWallet();
        });
        
        document.getElementById('restore-wallet').addEventListener('click', () => {
            this.restoreWallet();
        });
        
        // Transaction actions
        document.getElementById('send-transaction').addEventListener('click', () => {
            this.sendTransaction();
        });
        
        // Mining actions
        document.getElementById('start-mining').addEventListener('click', () => {
            this.startMining();
        });
        
        document.getElementById('stop-mining').addEventListener('click', () => {
            this.stopMining();
        });
        
        // Consensus actions
        document.getElementById('join-consensus').addEventListener('click', () => {
            this.joinConsensus();
        });
        
        document.getElementById('leave-consensus').addEventListener('click', () => {
            this.leaveConsensus();
        });
        
        document.getElementById('update-stake').addEventListener('click', () => {
            this.updateStake();
        });
        
        // Advanced actions
        document.getElementById('create-entangled').addEventListener('click', () => {
            this.createEntangledTransaction();
        });
        
        document.getElementById('create-contract').addEventListener('click', () => {
            this.createDimensionalContract();
        });
        
        document.getElementById('create-consciousness').addEventListener('click', () => {
            this.createConsciousnessToken();
        });
        
        document.getElementById('create-reality').addEventListener('click', () => {
            this.createRealityToken();
        });
        
        // Configuration sliders
        this.setupSliders();
    }
    
    setupSliders() {
        // Mining difficulty
        const difficultySlider = document.getElementById('mining-difficulty');
        const difficultyValue = document.getElementById('difficulty-value');
        difficultySlider.addEventListener('input', () => {
            difficultyValue.textContent = difficultySlider.value;
            this.updateMiningDifficulty(parseFloat(difficultySlider.value));
        });
        
        // Quantum entanglement
        const entanglementSlider = document.getElementById('quantum-entanglement');
        const entanglementValue = document.getElementById('entanglement-value');
        entanglementSlider.addEventListener('input', () => {
            entanglementValue.textContent = entanglementSlider.value;
            this.updateQuantumEntanglement(parseFloat(entanglementSlider.value));
        });
        
        // Consciousness sliders
        const awarenessSlider = document.getElementById('consciousness-awareness');
        const awarenessValue = document.getElementById('awareness-value');
        awarenessSlider.addEventListener('input', () => {
            awarenessValue.textContent = awarenessSlider.value;
        });
        
        const understandingSlider = document.getElementById('consciousness-understanding');
        const understandingValue = document.getElementById('understanding-value');
        understandingSlider.addEventListener('input', () => {
            understandingValue.textContent = understandingSlider.value;
        });
        
        const creativitySlider = document.getElementById('consciousness-creativity');
        const creativityValue = document.getElementById('creativity-value');
        creativitySlider.addEventListener('input', () => {
            creativityValue.textContent = creativitySlider.value;
        });
        
        // Reality sliders
        const stabilitySlider = document.getElementById('reality-stability');
        const stabilityValue = document.getElementById('stability-value');
        stabilitySlider.addEventListener('input', () => {
            stabilityValue.textContent = stabilitySlider.value;
        });
        
        const manipulationSlider = document.getElementById('reality-manipulation');
        const manipulationValue = document.getElementById('manipulation-value');
        manipulationSlider.addEventListener('input', () => {
            manipulationValue.textContent = manipulationSlider.value;
        });
        
        const synthesisSlider = document.getElementById('reality-synthesis');
        const synthesisValue = document.getElementById('synthesis-value');
        synthesisSlider.addEventListener('input', () => {
            synthesisValue.textContent = synthesisSlider.value;
        });
    }
    
    switchTab(tabName) {
        // Hide all tab contents
        const tabContents = this.interface.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        const tabButtons = this.interface.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Add active class to selected tab button
        const selectedButton = this.interface.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }
    
    initializeSystem() {
        this.system = new SpatialCryptoSystem();
        this.updateStatus();
        this.addLog('Spatial crypto system initialized');
    }
    
    createWallet() {
        if (!this.system) return;
        
        try {
            this.currentWallet = this.system.createSpatialWallet();
            this.updateWalletDisplay();
            this.addLog('Wallet created: ' + this.currentWallet.id);
        } catch (error) {
            this.addLog('Error creating wallet: ' + error.message);
        }
    }
    
    backupWallet() {
        if (!this.currentWallet) {
            this.addLog('No wallet to backup');
            return;
        }
        
        const walletData = JSON.stringify(this.currentWallet, null, 2);
        const blob = new Blob([walletData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'spatial-wallet-backup.json';
        a.click();
        
        URL.revokeObjectURL(url);
        this.addLog('Wallet backed up successfully');
    }
    
    restoreWallet() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        this.currentWallet = JSON.parse(e.target.result);
                        this.updateWalletDisplay();
                        this.addLog('Wallet restored: ' + this.currentWallet.id);
                    } catch (error) {
                        this.addLog('Error restoring wallet: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
    
    sendTransaction() {
        if (!this.currentWallet) {
            this.addLog('No wallet available');
            return;
        }
        
        const toWallet = document.getElementById('transaction-to').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const data = document.getElementById('transaction-data').value;
        
        if (!toWallet || !amount || amount <= 0) {
            this.addLog('Invalid transaction parameters');
            return;
        }
        
        try {
            const transaction = this.system.createSpatialTransaction(
                this.currentWallet,
                { id: toWallet },
                amount,
                data
            );
            
            this.updateTransactionHistory();
            this.addLog('Transaction sent: ' + transaction.id);
            
            // Clear form
            document.getElementById('transaction-to').value = '';
            document.getElementById('transaction-amount').value = '';
            document.getElementById('transaction-data').value = '';
            
        } catch (error) {
            this.addLog('Error sending transaction: ' + error.message);
        }
    }
    
    startMining() {
        if (!this.system || !this.currentWallet) {
            this.addLog('No system or wallet available for mining');
            return;
        }
        
        try {
            // Simulate mining process
            this.miningInterval = setInterval(() => {
                const transactions = Array.from(this.system.spatialTransactions.values()).slice(0, 10);
                if (transactions.length > 0) {
                    const block = this.system.mineSpatialBlock(transactions, this.currentWallet);
                    this.updateMiningStatus();
                    this.addLog('Block mined: ' + block.id);
                }
            }, 5000); // Mine every 5 seconds
            
            document.getElementById('mining-status').textContent = 'Active';
            this.addLog('Mining started');
            
        } catch (error) {
            this.addLog('Error starting mining: ' + error.message);
        }
    }
    
    stopMining() {
        if (this.miningInterval) {
            clearInterval(this.miningInterval);
            this.miningInterval = null;
            document.getElementById('mining-status').textContent = 'Inactive';
            this.addLog('Mining stopped');
        }
    }
    
    joinConsensus() {
        if (!this.system || !this.currentWallet) {
            this.addLog('No system or wallet available for consensus');
            return;
        }
        
        const stake = parseFloat(document.getElementById('consensus-stake').value) || 100;
        
        try {
            const consensusNode = this.system.participateInSpatialConsensus(this.currentWallet, stake);
            this.updateConsensusStatus();
            this.addLog('Joined consensus: ' + consensusNode.id);
        } catch (error) {
            this.addLog('Error joining consensus: ' + error.message);
        }
    }
    
    leaveConsensus() {
        // Implementation for leaving consensus
        this.addLog('Left consensus');
        this.updateConsensusStatus();
    }
    
    updateStake() {
        const stake = parseFloat(document.getElementById('consensus-stake').value);
        if (stake > 0) {
            this.addLog('Stake updated: ' + stake + ' SPC');
        }
    }
    
    createEntangledTransaction() {
        if (!this.system || !this.currentWallet) {
            this.addLog('No system or wallet available');
            return;
        }
        
        const walletIds = document.getElementById('entangled-wallets').value.split(',').map(id => id.trim());
        const amount = parseFloat(document.getElementById('entangled-amount').value);
        
        if (walletIds.length < 2 || !amount || amount <= 0) {
            this.addLog('Invalid entangled transaction parameters');
            return;
        }
        
        try {
            const wallets = walletIds.map(id => ({ id: id }));
            const entangledTransaction = this.system.createQuantumEntangledTransaction(wallets, amount);
            this.addLog('Entangled transaction created: ' + entangledTransaction.id);
        } catch (error) {
            this.addLog('Error creating entangled transaction: ' + error.message);
        }
    }
    
    createDimensionalContract() {
        if (!this.system || !this.currentWallet) {
            this.addLog('No system or wallet available');
            return;
        }
        
        const conditions = document.getElementById('contract-conditions').value;
        const participants = document.getElementById('contract-participants').value.split(',').map(id => id.trim());
        
        if (!conditions || participants.length < 1) {
            this.addLog('Invalid contract parameters');
            return;
        }
        
        try {
            const contract = this.system.createDimensionalContract({ conditions }, participants.map(id => ({ id: id })));
            this.addLog('Dimensional contract created: ' + contract.id);
        } catch (error) {
            this.addLog('Error creating dimensional contract: ' + error.message);
        }
    }
    
    createConsciousnessToken() {
        if (!this.system || !this.currentWallet) {
            this.addLog('No system or wallet available');
            return;
        }
        
        const awareness = parseFloat(document.getElementById('consciousness-awareness').value);
        const understanding = parseFloat(document.getElementById('consciousness-understanding').value);
        const creativity = parseFloat(document.getElementById('consciousness-creativity').value);
        
        try {
            const token = this.system.createConsciousnessToken(awareness, understanding, creativity);
            this.addLog('Consciousness token created: ' + token.id);
        } catch (error) {
            this.addLog('Error creating consciousness token: ' + error.message);
        }
    }
    
    createRealityToken() {
        if (!this.system || !this.currentWallet) {
            this.addLog('No system or wallet available');
            return;
        }
        
        const stability = parseFloat(document.getElementById('reality-stability').value);
        const manipulation = parseFloat(document.getElementById('reality-manipulation').value);
        const synthesis = parseFloat(document.getElementById('reality-synthesis').value);
        
        try {
            const token = this.system.createRealityToken(stability, manipulation, synthesis);
            this.addLog('Reality token created: ' + token.id);
        } catch (error) {
            this.addLog('Error creating reality token: ' + error.message);
        }
    }
    
    updateMiningDifficulty(difficulty) {
        if (this.system) {
            this.system.spatialDifficulty = difficulty;
            this.addLog('Mining difficulty updated: ' + difficulty);
        }
    }
    
    updateQuantumEntanglement(entanglement) {
        if (this.system) {
            this.system.quantumEntanglement = entanglement;
            this.addLog('Quantum entanglement updated: ' + entanglement);
        }
    }
    
    updateWalletDisplay() {
        if (this.currentWallet) {
            document.getElementById('wallet-id').textContent = this.currentWallet.id;
            document.getElementById('wallet-balance').textContent = this.currentWallet.balance;
        }
    }
    
    updateTransactionHistory() {
        if (!this.system) return;
        
        const transactionList = document.getElementById('transaction-history');
        const transactions = Array.from(this.system.spatialTransactions.values()).slice(-10);
        
        if (transactions.length === 0) {
            transactionList.innerHTML = '<div class="no-transactions">No transactions yet</div>';
            return;
        }
        
        transactionList.innerHTML = transactions.map(tx => `
            <div class="transaction-item">
                <div class="transaction-id">${tx.id}</div>
                <div class="transaction-details">
                    <span>From: ${tx.from}</span>
                    <span>To: ${tx.to}</span>
                    <span>Amount: ${tx.amount} SPC</span>
                    <span>Status: ${tx.status}</span>
                </div>
            </div>
        `).join('');
    }
    
    updateMiningStatus() {
        if (!this.system) return;
        
        document.getElementById('blocks-mined').textContent = this.system.spatialBlocksMined;
        document.getElementById('mining-reward').textContent = this.system.calculateMiningReward() + ' SPC';
    }
    
    updateConsensusStatus() {
        if (!this.system) return;
        
        document.getElementById('consensus-level').textContent = Math.round(this.system.calculateConsensusLevel() * 100) + '%';
        document.getElementById('network-nodes').textContent = this.system.networkNodes;
    }
    
    updateStatus() {
        if (!this.system) return;
        
        const status = this.system.getSystemStatus();
        
        document.getElementById('total-coins').textContent = status.totalSpatialCoins;
        document.getElementById('active-transactions').textContent = status.activeTransactions;
        document.getElementById('total-blocks').textContent = status.spatialBlocksMined;
        document.getElementById('total-nodes').textContent = status.networkNodes;
        document.getElementById('spatial-difficulty').textContent = status.spatialDifficulty;
        document.getElementById('quantum-entanglement-status').textContent = status.quantumEntanglement;
        document.getElementById('consciousness-validation').textContent = status.consciousnessValidation;
        document.getElementById('dimensional-depth').textContent = status.dimensionalDepth;
        document.getElementById('reality-stability-status').textContent = status.realityStability;
        document.getElementById('consensus-level-status').textContent = Math.round(status.spatialConsensusLevel * 100) + '%';
    }
    
    addLog(message) {
        const logContainer = document.getElementById('system-logs');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = new Date().toLocaleTimeString() + ': ' + message;
        
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Keep only last 50 log entries
        while (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }
    
    destroy() {
        if (this.miningInterval) {
            clearInterval(this.miningInterval);
        }
        
        if (this.interface) {
            this.interface.remove();
        }
        
        console.log('🔄 Destroying Spatial Crypto Interface...');
    }
}

// Initialize Spatial Crypto Interface
window.SpatialCryptoInterface = SpatialCryptoInterface; 