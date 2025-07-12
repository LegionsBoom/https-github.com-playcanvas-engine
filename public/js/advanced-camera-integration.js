/**
 * Advanced Camera Integration
 * Connects advanced camera system to Supabase database
 */

class AdvancedCameraIntegration {
    constructor() {
        this.supabase = window.supabase;
        this.cameraManager = window.AdvancedCameraManager;
        this.cameraPaths = new Map();
        this.currentPath = null;
        this.cameraAnalytics = [];
        
        this.init();
    }

    async init() {
        try {
            await this.loadCameraPaths();
            this.setupEventListeners();
            console.log('Advanced Camera Integration initialized');
        } catch (error) {
            console.error('Failed to initialize advanced camera integration:', error);
        }
    }

    async loadCameraPaths() {
        try {
            const paths = await window.SupabaseIntegration.loadCameraPaths();
            
            paths.forEach(path => {
                this.cameraPaths.set(path.id, path);
            });

            console.log('Camera paths loaded:', paths.length);
            return paths;
        } catch (error) {
            console.error('Failed to load camera paths:', error);
            return [];
        }
    }

    setupEventListeners() {
        if (!this.cameraManager) return;

        // Track camera movements
        this.cameraManager.onCameraMove = (cameraData) => {
            this.trackCameraMovement(cameraData);
        };

        // Track path playback
        this.cameraManager.onPathPlay = (pathData) => {
            this.trackPathPlayback(pathData);
        };

        // Track cinematic sequences
        this.cameraManager.onCinematicSequence = (sequenceData) => {
            this.trackCinematicSequence(sequenceData);
        };

        // Track drone mode
        this.cameraManager.onDroneMode = (droneData) => {
            this.trackDroneMode(droneData);
        };
    }

    async saveCameraPath(pathData) {
        if (!window.SupabaseIntegration?.currentUser) return;

        try {
            const path = {
                name: pathData.name,
                description: pathData.description,
                type: pathData.type,
                keyframes: pathData.keyframes,
                duration: pathData.duration,
                easing: pathData.easing || 'easeInOutCubic',
                isPublic: pathData.isPublic || false
            };

            const savedPath = await window.SupabaseIntegration.saveCameraPath(path);
            this.cameraPaths.set(savedPath.id, savedPath);

            console.log('Camera path saved:', savedPath.id);
            return savedPath;
        } catch (error) {
            console.error('Failed to save camera path:', error);
            throw error;
        }
    }

    async loadSceneCameraPaths(sceneCameraPaths) {
        if (!this.cameraManager || !sceneCameraPaths) return;

        try {
            sceneCameraPaths.forEach(path => {
                this.cameraManager.loadCameraPath(path);
            });

            console.log('Scene camera paths loaded:', sceneCameraPaths.length);
        } catch (error) {
            console.error('Failed to load scene camera paths:', error);
        }
    }

    trackCameraMovement(cameraData) {
        if (!window.SupabaseIntegration) return;

        const movementData = {
            position: cameraData.position,
            rotation: cameraData.rotation,
            zoom: cameraData.zoom,
            timestamp: new Date(),
            mode: cameraData.mode
        };

        this.cameraAnalytics.push(movementData);

        // Track to database periodically
        if (this.cameraAnalytics.length >= 10) {
            this.flushCameraAnalytics();
        }
    }

    async trackPathPlayback(pathData) {
        if (!window.SupabaseIntegration) return;

        try {
            await window.SupabaseIntegration.trackInteraction('camera_path_play', {
                path_id: pathData.id,
                path_name: pathData.name,
                duration: pathData.duration,
                completed: pathData.completed
            });
        } catch (error) {
            console.error('Failed to track path playback:', error);
        }
    }

    async trackCinematicSequence(sequenceData) {
        if (!window.SupabaseIntegration) return;

        try {
            await window.SupabaseIntegration.trackInteraction('cinematic_sequence', {
                sequence_type: sequenceData.type,
                duration: sequenceData.duration,
                keyframe_count: sequenceData.keyframes.length,
                effects_used: sequenceData.effects
            });
        } catch (error) {
            console.error('Failed to track cinematic sequence:', error);
        }
    }

    async trackDroneMode(droneData) {
        if (!window.SupabaseIntegration) return;

        try {
            await window.SupabaseIntegration.trackInteraction('drone_mode', {
                mode: droneData.mode,
                altitude: droneData.altitude,
                speed: droneData.speed,
                duration: droneData.duration
            });
        } catch (error) {
            console.error('Failed to track drone mode:', error);
        }
    }

