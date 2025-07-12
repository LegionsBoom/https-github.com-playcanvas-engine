/**
 * Spatial Crypto Initialization
 * Initialize spatial cryptocurrency system and interface
 * Developed by Fungai Taranhike
 */

// Global spatial crypto instance
let spatialCryptoInterface = null;

// Initialize spatial crypto system
function initSpatialCrypto() {
    console.log('🪙 Initializing Spatial Crypto System...');
    console.log('👨‍💻 Creator: Fungai Taranhike');
    
    try {
        // Create spatial crypto interface
        spatialCryptoInterface = new SpatialCryptoInterface();
        
        // Add demo functionality
        setupDemoFeatures();
        
        console.log('✅ Spatial Crypto System initialized successfully');
        
        // Add to global scope for debugging
        window.spatialCryptoInterface = spatialCryptoInterface;
        
    } catch (error) {
        console.error('❌ Error initializing Spatial Crypto System:', error);
    }
}

// Setup demo features
function setupDemoFeatures() {
    // Add demo wallet creation
    setTimeout(() => {
        if (spatialCryptoInterface && spatialCryptoInterface.system) {
            console.log('🪙 Creating demo wallet...');
            spatialCryptoInterface.createWallet();
        }
    }, 2000);
    
    // Add demo transaction
    setTimeout(() => {
        if (spatialCryptoInterface && spatialCryptoInterface.currentWallet) {
            console.log('🔄 Creating demo transaction...');
            createDemoTransaction();
        }
    }, 4000);
    
    // Add demo mining
    setTimeout(() => {
        if (spatialCryptoInterface && spatialCryptoInterface.currentWallet) {
            console.log('⛏️ Starting demo mining...');
            spatialCryptoInterface.startMining();
        }
    }, 6000);
    
    // Add demo consensus participation
    setTimeout(() => {
        if (spatialCryptoInterface && spatialCryptoInterface.currentWallet) {
            console.log('🤝 Joining demo consensus...');
            spatialCryptoInterface.joinConsensus();
        }
    }, 8000);
    
    // Add demo advanced features
    setTimeout(() => {
        if (spatialCryptoInterface && spatialCryptoInterface.system) {
            console.log('🚀 Creating demo advanced features...');
            createDemoAdvancedFeatures();
        }
    }, 10000);
}

// Create demo transaction
function createDemoTransaction() {
    if (!spatialCryptoInterface || !spatialCryptoInterface.currentWallet) return;
    
    try {
        // Create a demo recipient wallet
        const demoRecipient = spatialCryptoInterface.system.createSpatialWallet();
        
        // Create demo transaction
        const transaction = spatialCryptoInterface.system.createSpatialTransaction(
            spatialCryptoInterface.currentWallet,
            demoRecipient,
            50,
            'Demo transaction from Fungai Taranhike'
        );
        
        console.log('✅ Demo transaction created:', transaction.id);
        
    } catch (error) {
        console.error('❌ Error creating demo transaction:', error);
    }
}

// Create demo advanced features
function createDemoAdvancedFeatures() {
    if (!spatialCryptoInterface || !spatialCryptoInterface.system) return;
    
    try {
        // Create demo wallets for advanced features
        const wallet1 = spatialCryptoInterface.system.createSpatialWallet();
        const wallet2 = spatialCryptoInterface.system.createSpatialWallet();
        const wallet3 = spatialCryptoInterface.system.createSpatialWallet();
        
        // Create quantum entangled transaction
        const entangledTransaction = spatialCryptoInterface.system.createQuantumEntangledTransaction(
            [wallet1, wallet2, wallet3],
            100
        );
        console.log('✅ Demo quantum entangled transaction created:', entangledTransaction.id);
        
        // Create dimensional contract
        const contract = spatialCryptoInterface.system.createDimensionalContract(
            {
                spatial: true,
                quantum: true,
                consciousness: true,
                dimensional: true,
                reality: true
            },
            [wallet1, wallet2]
        );
        console.log('✅ Demo dimensional contract created:', contract.id);
        
        // Create consciousness token
        const consciousnessToken = spatialCryptoInterface.system.createConsciousnessToken(
            0.8, // awareness
            0.7, // understanding
            0.6  // creativity
        );
        console.log('✅ Demo consciousness token created:', consciousnessToken.id);
        
        // Create reality token
        const realityToken = spatialCryptoInterface.system.createRealityToken(
            0.95, // stability
            0.3,  // manipulation
            0.7   // synthesis
        );
        console.log('✅ Demo reality token created:', realityToken.id);
        
    } catch (error) {
        console.error('❌ Error creating demo advanced features:', error);
    }
}

// Add spatial crypto button to editor
function addSpatialCryptoButton() {
    // Create spatial crypto button
    const cryptoButton = document.createElement('button');
    cryptoButton.className = 'nav-btn';
    cryptoButton.id = 'spatial-crypto-btn';
    cryptoButton.innerHTML = '<i class="fas fa-coins"></i> Spatial Crypto';
    cryptoButton.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(255, 0, 255, 0.2) 100%)';
    cryptoButton.style.border = '1px solid rgba(0, 212, 255, 0.3)';
    
    // Add to navigation
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
        navRight.appendChild(cryptoButton);
    }
    
    // Add click event
    cryptoButton.addEventListener('click', () => {
        toggleSpatialCrypto();
    });
}

// Toggle spatial crypto interface
function toggleSpatialCrypto() {
    const cryptoInterface = document.getElementById('spatial-crypto-interface');
    
    if (cryptoInterface) {
        if (cryptoInterface.style.display === 'none' || !cryptoInterface.style.display) {
            cryptoInterface.style.display = 'block';
            console.log('🪙 Spatial Crypto Interface activated');
        } else {
            cryptoInterface.style.display = 'none';
            console.log('🪙 Spatial Crypto Interface deactivated');
        }
    } else {
        console.log('🪙 Spatial Crypto Interface not found');
    }
}

// Add spatial crypto info to editor
function addSpatialCryptoInfo() {
    const infoHTML = `
        <div class="spatial-crypto-info" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 10px;
            padding: 15px;
            color: #ffffff;
            font-size: 0.9em;
            z-index: 9999;
            backdrop-filter: blur(10px);
            max-width: 300px;
        ">
            <h4 style="margin: 0 0 10px 0; color: #00d4ff;">
                <i class="fas fa-coins"></i> Spatial Crypto
            </h4>
            <p style="margin: 0 0 10px 0; color: #cccccc;">
                Revolutionary cryptocurrency using spatial dimensions, quantum computing, and consciousness
            </p>
            <div style="font-size: 0.8em; color: #888888;">
                <div>Creator: Fungai Taranhike</div>
                <div>Status: Active</div>
                <div>Features: Quantum, Consciousness, Dimensional</div>
            </div>
        </div>
    `;
    
    const infoElement = document.createElement('div');
    infoElement.innerHTML = infoHTML;
    document.body.appendChild(infoElement.firstElementChild);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🪙 DOM loaded, initializing Spatial Crypto...');
    
    // Wait for other systems to load
    setTimeout(() => {
        initSpatialCrypto();
        addSpatialCryptoButton();
        addSpatialCryptoInfo();
    }, 1000);
});

// Export functions for global access
window.initSpatialCrypto = initSpatialCrypto;
window.toggleSpatialCrypto = toggleSpatialCrypto;
window.spatialCryptoInterface = null; 