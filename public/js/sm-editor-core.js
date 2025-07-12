/**
 * Static Motion Editor Core
 * Spatial Data Consumption Platform
 * Built on PlayCanvas Engine
 * Developed by Fungai Taranhike
 */

class SMEditorCore {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.version = '1.0.0';
        this.systemName = 'Static Motion Editor';
        
        // Core platform components
        this.components = {
            playcanvasEngine: new SMPlayCanvasEngine(),
            layoutSystem: new SMLayoutSystem(),
            dataTypeManager: new SMDataTypeManager(),
            contentCreator: new SMContentCreator(),
            endUserExperience: new SMEndUserExperience(),
            userManagement: new SMUserManagement()
        };
        
        // User types
        this.userTypes = {
            superAdmin: 'super-admin',
            contentCreator: 'content-creator',
            endUser: 'end-user'
        };
        
        // Data types with color coding
        this.dataTypes = {
            image: { color: '#ff6b6b', name: 'Image', icon: 'fas fa-image' },
            text: { color: '#4ecdc4', name: 'Text', icon: 'fas fa-font' },
            video: { color: '#45b7d1', name: 'Video', icon: 'fas fa-video' },
            contact: { color: '#96ceb4', name: 'Contact', icon: 'fas fa-address-card' },
            model3d: { color: '#feca57', name: '3D Model', icon: 'fas fa-cube' },
            carousel: { color: '#ff9ff3', name: 'Carousel', icon: 'fas fa-images' }
        };
        
        // Layout styles
        this.layoutStyles = {
            globe: 'globe-style',
            flatLand: 'flat-land-style'
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Static Motion Editor...');
        console.log('👨‍💻 Creator: ' + this.creator);
        console.log('🎮 Platform: Spatial Data Consumption');
        
        this.initializeCoreComponents();
        this.setupPlayCanvasEngine();
        this.createLayoutSystem();
        this.setupDataTypeManager();
        this.initializeUserManagement();
        
        console.log('✅ Static Motion Editor Core Ready');
        console.log('🎯 Focus: Spatial Data Consumption Platform');
    }
    
    initializeCoreComponents() {
        // Initialize all core components
        Object.values(this.components).forEach(component => {
            component.initialize({
                editor: this,
                userTypes: this.userTypes,
                dataTypes: this.dataTypes,
                layoutStyles: this.layoutStyles
            });
        });
        
        console.log('✅ Core components initialized');
    }
    
    setupPlayCanvasEngine() {
        // Enhanced PlayCanvas integration for spatial experiences
        this.components.playcanvasEngine.setup({
            spatialRendering: true,
            physicsEnabled: true,
            arSupport: true,
            performanceOptimized: true
        });
        
        console.log('🎮 PlayCanvas Engine enhanced for spatial experiences');
    }
    
    createLayoutSystem() {
        // Create layout system for globe and flat land styles
        this.components.layoutSystem.createLayouts({
            globeStyle: {
                type: 'spherical',
                navigation: 'orbital',
                containers: 'distributed'
            },
            flatLandStyle: {
                type: 'planar',
                navigation: 'pan-zoom',
                containers: 'grid-based'
            }
        });
        
        console.log('🌍 Layout system created for spatial experiences');
    }
    
    setupDataTypeManager() {
        // Setup data type management with color coding
        this.components.dataTypeManager.setupDataTypes({
            colorCoded: true,
            interactive: true,
            previewEnabled: true,
            dragDrop: true
        });
        
        console.log('🎨 Data type manager with color coding ready');
    }
    
    initializeUserManagement() {
        // Initialize user management for different user types
        this.components.userManagement.setupUserTypes({
            superAdmin: {
                permissions: ['all'],
                features: ['system-management', 'user-management', 'analytics']
            },
            contentCreator: {
                permissions: ['create', 'edit', 'preview', 'publish'],
                features: ['layout-selection', 'data-assignment', 'content-creation']
            },
            endUser: {
                permissions: ['view', 'interact'],
                features: ['spatial-navigation', 'data-consumption', 'ar-viewing']
            }
        });
        
        console.log('👥 User management system initialized');
    }
    
