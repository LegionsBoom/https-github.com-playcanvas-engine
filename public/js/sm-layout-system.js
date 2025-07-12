/**
 * SM Layout System
 * Globe and Flat Land Layout Styles for Spatial Data Consumption
 * Developed by Fungai Taranhike
 */

class SMLayoutManager {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.version = '1.0.0';
        this.systemName = 'SM Layout System';
        
        // Layout styles
        this.layouts = {
            globe: new SMGlobeLayout(),
            flatLand: new SMFlatLandLayout()
        };
        
        // Container templates
        this.containerTemplates = {
            image: new SMImageContainer(),
            text: new SMTextContainer(),
            video: new SMVideoContainer(),
            contact: new SMContactContainer(),
            model3d: new SM3DModelContainer(),
            carousel: new SMCarouselContainer()
        };
        
        this.init();
    }
    
    init() {
        console.log('🌍 Initializing SM Layout System...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.initializeLayouts();
        this.createContainerTemplates();
        this.setupSpatialNavigation();
        
        console.log('✅ SM Layout System Ready');
        console.log('🎯 Focus: Spatial Data Consumption Layouts');
    }
    
    initializeLayouts() {
        // Initialize globe and flat land layouts
        Object.values(this.layouts).forEach(layout => {
            layout.initialize({
                spatialRendering: true,
                interactive: true,
                responsive: true
            });
        });
        
        console.log('✅ Layouts initialized');
    }
    
    createContainerTemplates() {
        // Create container templates for different data types
        Object.values(this.containerTemplates).forEach(template => {
            template.initialize({
                spatialAware: true,
                interactive: true,
                responsive: true
            });
        });
        
        console.log('✅ Container templates created');
    }
    
    setupSpatialNavigation() {
        // Setup spatial navigation for different layout styles
        this.setupGlobeNavigation();
        this.setupFlatLandNavigation();
        
        console.log('✅ Spatial navigation configured');
    }
    
    setupGlobeNavigation() {
        // Setup orbital navigation for globe style
        const globeNav = {
            type: 'orbital',
            controls: ['rotate', 'zoom', 'pan'],
            smooth: true,
            constraints: {
                minDistance: 5,
                maxDistance: 50,
                minPolarAngle: 0,
                maxPolarAngle: Math.PI
            }
        };
        
        this.layouts.globe.setupNavigation(globeNav);
        console.log('🌍 Globe navigation configured');
    }
    
    setupFlatLandNavigation() {
        // Setup pan-zoom navigation for flat land style
        const flatLandNav = {
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
        };
        
        this.layouts.flatLand.setupNavigation(flatLandNav);
        console.log('🏞️ Flat land navigation configured');
    }
    
    // Public API methods
    
    getLayout(style) {
        return this.layouts[style];
    }
    
    getContainerTemplate(type) {
        return this.containerTemplates[type];
    }
    
    createSpatialExperience(layoutStyle, dataAssignments) {
        const layout = this.getLayout(layoutStyle);
        const experience = layout.createExperience(dataAssignments);
        
        console.log('🌍 Spatial experience created:', layoutStyle);
        return experience;
    }
    
    getLayoutStatus() {
        const status = {};
        Object.entries(this.layouts).forEach(([style, layout]) => {
            status[style] = layout.getStatus();
        });
        return status;
    }
    
    // Cleanup
    destroy() {
        console.log('🔄 Destroying SM Layout System...');
        Object.values(this.layouts).forEach(layout => {
            layout.destroy();
        });
        Object.values(this.containerTemplates).forEach(template => {
            template.destroy();
        });
    }
}

