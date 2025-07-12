/**
 * SM Content Creator UI
 * Professional Interface for Spatial Content Creation
 * Developed by Fungai Taranhike
 */

class SMContentCreatorUI {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.version = '1.0.0';
        this.systemName = 'SM Content Creator UI';
        
        // UI components
        this.components = {
            layoutSelector: new SMLayoutSelectorUI(),
            dataBallPalette: new SMDataBallPalette(),
            containerWorkspace: new SMContainerWorkspace(),
            previewPanel: new SMPreviewPanel(),
            contentManager: new SMContentManagerUI()
        };
        
        // Data types with enhanced color coding
        this.dataTypes = {
            image: { 
                color: '#ff6b6b', 
                name: 'Image', 
                icon: 'fas fa-image', 
                description: 'Single image or photo',
                examples: ['Property photos', 'Vehicle images', 'Product shots']
            },
            text: { 
                color: '#4ecdc4', 
                name: 'Text', 
                icon: 'fas fa-font', 
                description: 'Text message or description',
                examples: ['Property descriptions', 'Vehicle specs', 'Contact info']
            },
            video: { 
                color: '#45b7d1', 
                name: 'Video', 
                icon: 'fas fa-video', 
                description: 'Video content or tour',
                examples: ['Virtual tours', 'Vehicle walkthroughs', 'Property videos']
            },
            contact: { 
                color: '#96ceb4', 
                name: 'Contact', 
                icon: 'fas fa-address-card', 
                description: 'Contact information',
                examples: ['Agent contact', 'Dealership info', 'Inquiry forms']
            },
            model3d: { 
                color: '#feca57', 
                name: '3D Model', 
                icon: 'fas fa-cube', 
                description: '3D model with AR support',
                examples: ['Vehicle models', 'Property models', 'Interactive 3D']
            },
            carousel: { 
                color: '#ff9ff3', 
                name: 'Carousel', 
                icon: 'fas fa-images', 
                description: 'Image carousel or gallery',
                examples: ['Photo galleries', 'Image collections', 'Multiple views']
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🎨 Initializing SM Content Creator UI...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.initializeUIComponents();
        this.createDataBallPalette();
        this.setupLayoutSelector();
        this.createContainerWorkspace();
        this.setupPreviewPanel();
        this.bindEvents();
        
        console.log('✅ SM Content Creator UI Ready');
        console.log('🎯 Focus: Professional Spatial Content Creation');
    }
    
    initializeUIComponents() {
        // Initialize all UI components
        Object.values(this.components).forEach(component => {
            component.initialize({
                dataTypes: this.dataTypes,
                professionalUI: true,
                intuitiveDesign: true,
                responsive: true
            });
        });
        
        console.log('✅ UI components initialized');
    }
    
    createDataBallPalette() {
        // Create professional data ball palette
        this.components.dataBallPalette.createPalette({
            dataTypes: this.dataTypes,
            draggable: true,
            visualFeedback: true,
            descriptions: true
        });
        
        console.log('🎨 Data ball palette created');
    }
    
    setupLayoutSelector() {
        // Setup professional layout selector
        this.components.layoutSelector.setupLayouts({
            globe: {
                name: 'Globe Style',
                description: 'Spherical spatial experience with orbital navigation',
                icon: 'fas fa-globe',
                features: ['360° navigation', 'Distributed containers', 'Immersive experience']
            },
            flatLand: {
                name: 'Flat Land Style',
                description: 'Planar spatial experience with pan-zoom navigation',
                icon: 'fas fa-map',
                features: ['Grid-based layout', 'Pan-zoom navigation', 'Organized presentation']
            }
        });
        
        console.log('🌍 Layout selector configured');
    }
    
    createContainerWorkspace() {
        // Create professional container workspace
        this.components.containerWorkspace.setupWorkspace({
            dragDrop: true,
            visualFeedback: true,
            assignmentValidation: true,
            professionalStyling: true
        });
        
        console.log('📦 Container workspace created');
    }
    
    setupPreviewPanel() {
        // Setup professional preview panel
        this.components.previewPanel.setupPreview({
            realTime: true,
            spatialRendering: true,
            interactive: true,
            professionalUI: true
        });
        
        console.log('👁️ Preview panel configured');
    }
    
    bindEvents() {
        // Bind professional UI events
        this.bindLayoutSelection();
        this.bindDataBallAssignment();
        this.bindPreviewGeneration();
        this.bindContentSaving();
        
        console.log('🔗 UI events bound');
    }
    
    bindLayoutSelection() {
        // Bind layout selection events
        this.components.layoutSelector.onLayoutSelect((layout) => {
            this.components.containerWorkspace.loadLayout(layout);
            this.components.previewPanel.updateLayout(layout);
            console.log('🎨 Layout selected:', layout.name);
        });
    }
    
    bindDataBallAssignment() {
        // Bind data ball assignment events
        this.components.dataBallPalette.onDataBallDrag((dataType, containerId) => {
            this.components.containerWorkspace.assignDataType(containerId, dataType);
            this.components.previewPanel.updateAssignment(containerId, dataType);
            console.log('📝 Data type assigned:', containerId, dataType.name);
        });
    }
    
    bindPreviewGeneration() {
        // Bind preview generation events
        this.components.previewPanel.onPreviewRequest(() => {
            const assignments = this.components.containerWorkspace.getAssignments();
            const preview = this.components.previewPanel.generatePreview(assignments);
            console.log('👁️ Preview generated');
            return preview;
        });
    }
    
    bindContentSaving() {
        // Bind content saving events
        this.components.contentManager.onSaveRequest((contentData) => {
            const savedContent = this.components.contentManager.saveContent(contentData);
            console.log('💾 Content saved:', savedContent.id);
            return savedContent;
        });
    }
    
    // Public API methods
    
    getUIStatus() {
        const status = {};
        Object.entries(this.components).forEach(([name, component]) => {
            status[name] = component.getStatus();
        });
        return status;
    }
    
    getDataTypes() {
        return this.dataTypes;
    }
    
    // Cleanup
    destroy() {
        console.log('🔄 Destroying SM Content Creator UI...');
        Object.values(this.components).forEach(component => {
            component.destroy();
        });
    }
}

// SM Layout Selector UI
class SMLayoutSelectorUI {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.layouts = {};
        this.selectedLayout = null;
        this.onLayoutSelectCallback = null;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.professionalUI = config.professionalUI;
        this.intuitiveDesign = config.intuitiveDesign;
        this.responsive = config.responsive;
    }
    
