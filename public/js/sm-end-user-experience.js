/**
 * SM End User Experience
 * Spatial Data Consumption and Interactive Navigation
 * Developed by Fungai Taranhike
 */

class SMEndUserExperience {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.version = '1.0.0';
        this.systemName = 'SM End User Experience';
        
        // Experience components
        this.components = {
            spatialNavigator: new SMSpatialNavigator(),
            dataConsumer: new SMDataConsumer(),
            interactionManager: new SMInteractionManager(),
            arViewer: new SMARViewer(),
            contactSystem: new SMContactSystem()
        };
        
        // User interaction modes
        this.interactionModes = {
            navigation: 'spatial-navigation',
            exploration: 'data-exploration',
            interaction: 'interactive-elements',
            ar: 'ar-viewing',
            contact: 'contact-actions'
        };
        
        this.init();
    }
    
    init() {
        console.log('🌍 Initializing SM End User Experience...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.initializeExperienceComponents();
        this.setupSpatialNavigation();
        this.setupDataConsumption();
        this.setupInteractiveElements();
        this.setupARViewing();
        this.setupContactSystem();
        
        console.log('✅ SM End User Experience Ready');
        console.log('🎯 Focus: Immersive Spatial Data Consumption');
    }
    
    initializeExperienceComponents() {
        // Initialize all experience components
        Object.values(this.components).forEach(component => {
            component.initialize({
                interactionModes: this.interactionModes,
                immersiveExperience: true,
                intuitiveNavigation: true,
                responsive: true
            });
        });
        
        console.log('✅ Experience components initialized');
    }
    
    setupSpatialNavigation() {
        // Setup spatial navigation for different layout styles
        this.components.spatialNavigator.setupNavigation({
            globe: {
                type: 'orbital',
                controls: ['rotate', 'zoom', 'pan'],
                smooth: true,
                constraints: {
                    minDistance: 5,
                    maxDistance: 50,
                    minPolarAngle: 0,
                    maxPolarAngle: Math.PI
                }
            },
            flatLand: {
                type: 'pan-zoom',
                controls: ['pan', 'zoom', 'rotate'],
                smooth: true,
                constraints: {
                    minZoom: 0.5,
                    maxZoom: 5,
                    panBounds: {
                        x: [-20, 20],
                        z: [-20, 20]
                    }
                }
            }
        });
        
        console.log('🧭 Spatial navigation configured');
    }
    
    setupDataConsumption() {
        // Setup data consumption system
        this.components.dataConsumer.setupConsumption({
            dataTypes: {
                image: { viewer: 'image-viewer', interaction: 'click-zoom' },
                text: { viewer: 'text-display', interaction: 'read-scroll' },
                video: { viewer: 'video-player', interaction: 'play-pause' },
                contact: { viewer: 'contact-card', interaction: 'contact-action' },
                model3d: { viewer: '3d-model-viewer', interaction: 'rotate-zoom' },
                carousel: { viewer: 'carousel-viewer', interaction: 'slide-navigate' }
            },
            immersive: true,
            interactive: true
        });
        
        console.log('📊 Data consumption configured');
    }
    
    setupInteractiveElements() {
        // Setup interactive elements
        this.components.interactionManager.setupInteractions({
            hotspots: {
                enabled: true,
                visualFeedback: true,
                informationDisplay: true
            },
            colorChanging: {
                enabled: true,
                realTime: true,
                customization: true
            },
            contactActions: {
                enabled: true,
                seamless: true,
                tracking: true
            }
        });
        
        console.log('👆 Interactive elements configured');
    }
    
    setupARViewing() {
        // Setup AR viewing for 3D models
        this.components.arViewer.setupAR({
            webXR: true,
            mobileSupport: true,
            modelViewing: true,
            interaction: true
        });
        
        console.log('🕶️ AR viewing configured');
    }
    
    setupContactSystem() {
        // Setup contact system
        this.components.contactSystem.setupContact({
            realEstate: {
                agentContact: true,
                propertyInquiry: true,
                appointmentScheduling: true
            },
            automotive: {
                dealerContact: true,
                vehicleInquiry: true,
                testDriveScheduling: true
            },
            seamless: true,
            tracking: true
        });
        
        console.log('📞 Contact system configured');
    }
    
    // Public API methods
    
    loadSpatialExperience(experienceId) {
        const experience = {
            id: experienceId,
            layout: null,
            data: {},
            interactions: []
        };
        
        this.components.spatialNavigator.loadExperience(experience);
        console.log('🌍 Spatial experience loaded:', experienceId);
        return experience;
    }
    
    navigateSpatialExperience(direction) {
        return this.components.spatialNavigator.navigate(direction);
    }
    
    interactWithData(dataId) {
        return this.components.dataConsumer.interact(dataId);
    }
    
    enableARView(modelId) {
        return this.components.arViewer.enableAR(modelId);
    }
    
    initiateContact(contactType, data) {
        return this.components.contactSystem.initiateContact(contactType, data);
    }
    
    getExperienceStatus() {
        const status = {};
        Object.entries(this.components).forEach(([name, component]) => {
            status[name] = component.getStatus();
        });
        return status;
    }
    
    // Cleanup
    destroy() {
        console.log('🔄 Destroying SM End User Experience...');
        Object.values(this.components).forEach(component => {
            component.destroy();
        });
    }
}

