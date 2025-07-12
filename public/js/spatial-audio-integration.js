/**
 * Spatial Audio Integration
 * Connects spatial audio system to Supabase database
 */

class SpatialAudioIntegration {
    constructor() {
        this.supabase = window.supabase;
        this.audioManager = window.SpatialAudioManager;
        this.environments = new Map();
        this.currentEnvironment = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadEnvironments();
            this.setupEventListeners();
            console.log('Spatial Audio Integration initialized');
        } catch (error) {
            console.error('Failed to initialize spatial audio integration:', error);
        }
    }

    async loadEnvironments() {
        try {
            const { data, error } = await this.supabase
                .from('spatial_audio_environments')
                .select('*')
                .or('is_public.eq.true,created_by.eq.' + (window.SupabaseIntegration?.currentUser?.id || 'null'));

            if (error) throw error;

            data.forEach(env => {
                this.environments.set(env.id, env);
            });

            console.log('Spatial audio environments loaded:', data.length);
            return data;
        } catch (error) {
            console.error('Failed to load spatial audio environments:', error);
            throw error;
        }
    }

    setupEventListeners() {
        if (!this.audioManager) return;

        // Listen for environment changes
        this.audioManager.onEnvironmentChange = (environment) => {
            this.saveEnvironmentToScene(environment);
        };

        // Listen for audio source changes
        this.audioManager.onSourceChange = (source) => {
            this.saveAudioSourceToScene(source);
        };

        // Listen for volume changes
        this.audioManager.onVolumeChange = (volume) => {
            this.saveVolumeSettingsToScene(volume);
        };
    }

    async saveEnvironmentToScene(environment) {
        if (!window.SupabaseIntegration?.currentScene) return;

        try {
            const sceneId = window.SupabaseIntegration.currentScene.id;
            const updates = {
                spatial_audio_settings: {
                    environment: environment.type,
                    tracks: environment.tracks,
                    volume: environment.volume,
                    reverb: environment.reverb
                }
            };

            await window.SupabaseIntegration.updateScene(sceneId, updates);
            console.log('Spatial audio environment saved to scene');
        } catch (error) {
            console.error('Failed to save spatial audio environment:', error);
        }
    }

    async saveAudioSourceToScene(source) {
        if (!window.SupabaseIntegration?.currentScene) return;

        try {
            const sceneId = window.SupabaseIntegration.currentScene.id;
            const currentSettings = window.SupabaseIntegration.currentScene.spatial_audio_settings || {};
            
            const updates = {
                spatial_audio_settings: {
                    ...currentSettings,
                    sources: {
                        ...currentSettings.sources,
                        [source.id]: {
                            position: source.position,
                            volume: source.volume,
                            loop: source.loop,
                            spatial: source.spatial,
                            maxDistance: source.maxDistance
                        }
                    }
                }
            };

            await window.SupabaseIntegration.updateScene(sceneId, updates);
            console.log('Audio source saved to scene');
        } catch (error) {
            console.error('Failed to save audio source:', error);
        }
    }

    async saveVolumeSettingsToScene(volumeSettings) {
        if (!window.SupabaseIntegration?.currentScene) return;

        try {
            const sceneId = window.SupabaseIntegration.currentScene.id;
            const currentSettings = window.SupabaseIntegration.currentScene.spatial_audio_settings || {};
            
            const updates = {
                spatial_audio_settings: {
                    ...currentSettings,
                    volume: volumeSettings
                }
            };

            await window.SupabaseIntegration.updateScene(sceneId, updates);
            console.log('Volume settings saved to scene');
        } catch (error) {
            console.error('Failed to save volume settings:', error);
        }
    }

    async loadSceneAudio(sceneAudioSettings) {
        if (!this.audioManager || !sceneAudioSettings) return;

        try {
            // Load environment
            if (sceneAudioSettings.environment) {
                await this.audioManager.playSoundscape(sceneAudioSettings.environment);
            }

            // Load volume settings
            if (sceneAudioSettings.volume) {
                this.audioManager.setMasterVolume(sceneAudioSettings.volume.master || 0.7);
                this.audioManager.setAmbientVolume(sceneAudioSettings.volume.ambient || 0.4);
                this.audioManager.setReverbLevel(sceneAudioSettings.volume.reverb || 0.3);
            }

            // Load audio sources
            if (sceneAudioSettings.sources) {
                Object.entries(sceneAudioSettings.sources).forEach(([id, source]) => {
                    this.audioManager.createAudioSource(id, {
                        x: source.position.x,
                        y: source.position.y,
                        z: source.position.z,
                        volume: source.volume,
                        loop: source.loop,
                        spatial: source.spatial,
                        maxDistance: source.maxDistance
                    });
                });
            }

            console.log('Scene audio loaded');
        } catch (error) {
            console.error('Failed to load scene audio:', error);
        }
    }

    async createCustomEnvironment(environmentData) {
        if (!window.SupabaseIntegration?.currentUser) return;

        try {
            const environment = {
                name: environmentData.name,
                description: environmentData.description,
                type: environmentData.type,
                tracks: environmentData.tracks,
                volumeSettings: environmentData.volumeSettings,
                reverbSettings: environmentData.reverbSettings,
                isPublic: environmentData.isPublic || false
            };

            const savedEnvironment = await window.SupabaseIntegration.saveSpatialAudioEnvironment(environment);
            this.environments.set(savedEnvironment.id, savedEnvironment);

            console.log('Custom audio environment created:', savedEnvironment.id);
            return savedEnvironment;
        } catch (error) {
            console.error('Failed to create custom environment:', error);
            throw error;
        }
    }

    async getEnvironmentSuggestions(sceneType) {
        const suggestions = [];

        // Suggest environments based on scene type
        switch (sceneType) {
            case 'automotive':
                suggestions.push({
                    id: 'showroom',
                    name: 'Car Showroom',
                    description: 'Elegant showroom atmosphere',
                    reason: 'Perfect for automotive displays'
                });
                break;
            case 'realestate':
                suggestions.push({
                    id: 'outdoor',
                    name: 'Outdoor Display',
                    description: 'Natural outdoor environment',
                    reason: 'Great for property showcases'
                });
                break;
            default:
                suggestions.push({
                    id: 'dynamic',
                    name: 'Dynamic Experience',
                    description: 'Interactive audio environment',
                    reason: 'Engaging for any content type'
                });
        }

        return suggestions;
    }

    async trackAudioInteraction(interactionType, details = {}) {
        if (!window.SupabaseIntegration) return;

        try {
            await window.SupabaseIntegration.trackInteraction('audio_play', {
                interaction_type: interactionType,
                environment: this.currentEnvironment?.type,
                volume: this.audioManager?.volume,
                details: details
            });
        } catch (error) {
            console.error('Failed to track audio interaction:', error);
        }
    }

    // Voice command integration
    async handleVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();

        if (lowerCommand.includes('play') || lowerCommand.includes('start')) {
            if (lowerCommand.includes('showroom')) {
                await this.audioManager.playSoundscape('showroom');
                await this.trackAudioInteraction('voice_command', { command, environment: 'showroom' });
            } else if (lowerCommand.includes('outdoor')) {
                await this.audioManager.playSoundscape('outdoor');
                await this.trackAudioInteraction('voice_command', { command, environment: 'outdoor' });
            } else if (lowerCommand.includes('night')) {
                await this.audioManager.playSoundscape('night');
                await this.trackAudioInteraction('voice_command', { command, environment: 'night' });
            }
        } else if (lowerCommand.includes('stop') || lowerCommand.includes('mute')) {
            this.audioManager.stopCurrentSoundscape();
            await this.trackAudioInteraction('voice_command', { command, action: 'stop' });
        } else if (lowerCommand.includes('volume')) {
            if (lowerCommand.includes('up')) {
                this.audioManager.setMasterVolume(Math.min(1, this.audioManager.volume + 0.1));
                await this.trackAudioInteraction('voice_command', { command, action: 'volume_up' });
            } else if (lowerCommand.includes('down')) {
                this.audioManager.setMasterVolume(Math.max(0, this.audioManager.volume - 0.1));
                await this.trackAudioInteraction('voice_command', { command, action: 'volume_down' });
            }
        }
    }

    // Mobile AR integration
    async setupMobileAudio() {
        if (!window.MobileARManager) return;

        // Setup audio for mobile AR sessions
        this.audioManager.setupVoiceCommands();
        
        // Track AR audio sessions
        window.MobileARManager.onSessionStart = (sessionData) => {
            this.trackAudioInteraction('ar_session_start', sessionData);
        };

        window.MobileARManager.onSessionEnd = (sessionData) => {
            this.trackAudioInteraction('ar_session_end', sessionData);
        };
    }

    // Analytics and reporting
    async getAudioAnalytics(sceneId) {
        if (!window.SupabaseIntegration) return [];

        try {
            const { data, error } = await this.supabase
                .from('scene_analytics')
                .select('*')
                .eq('scene_id', sceneId)
                .eq('interaction_type', 'audio_play')
                .order('timestamp', { ascending: false });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Failed to get audio analytics:', error);
            return [];
        }
    }

    // Cleanup
    destroy() {
        this.environments.clear();
        this.currentEnvironment = null;
        
        if (this.audioManager) {
            this.audioManager.destroy();
        }
    }
}

// Initialize Spatial Audio Integration
window.SpatialAudioIntegration = new SpatialAudioIntegration(); 