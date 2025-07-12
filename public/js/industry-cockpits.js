/**
 * Industry-Specific Cockpit System
 * Dynamically adapts UI, features, and functionality based on industry
 */

class IndustryCockpitManager {
    constructor() {
        this.currentIndustry = 'general';
        this.industryConfigs = new Map();
        this.cockpitElements = new Map();
        this.featureSets = new Map();
        
        this.init();
    }

    init() {
        this.loadIndustryConfigurations();
        this.setupIndustrySwitching();
        this.initializeCurrentIndustry();
    }

    loadIndustryConfigurations() {
        // Automotive Industry Configuration
        this.industryConfigs.set('automotive', {
            name: 'Automotive',
            theme: 'cyber-blue',
            primaryColor: '#00ccff',
            accentColor: '#ff6b35',
            features: {
                physics: true,
                materials: true,
                animation: true,
                lighting: 'showroom',
                particles: true,
                spatialAudio: true,
                aiFeatures: true,
                mobileAR: true,
                advancedCamera: true,
                threeDScanner: true
            },
            ui: {
                showColorPicker: true,
                showVehicleConfigurator: true,
                showSpecsPanel: true,
                showPricingCalculator: true,
                showFinancingOptions: true,
                showTestDrive: true,
                showVirtualTour: true
            },
            templates: ['car-showcase', 'dealership', 'service-center'],
            contentTypes: ['vehicle', 'specs', 'pricing', 'financing', 'test-drive', 'service'],
            advancedFeatures: {
                vehiclePhysics: true,
                carPaintMaterials: true,
                engineSounds: true,
                suspensionAnimation: true,
                headlightEffects: true,
                tireTracks: true
            }
        });

        // Real Estate Industry Configuration
        this.industryConfigs.set('realestate', {
            name: 'Real Estate',
            theme: 'luxury-gold',
            primaryColor: '#ffd700',
            accentColor: '#8b4513',
            features: {
                physics: false,
                materials: true,
                animation: true,
                lighting: 'natural',
                particles: false,
                spatialAudio: true,
                aiFeatures: true,
                mobileAR: true,
                advancedCamera: true,
                threeDScanner: true
            },
            ui: {
                showFloorPlan: true,
                showPropertyDetails: true,
                showNeighborhoodInfo: true,
                showVirtualStaging: true,
                showWalkthrough: true,
                showContactForm: true,
                showMortgageCalculator: true
            },
            templates: ['property-tour', 'neighborhood', 'virtual-staging'],
            contentTypes: ['property', 'floorplan', 'neighborhood', 'staging', 'walkthrough', 'contact'],
            advancedFeatures: {
                naturalLighting: true,
                virtualStaging: true,
                walkthroughPaths: true,
                propertyAudio: true,
                neighborhoodMap: true,
                mortgageCalculator: true
            }
        });

        // General/Other Industries Configuration
        this.industryConfigs.set('general', {
            name: 'General',
            theme: 'modern-dark',
            primaryColor: '#6366f1',
            accentColor: '#10b981',
            features: {
                physics: true,
                materials: true,
                animation: true,
                lighting: 'studio',
                particles: true,
                spatialAudio: true,
                aiFeatures: true,
                mobileAR: true,
                advancedCamera: true,
                threeDScanner: true
            },
            ui: {
                showContentLibrary: true,
                showCustomForms: true,
                showAnalytics: true,
                showBranding: true,
                showSocialSharing: true,
                showEmbedding: true
            },
            templates: ['presentation', 'showcase', 'interactive'],
            contentTypes: ['content', 'form', 'video', 'image', 'text', 'interactive'],
            advancedFeatures: {
                customBranding: true,
                socialIntegration: true,
                analyticsTracking: true,
                embedOptions: true,
                customCSS: true
            }
        });

        // Fashion/Retail Industry Configuration
        this.industryConfigs.set('fashion', {
            name: 'Fashion & Retail',
            theme: 'fashion-purple',
            primaryColor: '#8a2be2',
            accentColor: '#9370db',
            features: {
                physics: false,
                materials: true,
                animation: true,
                lighting: 'fashion',
                particles: true,
                spatialAudio: true,
                aiFeatures: true,
                mobileAR: true,
                advancedCamera: true,
                threeDScanner: true
            },
            ui: {
                showProductCatalog: true,
                showSizeGuide: true,
                showVirtualTryOn: true,
                showWishlist: true,
                showShoppingCart: true,
                showReviews: true,
                showTrending: true
            },
            templates: ['product-showcase', 'virtual-store', 'runway'],
            contentTypes: ['product', 'catalog', 'try-on', 'reviews', 'trending', 'wishlist'],
            advancedFeatures: {
                virtualTryOn: true,
                productVisualization: true,
                trendAnalysis: true,
                sizeRecommendation: true,
                socialShopping: true
            }
        });

        // Makeup & Beauty Industry Configuration
        this.industryConfigs.set('makeup', {
            name: 'Makeup & Beauty',
            theme: 'beauty-pink',
            primaryColor: '#ff69b4',
            accentColor: '#ff1493',
            features: {
                physics: false,
                materials: true,
                animation: true,
                lighting: 'beauty',
                particles: true,
                spatialAudio: true,
                aiFeatures: true,
                mobileAR: true,
                advancedCamera: true,
                threeDScanner: true
            },
            ui: {
                showVirtualTryOn: true,
                showColorMatching: true,
                showTutorials: true,
                showProductReviews: true,
                showBeautyQuiz: true,
                showLiveShopping: true,
                showBeautyTips: true
            },
            templates: ['beauty-showcase', 'virtual-makeup', 'tutorial-studio'],
            contentTypes: ['makeup', 'tutorial', 'review', 'quiz', 'live-shopping', 'tips'],
            advancedFeatures: {
                virtualMakeup: true,
                skinToneMatching: true,
                beautyAI: true,
                liveStreaming: true,
                productVisualization: true,
                beautyAnalytics: true
            }
        });

        // Education Industry Configuration
        this.industryConfigs.set('education', {
            name: 'Education',
            theme: 'academic-blue',
            primaryColor: '#1e40af',
            accentColor: '#059669',
            features: {
                physics: true,
                materials: true,
                animation: true,
                lighting: 'classroom',
                particles: false,
                spatialAudio: true,
                aiFeatures: true,
                mobileAR: true,
                advancedCamera: true,
                threeDScanner: true
            },
            ui: {
                showLessonPlans: true,
                showInteractiveQuizzes: true,
                showVirtualLabs: true,
                showStudentProgress: true,
                showCollaboration: true,
                showAssessment: true,
                showResources: true
            },
            templates: ['virtual-classroom', 'interactive-lab', 'field-trip'],
            contentTypes: ['lesson', 'quiz', 'lab', 'assessment', 'resource', 'collaboration'],
            advancedFeatures: {
                interactiveLearning: true,
                progressTracking: true,
                collaborativeTools: true,
                assessmentTools: true,
                virtualLabs: true
            }
        });
    }