// SM Spatial Navigator
class SMSpatialNavigator {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.currentExperience = null;
        this.navigationModes = {};
        this.currentMode = 'navigation';
    }
    
    initialize(config) {
        this.interactionModes = config.interactionModes;
        this.immersiveExperience = config.immersiveExperience;
        this.intuitiveNavigation = config.intuitiveNavigation;
        this.responsive = config.responsive;
    }
    
    setupNavigation(navigationConfig) {
        this.navigationModes = navigationConfig;
        console.log('🧭 Spatial navigator configured');
    }
    
    loadExperience(experience) {
        this.currentExperience = experience;
        console.log('🌍 Experience loaded in navigator');
    }
    
    navigate(direction) {
        if (!this.currentExperience) return false;
        
        const navigation = {
            direction: direction,
            timestamp: new Date().toISOString(),
            experienceId: this.currentExperience.id
        };
        
        console.log('🧭 Spatial navigation:', direction);
        return navigation;
    }
    
    getCurrentExperience() {
        return this.currentExperience;
    }
    
    getNavigationModes() {
        return this.navigationModes;
    }
    
    getStatus() {
        return {
            currentExperience: this.currentExperience?.id || null,
            navigationModes: Object.keys(this.navigationModes).length,
            currentMode: this.currentMode,
            immersiveExperience: this.immersiveExperience
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Spatial Navigator...');
    }
}

// SM Data Consumer
class SMDataConsumer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.dataTypes = {};
        this.currentData = {};
        this.interactions = [];
    }
    
    initialize(config) {
        this.interactionModes = config.interactionModes;
        this.immersiveExperience = config.immersiveExperience;
        this.intuitiveNavigation = config.intuitiveNavigation;
        this.responsive = config.responsive;
    }
    
    setupConsumption(config) {
        this.dataTypes = config.dataTypes;
        this.immersive = config.immersive;
        this.interactive = config.interactive;
        
        console.log('📊 Data consumer configured');
    }
    
    interact(dataId) {
        const interaction = {
            dataId: dataId,
            timestamp: new Date().toISOString(),
            type: 'data-interaction'
        };
        
        this.interactions.push(interaction);
        console.log('👆 Data interaction:', dataId);
        return interaction;
    }
    
    loadData(dataType, content) {
        this.currentData[dataType] = content;
        console.log('📊 Data loaded:', dataType);
    }
    
    getCurrentData() {
        return this.currentData;
    }
    
    getInteractions() {
        return this.interactions;
    }
    
    getStatus() {
        return {
            dataTypes: Object.keys(this.dataTypes).length,
            currentData: Object.keys(this.currentData).length,
            interactions: this.interactions.length,
            immersive: this.immersive,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Data Consumer...');
    }
}