    // Public API methods
    
    getEditorStatus() {
        return {
            creator: this.creator,
            version: this.version,
            systemName: this.systemName,
            components: Object.keys(this.components),
            userTypes: this.userTypes,
            dataTypes: this.dataTypes,
            layoutStyles: this.layoutStyles
        };
    }
    
    getComponent(componentName) {
        return this.components[componentName];
    }
    
    getUserType(userType) {
        return this.userTypes[userType];
    }
    
    getDataType(dataType) {
        return this.dataTypes[dataType];
    }
    
    getLayoutStyle(style) {
        return this.layoutStyles[style];
    }
    
    // Cleanup
    destroy() {
        console.log('🔄 Destroying Static Motion Editor Core...');
        Object.values(this.components).forEach(component => {
            component.destroy();
        });
    }
}

// SM PlayCanvas Engine
class SMPlayCanvasEngine {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.app = null;
        this.spatialRendering = false;
        this.physicsEnabled = false;
        this.arSupport = false;
    }
    
    initialize(config) {
        this.editor = config.editor;
        this.userTypes = config.userTypes;
        this.dataTypes = config.dataTypes;
        this.layoutStyles = config.layoutStyles;
    }
    
    setup(config) {
        this.spatialRendering = config.spatialRendering;
        this.physicsEnabled = config.physicsEnabled;
        this.arSupport = config.arSupport;
        this.performanceOptimized = config.performanceOptimized;
        
        this.initializePlayCanvas();
    }
    
    initializePlayCanvas() {
        try {
            // Initialize PlayCanvas application
            this.app = new pc.Application(document.getElementById('playcanvas-canvas'), {
                mouse: new pc.Mouse(document.getElementById('playcanvas-canvas')),
                touch: new pc.Touch(document.getElementById('playcanvas-canvas')),
                keyboard: new pc.Keyboard(window)
            });
            
            // Set up spatial rendering
            this.setupSpatialRendering();
            
            // Set up physics
            if (this.physicsEnabled) {
                this.setupPhysics();
            }
            
            // Set up AR support
            if (this.arSupport) {
                this.setupARSupport();
            }
            
            // Start the application
            this.app.start();
            
            console.log('✅ PlayCanvas Engine initialized for spatial experiences');
            
        } catch (error) {
            console.error('❌ PlayCanvas initialization failed:', error);
        }
    }
    
    setupSpatialRendering() {
        // Set up enhanced spatial rendering
        this.app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);
        
        // Create spatial camera
        this.spatialCamera = new pc.Entity('spatial-camera');
        this.spatialCamera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.2),
            clearColorBuffer: true,
            clearDepthBuffer: true
        });
        
        // Position camera for spatial viewing
        this.spatialCamera.setPosition(0, 10, 20);
        this.spatialCamera.lookAt(0, 0, 0);
        
        this.app.root.addChild(this.spatialCamera);
    }
    
    setupPhysics() {
        // Set up physics for interactive spatial experiences
        this.app.systems.add(new pc.PhysicsSystem());
        console.log('⚡ Physics system enabled for spatial interactions');
    }
    
    setupARSupport() {
        // Set up AR support for 3D model viewing
        if (navigator.xr) {
            this.app.xr.start();
            console.log('🕶️ AR support enabled for 3D model viewing');
        }
    }
    
    getStatus() {
        return {
            spatialRendering: this.spatialRendering,
            physicsEnabled: this.physicsEnabled,
            arSupport: this.arSupport,
            appActive: this.app !== null
        };
    }
    
    destroy() {
        if (this.app) {
            this.app.destroy();
        }
        console.log('🔄 Destroying SM PlayCanvas Engine...');
    }
}

