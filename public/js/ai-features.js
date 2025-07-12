/**
 * AI-Powered Features System
 * Smart layout suggestions, voice commands, and intelligent content recommendations
 */

class AIFeaturesManager {
    constructor() {
        this.isEnabled = false;
        this.voiceRecognition = null;
        this.suggestionEngine = null;
        this.layoutAnalyzer = null;
        this.contentRecommender = null;
        this.voiceCommands = new Map();
        this.smartSuggestions = [];
        this.learningData = {
            userPreferences: {},
            layoutPatterns: [],
            contentUsage: {}
        };
        
        this.init();
    }

    async init() {
        try {
            this.setupVoiceRecognition();
            this.initializeSuggestionEngine();
            this.setupVoiceCommands();
            this.loadLearningData();
            
            this.isEnabled = true;
            console.log('AI Features System initialized');
        } catch (error) {
            console.error('Failed to initialize AI features:', error);
        }
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.voiceRecognition = new SpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = false;
            this.voiceRecognition.lang = 'en-US';

            this.voiceRecognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };

            this.voiceRecognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
            };

            this.voiceRecognition.start();
        }
    }

    initializeSuggestionEngine() {
        this.suggestionEngine = {
            layoutTemplates: this.getLayoutTemplates(),
            contentSuggestions: this.getContentSuggestions(),
            optimizationRules: this.getOptimizationRules()
        };
    }

    getLayoutTemplates() {
        return {
            'car-showroom': {
                name: 'Car Showroom Layout',
                description: 'Optimized layout for showcasing vehicles',
                elements: [
                    { type: 'vehicle', position: { x: 0, y: 0, z: 0 }, scale: 1.2 },
                    { type: 'lighting', position: { x: 0, y: 5, z: 0 }, intensity: 0.8 },
                    { type: 'info-panel', position: { x: 3, y: 1.5, z: 0 }, size: 'medium' },
                    { type: 'branding', position: { x: -3, y: 2, z: 0 }, size: 'large' }
                ],
                camera: { position: { x: 5, y: 3, z: 5 }, target: { x: 0, y: 1, z: 0 } }
            },
            'outdoor-display': {
                name: 'Outdoor Display Layout',
                description: 'Natural outdoor environment for vehicle presentation',
                elements: [
                    { type: 'vehicle', position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
                    { type: 'environment', position: { x: 0, y: 0, z: 0 }, type: 'outdoor' },
                    { type: 'lighting', position: { x: 0, y: 10, z: 0 }, intensity: 1.0 },
                    { type: 'info-panel', position: { x: 4, y: 1.5, z: 0 }, size: 'large' }
                ],
                camera: { position: { x: 8, y: 4, z: 8 }, target: { x: 0, y: 1, z: 0 } }
            },
            'interactive-demo': {
                name: 'Interactive Demo Layout',
                description: 'Engaging interactive experience with hotspots',
                elements: [
                    { type: 'vehicle', position: { x: 0, y: 0, z: 0 }, scale: 1.1 },
                    { type: 'hotspots', positions: [
                        { x: 2, y: 1, z: 0, info: 'Engine Details' },
                        { x: -2, y: 1, z: 0, info: 'Interior Features' },
                        { x: 0, y: 1, z: 2, info: 'Safety Features' }
                    ]},
                    { type: 'lighting', position: { x: 0, y: 6, z: 0 }, intensity: 0.9 },
                    { type: 'ui-overlay', position: { x: 0, y: 0, z: 0 }, type: 'floating' }
                ],
                camera: { position: { x: 6, y: 3, z: 6 }, target: { x: 0, y: 1, z: 0 } }
            }
        };
    }

    getContentSuggestions() {
        return {
            'vehicle-features': [
                { type: 'text', content: 'Advanced Safety Systems', style: 'highlight' },
                { type: 'text', content: 'Premium Interior Materials', style: 'feature' },
                { type: 'text', content: 'Eco-Friendly Technology', style: 'benefit' }
            ],
            'branding-elements': [
                { type: 'logo', style: 'modern', position: 'top-left' },
                { type: 'tagline', content: 'Innovation Meets Luxury', style: 'elegant' },
                { type: 'contact-info', style: 'minimal' }
            ],
            'interactive-elements': [
                { type: 'color-picker', options: ['Red', 'Blue', 'Silver', 'Black'] },
                { type: 'specs-panel', layout: 'expandable' },
                { type: 'comparison-tool', mode: 'side-by-side' }
            ]
        };
    }

    getOptimizationRules() {
        return {
            performance: {
                maxPolygons: 50000,
                maxTextures: 10,
                maxLights: 5,
                targetFPS: 60
            },
            accessibility: {
                minContrastRatio: 4.5,
                minTouchTarget: 44,
                maxAnimationDuration: 500
            },
            userExperience: {
                maxLoadTime: 3000,
                minInteractionDelay: 100,
                smoothTransitions: true
            }
        };
    }

    setupVoiceCommands() {
        // Layout commands
        this.voiceCommands.set('apply layout', (params) => {
            const layoutName = params.layout || 'car-showroom';
            this.applyLayoutTemplate(layoutName);
        });

        this.voiceCommands.set('optimize scene', () => {
            this.optimizeCurrentScene();
        });

        this.voiceCommands.set('add hotspot', (params) => {
            const position = params.position || { x: 0, y: 1, z: 0 };
            this.addSmartHotspot(position, params.info);
        });

        this.voiceCommands.set('change color', (params) => {
            const color = params.color || 'red';
            this.changeVehicleColor(color);
        });

        this.voiceCommands.set('show specs', () => {
            this.showVehicleSpecifications();
        });

        this.voiceCommands.set('add lighting', (params) => {
            const type = params.type || 'spotlight';
            this.addSmartLighting(type);
        });

        this.voiceCommands.set('suggest content', () => {
            this.generateContentSuggestions();
        });

        this.voiceCommands.set('auto arrange', () => {
            this.autoArrangeElements();
        });
    }

    processVoiceCommand(command) {
        console.log('AI Voice Command:', command);

        // Parse command and parameters
        const parsedCommand = this.parseVoiceCommand(command);
        
        // Find matching command handler
        for (const [pattern, handler] of this.voiceCommands) {
            if (command.includes(pattern)) {
                const params = this.extractCommandParameters(command);
                handler(params);
                return;
            }
        }

        // Fallback to natural language processing
        this.processNaturalLanguage(command);
    }

    parseVoiceCommand(command) {
        const patterns = {
            layout: /(apply|use|set)\s+(layout|template)\s+(\w+)/i,
            color: /(change|set)\s+color\s+(to\s+)?(\w+)/i,
            hotspot: /(add|create)\s+hotspot\s+(at\s+)?(\w+)/i,
            lighting: /(add|create)\s+(\w+)\s+light(ing)?/i,
            optimize: /(optimize|improve)\s+(scene|performance)/i
        };

        for (const [type, pattern] of Object.entries(patterns)) {
            const match = command.match(pattern);
            if (match) {
                return { type, params: match.slice(1) };
            }
        }

        return { type: 'unknown', params: [] };
    }

    extractCommandParameters(command) {
        const params = {};
        
        // Extract color
        const colorMatch = command.match(/color\s+(?:to\s+)?(\w+)/i);
        if (colorMatch) params.color = colorMatch[1];

        // Extract layout
        const layoutMatch = command.match(/layout\s+(\w+)/i);
        if (layoutMatch) params.layout = layoutMatch[1];

        // Extract position
        const positionMatch = command.match(/at\s+(\w+)/i);
        if (positionMatch) params.position = positionMatch[1];

        return params;
    }

    processNaturalLanguage(command) {
        // Simple natural language processing
        if (command.includes('better') || command.includes('improve')) {
            this.suggestImprovements();
        } else if (command.includes('problem') || command.includes('issue')) {
            this.diagnoseIssues();
        } else if (command.includes('recommend') || command.includes('suggest')) {
            this.generateRecommendations();
        }
    }

    // Smart Layout Suggestions
    applyLayoutTemplate(templateName) {
        const template = this.suggestionEngine.layoutTemplates[templateName];
        if (!template) {
            console.error(`Layout template '${templateName}' not found`);
            return;
        }

        console.log(`Applying layout template: ${template.name}`);

        // Apply template elements
        template.elements.forEach(element => {
            this.createSmartElement(element);
        });

        // Apply camera settings
        if (template.camera) {
            this.applyCameraSettings(template.camera);
        }

        // Show success notification
        this.showNotification(`Applied ${template.name}`, 'success');
    }

    createSmartElement(elementConfig) {
        const { type, position, scale, intensity, size, info } = elementConfig;

        switch (type) {
            case 'vehicle':
                this.addVehicleToScene(position, scale);
                break;
            case 'lighting':
                this.addSmartLighting('spotlight', position, intensity);
                break;
            case 'info-panel':
                this.addInfoPanel(position, size);
                break;
            case 'branding':
                this.addBrandingElement(position, size);
                break;
            case 'hotspots':
                if (Array.isArray(elementConfig.positions)) {
                    elementConfig.positions.forEach(hotspot => {
                        this.addSmartHotspot(hotspot, hotspot.info);
                    });
                }
                break;
            case 'environment':
                this.setEnvironment(elementConfig.type);
                break;
            case 'ui-overlay':
                this.addUIOverlay(elementConfig.type);
                break;
        }
    }

    addVehicleToScene(position, scale = 1.0) {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.addVehicle({
                position: position || { x: 0, y: 0, z: 0 },
                scale: scale,
                color: this.getRecommendedColor()
            });
        }
    }

    addSmartLighting(type, position, intensity = 1.0) {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.addLight({
                type: type,
                position: position || { x: 0, y: 5, z: 0 },
                intensity: intensity,
                color: type === 'spotlight' ? '#ffffff' : '#ffaa00'
            });
        }
    }

    addInfoPanel(position, size = 'medium') {
        const panel = {
            type: 'info-panel',
            position: position || { x: 3, y: 1.5, z: 0 },
            size: size,
            content: this.getRecommendedContent('vehicle-features')
        };

        if (window.SMeditor) {
            window.SMeditor.addContainer(panel);
        }
    }

    addBrandingElement(position, size = 'medium') {
        const branding = {
            type: 'branding',
            position: position || { x: -3, y: 2, z: 0 },
            size: size,
            content: this.getRecommendedContent('branding-elements')
        };

        if (window.SMeditor) {
            window.SMeditor.addContainer(branding);
        }
    }

    addSmartHotspot(position, info) {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.addHotspot({
                position: position || { x: 0, y: 1, z: 0 },
                info: info || 'Feature Highlight',
                style: 'glowing'
            });
        }
    }

    // Content Recommendations
    getRecommendedContent(type) {
        const suggestions = this.suggestionEngine.contentSuggestions[type];
        if (suggestions) {
            return suggestions[Math.floor(Math.random() * suggestions.length)];
        }
        return null;
    }

    getRecommendedColor() {
        const colors = ['#ff0000', '#0000ff', '#c0c0c0', '#000000', '#ffffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateContentSuggestions() {
        const suggestions = [];
        
        // Analyze current scene
        const sceneAnalysis = this.analyzeCurrentScene();
        
        // Generate recommendations based on analysis
        if (sceneAnalysis.hasVehicle && !sceneAnalysis.hasSpecs) {
            suggestions.push({
                type: 'specs-panel',
                priority: 'high',
                reason: 'Vehicle present but no specifications shown'
            });
        }

        if (sceneAnalysis.hasBranding && !sceneAnalysis.hasContact) {
            suggestions.push({
                type: 'contact-info',
                priority: 'medium',
                reason: 'Branding present but no contact information'
            });
        }

        if (sceneAnalysis.hasVehicle && !sceneAnalysis.hasColorPicker) {
            suggestions.push({
                type: 'color-picker',
                priority: 'high',
                reason: 'Vehicle present but no color customization'
            });
        }

        this.displaySuggestions(suggestions);
    }

    analyzeCurrentScene() {
        // Analyze current scene state
        const analysis = {
            hasVehicle: false,
            hasLighting: false,
            hasBranding: false,
            hasSpecs: false,
            hasContact: false,
            hasColorPicker: false,
            hasHotspots: false
        };

        // Check PlayCanvas scene
        if (window.PlayCanvasManager) {
            const entities = window.PlayCanvasManager.getSceneEntities();
            analysis.hasVehicle = entities.some(e => e.tags && e.tags.includes('vehicle'));
            analysis.hasLighting = entities.some(e => e.tags && e.tags.includes('light'));
            analysis.hasHotspots = entities.some(e => e.tags && e.tags.includes('hotspot'));
        }

        // Check SMeditor containers
        if (window.SMeditor) {
            const containers = window.SMeditor.getContainers();
            analysis.hasBranding = containers.some(c => c.type === 'branding');
            analysis.hasSpecs = containers.some(c => c.type === 'specs-panel');
            analysis.hasContact = containers.some(c => c.type === 'contact-info');
            analysis.hasColorPicker = containers.some(c => c.type === 'color-picker');
        }

        return analysis;
    }

    displaySuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.showNotification('No suggestions available', 'info');
            return;
        }

        const suggestionsPanel = document.createElement('div');
        suggestionsPanel.className = 'ai-suggestions-panel';
        suggestionsPanel.innerHTML = `
            <div class="suggestions-header">
                <h3>🤖 AI Suggestions</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="suggestions-list">
                ${suggestions.map(suggestion => `
                    <div class="suggestion-item priority-${suggestion.priority}">
                        <div class="suggestion-content">
                            <strong>${suggestion.type}</strong>
                            <p>${suggestion.reason}</p>
                        </div>
                        <button onclick="window.AIFeaturesManager.applySuggestion('${suggestion.type}')">
                            Apply
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(suggestionsPanel);
    }

    applySuggestion(suggestionType) {
        switch (suggestionType) {
            case 'specs-panel':
                this.addInfoPanel({ x: 3, y: 1.5, z: 0 }, 'large');
                break;
            case 'contact-info':
                this.addBrandingElement({ x: -3, y: 2, z: 0 }, 'medium');
                break;
            case 'color-picker':
                this.addColorPicker();
                break;
        }

        this.showNotification(`Applied ${suggestionType}`, 'success');
    }

    addColorPicker() {
        if (window.SMeditor) {
            const colorPicker = {
                type: 'color-picker',
                position: { x: 0, y: 2, z: 0 },
                options: ['Red', 'Blue', 'Silver', 'Black', 'White'],
                onColorChange: (color) => {
                    if (window.PlayCanvasManager) {
                        window.PlayCanvasManager.changeVehicleColor(color);
                    }
                }
            };

            window.SMeditor.addContainer(colorPicker);
        }
    }

    // Scene Optimization
    optimizeCurrentScene() {
        const optimizations = [];

        // Performance optimizations
        if (window.PlayCanvasManager) {
            const performance = window.PlayCanvasManager.getPerformanceMetrics();
            
            if (performance.polygonCount > this.suggestionEngine.optimizationRules.performance.maxPolygons) {
                optimizations.push('Reduce polygon count');
            }

            if (performance.textureCount > this.suggestionEngine.optimizationRules.performance.maxTextures) {
                optimizations.push('Optimize texture usage');
            }

            if (performance.lightCount > this.suggestionEngine.optimizationRules.performance.maxLights) {
                optimizations.push('Reduce lighting complexity');
            }
        }

        // Accessibility optimizations
        const contrastRatio = this.calculateContrastRatio();
        if (contrastRatio < this.suggestionEngine.optimizationRules.accessibility.minContrastRatio) {
            optimizations.push('Improve text contrast');
        }

        if (optimizations.length > 0) {
            this.showOptimizationSuggestions(optimizations);
        } else {
            this.showNotification('Scene is already optimized!', 'success');
        }
    }

    calculateContrastRatio() {
        // Simplified contrast calculation
        return 4.8; // Placeholder
    }

    showOptimizationSuggestions(optimizations) {
        const panel = document.createElement('div');
        panel.className = 'optimization-panel';
        panel.innerHTML = `
            <div class="optimization-header">
                <h3>⚡ Optimization Suggestions</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="optimization-list">
                ${optimizations.map(opt => `
                    <div class="optimization-item">
                        <span>${opt}</span>
                        <button onclick="window.AIFeaturesManager.applyOptimization('${opt}')">
                            Apply
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(panel);
    }

    applyOptimization(optimization) {
        switch (optimization) {
            case 'Reduce polygon count':
                if (window.PlayCanvasManager) {
                    window.PlayCanvasManager.optimizeGeometry();
                }
                break;
            case 'Optimize texture usage':
                if (window.PlayCanvasManager) {
                    window.PlayCanvasManager.optimizeTextures();
                }
                break;
            case 'Reduce lighting complexity':
                if (window.PlayCanvasManager) {
                    window.PlayCanvasManager.optimizeLighting();
                }
                break;
            case 'Improve text contrast':
                this.improveTextContrast();
                break;
        }

        this.showNotification(`Applied: ${optimization}`, 'success');
    }

    improveTextContrast() {
        // Apply high contrast text styling
        const style = document.createElement('style');
        style.textContent = `
            .text-content {
                color: #000000 !important;
                background-color: #ffffff !important;
                text-shadow: 1px 1px 2px rgba(255,255,255,0.8) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-arrangement
    autoArrangeElements() {
        if (window.PlayCanvasManager && window.SMeditor) {
            const entities = window.PlayCanvasManager.getSceneEntities();
            const containers = window.SMeditor.getContainers();

            // Arrange vehicles in center
            const vehicles = entities.filter(e => e.tags && e.tags.includes('vehicle'));
            vehicles.forEach((vehicle, index) => {
                const angle = (index / vehicles.length) * Math.PI * 2;
                const radius = 5;
                const position = {
                    x: Math.cos(angle) * radius,
                    y: 0,
                    z: Math.sin(angle) * radius
                };
                window.PlayCanvasManager.moveEntity(vehicle.id, position);
            });

            // Arrange UI elements around the scene
            const uiElements = containers.filter(c => c.type === 'info-panel' || c.type === 'branding');
            uiElements.forEach((element, index) => {
                const angle = (index / uiElements.length) * Math.PI * 2;
                const radius = 8;
                const position = {
                    x: Math.cos(angle) * radius,
                    y: 2,
                    z: Math.sin(angle) * radius
                };
                window.SMeditor.moveContainer(element.id, position);
            });

            this.showNotification('Elements auto-arranged', 'success');
        }
    }

    // Learning and Improvement
    loadLearningData() {
        const saved = localStorage.getItem('ai-learning-data');
        if (saved) {
            this.learningData = JSON.parse(saved);
        }
    }

    saveLearningData() {
        localStorage.setItem('ai-learning-data', JSON.stringify(this.learningData));
    }

    recordUserAction(action, context) {
        this.learningData.userPreferences[action] = {
            count: (this.learningData.userPreferences[action]?.count || 0) + 1,
            lastUsed: Date.now(),
            context: context
        };

        this.saveLearningData();
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ai-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    suggestImprovements() {
        const improvements = [
            'Add more lighting for better visibility',
            'Include vehicle specifications',
            'Add interactive hotspots',
            'Optimize for mobile devices'
        ];

        this.displaySuggestions(improvements.map(imp => ({
            type: 'improvement',
            priority: 'medium',
            reason: imp
        })));
    }

    diagnoseIssues() {
        const issues = [];
        
        if (window.PlayCanvasManager) {
            const performance = window.PlayCanvasManager.getPerformanceMetrics();
            
            if (performance.fps < 30) {
                issues.push('Low frame rate detected');
            }
            
            if (performance.memoryUsage > 100) {
                issues.push('High memory usage');
            }
        }

        if (issues.length > 0) {
            this.showOptimizationSuggestions(issues);
        } else {
            this.showNotification('No issues detected', 'success');
        }
    }

    generateRecommendations() {
        this.generateContentSuggestions();
    }

    // Cleanup
    destroy() {
        if (this.voiceRecognition) {
            this.voiceRecognition.stop();
        }
        
        this.saveLearningData();
        this.voiceCommands.clear();
        this.smartSuggestions = [];
    }
}

// Singleton instance
window.AIFeaturesManager = new AIFeaturesManager(); 