    setupLayouts(layoutConfig) {
        Object.entries(layoutConfig).forEach(([style, config]) => {
            this.layouts[style] = {
                style: style,
                name: config.name,
                description: config.description,
                icon: config.icon,
                features: config.features
            };
        });
        
        console.log('🌍 Layout selector UI configured');
    }
    
    onLayoutSelect(callback) {
        this.onLayoutSelectCallback = callback;
    }
    
    selectLayout(layoutStyle) {
        this.selectedLayout = this.layouts[layoutStyle];
        
        if (this.onLayoutSelectCallback) {
            this.onLayoutSelectCallback(this.selectedLayout);
        }
        
        console.log('🎨 Layout selected in UI:', layoutStyle);
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
            professionalUI: this.professionalUI
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Layout Selector UI...');
    }
}

// SM Data Ball Palette
class SMDataBallPalette {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.dataBalls = {};
        this.draggable = false;
        this.visualFeedback = false;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.professionalUI = config.professionalUI;
        this.intuitiveDesign = config.intuitiveDesign;
        this.responsive = config.responsive;
    }
    
    createPalette(config) {
        this.draggable = config.draggable;
        this.visualFeedback = config.visualFeedback;
        this.descriptions = config.descriptions;
        
        Object.entries(this.dataTypes).forEach(([type, config]) => {
            this.createDataBall(type, config);
        });
        
        console.log('🎨 Data ball palette created');
    }
    
    createDataBall(type, config) {
        const dataBall = {
            id: `data-ball-${type}`,
            type: type,
            color: config.color,
            name: config.name,
            icon: config.icon,
            description: config.description,
            examples: config.examples,
            draggable: this.draggable,
            visualFeedback: this.visualFeedback
        };
        
        this.dataBalls[type] = dataBall;
        console.log('🎨 Data ball created:', type);
    }
    
    onDataBallDrag(callback) {
        this.onDragCallback = callback;
    }
    
    dragDataBall(dataType, containerId) {
        if (this.onDragCallback) {
            this.onDragCallback(dataType, containerId);
        }
        
        console.log('🎨 Data ball dragged:', dataType.name, 'to', containerId);
    }
    
    getDataBalls() {
        return this.dataBalls;
    }
    
    getDataBall(type) {
        return this.dataBalls[type];
    }
    
    getStatus() {
        return {
            dataBalls: Object.keys(this.dataBalls).length,
            draggable: this.draggable,
            visualFeedback: this.visualFeedback,
            descriptions: this.descriptions
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Data Ball Palette...');
    }
}