// SM Layout System
class SMLayoutSystem {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.layouts = {};
    }
    
    initialize(config) {
        this.editor = config.editor;
        this.userTypes = config.userTypes;
        this.dataTypes = config.dataTypes;
        this.layoutStyles = config.layoutStyles;
    }
    
    createLayouts(config) {
        // Create globe style layout
        this.layouts.globeStyle = {
            type: config.globeStyle.type,
            navigation: config.globeStyle.navigation,
            containers: config.globeStyle.containers,
            containers: this.createGlobeContainers()
        };
        
        // Create flat land style layout
        this.layouts.flatLandStyle = {
            type: config.flatLandStyle.type,
            navigation: config.flatLandStyle.navigation,
            containers: config.flatLandStyle.containers,
            containers: this.createFlatLandContainers()
        };
        
        console.log('✅ Layouts created for spatial experiences');
    }
    
    createGlobeContainers() {
        // Create distributed containers for globe style
        return [
            { id: 'globe-top', position: [0, 5, 0], size: [2, 2, 2] },
            { id: 'globe-bottom', position: [0, -5, 0], size: [2, 2, 2] },
            { id: 'globe-left', position: [-5, 0, 0], size: [2, 2, 2] },
            { id: 'globe-right', position: [5, 0, 0], size: [2, 2, 2] },
            { id: 'globe-front', position: [0, 0, 5], size: [2, 2, 2] },
            { id: 'globe-back', position: [0, 0, -5], size: [2, 2, 2] }
        ];
    }
    
    createFlatLandContainers() {
        // Create grid-based containers for flat land style
        return [
            { id: 'flat-top-left', position: [-3, 0, -3], size: [2, 2, 2] },
            { id: 'flat-top-center', position: [0, 0, -3], size: [2, 2, 2] },
            { id: 'flat-top-right', position: [3, 0, -3], size: [2, 2, 2] },
            { id: 'flat-center-left', position: [-3, 0, 0], size: [2, 2, 2] },
            { id: 'flat-center-center', position: [0, 0, 0], size: [2, 2, 2] },
            { id: 'flat-center-right', position: [3, 0, 0], size: [2, 2, 2] },
            { id: 'flat-bottom-left', position: [-3, 0, 3], size: [2, 2, 2] },
            { id: 'flat-bottom-center', position: [0, 0, 3], size: [2, 2, 2] },
            { id: 'flat-bottom-right', position: [3, 0, 3], size: [2, 2, 2] }
        ];
    }
    
    getLayout(style) {
        return this.layouts[style];
    }
    
    getAllLayouts() {
        return this.layouts;
    }
    
    getStatus() {
        return {
            layouts: Object.keys(this.layouts),
            globeContainers: this.layouts.globeStyle?.containers?.length || 0,
            flatLandContainers: this.layouts.flatLandStyle?.containers?.length || 0
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Layout System...');
    }
}

// SM Data Type Manager
class SMDataTypeManager {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.dataTypes = {};
        this.colorCoded = false;
        this.interactive = false;
    }
    
    initialize(config) {
        this.editor = config.editor;
        this.userTypes = config.userTypes;
        this.dataTypes = config.dataTypes;
        this.layoutStyles = config.layoutStyles;
    }
    
    setupDataTypes(config) {
        this.colorCoded = config.colorCoded;
        this.interactive = config.interactive;
        this.previewEnabled = config.previewEnabled;
        this.dragDrop = config.dragDrop;
        
        this.createDataTypeBalls();
    }
    
    createDataTypeBalls() {
        // Create color-coded data type balls for content creators
        Object.entries(this.dataTypes).forEach(([type, config]) => {
            this.dataTypes[type] = {
                ...config,
                ball: this.createDataBall(type, config)
            };
        });
        
        console.log('🎨 Data type balls created with color coding');
    }
    
    createDataBall(type, config) {
        return {
            type: type,
            color: config.color,
            name: config.name,
            icon: config.icon,
            interactive: this.interactive,
            draggable: this.dragDrop
        };
    }
    
    getDataType(type) {
        return this.dataTypes[type];
    }
    
    getAllDataTypes() {
        return this.dataTypes;
    }
    
    getStatus() {
        return {
            colorCoded: this.colorCoded,
            interactive: this.interactive,
            previewEnabled: this.previewEnabled,
            dragDrop: this.dragDrop,
            dataTypes: Object.keys(this.dataTypes)
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Data Type Manager...');
    }
}