    setupIndustrySwitching() {
        // Industry mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const industry = e.target.dataset.industry || e.target.id.replace('-mode', '');
                this.switchIndustry(industry);
            });
        });
    }

    switchIndustry(industry) {
        if (!this.industryConfigs.has(industry)) {
            console.error('Unknown industry:', industry);
            return;
        }

        this.currentIndustry = industry;
        const config = this.industryConfigs.get(industry);

        // Update UI theme
        this.updateTheme(config);
        
        // Update feature visibility
        this.updateFeatureVisibility(config);
        
        // Update UI elements
        this.updateUIElements(config);
        
        // Update content types
        this.updateContentTypes(config);
        
        // Update advanced features
        this.updateAdvancedFeatures(config);
        
        // Update PlayCanvas scene
        this.updatePlayCanvasScene(config);
        
        // Show feedback
        this.showIndustryFeedback(config);
        
        // Save to localStorage
        localStorage.setItem('selectedIndustry', industry);
    }

    updateTheme(config) {
        const root = document.documentElement;
        
        // Update CSS custom properties
        root.style.setProperty('--primary-color', config.primaryColor);
        root.style.setProperty('--accent-color', config.accentColor);
        root.style.setProperty('--theme-name', config.theme);
        
        // Update body class
        document.body.className = `industry-${this.currentIndustry} theme-${config.theme}`;
        
        // Update cockpit theme
        this.updateCockpitTheme(config);
    }

    updateCockpitTheme(config) {
        const cockpit = document.querySelector('.cockpit-container');
        if (cockpit) {
            cockpit.className = `cockpit-container theme-${config.theme}`;
        }
        
        // Update sidebar themes
        document.querySelectorAll('.sidebar-section').forEach(section => {
            section.className = `sidebar-section theme-${config.theme}`;
        });
        
        // Update button themes
        document.querySelectorAll('.feature-btn').forEach(btn => {
            btn.className = `feature-btn theme-${config.theme}`;
        });
    }

    updateFeatureVisibility(config) {
        const features = config.features;
        
        // Physics features
        this.toggleFeature('physics-btn', features.physics);
        this.toggleFeature('physics-panel', features.physics);
        
        // Materials features
        this.toggleFeature('materials-btn', features.materials);
        this.toggleFeature('materials-panel', features.materials);
        
        // Animation features
        this.toggleFeature('animation-btn', features.animation);
        this.toggleFeature('animation-panel', features.animation);
        
        // Lighting features
        this.toggleFeature('lighting-btn', features.lighting);
        this.toggleFeature('lighting-panel', features.lighting);
        
        // Particle features
        this.toggleFeature('particles-btn', features.particles);
        this.toggleFeature('particles-panel', features.particles);
        
        // Spatial Audio features
        this.toggleFeature('spatial-audio-btn', features.spatialAudio);
        
        // AI features
        this.toggleFeature('ai-features-btn', features.aiFeatures);
        
        // Mobile AR features
        this.toggleFeature('mobile-ar-btn', features.mobileAR);
        
        // Advanced Camera features
        this.toggleFeature('advanced-camera-btn', features.advancedCamera);
        
        // 3D Scanner features
        this.toggleFeature('3d-scanner-btn', features.threeDScanner);
    }

    toggleFeature(featureId, enabled) {
        const element = document.getElementById(featureId);
        if (element) {
            if (enabled) {
                element.style.display = 'block';
                element.classList.remove('disabled');
            } else {
                element.style.display = 'none';
                element.classList.add('disabled');
            }
        }
    }

    updateUIElements(config) {
        const ui = config.ui;
        
        // Show/hide industry-specific UI elements
        Object.keys(ui).forEach(elementKey => {
            const element = document.getElementById(elementKey);
            if (element) {
                element.style.display = ui[elementKey] ? 'block' : 'none';
            }
        });
        
        // Update content types
        this.updateContentTypeButtons(config.contentTypes);
        
        // Update templates
        this.updateTemplateOptions(config.templates);
    }

    updateContentTypeButtons(contentTypes) {
        const contentButtons = document.querySelectorAll('.content-type-btn');
        contentButtons.forEach(btn => {
            const contentType = btn.dataset.type;
            if (contentTypes.includes(contentType)) {
                btn.style.display = 'block';
                btn.classList.remove('disabled');
            } else {
                btn.style.display = 'none';
                btn.classList.add('disabled');
            }
        });
    }

    updateTemplateOptions(templates) {
        const templateSelect = document.getElementById('template-select');
        if (templateSelect) {
            templateSelect.innerHTML = '';
            templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template;
                option.textContent = template.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                templateSelect.appendChild(option);
            });
        }
    }

    updateAdvancedFeatures(config) {
        const advancedFeatures = config.advancedFeatures;
        
        // Update PlayCanvas features based on industry
        if (window.PlayCanvasManager) {
            // Set physics mode
            if (advancedFeatures.vehiclePhysics) {
                window.PlayCanvasManager.setPhysicsMode('vehicle');
            } else if (advancedFeatures.naturalLighting) {
                window.PlayCanvasManager.setPhysicsMode('natural');
            } else {
                window.PlayCanvasManager.setPhysicsMode('floating');
            }
        }
        
        // Update material presets
        if (window.AdvancedMaterialsManager) {
            if (advancedFeatures.carPaintMaterials) {
                window.AdvancedMaterialsManager.setDefaultPreset('carPaint');
            } else if (advancedFeatures.virtualStaging) {
                window.AdvancedMaterialsManager.setDefaultPreset('realistic');
            } else {
                window.AdvancedMaterialsManager.setDefaultPreset('standard');
            }
        }
        
        // Update lighting setup
        if (window.PostProcessingManager) {
            const lightingMode = config.features.lighting;
            window.PostProcessingManager.setLightingMode(lightingMode);
        }
    }

    updatePlayCanvasScene(config) {
        if (!window.PlayCanvasManager) return;
        
        // Update scene based on industry
        switch (this.currentIndustry) {
            case 'automotive':
                this.setupAutomotiveScene();
                break;
            case 'realestate':
                this.setupRealEstateScene();
                break;
            case 'fashion':
                this.setupFashionScene();
                break;
            case 'education':
                this.setupEducationScene();
                break;
            default:
                this.setupGeneralScene();
        }
    }

    setupAutomotiveScene() {
        const manager = window.PlayCanvasManager;
        if (!manager) return;
        
        // Create showroom environment
        manager.createShowroomEnvironment();
        
        // Add vehicle physics
        if (window.AdvancedPhysicsManager) {
            window.AdvancedPhysicsManager.setPhysicsMode('vehicle');
        }
        
        // Add car paint materials
        if (window.AdvancedMaterialsManager) {
            window.AdvancedMaterialsManager.setDefaultPreset('carPaint');
        }
        
        // Add showroom lighting
        if (window.PostProcessingManager) {
            window.PostProcessingManager.setLightingMode('showroom');
        }
    }

    setupRealEstateScene() {
        const manager = window.PlayCanvasManager;
        if (!manager) return;
        
        // Create property environment
        manager.createPropertyEnvironment();
        
        // Add natural lighting
        if (window.PostProcessingManager) {
            window.PostProcessingManager.setLightingMode('natural');
        }
        
        // Add realistic materials
        if (window.AdvancedMaterialsManager) {
            window.AdvancedMaterialsManager.setDefaultPreset('realistic');
        }
    }

    setupFashionScene() {
        const manager = window.PlayCanvasManager;
        if (!manager) return;
        
        // Create fashion environment
        manager.createFashionEnvironment();
        
        // Add fashion lighting
        if (window.PostProcessingManager) {
            window.PostProcessingManager.setLightingMode('fashion');
        }
        
        // Add fashion materials
        if (window.AdvancedMaterialsManager) {
            window.AdvancedMaterialsManager.setDefaultPreset('fashion');
        }
    }

    setupEducationScene() {
        const manager = window.PlayCanvasManager;
        if (!manager) return;
        
        // Create classroom environment
        manager.createClassroomEnvironment();
        
        // Add classroom lighting
        if (window.PostProcessingManager) {
            window.PostProcessingManager.setLightingMode('classroom');
        }
        
        // Add educational materials
        if (window.AdvancedMaterialsManager) {
            window.AdvancedMaterialsManager.setDefaultPreset('educational');
        }
    }

    setupGeneralScene() {
        const manager = window.PlayCanvasManager;
        if (!manager) return;
        
        // Create general environment
        manager.createGeneralEnvironment();
        
        // Add studio lighting
        if (window.PostProcessingManager) {
            window.PostProcessingManager.setLightingMode('studio');
        }
        
        // Add standard materials
        if (window.AdvancedMaterialsManager) {
            window.AdvancedMaterialsManager.setDefaultPreset('standard');
        }
    }

    showIndustryFeedback(config) {
        const message = `🎯 Switched to ${config.name} cockpit with ${config.theme} theme`;
        this.showFeedback(message);
        
        // Show industry-specific tips
        this.showIndustryTips(config);
    }

    showIndustryTips(config) {
        const tips = this.getIndustryTips(config.name);
        if (tips.length > 0) {
            const tip = tips[Math.floor(Math.random() * tips.length)];
            setTimeout(() => {
                this.showFeedback(`💡 Tip: ${tip}`, 5000);
            }, 2000);
        }
    }

    getIndustryTips(industryName) {
        const tips = {
            'Automotive': [
                'Use vehicle physics for realistic car interactions',
                'Try car paint materials for authentic vehicle colors',
                'Add engine sounds for immersive experiences',
                'Use showroom lighting for professional presentation'
            ],
            'Real Estate': [
                'Enable natural lighting for realistic property views',
                'Use virtual staging to showcase empty spaces',
                'Add walkthrough paths for guided tours',
                'Include neighborhood information for context'
            ],
            'Fashion & Retail': [
                'Use fashion lighting for product presentation',
                'Enable virtual try-on for interactive shopping',
                'Add trend analysis for product recommendations',
                'Include size guides for better customer experience'
            ],
            'Education': [
                'Use classroom lighting for learning environments',
                'Enable interactive learning tools',
                'Add progress tracking for student engagement',
                'Include collaborative tools for group learning'
            ],
            'General': [
                'Customize branding for your business',
                'Use analytics to track engagement',
                'Enable social sharing for wider reach',
                'Add custom forms for lead generation'
            ]
        };
        
        return tips[industryName] || tips['General'];
    }

    showFeedback(message, duration = 3000) {
        if (window.SMeditor) {
            window.SMeditor.showFeedback(message, duration);
        } else {
            console.log(message);
        }
    }

    initializeCurrentIndustry() {
        // Load saved industry from localStorage
        const savedIndustry = localStorage.getItem('selectedIndustry');
        if (savedIndustry && this.industryConfigs.has(savedIndustry)) {
            this.switchIndustry(savedIndustry);
        } else {
            // Default to general
            this.switchIndustry('general');
        }
    }

    // Get current industry configuration
    getCurrentConfig() {
        return this.industryConfigs.get(this.currentIndustry);
    }

    // Get available industries
    getAvailableIndustries() {
        return Array.from(this.industryConfigs.keys());
    }

    // Check if feature is enabled for current industry
    isFeatureEnabled(featureName) {
        const config = this.getCurrentConfig();
        return config.features[featureName] || false;
    }

    // Get industry-specific content types
    getContentTypes() {
        const config = this.getCurrentConfig();
        return config.contentTypes || [];
    }

    // Get industry-specific templates
    getTemplates() {
        const config = this.getCurrentConfig();
        return config.templates || [];
    }
}

// Initialize Industry Cockpit Manager
window.IndustryCockpitManager = new IndustryCockpitManager(); 