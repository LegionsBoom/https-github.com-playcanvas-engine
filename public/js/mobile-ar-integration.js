/**
 * Mobile AR Integration
 * Connects mobile AR system to Supabase database
 */

class MobileARIntegration {
    constructor() {
        this.supabase = window.supabase;
        this.arManager = window.MobileARManager;
        this.currentSession = null;
        this.sessionData = {
            gestures: [],
            interactions: [],
            deviceInfo: {},
            sessionStart: null,
            sessionEnd: null
        };
        
        this.init();
    }

    async init() {
        try {
            this.setupEventListeners();
            this.detectDeviceCapabilities();
            console.log('Mobile AR Integration initialized');
        } catch (error) {
            console.error('Failed to initialize mobile AR integration:', error);
        }
    }

    setupEventListeners() {
        if (!this.arManager) return;

        // Track AR session start
        this.arManager.onSessionStart = (sessionData) => {
            this.startARSession(sessionData);
        };

        // Track AR session end
        this.arManager.onSessionEnd = (sessionData) => {
            this.endARSession(sessionData);
        };

        // Track gesture interactions
        this.arManager.onGestureDetected = (gesture) => {
            this.trackGesture(gesture);
        };

        // Track touch interactions
        this.arManager.onTouchInteraction = (interaction) => {
            this.trackTouchInteraction(interaction);
        };

        // Track device orientation changes
        this.arManager.onOrientationChange = (orientation) => {
            this.trackOrientationChange(orientation);
        };
    }

    detectDeviceCapabilities() {
        this.sessionData.deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            pixelRatio: window.devicePixelRatio,
            touchSupport: 'ontouchstart' in window,
            webGLSupport: this.checkWebGLSupport(),
            webXRSupport: this.checkWebXRSupport(),
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            connection: this.getConnectionInfo()
        };

        console.log('Device capabilities detected:', this.sessionData.deviceInfo);
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    checkWebXRSupport() {
        return 'xr' in navigator;
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return 'unknown';
    }

    async startARSession(sessionData) {
        try {
            this.sessionData.sessionStart = new Date();
            this.sessionData.gestures = [];
            this.sessionData.interactions = [];
            this.sessionData.deviceInfo = { ...this.sessionData.deviceInfo, ...sessionData.deviceInfo };

            this.currentSession = {
                type: sessionData.type || 'mobile',
                deviceInfo: this.sessionData.deviceInfo,
                sessionStart: this.sessionData.sessionStart
            };

            console.log('AR session started:', this.currentSession);
        } catch (error) {
            console.error('Failed to start AR session:', error);
        }
    }

    async endARSession(sessionData) {
        if (!this.currentSession) return;

        try {
            this.sessionData.sessionEnd = new Date();
            const sessionDuration = Math.floor((this.sessionData.sessionEnd - this.sessionData.sessionStart) / 1000);

            const arSessionData = {
                type: this.currentSession.type,
                deviceInfo: this.sessionData.deviceInfo,
                gestureData: this.sessionData.gestures,
                interactions: this.sessionData.interactions,
                sessionDuration: sessionDuration,
                startedAt: this.sessionData.sessionStart,
                endedAt: this.sessionData.sessionEnd
            };

            // Save to database
            await window.SupabaseIntegration.trackARSession(arSessionData);

            // Track analytics
            await window.SupabaseIntegration.trackInteraction('ar_session', {
                session_type: this.currentSession.type,
                duration: sessionDuration,
                gesture_count: this.sessionData.gestures.length,
                interaction_count: this.sessionData.interactions.length
            });

            console.log('AR session ended:', arSessionData);
            
            // Reset session data
            this.currentSession = null;
            this.sessionData = {
                gestures: [],
                interactions: [],
                deviceInfo: {},
                sessionStart: null,
                sessionEnd: null
            };
        } catch (error) {
            console.error('Failed to end AR session:', error);
        }
    }

    trackGesture(gesture) {
        if (!this.currentSession) return;

        const gestureData = {
            type: gesture.type,
            timestamp: new Date(),
            position: gesture.position,
            duration: gesture.duration,
            intensity: gesture.intensity,
            success: gesture.success
        };

        this.sessionData.gestures.push(gestureData);
        console.log('Gesture tracked:', gestureData);
    }

    trackTouchInteraction(interaction) {
        if (!this.currentSession) return;

        const interactionData = {
            type: interaction.type,
            timestamp: new Date(),
            position: interaction.position,
            target: interaction.target,
            duration: interaction.duration
        };

        this.sessionData.interactions.push(interactionData);
        console.log('Touch interaction tracked:', interactionData);
    }

    trackOrientationChange(orientation) {
        if (!this.currentSession) return;

        const orientationData = {
            alpha: orientation.alpha,
            beta: orientation.beta,
            gamma: orientation.gamma,
            timestamp: new Date()
        };

        // Store orientation data for analytics
        this.sessionData.interactions.push({
            type: 'orientation_change',
            data: orientationData,
            timestamp: new Date()
        });
    }

    async getARSessionAnalytics(sceneId) {
        if (!window.SupabaseIntegration) return [];

        try {
            const { data, error } = await this.supabase
                .from('mobile_ar_sessions')
                .select('*')
                .eq('scene_id', sceneId)
                .order('started_at', { ascending: false });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Failed to get AR session analytics:', error);
            return [];
        }
    }