// SM Container Workspace
class SMContainerWorkspace {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.containers = {};
        this.assignments = {};
        this.currentLayout = null;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.professionalUI = config.professionalUI;
        this.intuitiveDesign = config.intuitiveDesign;
        this.responsive = config.responsive;
    }
    
    setupWorkspace(config) {
        this.dragDrop = config.dragDrop;
        this.visualFeedback = config.visualFeedback;
        this.assignmentValidation = config.assignmentValidation;
        this.professionalStyling = config.professionalStyling;
        
        console.log('📦 Container workspace configured');
    }
    
    loadLayout(layout) {
        this.currentLayout = layout;
        this.createContainers(layout.style);
        console.log('📦 Layout loaded:', layout.name);
    }
    
    createContainers(layoutStyle) {
        this.containers = {};
        this.assignments = {};
        
        const containerIds = this.getContainerIdsForLayout(layoutStyle);
        
        containerIds.forEach(containerId => {
            this.containers[containerId] = {
                id: containerId,
                assignedDataType: null,
                content: null,
                status: 'empty',
                visualFeedback: this.visualFeedback
            };
        });
        
        console.log('📦 Containers created for layout:', layoutStyle);
    }
    
    getContainerIdsForLayout(layoutStyle) {
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
            
            console.log('📝 Data type assigned to container:', containerId, dataType.name);
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
            currentLayout: this.currentLayout?.name || null,
            dragDrop: this.dragDrop,
            visualFeedback: this.visualFeedback
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Container Workspace...');
    }
}

// SM Preview Panel
class SMPreviewPanel {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.currentPreview = null;
        this.currentLayout = null;
        this.onPreviewRequestCallback = null;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.professionalUI = config.professionalUI;
        this.intuitiveDesign = config.intuitiveDesign;
        this.responsive = config.responsive;
    }
    
    setupPreview(config) {
        this.realTime = config.realTime;
        this.spatialRendering = config.spatialRendering;
        this.interactive = config.interactive;
        this.professionalUI = config.professionalUI;
        
        console.log('👁️ Preview panel configured');
    }
    
    onPreviewRequest(callback) {
        this.onPreviewRequestCallback = callback;
    }
    
    updateLayout(layout) {
        this.currentLayout = layout;
        console.log('👁️ Layout updated in preview:', layout.name);
    }
    
    updateAssignment(containerId, dataType) {
        if (this.currentPreview) {
            this.currentPreview.assignments[containerId] = dataType;
            this.currentPreview.timestamp = new Date().toISOString();
            console.log('👁️ Assignment updated in preview:', containerId, dataType.name);
        }
    }
    
    generatePreview(assignments) {
        const preview = {
            layout: this.currentLayout,
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
    
    getStatus() {
        return {
            currentPreview: this.currentPreview?.previewId || null,
            currentLayout: this.currentLayout?.name || null,
            realTime: this.realTime,
            spatialRendering: this.spatialRendering,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Preview Panel...');
    }
}

// SM Content Manager UI
class SMContentManagerUI {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.savedContent = {};
        this.contentCounter = 0;
        this.onSaveRequestCallback = null;
    }
    
    initialize(config) {
        this.dataTypes = config.dataTypes;
        this.professionalUI = config.professionalUI;
        this.intuitiveDesign = config.intuitiveDesign;
        this.responsive = config.responsive;
    }
    
    onSaveRequest(callback) {
        this.onSaveRequestCallback = callback;
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
        console.log('💾 Content saved in UI:', contentId);
        return savedContent;
    }
    
    getContent(contentId) {
        return this.savedContent[contentId];
    }
    
    getAllContent() {
        return this.savedContent;
    }
    
    getStatus() {
        return {
            savedContent: Object.keys(this.savedContent).length,
            contentCounter: this.contentCounter,
            professionalUI: this.professionalUI
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Content Manager UI...');
    }
}

// Initialize SM Content Creator UI
window.SMContentCreatorUI = SMContentCreatorUI;
window.SMLayoutSelectorUI = SMLayoutSelectorUI;
window.SMDataBallPalette = SMDataBallPalette;
window.SMContainerWorkspace = SMContainerWorkspace;
window.SMPreviewPanel = SMPreviewPanel;
window.SMContentManagerUI = SMContentManagerUI; 