// SM Content Creator
class SMContentCreator {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.currentLayout = null;
        this.selectedDataTypes = {};
    }
    
    initialize(config) {
        this.editor = config.editor;
        this.userTypes = config.userTypes;
        this.dataTypes = config.dataTypes;
        this.layoutStyles = config.layoutStyles;
    }
    
    selectLayout(layoutStyle) {
        this.currentLayout = this.editor.components.layoutSystem.getLayout(layoutStyle);
        console.log('🎨 Layout selected:', layoutStyle);
        return this.currentLayout;
    }
    
    assignDataType(containerId, dataType) {
        this.selectedDataTypes[containerId] = dataType;
        console.log('📝 Data type assigned to container:', containerId, dataType);
    }
    
    previewLayout() {
        // Generate preview of current layout with assigned data types
        const preview = {
            layout: this.currentLayout,
            dataTypes: this.selectedDataTypes,
            timestamp: new Date().toISOString()
        };
        
        console.log('👁️ Layout preview generated');
        return preview;
    }
    
    getStatus() {
        return {
            currentLayout: this.currentLayout?.type || null,
            assignedDataTypes: Object.keys(this.selectedDataTypes).length,
            previewReady: this.currentLayout !== null
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Content Creator...');
    }
}

// SM End User Experience
class SMEndUserExperience {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.currentExperience = null;
        this.interactionMode = 'navigation';
    }
    
    initialize(config) {
        this.editor = config.editor;
        this.userTypes = config.userTypes;
        this.dataTypes = config.dataTypes;
        this.layoutStyles = config.layoutStyles;
    }
    
    loadSpatialExperience(experienceId) {
        this.currentExperience = {
            id: experienceId,
            layout: null,
            data: {},
            interactions: []
        };
        
        console.log('🌍 Spatial experience loaded:', experienceId);
        return this.currentExperience;
    }
    
    navigateSpatialExperience(direction) {
        // Handle spatial navigation
        console.log('🧭 Spatial navigation:', direction);
    }
    
    interactWithData(dataId) {
        // Handle data interaction
        console.log('👆 Data interaction:', dataId);
    }
    
    enableARView() {
        // Enable AR viewing for 3D models
        console.log('🕶️ AR view enabled');
    }
    
    getStatus() {
        return {
            currentExperience: this.currentExperience?.id || null,
            interactionMode: this.interactionMode,
            arEnabled: false
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM End User Experience...');
    }
}

// SM User Management
class SMUserManagement {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.currentUser = null;
        this.userPermissions = {};
    }
    
    initialize(config) {
        this.editor = config.editor;
        this.userTypes = config.userTypes;
        this.dataTypes = config.dataTypes;
        this.layoutStyles = config.layoutStyles;
    }
    
    setupUserTypes(config) {
        this.userPermissions = config;
        console.log('👥 User types configured');
    }
    
    loginUser(userType, credentials) {
        this.currentUser = {
            type: userType,
            permissions: this.userPermissions[userType]?.permissions || [],
            features: this.userPermissions[userType]?.features || [],
            loginTime: new Date().toISOString()
        };
        
        console.log('🔐 User logged in:', userType);
        return this.currentUser;
    }
    
    getUserPermissions() {
        return this.currentUser?.permissions || [];
    }
    
    getUserFeatures() {
        return this.currentUser?.features || [];
    }
    
    getStatus() {
        return {
            currentUser: this.currentUser?.type || null,
            permissions: this.currentUser?.permissions || [],
            features: this.currentUser?.features || []
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM User Management...');
    }
}

// Initialize Static Motion Editor Core
window.SMEditorCore = SMEditorCore;
window.SMPlayCanvasEngine = SMPlayCanvasEngine;
window.SMLayoutSystem = SMLayoutSystem;
window.SMDataTypeManager = SMDataTypeManager;
window.SMContentCreator = SMContentCreator;
window.SMEndUserExperience = SMEndUserExperience;
window.SMUserManagement = SMUserManagement; 