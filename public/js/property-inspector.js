// Property Inspector for SMeditor
// Provides dynamic property panels for editing entity properties, materials, transforms, and components

class PropertyInspector {
    constructor() {
        this.currentTarget = null;
        this.propertyGroups = new Map();
        this.inspectorPanel = null;
        this.isUpdating = false;
        
        this.init();
    }
    
    init() {
        this.createInspectorPanel();
        this.setupEventListeners();
    }
    
    createInspectorPanel() {
        this.inspectorPanel = document.createElement('div');
        this.inspectorPanel.className = 'property-inspector cockpit-theme';
        this.inspectorPanel.innerHTML = `
            <div class="inspector-header">
                <h3>Properties</h3>
                <button class="inspector-close" aria-label="Close inspector">×</button>
            </div>
            <div class="inspector-content">
                <div class="no-selection">
                    <div class="no-selection-icon">🎯</div>
                    <p>Select an entity to inspect its properties</p>
                </div>
                <div class="property-groups" style="display: none;">
                    <!-- Dynamic property groups will be inserted here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(this.inspectorPanel);
    }
    
    setupEventListeners() {
        // Close button
        const closeBtn = this.inspectorPanel.querySelector('.inspector-close');
        closeBtn.addEventListener('click', () => {
            this.hide();
        });
        
        // Global click listener to detect entity selection
        document.addEventListener('click', (e) => {
            const entity = e.target.closest('[data-entity-id]');
            if (entity) {
                this.inspectEntity(entity.dataset.entityId);
            }
        });
    }
    
    // Inspect an entity
    inspectEntity(entityId) {
        if (this.currentTarget === entityId) return;
        
        this.currentTarget = entityId;
        this.isUpdating = true;
        
        // Clear previous groups
        this.propertyGroups.clear();
        
        // Get entity data
        const entity = this.getEntityData(entityId);
        if (!entity) {
            this.showNoSelection();
            return;
        }
        
        // Generate property groups based on entity type
        this.generatePropertyGroups(entity);
        
        // Render the inspector
        this.renderInspector();
        
        this.isUpdating = false;
        this.show();
    }
    
    getEntityData(entityId) {
        // Get entity data from different sources
        if (window.PlayCanvasManager && window.PlayCanvasManager.app) {
            const entity = window.PlayCanvasManager.app.root.findByTag(entityId);
            if (entity) {
                return this.extractEntityData(entity);
            }
        }
        
        // Check SMeditor containers
        if (window.smeditor && window.smeditor.containers) {
            const containerData = window.smeditor.containers.get(parseInt(entityId));
            if (containerData) {
                return {
                    type: 'container',
                    id: entityId,
                    data: containerData
                };
            }
        }
        
        return null;
    }
    
    extractEntityData(entity) {
        const data = {
            type: 'entity',
            id: entity.name || entity.id,
            position: entity.getPosition(),
            rotation: entity.getEulerAngles(),
            scale: entity.getLocalScale(),
            components: {}
        };
        
        // Extract component data
        if (entity.model) {
            data.components.model = {
                type: 'model',
                material: entity.model.material ? {
                    diffuse: entity.model.material.diffuse,
                    emissive: entity.model.material.emissive,
                    opacity: entity.model.material.opacity
                } : null
            };
        }
        
        if (entity.camera) {
            data.components.camera = {
                type: 'camera',
                fov: entity.camera.fov,
                nearClip: entity.camera.nearClip,
                farClip: entity.camera.farClip
            };
        }
        
        if (entity.light) {
            data.components.light = {
                type: 'light',
                color: entity.light.color,
                intensity: entity.light.intensity,
                range: entity.light.range
            };
        }
        
        return data;
    }
    
    generatePropertyGroups(entity) {
        // Transform Group
        this.addTransformGroup(entity);
        
        // Component Groups
        if (entity.components) {
            Object.keys(entity.components).forEach(componentType => {
                this.addComponentGroup(entity, componentType, entity.components[componentType]);
            });
        }
        
        // Custom Properties Group
        if (entity.data) {
            this.addCustomPropertiesGroup(entity);
        }
    }
    
    addTransformGroup(entity) {
        const transformGroup = {
            title: 'Transform',
            icon: '🎯',
            properties: [
                {
                    name: 'Position X',
                    type: 'number',
                    value: entity.position ? entity.position.x : 0,
                    min: -100,
                    max: 100,
                    step: 0.1,
                    onChange: (value) => this.updateTransform(entity.id, 'position', 'x', value)
                },
                {
                    name: 'Position Y',
                    type: 'number',
                    value: entity.position ? entity.position.y : 0,
                    min: -100,
                    max: 100,
                    step: 0.1,
                    onChange: (value) => this.updateTransform(entity.id, 'position', 'y', value)
                },
                {
                    name: 'Position Z',
                    type: 'number',
                    value: entity.position ? entity.position.z : 0,
                    min: -100,
                    max: 100,
                    step: 0.1,
                    onChange: (value) => this.updateTransform(entity.id, 'position', 'z', value)
                },
                {
                    name: 'Rotation X',
                    type: 'number',
                    value: entity.rotation ? entity.rotation.x : 0,
                    min: -180,
                    max: 180,
                    step: 1,
                    onChange: (value) => this.updateTransform(entity.id, 'rotation', 'x', value)
                },
                {
                    name: 'Rotation Y',
                    type: 'number',
                    value: entity.rotation ? entity.rotation.y : 0,
                    min: -180,
                    max: 180,
                    step: 1,
                    onChange: (value) => this.updateTransform(entity.id, 'rotation', 'y', value)
                },
                {
                    name: 'Rotation Z',
                    type: 'number',
                    value: entity.rotation ? entity.rotation.z : 0,
                    min: -180,
                    max: 180,
                    step: 1,
                    onChange: (value) => this.updateTransform(entity.id, 'rotation', 'z', value)
                },
                {
                    name: 'Scale X',
                    type: 'number',
                    value: entity.scale ? entity.scale.x : 1,
                    min: 0.1,
                    max: 10,
                    step: 0.1,
                    onChange: (value) => this.updateTransform(entity.id, 'scale', 'x', value)
                },
                {
                    name: 'Scale Y',
                    type: 'number',
                    value: entity.scale ? entity.scale.y : 1,
                    min: 0.1,
                    max: 10,
                    step: 0.1,
                    onChange: (value) => this.updateTransform(entity.id, 'scale', 'y', value)
                },
                {
                    name: 'Scale Z',
                    type: 'number',
                    value: entity.scale ? entity.scale.z : 1,
                    min: 0.1,
                    max: 10,
                    step: 0.1,
                    onChange: (value) => this.updateTransform(entity.id, 'scale', 'z', value)
                }
            ]
        };
        
        this.propertyGroups.set('transform', transformGroup);
    }
    
    addComponentGroup(entity, componentType, componentData) {
        let group = null;
        
        switch (componentType) {
            case 'model':
                group = this.createMaterialGroup(entity, componentData);
                break;
            case 'camera':
                group = this.createCameraGroup(entity, componentData);
                break;
            case 'light':
                group = this.createLightGroup(entity, componentData);
                break;
        }
        
        if (group) {
            this.propertyGroups.set(componentType, group);
        }
    }
    
    createMaterialGroup(entity, materialData) {
        if (!materialData.material) return null;
        
        return {
            title: 'Material',
            icon: '🎨',
            properties: [
                {
                    name: 'Diffuse Color',
                    type: 'color',
                    value: materialData.material.diffuse ? 
                        this.rgbToHex(materialData.material.diffuse) : '#ffffff',
                    onChange: (value) => this.updateMaterial(entity.id, 'diffuse', this.hexToRgb(value))
                },
                {
                    name: 'Emissive Color',
                    type: 'color',
                    value: materialData.material.emissive ? 
                        this.rgbToHex(materialData.material.emissive) : '#000000',
                    onChange: (value) => this.updateMaterial(entity.id, 'emissive', this.hexToRgb(value))
                },
                {
                    name: 'Opacity',
                    type: 'number',
                    value: materialData.material.opacity || 1,
                    min: 0,
                    max: 1,
                    step: 0.1,
                    onChange: (value) => this.updateMaterial(entity.id, 'opacity', value)
                }
            ]
        };
    }
    
    createCameraGroup(entity, cameraData) {
        return {
            title: 'Camera',
            icon: '📷',
            properties: [
                {
                    name: 'Field of View',
                    type: 'number',
                    value: cameraData.fov || 60,
                    min: 10,
                    max: 120,
                    step: 1,
                    onChange: (value) => this.updateCamera(entity.id, 'fov', value)
                },
                {
                    name: 'Near Clip',
                    type: 'number',
                    value: cameraData.nearClip || 0.1,
                    min: 0.01,
                    max: 10,
                    step: 0.01,
                    onChange: (value) => this.updateCamera(entity.id, 'nearClip', value)
                },
                {
                    name: 'Far Clip',
                    type: 'number',
                    value: cameraData.farClip || 1000,
                    min: 10,
                    max: 10000,
                    step: 10,
                    onChange: (value) => this.updateCamera(entity.id, 'farClip', value)
                }
            ]
        };
    }
    
    createLightGroup(entity, lightData) {
        return {
            title: 'Light',
            icon: '💡',
            properties: [
                {
                    name: 'Color',
                    type: 'color',
                    value: lightData.color ? this.rgbToHex(lightData.color) : '#ffffff',
                    onChange: (value) => this.updateLight(entity.id, 'color', this.hexToRgb(value))
                },
                {
                    name: 'Intensity',
                    type: 'number',
                    value: lightData.intensity || 1,
                    min: 0,
                    max: 10,
                    step: 0.1,
                    onChange: (value) => this.updateLight(entity.id, 'intensity', value)
                },
                {
                    name: 'Range',
                    type: 'number',
                    value: lightData.range || 10,
                    min: 0,
                    max: 100,
                    step: 1,
                    onChange: (value) => this.updateLight(entity.id, 'range', value)
                }
            ]
        };
    }
    
    addCustomPropertiesGroup(entity) {
        if (!entity.data || !entity.data.content) return;
        
        const properties = [];
        Object.keys(entity.data.content).forEach(key => {
            const value = entity.data.content[key];
            properties.push({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                type: typeof value === 'number' ? 'number' : 'text',
                value: value,
                onChange: (newValue) => this.updateCustomProperty(entity.id, key, newValue)
            });
        });
        
        if (properties.length > 0) {
            this.propertyGroups.set('custom', {
                title: 'Content',
                icon: '📄',
                properties: properties
            });
        }
    }
    
    renderInspector() {
        const groupsContainer = this.inspectorPanel.querySelector('.property-groups');
        const noSelection = this.inspectorPanel.querySelector('.no-selection');
        
        if (this.propertyGroups.size === 0) {
            groupsContainer.style.display = 'none';
            noSelection.style.display = 'block';
            return;
        }
        
        noSelection.style.display = 'none';
        groupsContainer.style.display = 'block';
        
        groupsContainer.innerHTML = '';
        
        this.propertyGroups.forEach((group, key) => {
            const groupElement = this.createPropertyGroup(group);
            groupsContainer.appendChild(groupElement);
        });
    }
    
    createPropertyGroup(group) {
        const groupElement = document.createElement('div');
        groupElement.className = 'property-group';
        groupElement.innerHTML = `
            <div class="group-header">
                <span class="group-icon">${group.icon}</span>
                <h4>${group.title}</h4>
                <button class="group-toggle">▼</button>
            </div>
            <div class="group-content">
                ${group.properties.map(prop => this.createPropertyField(prop)).join('')}
            </div>
        `;
        
        // Add toggle functionality
        const toggle = groupElement.querySelector('.group-toggle');
        const content = groupElement.querySelector('.group-content');
        
        toggle.addEventListener('click', () => {
            const isExpanded = content.style.display !== 'none';
            content.style.display = isExpanded ? 'none' : 'block';
            toggle.textContent = isExpanded ? '▶' : '▼';
        });
        
        return groupElement;
    }
    
    createPropertyField(property) {
        const fieldId = `prop-${Math.random().toString(36).substr(2, 9)}`;
        
        let inputHtml = '';
        switch (property.type) {
            case 'color':
                inputHtml = `<input type="color" id="${fieldId}" value="${property.value}" />`;
                break;
            case 'number':
                inputHtml = `
                    <input type="range" id="${fieldId}" 
                           min="${property.min}" max="${property.max}" 
                           step="${property.step}" value="${property.value}" />
                    <input type="number" class="number-input" 
                           min="${property.min}" max="${property.max}" 
                           step="${property.step}" value="${property.value}" />
                `;
                break;
            case 'text':
            default:
                inputHtml = `<input type="text" id="${fieldId}" value="${property.value}" />`;
                break;
        }
        
        return `
            <div class="property-field">
                <label for="${fieldId}">${property.name}</label>
                <div class="property-inputs">
                    ${inputHtml}
                </div>
            </div>
        `;
    }
    
    // Update methods
    updateTransform(entityId, transformType, axis, value) {
        if (window.PlayCanvasManager && window.PlayCanvasManager.app) {
            const entity = window.PlayCanvasManager.app.root.findByTag(entityId);
            if (entity) {
                switch (transformType) {
                    case 'position':
                        const pos = entity.getPosition();
                        pos[axis] = value;
                        entity.setPosition(pos);
                        break;
                    case 'rotation':
                        const rot = entity.getEulerAngles();
                        rot[axis] = value;
                        entity.setEulerAngles(rot);
                        break;
                    case 'scale':
                        const scale = entity.getLocalScale();
                        scale[axis] = value;
                        entity.setLocalScale(scale);
                        break;
                }
            }
        }
    }
    
    updateMaterial(entityId, property, value) {
        if (window.PlayCanvasManager && window.PlayCanvasManager.app) {
            const entity = window.PlayCanvasManager.app.root.findByTag(entityId);
            if (entity && entity.model && entity.model.material) {
                switch (property) {
                    case 'diffuse':
                        entity.model.material.diffuse = new pc.Color(value.r, value.g, value.b);
                        break;
                    case 'emissive':
                        entity.model.material.emissive = new pc.Color(value.r, value.g, value.b);
                        break;
                    case 'opacity':
                        entity.model.material.opacity = value;
                        break;
                }
                entity.model.material.update();
            }
        }
    }
    
    updateCamera(entityId, property, value) {
        if (window.PlayCanvasManager && window.PlayCanvasManager.app) {
            const entity = window.PlayCanvasManager.app.root.findByTag(entityId);
            if (entity && entity.camera) {
                entity.camera[property] = value;
            }
        }
    }
    
    updateLight(entityId, property, value) {
        if (window.PlayCanvasManager && window.PlayCanvasManager.app) {
            const entity = window.PlayCanvasManager.app.root.findByTag(entityId);
            if (entity && entity.light) {
                switch (property) {
                    case 'color':
                        entity.light.color = new pc.Color(value.r, value.g, value.b);
                        break;
                    case 'intensity':
                        entity.light.intensity = value;
                        break;
                    case 'range':
                        entity.light.range = value;
                        break;
                }
            }
        }
    }
    
    updateCustomProperty(entityId, property, value) {
        if (window.smeditor && window.smeditor.containers) {
            const containerData = window.smeditor.containers.get(parseInt(entityId));
            if (containerData && containerData.content) {
                containerData.content[property] = value;
                window.smeditor.validateScene();
            }
        }
    }
    
    // Utility methods
    rgbToHex(color) {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 1, g: 1, b: 1 };
    }
    
    show() {
        this.inspectorPanel.style.display = 'block';
    }
    
    hide() {
        this.inspectorPanel.style.display = 'none';
    }
    
    showNoSelection() {
        const groupsContainer = this.inspectorPanel.querySelector('.property-groups');
        const noSelection = this.inspectorPanel.querySelector('.no-selection');
        
        groupsContainer.style.display = 'none';
        noSelection.style.display = 'block';
    }
}

// Global property inspector instance
window.PropertyInspector = new PropertyInspector(); 