// SM Interaction Manager
class SMInteractionManager {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.hotspots = {};
        this.colorChanges = {};
        this.contactActions = {};
    }
    
    initialize(config) {
        this.interactionModes = config.interactionModes;
        this.immersiveExperience = config.immersiveExperience;
        this.intuitiveNavigation = config.intuitiveNavigation;
        this.responsive = config.responsive;
    }
    
    setupInteractions(config) {
        this.hotspots = config.hotspots;
        this.colorChanges = config.colorChanging;
        this.contactActions = config.contactActions;
        
        console.log('👆 Interaction manager configured');
    }
    
    createHotspot(id, position, information) {
        this.hotspots[id] = {
            id: id,
            position: position,
            information: information,
            enabled: true
        };
        
        console.log('📍 Hotspot created:', id);
    }
    
    changeColor(elementId, newColor) {
        this.colorChanges[elementId] = {
            elementId: elementId,
            newColor: newColor,
            timestamp: new Date().toISOString()
        };
        
        console.log('🎨 Color changed:', elementId, newColor);
    }
    
    triggerContactAction(actionType, data) {
        const action = {
            type: actionType,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        this.contactActions[actionType] = action;
        console.log('📞 Contact action triggered:', actionType);
        return action;
    }
    
    getHotspots() {
        return this.hotspots;
    }
    
    getColorChanges() {
        return this.colorChanges;
    }
    
    getContactActions() {
        return this.contactActions;
    }
    
    getStatus() {
        return {
            hotspots: Object.keys(this.hotspots).length,
            colorChanges: Object.keys(this.colorChanges).length,
            contactActions: Object.keys(this.contactActions).length,
            immersiveExperience: this.immersiveExperience
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Interaction Manager...');
    }
}

// SM AR Viewer
class SMARViewer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.arEnabled = false;
        this.currentModel = null;
        this.webXR = false;
    }
    
    initialize(config) {
        this.interactionModes = config.interactionModes;
        this.immersiveExperience = config.immersiveExperience;
        this.intuitiveNavigation = config.intuitiveNavigation;
        this.responsive = config.responsive;
    }
    
    setupAR(config) {
        this.webXR = config.webXR;
        this.mobileSupport = config.mobileSupport;
        this.modelViewing = config.modelViewing;
        this.interaction = config.interaction;
        
        console.log('🕶️ AR viewer configured');
    }
    
    enableAR(modelId) {
        this.arEnabled = true;
        this.currentModel = modelId;
        
        const arSession = {
            modelId: modelId,
            enabled: true,
            timestamp: new Date().toISOString(),
            webXR: this.webXR
        };
        
        console.log('🕶️ AR enabled for model:', modelId);
        return arSession;
    }
    
    disableAR() {
        this.arEnabled = false;
        this.currentModel = null;
        console.log('🕶️ AR disabled');
    }
    
    getCurrentModel() {
        return this.currentModel;
    }
    
    isAREnabled() {
        return this.arEnabled;
    }
    
    getStatus() {
        return {
            arEnabled: this.arEnabled,
            currentModel: this.currentModel,
            webXR: this.webXR,
            mobileSupport: this.mobileSupport,
            modelViewing: this.modelViewing
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM AR Viewer...');
    }
}

// SM Contact System
class SMContactSystem {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.contactTypes = {};
        this.contactHistory = [];
    }
    
    initialize(config) {
        this.interactionModes = config.interactionModes;
        this.immersiveExperience = config.immersiveExperience;
        this.intuitiveNavigation = config.intuitiveNavigation;
        this.responsive = config.responsive;
    }
    
    setupContact(config) {
        this.realEstate = config.realEstate;
        this.automotive = config.automotive;
        this.seamless = config.seamless;
        this.tracking = config.tracking;
        
        console.log('📞 Contact system configured');
    }
    
    initiateContact(contactType, data) {
        const contact = {
            type: contactType,
            data: data,
            timestamp: new Date().toISOString(),
            seamless: this.seamless
        };
        
        this.contactHistory.push(contact);
        console.log('📞 Contact initiated:', contactType);
        return contact;
    }
    
    getContactHistory() {
        return this.contactHistory;
    }
    
    getStatus() {
        return {
            realEstate: this.realEstate,
            automotive: this.automotive,
            seamless: this.seamless,
            tracking: this.tracking,
            contactHistory: this.contactHistory.length
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Contact System...');
    }
}

// Initialize SM End User Experience
window.SMEndUserExperience = SMEndUserExperience;
window.SMSpatialNavigator = SMSpatialNavigator;
window.SMDataConsumer = SMDataConsumer;
window.SMInteractionManager = SMInteractionManager;
window.SMARViewer = SMARViewer;
window.SMContactSystem = SMContactSystem; 