/**
 * SM Content Creator System
 * Color-Coded Data Balls and Intuitive Content Creation
 * Developed by Fungai Taranhike
 */

class SMContentCreatorSystem {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.version = '1.0.0';
        this.systemName = 'SM Content Creator System';
        
        // Content creation components
        this.components = {
            dataBallManager: new SMDataBallManager(),
            layoutSelector: new SMLayoutSelector(),
            containerManager: new SMContainerManager(),
            previewSystem: new SMPreviewSystem(),
            contentManager: new SMContentManager()
        };
        
        // Data types with color coding
        this.dataTypes = {
            image: { color: '#ff6b6b', name: 'Image', icon: 'fas fa-image', description: 'Single image or photo' },
            text: { color: '#4ecdc4', name: 'Text', icon: 'fas fa-font', description: 'Text message or description' },
            video: { color: '#45b7d1', name: 'Video', icon: 'fas fa-video', description: 'Video content or tour' },
            contact: { color: '#96ceb4', name: 'Contact', icon: 'fas fa-address-card', description: 'Contact information' },
            model3d: { color: '#feca57', name: '3D Model', icon: 'fas fa-cube', description: '3D model with AR support' },
            carousel: { color: '#ff9ff3', name: 'Carousel', icon: 'fas fa-images', description: 'Image carousel or gallery' }
        };
        
        this.init();
    }
    
    init() {
        console.log('🎨 Initializing SM Content Creator System...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.initializeComponents();
        this.createDataBalls();
        this.setupLayoutSelection();
        this.setupContainerAssignment();
        this.setupPreviewSystem();
        
        console.log('✅ SM Content Creator System Ready');
        console.log('🎯 Focus: Intuitive Spatial Content Creation');
    }
    
    initializeComponents() {
        // Initialize all content creation components
        Object.values(this.components).forEach(component => {
            component.initialize({
                dataTypes: this.dataTypes,
                spatialAware: true,
                intuitiveDesign: true,
                interactive: true
            });
        });
        
        console.log('✅ Content creation components initialized');
    }
    
    createDataBalls() {
        // Create color-coded data balls for content creators
        Object.entries(this.dataTypes).forEach(([type, config]) => {
            this.components.dataBallManager.createDataBall(type, config);
        });
        
        console.log('🎨 Color-coded data balls created');
    }
    
    setupLayoutSelection() {
        // Setup layout selection system
        this.components.layoutSelector.setupLayouts({
            globe: { name: 'Globe Style', description: 'Spherical spatial experience' },
            flatLand: { name: 'Flat Land Style', description: 'Planar spatial experience' }
        });
        
        console.log('🌍 Layout selection system configured');
    }
    
    setupContainerAssignment() {
        // Setup container assignment system
        this.components.containerManager.setupContainers({
            dragDrop: true,
            visualFeedback: true,
            assignmentValidation: true
        });
        
        console.log('📦 Container assignment system configured');
    }
    
    setupPreviewSystem() {
        // Setup preview system
        this.components.previewSystem.setupPreview({
            realTime: true,
            spatialRendering: true,
            interactive: true
        });
        
        console.log('👁️ Preview system configured');
    }
    
    // Public API methods
    
    selectLayout(layoutStyle) {
        return this.components.layoutSelector.selectLayout(layoutStyle);
    }
    
    getDataBalls() {
        return this.components.dataBallManager.getDataBalls();
    }
    
    assignDataType(containerId, dataType) {
        return this.components.containerManager.assignDataType(containerId, dataType);
    }
    
    previewExperience() {
        return this.components.previewSystem.generatePreview();
    }
    
    saveContent(contentData) {
        return this.components.contentManager.saveContent(contentData);
    }
    
    getSystemStatus() {
        const status = {};
        Object.entries(this.components).forEach(([name, component]) => {
            status[name] = component.getStatus();
        });
        return status;
    }
    
    // Cleanup
    destroy() {
        console.log('🔄 Destroying SM Content Creator System...');
        Object.values(this.components).forEach(component => {
            component.destroy();
        });
    }
}