// SM Globe Layout
class SMGlobeLayout {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.type = 'spherical';
        this.containers = [];
        this.navigation = null;
    }
    
    initialize(config) {
        this.spatialRendering = config.spatialRendering;
        this.interactive = config.interactive;
        this.responsive = config.responsive;
        
        this.createGlobeContainers();
    }
    
    createGlobeContainers() {
        // Create distributed containers around a sphere
        this.containers = [
            // Top hemisphere
            { id: 'globe-north-pole', position: [0, 8, 0], rotation: [0, 0, 0], size: [3, 3, 3] },
            { id: 'globe-north-east', position: [5.7, 5.7, 0], rotation: [0, 45, 0], size: [3, 3, 3] },
            { id: 'globe-north-west', position: [-5.7, 5.7, 0], rotation: [0, -45, 0], size: [3, 3, 3] },
            { id: 'globe-east', position: [8, 0, 0], rotation: [0, 90, 0], size: [3, 3, 3] },
            { id: 'globe-west', position: [-8, 0, 0], rotation: [0, -90, 0], size: [3, 3, 3] },
            
            // Bottom hemisphere
            { id: 'globe-south-east', position: [5.7, -5.7, 0], rotation: [0, 45, 180], size: [3, 3, 3] },
            { id: 'globe-south-west', position: [-5.7, -5.7, 0], rotation: [0, -45, 180], size: [3, 3, 3] },
            { id: 'globe-south-pole', position: [0, -8, 0], rotation: [0, 0, 180], size: [3, 3, 3] },
            
            // Front and back
            { id: 'globe-front', position: [0, 0, 8], rotation: [0, 0, 0], size: [3, 3, 3] },
            { id: 'globe-back', position: [0, 0, -8], rotation: [0, 180, 0], size: [3, 3, 3] }
        ];
        
        console.log('🌍 Globe containers created');
    }
    
    setupNavigation(config) {
        this.navigation = config;
        console.log('🧭 Globe navigation configured');
    }
    
    createExperience(dataAssignments) {
        const experience = {
            type: 'globe',
            containers: this.containers,
            navigation: this.navigation,
            dataAssignments: dataAssignments,
            spatialRendering: this.spatialRendering,
            interactive: this.interactive
        };
        
        return experience;
    }
    
    getStatus() {
        return {
            type: this.type,
            containers: this.containers.length,
            navigation: this.navigation?.type || null,
            spatialRendering: this.spatialRendering,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Globe Layout...');
    }
}

// SM Flat Land Layout
class SMFlatLandLayout {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.type = 'planar';
        this.containers = [];
        this.navigation = null;
    }
    
    initialize(config) {
        this.spatialRendering = config.spatialRendering;
        this.interactive = config.interactive;
        this.responsive = config.responsive;
        
        this.createFlatLandContainers();
    }
    
    createFlatLandContainers() {
        // Create grid-based containers for flat land style
        this.containers = [
            // Top row
            { id: 'flat-top-left', position: [-6, 0, -6], rotation: [0, 0, 0], size: [3, 3, 3] },
            { id: 'flat-top-center', position: [0, 0, -6], rotation: [0, 0, 0], size: [3, 3, 3] },
            { id: 'flat-top-right', position: [6, 0, -6], rotation: [0, 0, 0], size: [3, 3, 3] },
            
            // Middle row
            { id: 'flat-center-left', position: [-6, 0, 0], rotation: [0, 0, 0], size: [3, 3, 3] },
            { id: 'flat-center-center', position: [0, 0, 0], rotation: [0, 0, 0], size: [3, 3, 3] },
            { id: 'flat-center-right', position: [6, 0, 0], rotation: [0, 0, 0], size: [3, 3, 3] },
            
            // Bottom row
            { id: 'flat-bottom-left', position: [-6, 0, 6], rotation: [0, 0, 0], size: [3, 3, 3] },
            { id: 'flat-bottom-center', position: [0, 0, 6], rotation: [0, 0, 0], size: [3, 3, 3] },
            { id: 'flat-bottom-right', position: [6, 0, 6], rotation: [0, 0, 0], size: [3, 3, 3] }
        ];
        
        console.log('🏞️ Flat land containers created');
    }
    
    setupNavigation(config) {
        this.navigation = config;
        console.log('🧭 Flat land navigation configured');
    }
    
    createExperience(dataAssignments) {
        const experience = {
            type: 'flatLand',
            containers: this.containers,
            navigation: this.navigation,
            dataAssignments: dataAssignments,
            spatialRendering: this.spatialRendering,
            interactive: this.interactive
        };
        
        return experience;
    }
    
    getStatus() {
        return {
            type: this.type,
            containers: this.containers.length,
            navigation: this.navigation?.type || null,
            spatialRendering: this.spatialRendering,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Flat Land Layout...');
    }
}

