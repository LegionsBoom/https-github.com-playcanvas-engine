// Scene Graph Architecture for SMeditor
// Provides hierarchical scene management, transitions, templates, and inheritance

class SceneGraph {
    constructor() {
        this.scenes = new Map();
        this.activeScene = null;
        this.sceneHistory = [];
        this.templates = new SceneTemplateLibrary();
        this.transitions = new SceneTransitionManager();
        this.maxHistorySize = 10;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadTemplates();
    }
    
    setupEventListeners() {
        // Scene management events
        document.addEventListener('scene:create', (e) => {
            this.createScene(e.detail.template || 'default');
        });
        
        document.addEventListener('scene:switch', (e) => {
            this.switchScene(e.detail.sceneId, e.detail.transition);
        });
        
        document.addEventListener('scene:save', (e) => {
            this.saveScene(e.detail.sceneId);
        });
        
        document.addEventListener('scene:load', (e) => {
            this.loadScene(e.detail.sceneId);
        });
        
        // Template events
        document.addEventListener('template:create', (e) => {
            this.createFromTemplate(e.detail.templateId);
        });
        
        document.addEventListener('template:save', (e) => {
            this.saveAsTemplate(e.detail.sceneId, e.detail.templateName);
        });
    }
    
    // Scene Management
    createScene(templateId = 'default') {
        const template = this.templates.getTemplate(templateId);
        const sceneId = this.generateSceneId();
        
        const scene = {
            id: sceneId,
            name: `Scene ${this.scenes.size + 1}`,
            template: templateId,
            parent: null,
            children: [],
            entities: new Map(),
            settings: {
                worldType: template.worldType || 'flat',
                physicsMode: template.physicsMode || 'floating',
                lighting: template.lighting || 'standard',
                postProcessing: template.postProcessing || ['bloom', 'ssao']
            },
            containers: {},
            brandSettings: {
                primaryColor: '#00ffe7',
                companyName: '',
                logo: null
            },
            metadata: {
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                version: '1.0.0'
            },
            state: 'draft' // 'draft', 'published', 'archived'
        };
        
        // Apply template settings
        if (template) {
            scene.settings = { ...scene.settings, ...template.settings };
            scene.containers = { ...template.containers };
        }
        
        this.scenes.set(sceneId, scene);
        this.addToHistory(sceneId);
        
        // Fire event
        this.fireSceneEvent('scene:created', { sceneId, scene });
        
        return sceneId;
    }
    
    switchScene(sceneId, transitionType = 'fade') {
        if (!this.scenes.has(sceneId)) {
            console.error(`Scene ${sceneId} not found`);
            return false;
        }
        
        const previousScene = this.activeScene;
        const newScene = this.scenes.get(sceneId);
        
        // Perform transition
        this.transitions.performTransition(previousScene, newScene, transitionType)
            .then(() => {
                this.activeScene = newScene;
                this.addToHistory(sceneId);
                
                // Update UI
                this.updateSceneUI();
                
                // Fire event
                this.fireSceneEvent('scene:switched', { 
                    previousScene: previousScene?.id, 
                    currentScene: sceneId 
                });
            })
            .catch(error => {
                console.error('Scene transition failed:', error);
            });
        
        return true;
    }
    
    saveScene(sceneId) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return false;
        
        // Get current scene data from editor
        const currentData = this.getCurrentSceneData();
        
        // Update scene with current data
        Object.assign(scene, currentData);
        scene.metadata.lastModified = new Date().toISOString();
        
        // Save to database
        if (window.supabaseClient) {
            window.supabaseClient.saveScene(scene)
                .then(result => {
                    if (result.success) {
                        this.showFeedback('Scene saved successfully');
                        this.fireSceneEvent('scene:saved', { sceneId });
                    } else {
                        this.showFeedback('Failed to save scene', 'error');
                    }
                });
        }
        