    async getGestureAnalytics(sceneId) {
        if (!window.SupabaseIntegration) return [];

        try {
            const { data, error } = await this.supabase
                .from('scene_analytics')
                .select('*')
                .eq('scene_id', sceneId)
                .eq('interaction_type', 'gesture')
                .order('timestamp', { ascending: false });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Failed to get gesture analytics:', error);
            return [];
        }
    }

    async saveGestureTemplate(gestureTemplate) {
        if (!window.SupabaseIntegration?.currentUser) return;

        try {
            const template = {
                name: gestureTemplate.name,
                description: gestureTemplate.description,
                gesture_type: gestureTemplate.type,
                gesture_data: gestureTemplate.data,
                created_by: window.SupabaseIntegration.currentUser.id,
                is_public: gestureTemplate.isPublic || false
            };

            // Save to custom table or use existing structure
            const { data, error } = await this.supabase
                .from('templates')
                .insert({
                    name: template.name,
                    description: template.description,
                    industry_type: 'automotive',
                    template_data: { gesture_template: template },
                    created_by: window.SupabaseIntegration.currentUser.id
                })
                .select()
                .single();

            if (error) throw error;

            console.log('Gesture template saved:', data.id);
            return data;
        } catch (error) {
            console.error('Failed to save gesture template:', error);
            throw error;
        }
    }

    async loadGestureTemplates() {
        try {
            const { data, error } = await this.supabase
                .from('templates')
                .select('*')
                .contains('template_data', { gesture_template: {} })
                .or('is_public.eq.true,created_by.eq.' + (window.SupabaseIntegration?.currentUser?.id || 'null'));

            if (error) throw error;

            console.log('Gesture templates loaded:', data.length);
            return data;
        } catch (error) {
            console.error('Failed to load gesture templates:', error);
            return [];
        }
    }

    async optimizeForDevice() {
        const deviceInfo = this.sessionData.deviceInfo;
        const optimizations = [];

        // Check device capabilities and suggest optimizations
        if (deviceInfo.deviceMemory && deviceInfo.deviceMemory < 4) {
            optimizations.push({
                type: 'performance',
                action: 'reduce_particle_count',
                reason: 'Low device memory detected'
            });
        }

        if (deviceInfo.connection && deviceInfo.connection.effectiveType === 'slow-2g') {
            optimizations.push({
                type: 'network',
                action: 'reduce_asset_quality',
                reason: 'Slow network connection detected'
            });
        }

        if (!deviceInfo.webGLSupport) {
            optimizations.push({
                type: 'compatibility',
                action: 'use_fallback_renderer',
                reason: 'WebGL not supported'
            });
        }

        if (deviceInfo.screenWidth < 768) {
            optimizations.push({
                type: 'ui',
                action: 'simplify_interface',
                reason: 'Small screen detected'
            });
        }

        console.log('Device optimizations suggested:', optimizations);
        return optimizations;
    }

    async trackPerformanceMetrics(metrics) {
        if (!window.SupabaseIntegration) return;

        try {
            await window.SupabaseIntegration.trackInteraction('performance_metrics', {
                fps: metrics.fps,
                memory_usage: metrics.memoryUsage,
                render_time: metrics.renderTime,
                device_info: this.sessionData.deviceInfo
            });
        } catch (error) {
            console.error('Failed to track performance metrics:', error);
        }
    }

    async getDeviceRecommendations() {
        const deviceInfo = this.sessionData.deviceInfo;
        const recommendations = [];

        // Performance recommendations
        if (deviceInfo.deviceMemory < 4) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                message: 'Consider closing other apps for better performance',
                action: 'optimize_memory'
            });
        }

        if (deviceInfo.connection && deviceInfo.connection.effectiveType === 'slow-2g') {
            recommendations.push({
                type: 'network',
                priority: 'medium',
                message: 'Slow connection detected. Some features may load slowly.',
                action: 'optimize_network'
            });
        }

        // Feature recommendations
        if (deviceInfo.touchSupport) {
            recommendations.push({
                type: 'feature',
                priority: 'low',
                message: 'Try gesture controls for better interaction',
                action: 'enable_gestures'
            });
        }

        if (deviceInfo.webXRSupport) {
            recommendations.push({
                type: 'feature',
                priority: 'medium',
                message: 'AR features available for enhanced experience',
                action: 'enable_ar'
            });
        }

        return recommendations;
    }

    // Voice command integration for mobile
    async handleMobileVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();

        // Mobile-specific voice commands
        if (lowerCommand.includes('optimize') || lowerCommand.includes('performance')) {
            const optimizations = await this.optimizeForDevice();
            console.log('Device optimizations:', optimizations);
        } else if (lowerCommand.includes('gesture') || lowerCommand.includes('help')) {
            this.arManager.showGestureHelp();
        } else if (lowerCommand.includes('ar') || lowerCommand.includes('augmented')) {
            this.arManager.startARSession();
        } else if (lowerCommand.includes('mobile') || lowerCommand.includes('responsive')) {
            this.arManager.optimizeForDevice();
        }

        // Track voice command
        await window.SupabaseIntegration.trackVoiceCommand(command);
    }

    // Cleanup
    destroy() {
        if (this.currentSession) {
            this.endARSession({});
        }

        this.currentSession = null;
        this.sessionData = {
            gestures: [],
            interactions: [],
            deviceInfo: {},
            sessionStart: null,
            sessionEnd: null
        };

        if (this.arManager) {
            this.arManager.destroy();
        }
    }
}

// Initialize Mobile AR Integration
window.MobileARIntegration = new MobileARIntegration(); 