// SM Data Ball Manager
class SMDataBallManager {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.dataBalls = {};
        this.draggable = true;
        this.interactive = true;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.spatialAware = config.spatialAware;
        this.intuitiveDesign = config.intuitiveDesign;
        this.interactive = config.interactive;
    }
    
    createDataBall(type, config) {
        const dataBall = {
            id: `data-ball-${type}`,
            type: type,
            color: config.color,
            name: config.name,
            icon: config.icon,
            description: config.description,
            draggable: this.draggable,
            interactive: this.interactive,
            spatialAware: this.spatialAware
        };
        
        this.dataBalls[type] = dataBall;
        console.log('🎨 Data ball created:', type);
    }
    
    getDataBall(type) {
        return this.dataBalls[type];
    }
    
    getDataBalls() {
        return this.dataBalls;
    }
    
    getStatus() {
        return {
            dataBalls: Object.keys(this.dataBalls).length,
            draggable: this.draggable,
            interactive: this.interactive,
            spatialAware: this.spatialAware
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Data Ball Manager...');
    }
}

// SM Layout Selector
class SMLayoutSelector {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.layouts = {};
        this.selectedLayout = null;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.spatialAware = config.spatialAware;
        this.intuitiveDesign = config.intuitiveDesign;
        this.interactive = config.interactive;
    }
    
    setupLayouts(layoutConfig) {
        Object.entries(layoutConfig).forEach(([style, config]) => {
            this.layouts[style] = {
                style: style,
                name: config.name,
                description: config.description,
                containers: this.getContainersForLayout(style)
            };
        });
        
        console.log('🌍 Layouts configured');
    }
    
    getContainersForLayout(style) {
        if (style === 'globe') {
            return [
                'globe-north-pole', 'globe-north-east', 'globe-north-west',
                'globe-east', 'globe-west', 'globe-south-east',
                'globe-south-west', 'globe-south-pole', 'globe-front', 'globe-back'
            ];
        } else if (style === 'flatLand') {
            return [
                'flat-top-left', 'flat-top-center', 'flat-top-right',
                'flat-center-left', 'flat-center-center', 'flat-center-right',
                'flat-bottom-left', 'flat-bottom-center', 'flat-bottom-right'
            ];
        }
        return [];
    }
    
    selectLayout(layoutStyle) {
        this.selectedLayout = this.layouts[layoutStyle];
        console.log('🎨 Layout selected:', layoutStyle);
        return this.selectedLayout;
    }
    
    getSelectedLayout() {
        return this.selectedLayout;
    }
    
    getAvailableLayouts() {
        return this.layouts;
    }
    
    getStatus() {
        return {
            layouts: Object.keys(this.layouts).length,
            selectedLayout: this.selectedLayout?.style || null,
            spatialAware: this.spatialAware
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Layout Selector...');
    }
}

// SM Container Manager
class SMContainerManager {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.containers = {};
        this.assignments = {};
        this.dragDrop = false;
        this.visualFeedback = false;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.spatialAware = config.spatialAware;
        this.intuitiveDesign = config.intuitiveDesign;
        this.interactive = config.interactive;
    }
    
    setupContainers(config) {
        this.dragDrop = config.dragDrop;
        this.visualFeedback = config.visualFeedback;
        this.assignmentValidation = config.assignmentValidation;
        
        console.log('📦 Container manager configured');
    }
    
    createContainers(layoutStyle) {
        const containers = this.getContainersForLayout(layoutStyle);
        
        containers.forEach(containerId => {
            this.containers[containerId] = {
                id: containerId,
                assignedDataType: null,
                content: null,
                status: 'empty'
            };
        });
        
        console.log('📦 Containers created for layout:', layoutStyle);
    }
    
    getContainersForLayout(layoutStyle) {
        if (layoutStyle === 'globe') {
            return [
                'globe-north-pole', 'globe-north-east', 'globe-north-west',
                'globe-east', 'globe-west', 'globe-south-east',
                'globe-south-west', 'globe-south-pole', 'globe-front', 'globe-back'
            ];
        } else if (layoutStyle === 'flatLand') {
            return [
                'flat-top-left', 'flat-top-center', 'flat-top-right',
                'flat-center-left', 'flat-center-center', 'flat-center-right',
                'flat-bottom-left', 'flat-bottom-center', 'flat-bottom-right'
            ];
        }
        return [];
    }
    
    assignDataType(containerId, dataType) {
        if (this.containers[containerId]) {
            this.containers[containerId].assignedDataType = dataType;
            this.containers[containerId].status = 'assigned';
            this.assignments[containerId] = dataType;
            
            console.log('📝 Data type assigned:', containerId, dataType);
            return true;
        }
        return false;
    }
    
    getContainer(containerId) {
        return this.containers[containerId];
    }
    
    getAllContainers() {
        return this.containers;
    }
    
    getAssignments() {
        return this.assignments;
    }
    
    getStatus() {
        return {
            containers: Object.keys(this.containers).length,
            assignments: Object.keys(this.assignments).length,
            dragDrop: this.dragDrop,
            visualFeedback: this.visualFeedback
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Container Manager...');
    }
}