        return true;
    }
    
    loadScene(sceneId) {
        if (window.supabaseClient) {
            window.supabaseClient.getScene(sceneId)
                .then(result => {
                    if (result.success) {
                        const scene = result.data;
                        this.scenes.set(sceneId, scene);
                        this.switchScene(sceneId);
                        this.showFeedback('Scene loaded successfully');
                    } else {
                        this.showFeedback('Failed to load scene', 'error');
                    }
                });
        }
    }
    
    // Scene Hierarchy Management
    createSubScene(parentSceneId, templateId = 'default') {
        const parentScene = this.scenes.get(parentSceneId);
        if (!parentScene) return null;
        
        const subSceneId = this.createScene(templateId);
        const subScene = this.scenes.get(subSceneId);
        
        // Set up parent-child relationship
        subScene.parent = parentSceneId;
        parentScene.children.push(subSceneId);
        
        // Inherit some settings from parent
        subScene.settings.worldType = parentScene.settings.worldType;
        subScene.brandSettings = { ...parentScene.brandSettings };
        
        this.fireSceneEvent('scene:subCreated', { 
            parentSceneId, 
            subSceneId 
        });
        
        return subSceneId;
    }
    
    // Scene Templates
    createFromTemplate(templateId) {
        return this.createScene(templateId);
    }
    
    saveAsTemplate(sceneId, templateName) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return false;
        
        const template = {
            id: this.generateTemplateId(),
            name: templateName,
            description: `Template based on ${scene.name}`,
            settings: { ...scene.settings },
            containers: { ...scene.containers },
            brandSettings: { ...scene.brandSettings },
            createdAt: new Date().toISOString()
        };
        
        this.templates.addTemplate(template);
        this.showFeedback(`Template "${templateName}" saved`);
        
        return template.id;
    }
    
    // Scene Transitions
    transitionToScene(sceneId, transitionType = 'fade') {
        return this.switchScene(sceneId, transitionType);
    }
    
    // Scene History
    addToHistory(sceneId) {
        // Remove if already exists
        const index = this.sceneHistory.indexOf(sceneId);
        if (index > -1) {
            this.sceneHistory.splice(index, 1);
        }
        
        // Add to front
        this.sceneHistory.unshift(sceneId);
        
        // Limit history size
        if (this.sceneHistory.length > this.maxHistorySize) {
            this.sceneHistory.pop();
        }
    }
    
    goBack() {
        if (this.sceneHistory.length > 1) {
            const currentIndex = this.sceneHistory.indexOf(this.activeScene?.id);
            if (currentIndex > 0) {
                const previousSceneId = this.sceneHistory[currentIndex - 1];
                this.switchScene(previousSceneId, 'slide-left');
            }
        }
    }
    
    goForward() {
        if (this.sceneHistory.length > 1) {
            const currentIndex = this.sceneHistory.indexOf(this.activeScene?.id);
            if (currentIndex < this.sceneHistory.length - 1) {
                const nextSceneId = this.sceneHistory[currentIndex + 1];
                this.switchScene(nextSceneId, 'slide-right');
            }
        }
    }
    
    // Scene Data Management
    getCurrentSceneData() {
        if (!this.activeScene) return null;
        
        // Get data from editor UI
        const title = document.getElementById('scene-title')?.value || this.activeScene.name;
        const description = document.getElementById('scene-description')?.value || '';
        
        return {
            ...this.activeScene,
            name: title,
            description: description,
            containers: this.getCurrentContainers(),
            brandSettings: this.getCurrentBrandSettings(),
            metadata: {
                ...this.activeScene.metadata,
                lastModified: new Date().toISOString()
            }
        };
    }
    
    getCurrentContainers() {
        const containers = {};
        const containerElements = document.querySelectorAll('.container-slot');
        
        containerElements.forEach((container, index) => {
            const content = container.querySelector('.container-content');
            if (content) {
                containers[index] = {
                    type: content.dataset.type,
                    data: JSON.parse(content.dataset.content || '{}')
                };
            }
        });
        
        return containers;
    }
    
    getCurrentBrandSettings() {
        return {
            primaryColor: document.getElementById('primary-color')?.value || '#00ffe7',
            companyName: document.getElementById('company-name')?.value || '',
            logo: this.activeScene?.brandSettings?.logo || null
        };
    }
    
    // Scene UI Management
    updateSceneUI() {
        if (!this.activeScene) return;
        
        // Update scene title
        const titleElement = document.getElementById('scene-title');
        if (titleElement) {
            titleElement.value = this.activeScene.name;
        }
        
        // Update scene description
        const descElement = document.getElementById('scene-description');
        if (descElement) {
            descElement.value = this.activeScene.description || '';
        }
        
        // Update scene info
        this.updateSceneInfo();
        
        // Update scene list
        this.updateSceneList();
        
        // Update navigation
        this.updateNavigation();
    }
    
    updateSceneInfo() {
        const infoContainer = document.getElementById('scene-info');
        if (!infoContainer || !this.activeScene) return;
        
        infoContainer.innerHTML = `
            <div class="scene-info-item">
                <span class="info-label">Template:</span>
                <span class="info-value">${this.activeScene.template}</span>
            </div>
            <div class="scene-info-item">
                <span class="info-label">World:</span>
                <span class="info-value">${this.activeScene.settings.worldType}</span>
            </div>
            <div class="scene-info-item">
                <span class="info-label">Physics:</span>
                <span class="info-value">${this.activeScene.settings.physicsMode}</span>
            </div>
            <div class="scene-info-item">
                <span class="info-label">Status:</span>
                <span class="info-value status-${this.activeScene.state}">${this.activeScene.state}</span>
            </div>
        `;
    }
    
    updateSceneList() {
        const listContainer = document.getElementById('scene-list');
        if (!listContainer) return;
        
        const sceneList = Array.from(this.scenes.values())
            .map(scene => `
                <div class="scene-list-item ${scene.id === this.activeScene?.id ? 'active' : ''}" 
                     data-scene-id="${scene.id}">
                    <div class="scene-item-icon">🎨</div>
                    <div class="scene-item-info">
                        <div class="scene-item-name">${scene.name}</div>
                        <div class="scene-item-meta">
                            ${scene.template} • ${scene.state}
                        </div>
                    </div>
                    <div class="scene-item-actions">
                        <button class="scene-action-btn" onclick="sceneGraph.switchScene('${scene.id}')">
                            Switch
                        </button>
                        <button class="scene-action-btn" onclick="sceneGraph.saveScene('${scene.id}')">
                            Save
                        </button>
                    </div>
                </div>
            `).join('');
        
        listContainer.innerHTML = sceneList;
    }
    
    updateNavigation() {
        const backBtn = document.getElementById('scene-back');
        const forwardBtn = document.getElementById('scene-forward');
        
        if (backBtn) {
            backBtn.disabled = this.sceneHistory.indexOf(this.activeScene?.id) <= 0;
        }
        
        if (forwardBtn) {
            forwardBtn.disabled = this.sceneHistory.indexOf(this.activeScene?.id) >= this.sceneHistory.length - 1;
        }
    }
    
    // Utility Methods
    generateSceneId() {
        return `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    generateTemplateId() {
        return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    fireSceneEvent(eventName, data) {
        document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
    
    showFeedback(message, type = 'success') {
        if (window.smeditor) {
            window.smeditor.showFeedback(message);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    // Public API
    getActiveScene() {
        return this.activeScene;
    }
    
    getScene(sceneId) {
        return this.scenes.get(sceneId);
    }
    
    getAllScenes() {
        return Array.from(this.scenes.values());
    }
    
    getSceneHistory() {
        return this.sceneHistory;
    }
    
    getTemplates() {
        return this.templates.getAllTemplates();
    }
    
    // Cleanup
    destroy() {
        this.scenes.clear();
        this.sceneHistory = [];
        this.activeScene = null;
    }
}

// Scene Template Library
class SceneTemplateLibrary {
    constructor() {
        this.templates = new Map();
        this.loadDefaultTemplates();
    }
    
    loadDefaultTemplates() {
        // Car Dealership Templates
        this.addTemplate({
            id: 'car-showcase',
            name: 'Car Showcase',
            description: 'Perfect for showcasing vehicles with 360° views',
            worldType: 'showroom',
            physicsMode: 'realistic',
            lighting: 'showroom',
            postProcessing: ['bloom', 'ssao', 'motionBlur'],
            containers: {
                0: { type: 'vehicle', data: {} },
                1: { type: 'specs', data: {} },
                2: { type: 'gallery', data: {} },
                3: { type: 'contact', data: {} }
            },
            settings: {
                cameraMode: 'orbit',
                enableParticles: true,
                enableAudio: true
            }
        });
        
        // Real Estate Templates
        this.addTemplate({
            id: 'property-tour',
            name: 'Property Tour',
            description: 'Interactive property tours with virtual staging',
            worldType: 'interior',
            physicsMode: 'walkthrough',
            lighting: 'natural',
            postProcessing: ['bloom', 'ssao', 'depthOfField'],
            containers: {
                0: { type: 'property', data: {} },
                1: { type: 'floorplan', data: {} },
                2: { type: 'neighborhood', data: {} },
                3: { type: 'contact', data: {} }
            },
            settings: {
                cameraMode: 'walkthrough',
                enableParticles: false,
                enableAudio: true
            }
        });
        
        // General Templates
        this.addTemplate({
            id: 'default',
            name: 'Default Scene',
            description: 'Basic scene template',
            worldType: 'flat',
            physicsMode: 'floating',
            lighting: 'standard',
            postProcessing: ['bloom'],
            containers: {},
            settings: {
                cameraMode: 'orbit',
                enableParticles: false,
                enableAudio: false
            }
        });
    }
    
    addTemplate(template) {
        this.templates.set(template.id, template);
    }
    
    getTemplate(templateId) {
        return this.templates.get(templateId);
    }
    
    getAllTemplates() {
        return Array.from(this.templates.values());
    }
}

// Scene Transition Manager
class SceneTransitionManager {
    constructor() {
        this.transitions = new Map();
        this.setupTransitions();
    }
    
    setupTransitions() {
        // Fade transition
        this.transitions.set('fade', (fromScene, toScene) => {
            return this.performFadeTransition(fromScene, toScene);
        });
        
        // Slide transitions
        this.transitions.set('slide-left', (fromScene, toScene) => {
            return this.performSlideTransition(fromScene, toScene, 'left');
        });
        
        this.transitions.set('slide-right', (fromScene, toScene) => {
            return this.performSlideTransition(fromScene, toScene, 'right');
        });
        
        // Zoom transition
        this.transitions.set('zoom', (fromScene, toScene) => {
            return this.performZoomTransition(fromScene, toScene);
        });
        
        // Holographic transition
        this.transitions.set('holographic', (fromScene, toScene) => {
            return this.performHolographicTransition(fromScene, toScene);
        });
    }
    
    performTransition(fromScene, toScene, transitionType) {
        const transition = this.transitions.get(transitionType);
        if (!transition) {
            console.warn(`Transition type "${transitionType}" not found, using fade`);
            return this.performFadeTransition(fromScene, toScene);
        }
        
        return transition(fromScene, toScene);
    }
    
    performFadeTransition(fromScene, toScene) {
        return new Promise((resolve) => {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'scene-transition-overlay fade';
            document.body.appendChild(overlay);
            
            // Fade out
            setTimeout(() => {
                overlay.classList.add('fade-out');
                
                // Fade in
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, 300);
            }, 300);
        });
    }
    
    performSlideTransition(fromScene, toScene, direction) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = `scene-transition-overlay slide-${direction}`;
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.classList.add('slide-out');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, 300);
            }, 300);
        });
    }
    
    performZoomTransition(fromScene, toScene) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'scene-transition-overlay zoom';
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.classList.add('zoom-out');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, 400);
            }, 400);
        });
    }
    
    performHolographicTransition(fromScene, toScene) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'scene-transition-overlay holographic';
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.classList.add('holographic-out');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, 600);
            }, 600);
        });
    }
}

// Global scene graph instance
window.SceneGraph = new SceneGraph(); 