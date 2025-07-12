/**
 * AI Features Integration
 * Connects AI features system to Supabase database
 */

class AIFeaturesIntegration {
    constructor() {
        this.supabase = window.supabase;
        this.aiManager = window.AIFeaturesManager;
        this.learningData = [];
        this.suggestions = [];
        this.userPreferences = {};
        
        this.init();
    }

    async init() {
        try {
            await this.loadUserPreferences();
            await this.loadLearningData();
            this.setupEventListeners();
            console.log('AI Features Integration initialized');
        } catch (error) {
            console.error('Failed to initialize AI features integration:', error);
        }
    }

    async loadUserPreferences() {
        if (!window.SupabaseIntegration?.currentUser) return;

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('preferences')
                .eq('id', window.SupabaseIntegration.currentUser.id)
                .single();

            if (error) throw error;

            this.userPreferences = data.preferences || {};
            this.applyPreferences();
            console.log('AI user preferences loaded');
        } catch (error) {
            console.error('Failed to load user preferences:', error);
        }
    }

    async loadLearningData() {
        if (!window.SupabaseIntegration?.currentScene) return;

        try {
            const sceneId = window.SupabaseIntegration.currentScene.id;
            const { data, error } = await this.supabase
                .from('ai_learning_data')
                .select('*')
                .eq('scene_id', sceneId)
                .order('timestamp', { ascending: false })
                .limit(100);

            if (error) throw error;

            this.learningData = data;
            console.log('AI learning data loaded:', data.length);
        } catch (error) {
            console.error('Failed to load learning data:', error);
        }
    }

    setupEventListeners() {
        if (!this.aiManager) return;

        // Listen for AI actions
        this.aiManager.onAction = (actionType, actionData) => {
            this.saveLearningData(actionType, actionData);
        };

        // Listen for suggestions
        this.aiManager.onSuggestionApplied = (suggestion) => {
            this.trackSuggestionUsage(suggestion);
        };

        // Listen for voice commands
        this.aiManager.onVoiceCommand = (command) => {
            this.trackVoiceCommand(command);
        };
    }

    async saveLearningData(actionType, actionData) {
        if (!window.SupabaseIntegration?.currentUser) return;

        try {
            const learningData = {
                user_id: window.SupabaseIntegration.currentUser.id,
                scene_id: window.SupabaseIntegration.currentScene?.id,
                action_type: actionType,
                action_data: actionData,
                context: {
                    scene_type: window.SupabaseIntegration.currentScene?.industry_type,
                    template_type: window.SupabaseIntegration.currentScene?.template_type,
                    user_preferences: this.userPreferences
                }
            };

            await window.SupabaseIntegration.saveAILearningData(actionType, actionData, learningData.context);
            this.learningData.unshift(learningData);

            console.log('AI learning data saved:', actionType);
        } catch (error) {
            console.error('Failed to save learning data:', error);
        }
    }

    async getAISuggestions(sceneId) {
        try {
            const suggestions = await window.SupabaseIntegration.getAISuggestions(sceneId);
            
            // Add contextual suggestions based on scene type
            const scene = window.SupabaseIntegration.currentScene;
            if (scene) {
                const contextualSuggestions = this.generateContextualSuggestions(scene);
                suggestions.push(...contextualSuggestions);
            }

            this.suggestions = suggestions;
            console.log('AI suggestions generated:', suggestions.length);
            return suggestions;
        } catch (error) {
            console.error('Failed to get AI suggestions:', error);
            return [];
        }
    }

    generateContextualSuggestions(scene) {
        const suggestions = [];

        // Analyze scene content
        const containers = scene.containers || {};
        const containerCount = Object.keys(containers).length;

        // Suggest based on scene type
        if (scene.industry_type === 'automotive') {
            if (containerCount < 3) {
                suggestions.push({
                    type: 'content',
                    priority: 'high',
                    reason: 'Add vehicle specifications and pricing information',
                    action: 'add_vehicle_specs'
                });
            }

            if (!scene.spatial_audio_settings?.environment) {
                suggestions.push({
                    type: 'audio',
                    priority: 'medium',
                    reason: 'Add showroom audio environment for immersion',
                    action: 'add_showroom_audio'
                });
            }

            if (!scene.camera_paths?.length) {
                suggestions.push({
                    type: 'camera',
                    priority: 'medium',
                    reason: 'Add cinematic camera paths for vehicle showcase',
                    action: 'add_vehicle_camera_path'
                });
            }
        }

        if (scene.industry_type === 'realestate') {
            if (containerCount < 2) {
                suggestions.push({
                    type: 'content',
                    priority: 'high',
                    reason: 'Add property details and virtual tour',
                    action: 'add_property_details'
                });
            }

            if (!scene.spatial_audio_settings?.environment) {
                suggestions.push({
                    type: 'audio',
                    priority: 'medium',
                    reason: 'Add outdoor audio environment for property showcase',
                    action: 'add_outdoor_audio'
                });
            }
        }

        // Suggest based on missing features
        if (!scene.post_processing?.bloom) {
            suggestions.push({
                type: 'visual',
                priority: 'low',
                reason: 'Add bloom effect for enhanced visuals',
                action: 'add_bloom_effect'
            });
        }

        if (!scene.particle_systems?.length) {
            suggestions.push({
                type: 'visual',
                priority: 'low',
                reason: 'Add particle effects for dynamic scenes',
                action: 'add_particle_effects'
            });
        }

        return suggestions;
    }

    async trackSuggestionUsage(suggestion) {
        if (!window.SupabaseIntegration) return;

        try {
            await window.SupabaseIntegration.trackInteraction('ai_suggestion', {
                suggestion_type: suggestion.type,
                suggestion_action: suggestion.action,
                priority: suggestion.priority,
                applied: true
            });
        } catch (error) {
            console.error('Failed to track suggestion usage:', error);
        }
    }

    async trackVoiceCommand(command) {
        if (!window.SupabaseIntegration) return;

        try {
            await window.SupabaseIntegration.trackVoiceCommand(command, true);
        } catch (error) {
            console.error('Failed to track voice command:', error);
        }
    }

    async applySuggestion(suggestion) {
        try {
            switch (suggestion.action) {
                case 'add_vehicle_specs':
                    await this.addVehicleSpecifications();
                    break;
                case 'add_showroom_audio':
                    await this.addShowroomAudio();
                    break;
                case 'add_vehicle_camera_path':
                    await this.addVehicleCameraPath();
                    break;
                case 'add_property_details':
                    await this.addPropertyDetails();
                    break;
                case 'add_outdoor_audio':
                    await this.addOutdoorAudio();
                    break;
                case 'add_bloom_effect':
                    await this.addBloomEffect();
                    break;
                case 'add_particle_effects':
                    await this.addParticleEffects();
                    break;
                default:
                    console.log('Unknown suggestion action:', suggestion.action);
            }

            await this.trackSuggestionUsage(suggestion);
            console.log('Suggestion applied:', suggestion.action);
        } catch (error) {
            console.error('Failed to apply suggestion:', error);
        }
    }

    async addVehicleSpecifications() {
        if (!window.SupabaseIntegration?.currentScene) return;

        try {
            const sceneId = window.SupabaseIntegration.currentScene.id;
            const containers = window.SupabaseIntegration.currentScene.containers || {};
            
            // Add vehicle specs container
            const newContainer = {
                type: 'vehicle-specs',
                content: {
                    title: 'Vehicle Specifications',
                    specs: {
                        engine: 'V6 3.0L',
                        power: '300 HP',
                        transmission: '8-Speed Automatic',
                        drivetrain: 'AWD',
                        fuel_economy: '25 MPG Combined'
                    }
                },
                position: { x: 3, y: 1.5, z: 0 },
                size: 'medium'
            };

            const containerId = `container_${Date.now()}`;
            containers[containerId] = newContainer;

            await window.SupabaseIntegration.updateScene(sceneId, { containers });
            console.log('Vehicle specifications added');
        } catch (error) {
            console.error('Failed to add vehicle specifications:', error);
        }
    }

    async addShowroomAudio() {
        if (!window.SpatialAudioManager) return;

        try {
            await window.SpatialAudioManager.playSoundscape('showroom');
            console.log('Showroom audio added');
        } catch (error) {
            console.error('Failed to add showroom audio:', error);
        }
    }

    async addVehicleCameraPath() {
        if (!window.AdvancedCameraManager) return;

        try {
            await window.AdvancedCameraManager.playCameraPath('vehicle-focus');
            console.log('Vehicle camera path added');
        } catch (error) {
            console.error('Failed to add vehicle camera path:', error);
        }
    }

    async addPropertyDetails() {
        if (!window.SupabaseIntegration?.currentScene) return;

        try {
            const sceneId = window.SupabaseIntegration.currentScene.id;
            const containers = window.SupabaseIntegration.currentScene.containers || {};
            
            // Add property details container
            const newContainer = {
                type: 'property-details',
                content: {
                    title: 'Property Details',
                    details: {
                        bedrooms: '3',
                        bathrooms: '2.5',
                        square_feet: '2,200',
                        lot_size: '0.25 acres',
                        year_built: '2020'
                    }
                },
                position: { x: 3, y: 1.5, z: 0 },
                size: 'medium'
            };

            const containerId = `container_${Date.now()}`;
            containers[containerId] = newContainer;

            await window.SupabaseIntegration.updateScene(sceneId, { containers });
            console.log('Property details added');
        } catch (error) {
            console.error('Failed to add property details:', error);
        }
    }

    async addOutdoorAudio() {
        if (!window.SpatialAudioManager) return;

        try {
            await window.SpatialAudioManager.playSoundscape('outdoor');
            console.log('Outdoor audio added');
        } catch (error) {
            console.error('Failed to add outdoor audio:', error);
        }
    }

    async addBloomEffect() {
        if (!window.PostProcessingManager) return;

        try {
            window.PostProcessingManager.enableBloom();
            console.log('Bloom effect added');
        } catch (error) {
            console.error('Failed to add bloom effect:', error);
        }
    }

    async addParticleEffects() {
        if (!window.ParticleSystemManager) return;

        try {
            window.ParticleSystemManager.createSparkleBurst();
            console.log('Particle effects added');
        } catch (error) {
            console.error('Failed to add particle effects:', error);
        }
    }

    applyPreferences() {
        if (!this.aiManager) return;

        // Apply user preferences to AI manager
        this.aiManager.isEnabled = this.userPreferences.ai_features_enabled !== false;
        this.aiManager.voiceCommandsEnabled = this.userPreferences.voice_commands_enabled !== false;
        this.aiManager.suggestionsEnabled = this.userPreferences.ai_suggestions_enabled !== false;

        console.log('AI preferences applied');
    }

    async updateUserPreferences(preferences) {
        if (!window.SupabaseIntegration?.currentUser) return;

        try {
            const { error } = await this.supabase
                .from('users')
                .update({ preferences: { ...this.userPreferences, ...preferences } })
                .eq('id', window.SupabaseIntegration.currentUser.id);

            if (error) throw error;

            this.userPreferences = { ...this.userPreferences, ...preferences };
            this.applyPreferences();
            console.log('AI user preferences updated');
        } catch (error) {
            console.error('Failed to update user preferences:', error);
        }
    }

    async getAIAnalytics(sceneId) {
        if (!window.SupabaseIntegration) return [];

        try {
            const { data, error } = await this.supabase
                .from('scene_analytics')
                .select('*')
                .eq('scene_id', sceneId)
                .in('interaction_type', ['ai_suggestion', 'voice_command'])
                .order('timestamp', { ascending: false });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Failed to get AI analytics:', error);
            return [];
        }
    }

    // Cleanup
    destroy() {
        this.learningData = [];
        this.suggestions = [];
        this.userPreferences = {};
        
        if (this.aiManager) {
            this.aiManager.destroy();
        }
    }
}

// Initialize AI Features Integration
window.AIFeaturesIntegration = new AIFeaturesIntegration(); 