    async flushCameraAnalytics() {
        if (!window.SupabaseIntegration || this.cameraAnalytics.length === 0) return;

        try {
            const analyticsData = {
                scene_id: window.SupabaseIntegration.currentScene?.id,
                camera_movements: this.cameraAnalytics,
                timestamp: new Date()
            };

            await window.SupabaseIntegration.trackInteraction('camera_analytics', analyticsData);
            
            this.cameraAnalytics = [];
            console.log('Camera analytics flushed');
        } catch (error) {
            console.error('Failed to flush camera analytics:', error);
        }
    }

    async createCinematicPath(sceneType) {
        try {
            let pathData;

            switch (sceneType) {
                case 'automotive':
                    pathData = {
                        name: 'Vehicle Showcase',
                        description: 'Cinematic path for vehicle presentation',
                        type: 'cinematic',
                        keyframes: [
                            { time: 0, position: { x: 0, y: 2, z: 5 }, rotation: { x: 0, y: 0, z: 0 } },
                            { time: 2, position: { x: 3, y: 1.5, z: 3 }, rotation: { x: 0, y: 45, z: 0 } },
                            { time: 4, position: { x: 0, y: 1, z: 2 }, rotation: { x: 0, y: 90, z: 0 } },
                            { time: 6, position: { x: -3, y: 1.5, z: 3 }, rotation: { x: 0, y: 135, z: 0 } },
                            { time: 8, position: { x: 0, y: 2, z: 5 }, rotation: { x: 0, y: 180, z: 0 } }
                        ],
                        duration: 8,
                        easing: 'easeInOutCubic'
                    };
                    break;

                case 'realestate':
                    pathData = {
                        name: 'Property Tour',
                        description: 'Cinematic path for property showcase',
                        type: 'cinematic',
                        keyframes: [
                            { time: 0, position: { x: 0, y: 3, z: 8 }, rotation: { x: -15, y: 0, z: 0 } },
                            { time: 3, position: { x: 5, y: 2, z: 5 }, rotation: { x: -10, y: 30, z: 0 } },
                            { time: 6, position: { x: 0, y: 1.5, z: 3 }, rotation: { x: 0, y: 0, z: 0 } },
                            { time: 9, position: { x: -5, y: 2, z: 5 }, rotation: { x: -10, y: -30, z: 0 } },
                            { time: 12, position: { x: 0, y: 3, z: 8 }, rotation: { x: -15, y: 0, z: 0 } }
                        ],
                        duration: 12,
                        easing: 'easeInOutCubic'
                    };
                    break;

                default:
                    pathData = {
                        name: 'General Showcase',
                        description: 'General cinematic path',
                        type: 'cinematic',
                        keyframes: [
                            { time: 0, position: { x: 0, y: 2, z: 4 }, rotation: { x: 0, y: 0, z: 0 } },
                            { time: 2, position: { x: 2, y: 1.5, z: 3 }, rotation: { x: 0, y: 30, z: 0 } },
                            { time: 4, position: { x: 0, y: 1, z: 2 }, rotation: { x: 0, y: 0, z: 0 } },
                            { time: 6, position: { x: -2, y: 1.5, z: 3 }, rotation: { x: 0, y: -30, z: 0 } },
                            { time: 8, position: { x: 0, y: 2, z: 4 }, rotation: { x: 0, y: 0, z: 0 } }
                        ],
                        duration: 8,
                        easing: 'easeInOutCubic'
                    };
            }

            const savedPath = await this.saveCameraPath(pathData);
            console.log('Cinematic path created:', savedPath.name);
            return savedPath;
        } catch (error) {
            console.error('Failed to create cinematic path:', error);
            throw error;
        }
    }

    async createDronePath(altitude, radius) {
        try {
            const pathData = {
                name: 'Drone Orbit',
                description: 'Drone-style orbital camera path',
                type: 'drone',
                keyframes: [
                    { time: 0, position: { x: radius, y: altitude, z: 0 }, rotation: { x: -30, y: 0, z: 0 } },
                    { time: 2, position: { x: 0, y: altitude, z: radius }, rotation: { x: -30, y: 90, z: 0 } },
                    { time: 4, position: { x: -radius, y: altitude, z: 0 }, rotation: { x: -30, y: 180, z: 0 } },
                    { time: 6, position: { x: 0, y: altitude, z: -radius }, rotation: { x: -30, y: 270, z: 0 } },
                    { time: 8, position: { x: radius, y: altitude, z: 0 }, rotation: { x: -30, y: 360, z: 0 } }
                ],
                duration: 8,
                easing: 'easeInOutCubic'
            };

            const savedPath = await this.saveCameraPath(pathData);
            console.log('Drone path created:', savedPath.name);
            return savedPath;
        } catch (error) {
            console.error('Failed to create drone path:', error);
            throw error;
        }
    }

