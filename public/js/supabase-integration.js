/**
 * Supabase Integration for Advanced Features
 * Connects spatial audio, AI features, mobile/AR, and advanced camera controls to database
 */

class SupabaseIntegration {
    constructor() {
        this.supabase = window.supabase;
        this.isConnected = false;
        this.currentUser = null;
        this.currentScene = null;
        this.analyticsQueue = [];
        this.learningDataQueue = [];
        
        this.init();
    }

    async init() {
        try {
            await this.checkConnection();
            await this.setupAuthListener();
            await this.setupRealtimeSubscriptions();
            
            this.isConnected = true;
            console.log('Supabase Integration initialized');
        } catch (error) {
            console.error('Failed to initialize Supabase integration:', error);
        }
    }

    async checkConnection() {
        try {
            const { data, error } = await this.supabase.from('users').select('count').limit(1);
            if (error) throw error;
            console.log('Supabase connection successful');
        } catch (error) {
            console.error('Supabase connection failed:', error);
            throw error;
        }
    }

    async setupAuthListener() {
        this.supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.currentUser = session.user;
                await this.initializeUserProfile();
                await this.loadUserPreferences();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.currentScene = null;
            }
        });
    }

    async setupRealtimeSubscriptions() {
        // Subscribe to scene updates
        this.supabase
            .channel('scene_updates')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'scenes' },
                (payload) => this.handleSceneUpdate(payload)
            )
            .subscribe();

        // Subscribe to analytics updates
        this.supabase
            .channel('analytics_updates')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'scene_analytics' },
                (payload) => this.handleAnalyticsUpdate(payload)
            )
            .subscribe();
    }

    // User Management
    async initializeUserProfile() {
        if (!this.currentUser) return;

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // User doesn't exist, create profile
                await this.createUserProfile();
            } else if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Failed to initialize user profile:', error);
        }
    }

    async createUserProfile() {
        if (!this.currentUser) return;

        try {
            const { error } = await this.supabase
                .from('users')
                .insert({
                    id: this.currentUser.id,
                    email: this.currentUser.email,
                    full_name: this.currentUser.user_metadata?.full_name || '',
                    user_type: 'automotive',
                    onboarding_completed: false,
                    preferences: {
                        ai_features_enabled: true,
                        spatial_audio_enabled: true,
                        mobile_ar_enabled: true,
                        advanced_camera_enabled: true,
                        ui_theme: 'cockpit',
                        notifications_enabled: true
                    }
                });

            if (error) throw error;
            console.log('User profile created');
        } catch (error) {
            console.error('Failed to create user profile:', error);
        }
    }

    async loadUserPreferences() {
        if (!this.currentUser) return;

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('preferences')
                .eq('id', this.currentUser.id)
                .single();

            if (error) throw error;

            // Apply user preferences to advanced features
            this.applyUserPreferences(data.preferences);
        } catch (error) {
            console.error('Failed to load user preferences:', error);
        }
    }

    applyUserPreferences(preferences) {
        // Apply to AI Features
        if (window.AIFeaturesManager) {
            window.AIFeaturesManager.isEnabled = preferences.ai_features_enabled;
        }

        // Apply to Spatial Audio
        if (window.SpatialAudioManager) {
            window.SpatialAudioManager.isEnabled = preferences.spatial_audio_enabled;
        }

        // Apply to Mobile AR
        if (window.MobileARManager) {
            window.MobileARManager.isEnabled = preferences.mobile_ar_enabled;
        }

        // Apply to Advanced Camera
        if (window.AdvancedCameraManager) {
            window.AdvancedCameraManager.isEnabled = preferences.advanced_camera_enabled;
        }

        console.log('User preferences applied');
    }

    // Scene Management
    async createScene(sceneData) {
        if (!this.currentUser) throw new Error('User not authenticated');

        try {
            const scene = {
                user_id: this.currentUser.id,
                title: sceneData.title,
                description: sceneData.description,
                industry_type: sceneData.industry_type || 'automotive',
                template_type: sceneData.template_type || 'grid-3x3',
                world_type: sceneData.world_type || 'flat',
                physics_mode: sceneData.physics_mode || 'floating',
                containers: sceneData.containers || {},
                brand_settings: sceneData.brand_settings || {},
                
                // Advanced Features
                spatial_audio_settings: sceneData.spatial_audio_settings || {},
                ai_features_enabled: sceneData.ai_features_enabled !== false,
                mobile_ar_enabled: sceneData.mobile_ar_enabled !== false,
                camera_paths: sceneData.camera_paths || [],
                post_processing: sceneData.post_processing || {},
                particle_systems: sceneData.particle_systems || [],
                scene_graph: sceneData.scene_graph || {},
                spatial_ui: sceneData.spatial_ui || []
            };

            const { data, error } = await this.supabase
                .from('scenes')
                .insert(scene)
                .select()
                .single();

            if (error) throw error;

            this.currentScene = data;
            console.log('Scene created:', data.id);
            return data;
        } catch (error) {
            console.error('Failed to create scene:', error);
            throw error;
        }
    }

    async updateScene(sceneId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('scenes')
                .update(updates)
                .eq('id', sceneId)
                .select()
                .single();

            if (error) throw error;

            this.currentScene = data;
            console.log('Scene updated:', sceneId);
            return data;
        } catch (error) {
            console.error('Failed to update scene:', error);
            throw error;
        }
    }

    async loadScene(sceneId) {
        try {
            const { data, error } = await this.supabase
                .from('scenes')
                .select('*')
                .eq('id', sceneId)
                .single();

            if (error) throw error;

            this.currentScene = data;
            await this.loadSceneAssets(sceneId);
            await this.loadSceneAdvancedFeatures(data);
            
            console.log('Scene loaded:', sceneId);
            return data;
        } catch (error) {
            console.error('Failed to load scene:', error);
            throw error;
        }
    }

    async loadSceneAssets(sceneId) {
        try {
            const { data, error } = await this.supabase
                .from('assets')
                .select('*')
                .eq('scene_id', sceneId);

            if (error) throw error;

            // Load assets into PlayCanvas
            if (window.PlayCanvasManager) {
                data.forEach(asset => {
                    window.PlayCanvasManager.loadAsset(asset);
                });
            }

            console.log('Scene assets loaded:', data.length);
        } catch (error) {
            console.error('Failed to load scene assets:', error);
        }
    }

    async loadSceneAdvancedFeatures(scene) {
        // Load spatial audio settings
        if (scene.spatial_audio_settings && window.SpatialAudioManager) {
            window.SpatialAudioManager.loadSceneAudio(scene.spatial_audio_settings);
        }

        // Load AI features
        if (scene.ai_features_enabled && window.AIFeaturesManager) {
            window.AIFeaturesManager.loadSceneAI(scene);
        }

        // Load camera paths
        if (scene.camera_paths && window.AdvancedCameraManager) {
            window.AdvancedCameraManager.loadSceneCameraPaths(scene.camera_paths);
        }

        // Load post-processing
        if (scene.post_processing && window.PostProcessingManager) {
            window.PostProcessingManager.loadSceneEffects(scene.post_processing);
        }

        // Load particle systems
        if (scene.particle_systems && window.ParticleSystemManager) {
            window.ParticleSystemManager.loadSceneParticles(scene.particle_systems);
        }

        console.log('Advanced features loaded for scene');
    }

    // Asset Management
    async uploadAsset(file, sceneId, assetType, metadata = {}) {
        if (!this.currentUser) throw new Error('User not authenticated');

        try {
            // Upload file to Supabase Storage
            const fileName = `${Date.now()}_${file.name}`;
            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('assets')
                .upload(`${this.currentUser.id}/${sceneId}/${fileName}`, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from('assets')
                .getPublicUrl(`${this.currentUser.id}/${sceneId}/${fileName}`);

            // Create asset record
            const asset = {
                user_id: this.currentUser.id,
                scene_id: sceneId,
                filename: fileName,
                original_name: file.name,
                mime_type: file.type,
                file_size: file.size,
                file_url: urlData.publicUrl,
                asset_type: assetType,
                metadata: metadata,
                spatial_position: metadata.spatial_position,
                spatial_rotation: metadata.spatial_rotation,
                spatial_scale: metadata.spatial_scale,
                spatial_audio_settings: metadata.spatial_audio_settings,
                ar_compatible: metadata.ar_compatible || false
            };

            const { data, error } = await this.supabase
                .from('assets')
                .insert(asset)
                .select()
                .single();

            if (error) throw error;

            console.log('Asset uploaded:', data.id);
            return data;
        } catch (error) {
            console.error('Failed to upload asset:', error);
            throw error;
        }
    }

    // Spatial Audio Integration
    async saveSpatialAudioEnvironment(environment) {
        if (!this.currentUser) throw new Error('User not authenticated');

        try {
            const audioEnv = {
                name: environment.name,
                description: environment.description,
                environment_type: environment.type,
                audio_tracks: environment.tracks,
                volume_settings: environment.volumeSettings,
                reverb_settings: environment.reverbSettings,
                created_by: this.currentUser.id,
                is_public: environment.isPublic || false
            };

            const { data, error } = await this.supabase
                .from('spatial_audio_environments')
                .insert(audioEnv)
                .select()
                .single();

            if (error) throw error;

            console.log('Spatial audio environment saved:', data.id);
            return data;
        } catch (error) {
            console.error('Failed to save spatial audio environment:', error);
            throw error;
        }
    }

    async loadSpatialAudioEnvironments() {
        try {
            const { data, error } = await this.supabase
                .from('spatial_audio_environments')
                .select('*')
                .or('is_public.eq.true,created_by.eq.' + this.currentUser.id);

            if (error) throw error;

            console.log('Spatial audio environments loaded:', data.length);
            return data;
        } catch (error) {
            console.error('Failed to load spatial audio environments:', error);
            throw error;
        }
    }

    // AI Features Integration
    async saveAILearningData(actionType, actionData, context = {}) {
        if (!this.currentUser) return;

        try {
            const learningData = {
                user_id: this.currentUser.id,
                scene_id: this.currentScene?.id,
                action_type: actionType,
                action_data: actionData,
                context: context
            };

            const { error } = await this.supabase
                .from('ai_learning_data')
                .insert(learningData);

            if (error) throw error;

            console.log('AI learning data saved');
        } catch (error) {
            console.error('Failed to save AI learning data:', error);
        }
    }

    async getAISuggestions(sceneId) {
        try {
            const { data, error } = await this.supabase
                .from('ai_learning_data')
                .select('*')
                .eq('scene_id', sceneId)
                .order('timestamp', { ascending: false })
                .limit(100);

            if (error) throw error;

            // Process learning data for suggestions
            const suggestions = this.processAILearningData(data);
            return suggestions;
        } catch (error) {
            console.error('Failed to get AI suggestions:', error);
            return [];
        }
    }

    processAILearningData(learningData) {
        // Simple suggestion algorithm based on user actions
        const actionCounts = {};
        const recentActions = learningData.slice(0, 10);

        recentActions.forEach(action => {
            actionCounts[action.action_type] = (actionCounts[action.action_type] || 0) + 1;
        });

        const suggestions = [];

        if (actionCounts['layout_created'] > 2) {
            suggestions.push({
                type: 'content',
                priority: 'high',
                reason: 'You frequently create layouts. Consider adding more content types.'
            });
        }

        if (actionCounts['camera_path_used'] < 1) {
            suggestions.push({
                type: 'camera',
                priority: 'medium',
                reason: 'Try adding cinematic camera paths to enhance your scenes.'
            });
        }

        if (actionCounts['spatial_audio_added'] < 1) {
            suggestions.push({
                type: 'audio',
                priority: 'medium',
                reason: 'Add spatial audio to create immersive experiences.'
            });
        }

        return suggestions;
    }

    // Camera Paths Integration
    async saveCameraPath(path) {
        if (!this.currentUser) throw new Error('User not authenticated');

        try {
            const cameraPath = {
                name: path.name,
                description: path.description,
                path_type: path.type,
                keyframes: path.keyframes,
                duration: path.duration,
                easing_type: path.easing || 'easeInOutCubic',
                created_by: this.currentUser.id,
                is_public: path.isPublic || false
            };

            const { data, error } = await this.supabase
                .from('camera_paths')
                .insert(cameraPath)
                .select()
                .single();

            if (error) throw error;

            console.log('Camera path saved:', data.id);
            return data;
        } catch (error) {
            console.error('Failed to save camera path:', error);
            throw error;
        }
    }

    async loadCameraPaths() {
        try {
            const { data, error } = await this.supabase
                .from('camera_paths')
                .select('*')
                .or('is_public.eq.true,created_by.eq.' + this.currentUser.id);

            if (error) throw error;

            console.log('Camera paths loaded:', data.length);
            return data;
        } catch (error) {
            console.error('Failed to load camera paths:', error);
            throw error;
        }
    }

    // Post-Processing Integration
    async savePostProcessingPreset(preset) {
        if (!this.currentUser) throw new Error('User not authenticated');

        try {
            const postProcessingPreset = {
                name: preset.name,
                description: preset.description,
                preset_type: preset.type,
                bloom_settings: preset.bloom || {},
                ssao_settings: preset.ssao || {},
                motion_blur_settings: preset.motionBlur || {},
                depth_of_field_settings: preset.depthOfField || {},
                created_by: this.currentUser.id,
                is_public: preset.isPublic || false
            };

            const { data, error } = await this.supabase
                .from('post_processing_presets')
                .insert(postProcessingPreset)
                .select()
                .single();

            if (error) throw error;

            console.log('Post-processing preset saved:', data.id);
            return data;
        } catch (error) {
            console.error('Failed to save post-processing preset:', error);
            throw error;
        }
    }

    async loadPostProcessingPresets() {
        try {
            const { data, error } = await this.supabase
                .from('post_processing_presets')
                .select('*')
                .or('is_public.eq.true,created_by.eq.' + this.currentUser.id);

            if (error) throw error;

            console.log('Post-processing presets loaded:', data.length);
            return data;
        } catch (error) {
            console.error('Failed to load post-processing presets:', error);
            throw error;
        }
    }

    // Analytics Integration
    async trackInteraction(interactionType, interactionData = {}) {
        if (!this.currentUser || !this.currentScene) return;

        try {
            const analytics = {
                scene_id: this.currentScene.id,
                interaction_type: interactionType,
                interaction_data: interactionData,
                user_agent: navigator.userAgent,
                device_type: this.getDeviceType(),
                session_duration: this.getSessionDuration()
            };

            const { error } = await this.supabase
                .from('scene_analytics')
                .insert(analytics);

            if (error) throw error;

            console.log('Interaction tracked:', interactionType);
        } catch (error) {
            console.error('Failed to track interaction:', error);
        }
    }

    async trackVoiceCommand(command, success = true) {
        if (!this.currentUser) return;

        try {
            const voiceCommand = {
                user_id: this.currentUser.id,
                command_text: command,
                command_type: this.classifyVoiceCommand(command),
                success_rate: success ? 100 : 0,
                usage_count: 1
            };

            const { error } = await this.supabase
                .from('voice_commands')
                .upsert(voiceCommand, { onConflict: 'user_id,command_text' });

            if (error) throw error;

            console.log('Voice command tracked:', command);
        } catch (error) {
            console.error('Failed to track voice command:', error);
        }
    }

    async trackARSession(sessionData) {
        if (!this.currentUser) return;

        try {
            const arSession = {
                user_id: this.currentUser.id,
                scene_id: this.currentScene?.id,
                session_type: sessionData.type,
                device_info: sessionData.deviceInfo,
                gesture_data: sessionData.gestures,
                session_duration: sessionData.duration,
                interactions_count: sessionData.interactions,
                started_at: sessionData.startedAt,
                ended_at: sessionData.endedAt
            };

            const { error } = await this.supabase
                .from('mobile_ar_sessions')
                .insert(arSession);

            if (error) throw error;

            console.log('AR session tracked');
        } catch (error) {
            console.error('Failed to track AR session:', error);
        }
    }

    // Utility Methods
    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
            return 'mobile';
        } else if (/tablet|ipad/.test(userAgent)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    getSessionDuration() {
        // Calculate session duration in seconds
        return Math.floor((Date.now() - this.sessionStartTime) / 1000);
    }

    classifyVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('layout') || lowerCommand.includes('template')) {
            return 'layout';
        } else if (lowerCommand.includes('camera') || lowerCommand.includes('view')) {
            return 'camera';
        } else if (lowerCommand.includes('audio') || lowerCommand.includes('sound')) {
            return 'audio';
        } else if (lowerCommand.includes('add') || lowerCommand.includes('create')) {
            return 'ai';
        } else {
            return 'general';
        }
    }

    // Real-time Updates
    handleSceneUpdate(payload) {
        console.log('Scene update received:', payload);
        
        if (payload.new && this.currentScene && payload.new.id === this.currentScene.id) {
            this.currentScene = payload.new;
            
            // Update UI if needed
            if (window.SMeditor) {
                window.SMeditor.updateSceneDisplay(payload.new);
            }
        }
    }

    handleAnalyticsUpdate(payload) {
        console.log('Analytics update received:', payload);
        
        // Update analytics dashboard if open
        if (window.AnalyticsDashboard) {
            window.AnalyticsDashboard.updateAnalytics(payload.new);
        }
    }

    // Batch Operations
    async flushAnalyticsQueue() {
        if (this.analyticsQueue.length === 0) return;

        try {
            const { error } = await this.supabase
                .from('scene_analytics')
                .insert(this.analyticsQueue);

            if (error) throw error;

            this.analyticsQueue = [];
            console.log('Analytics queue flushed');
        } catch (error) {
            console.error('Failed to flush analytics queue:', error);
        }
    }

    async flushLearningDataQueue() {
        if (this.learningDataQueue.length === 0) return;

        try {
            const { error } = await this.supabase
                .from('ai_learning_data')
                .insert(this.learningDataQueue);

            if (error) throw error;

            this.learningDataQueue = [];
            console.log('Learning data queue flushed');
        } catch (error) {
            console.error('Failed to flush learning data queue:', error);
        }
    }

    // Cleanup
    destroy() {
        // Flush any remaining data
        this.flushAnalyticsQueue();
        this.flushLearningDataQueue();
        
        // Unsubscribe from real-time channels
        this.supabase.removeAllChannels();
        
        this.isConnected = false;
        this.currentUser = null;
        this.currentScene = null;
    }
}

// Initialize Supabase Integration
window.SupabaseIntegration = new SupabaseIntegration(); 