// SM Container Templates
class SMImageContainer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.type = 'image';
        this.color = '#ff6b6b';
        this.icon = 'fas fa-image';
    }
    
    initialize(config) {
        this.spatialAware = config.spatialAware;
        this.interactive = config.interactive;
        this.responsive = config.responsive;
    }
    
    createContainer(data) {
        return {
            type: this.type,
            color: this.color,
            icon: this.icon,
            data: data,
            spatialAware: this.spatialAware,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Image Container...');
    }
}

class SMTextContainer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.type = 'text';
        this.color = '#4ecdc4';
        this.icon = 'fas fa-font';
    }
    
    initialize(config) {
        this.spatialAware = config.spatialAware;
        this.interactive = config.interactive;
        this.responsive = config.responsive;
    }
    
    createContainer(data) {
        return {
            type: this.type,
            color: this.color,
            icon: this.icon,
            data: data,
            spatialAware: this.spatialAware,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Text Container...');
    }
}

class SMVideoContainer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.type = 'video';
        this.color = '#45b7d1';
        this.icon = 'fas fa-video';
    }
    
    initialize(config) {
        this.spatialAware = config.spatialAware;
        this.interactive = config.interactive;
        this.responsive = config.responsive;
    }
    
    createContainer(data) {
        return {
            type: this.type,
            color: this.color,
            icon: this.icon,
            data: data,
            spatialAware: this.spatialAware,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Video Container...');
    }
}

class SMContactContainer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.type = 'contact';
        this.color = '#96ceb4';
        this.icon = 'fas fa-address-card';
    }
    
    initialize(config) {
        this.spatialAware = config.spatialAware;
        this.interactive = config.interactive;
        this.responsive = config.responsive;
    }
    
    createContainer(data) {
        return {
            type: this.type,
            color: this.color,
            icon: this.icon,
            data: data,
            spatialAware: this.spatialAware,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Contact Container...');
    }
}

class SM3DModelContainer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.type = 'model3d';
        this.color = '#feca57';
        this.icon = 'fas fa-cube';
    }
    
    initialize(config) {
        this.spatialAware = config.spatialAware;
        this.interactive = config.interactive;
        this.responsive = config.responsive;
    }
    
    createContainer(data) {
        return {
            type: this.type,
            color: this.color,
            icon: this.icon,
            data: data,
            spatialAware: this.spatialAware,
            interactive: this.interactive,
            arEnabled: true
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM 3D Model Container...');
    }
}

class SMCarouselContainer {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.type = 'carousel';
        this.color = '#ff9ff3';
        this.icon = 'fas fa-images';
    }
    
    initialize(config) {
        this.spatialAware = config.spatialAware;
        this.interactive = config.interactive;
        this.responsive = config.responsive;
    }
    
    createContainer(data) {
        return {
            type: this.type,
            color: this.color,
            icon: this.icon,
            data: data,
            spatialAware: this.spatialAware,
            interactive: this.interactive
        };
    }
    
    destroy() {
        console.log('🔄 Destroying SM Carousel Container...');
    }
}

// Initialize SM Layout System
window.SMLayoutManager = SMLayoutManager;
window.SMGlobeLayout = SMGlobeLayout;
window.SMFlatLandLayout = SMFlatLandLayout;
window.SMImageContainer = SMImageContainer;
window.SMTextContainer = SMTextContainer;
window.SMVideoContainer = SMVideoContainer;
window.SMContactContainer = SMContactContainer;
window.SM3DModelContainer = SM3DModelContainer;
window.SMCarouselContainer = SMCarouselContainer; 