    async getCameraAnalytics(sceneId) {
        if (!window.SupabaseIntegration) return [];

        try {
            const { data, error } = await this.supabase
                .from('scene_analytics')
                .select('*')
                .eq('scene_id', sceneId)
                .in('interaction_type', ['camera_path_play', 'cinematic_sequence', 'drone_mode', 'camera_analytics'])
                .order('timestamp', { ascending: false });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Failed to get camera analytics:', error);
            return [];
        }
    }

    async getPopularCameraPaths() {
        try {
            const { data, error } = await this.supabase
                .from('scene_analytics')
                .select('interaction_data')
                .eq('interaction_type', 'camera_path_play')
                .order('timestamp', { ascending: false })
                .limit(100);

            if (error) throw error;

            // Analyze popular paths
            const pathUsage = {};
            data.forEach(record => {
                const pathName = record.interaction_data?.path_name;
                if (pathName) {
                    pathUsage[pathName] = (pathUsage[pathName] || 0) + 1;
                }
            });

            const popularPaths = Object.entries(pathUsage)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            console.log('Popular camera paths:', popularPaths);
            return popularPaths;
        } catch (error) {
            console.error('Failed to get popular camera paths:', error);
            return [];
        }
    }

    async suggestCameraPaths(sceneType) {
        const suggestions = [];

        // Suggest based on scene type
        switch (sceneType) {
            case 'automotive':
                suggestions.push({
                    name: 'Vehicle Showcase',
                    description: 'Cinematic path for vehicle presentation',
                    reason: 'Perfect for automotive displays'
                });
                suggestions.push({
                    name: 'Drone Orbit',
                    description: 'Aerial view of vehicle',
                    reason: 'Great for showing vehicle from above'
                });
                break;

            case 'realestate':
                suggestions.push({
                    name: 'Property Tour',
                    description: 'Cinematic path for property showcase',
                    reason: 'Ideal for real estate presentations'
                });
                suggestions.push({
                    name: 'Exterior Walk',
                    description: 'Walking tour of property exterior',
                    reason: 'Shows property from ground level'
                });
                break;

            default:
                suggestions.push({
                    name: 'General Showcase',
                    description: 'General cinematic path',
                    reason: 'Works for any content type'
                });
        }

        return suggestions;
    }

    // Voice command integration
    async handleCameraVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();

        if (lowerCommand.includes('cinematic') || lowerCommand.includes('movie')) {
            await this.cameraManager.playCinematicSequence();
        } else if (lowerCommand.includes('drone') || lowerCommand.includes('aerial')) {
            await this.cameraManager.enableDroneMode();
        } else if (lowerCommand.includes('orbit') || lowerCommand.includes('circle')) {
            await this.cameraManager.enableOrbitMode();
        } else if (lowerCommand.includes('follow') || lowerCommand.includes('track')) {
            await this.cameraManager.enableFollowMode();
        } else if (lowerCommand.includes('reset') || lowerCommand.includes('home')) {
            await this.cameraManager.resetCamera();
        } else if (lowerCommand.includes('zoom')) {
            if (lowerCommand.includes('in')) {
                await this.cameraManager.zoomIn();
            } else if (lowerCommand.includes('out')) {
                await this.cameraManager.zoomOut();
            }
        }

        // Track voice command
        await window.SupabaseIntegration.trackVoiceCommand(command);
    }

    // Mobile AR integration
    async setupMobileCamera() {
        if (!window.MobileARManager) return;

        // Setup camera for mobile AR sessions
        this.cameraManager.setupMobileControls();
        
        // Track mobile camera sessions
        window.MobileARManager.onSessionStart = (sessionData) => {
            this.trackCameraMovement({
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                zoom: 1,
                mode: 'mobile_ar'
            });
        };
    }

    // Cleanup
    destroy() {
        this.flushCameraAnalytics();
        
        this.cameraPaths.clear();
        this.currentPath = null;
        this.cameraAnalytics = [];

        if (this.cameraManager) {
            this.cameraManager.destroy();
        }
    }
}

// Initialize Advanced Camera Integration
window.AdvancedCameraIntegration = new AdvancedCameraIntegration(); 