// SM Preview System
class SMPreviewSystem {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.currentPreview = null;
        this.realTime = false;
        this.spatialRendering = false;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.spatialAware = config.spatialAware;
        this.intuitiveDesign = config.intuitiveDesign;
        this.interactive = config.interactive;
    }
    
    setupPreview(config) {
        this.realTime = config.realTime;
        this.spatialRendering = config.spatialRendering;
        this.interactive = config.interactive;
        
        console.log('👁️ Preview system configured');
    }
    
    generatePreview(layoutData, assignments) {
        const preview = {
            layout: layoutData,
            assignments: assignments,
            spatialRendering: this.spatialRendering,
            interactive: this.interactive,
            timestamp: new Date().toISOString(),
            previewId: `preview-${Date.now()}`
        };
        
        this.currentPreview = preview;
        console.log('👁️ Preview generated:', preview.previewId);
        return preview;
    }
    
    getCurrentPreview() {
        return this.currentPreview;
    }
    
    updatePreview(assignments) {
        if (this.currentPreview) {
            this.currentPreview.assignments = assignments;
            this.currentPreview.timestamp = new Date().toISOString();
            console.log('👁️ Preview updated');
        }
    }
    
    getStatus() {
        return {
            currentPreview: this.currentPreview?.previewId || null,
            realTime: this.realTime,
            spatialRendering: this.spatialRendering,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Preview System...');
    }
}

// SM Content Manager
class SMContentManager {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.savedContent = {};
        this.contentCounter = 0;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.spatialAware = config.spatialAware;
        this.intuitiveDesign = config.intuitiveDesign;
        this.interactive = config.interactive;
    }
    
    saveContent(contentData) {
        const contentId = `content-${++this.contentCounter}`;
        
        const savedContent = {
            id: contentId,
            layout: contentData.layout,
            assignments: contentData.assignments,
            content: contentData.content,
            metadata: {
                createdBy: 'content-creator',
                createdAt: new Date().toISOString(),
                version: '1.0.0'
            }
        };
        
        this.savedContent[contentId] = savedContent;
        console.log('💾 Content saved:', contentId);
        return contentId;
    }
    
    getContent(contentId) {
        return this.savedContent[contentId];
    }
    
    getAllContent() {
        return this.savedContent;
    }
    
    updateContent(contentId, contentData) {
        if (this.savedContent[contentId]) {
            this.savedContent[contentId] = {
                ...this.savedContent[contentId],
                ...contentData,
                metadata: {
                    ...this.savedContent[contentId].metadata,
                    updatedAt: new Date().toISOString()
                }
            };
            console.log('💾 Content updated:', contentId);
            return true;
        }
        return false;
    }
    
    deleteContent(contentId) {
        if (this.savedContent[contentId]) {
            delete this.savedContent[contentId];
            console.log('🗑️ Content deleted:', contentId);
            return true;
        }
        return false;
    }
    
    getStatus() {
        return {
            savedContent: Object.keys(this.savedContent).length,
            contentCounter: this.contentCounter
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Content Manager...');
    }
}

// Initialize SM Content Creator System
window.SMContentCreatorSystem = SMContentCreatorSystem;
window.SMDataBallManager = SMDataBallManager;
window.SMLayoutSelector = SMLayoutSelector;
window.SMContainerManager = SMContainerManager;
window.SMPreviewSystem = SMPreviewSystem;
window.SMContentManager = SMContentManager; 