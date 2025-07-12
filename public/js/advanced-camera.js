/**
 * Advanced Camera Controls System
 * Cinematic camera paths, drone mode, and professional camera movements
 */

class AdvancedCameraManager {
    constructor() {
        this.isEnabled = false;
        this.currentMode = 'orbit';
        this.cameraPaths = new Map();
        this.activePath = null;
        this.droneMode = false;
        this.cinematicMode = false;
        this.cameraSettings = {
            fov: 60,
            near: 0.1,
            far: 1000,
            sensitivity: 1.0,
            smoothness: 0.1
        };
        this.cameraStates = {
            orbit: { position: { x: 5, y: 3, z: 5 }, target: { x: 0, y: 1, z: 0 } },
            drone: { position: { x: 0, y: 10, z: 0 }, target: { x: 0, y: 0, z: 0 } },
            cinematic: { position: { x: 8, y: 4, z: 8 }, target: { x: 0, y: 1, z: 0 } },
            walkthrough: { position: { x: 0, y: 1.7, z: 5 }, target: { x: 0, y: 1.7, z: 0 } }
        };
        
        this.init();
    }

    async init() {
        try {
            this.setupCameraPaths();
            this.setupCameraModes();
            this.setupKeyboardControls();
            this.setupMouseControls();
            
            this.isEnabled = true;
            console.log('Advanced Camera Controls System initialized');
        } catch (error) {
            console.error('Failed to initialize advanced camera controls:', error);
        }
    }

    setupCameraPaths() {
        // Car Showroom Path
        this.cameraPaths.set('showroom-intro', {
            name: 'Showroom Introduction',
            description: 'Cinematic introduction to the showroom',
            duration: 8000,
            easing: 'easeInOutCubic',
            keyframes: [
                { time: 0, position: { x: 15, y: 8, z: 15 }, target: { x: 0, y: 2, z: 0 }, fov: 45 },
                { time: 2000, position: { x: 8, y: 4, z: 8 }, target: { x: 0, y: 1, z: 0 }, fov: 60 },
                { time: 4000, position: { x: 5, y: 3, z: 5 }, target: { x: 0, y: 1, z: 0 }, fov: 70 },
                { time: 6000, position: { x: 3, y: 2, z: 3 }, target: { x: 0, y: 1, z: 0 }, fov: 80 },
                { time: 8000, position: { x: 5, y: 3, z: 5 }, target: { x: 0, y: 1, z: 0 }, fov: 60 }
            ]
        });

        // Vehicle Focus Path
        this.cameraPaths.set('vehicle-focus', {
            name: 'Vehicle Focus',
            description: 'Focus on vehicle features',
            duration: 6000,
            easing: 'easeInOutQuart',
            keyframes: [
                { time: 0, position: { x: 5, y: 3, z: 5 }, target: { x: 0, y: 1, z: 0 }, fov: 60 },
                { time: 1500, position: { x: 3, y: 2, z: 0 }, target: { x: 0, y: 1, z: 0 }, fov: 70 },
                { time: 3000, position: { x: -3, y: 2, z: 0 }, target: { x: 0, y: 1, z: 0 }, fov: 70 },
                { time: 4500, position: { x: 0, y: 4, z: 3 }, target: { x: 0, y: 1, z: 0 }, fov: 65 },
                { time: 6000, position: { x: 5, y: 3, z: 5 }, target: { x: 0, y: 1, z: 0 }, fov: 60 }
            ]
        });

        // Drone Overview Path
        this.cameraPaths.set('drone-overview', {
            name: 'Drone Overview',
            description: 'Aerial view of the entire scene',
            duration: 10000,
            easing: 'easeInOutSine',
            keyframes: [
                { time: 0, position: { x: 0, y: 15, z: 0 }, target: { x: 0, y: 0, z: 0 }, fov: 45 },
                { time: 2500, position: { x: 10, y: 12, z: 10 }, target: { x: 0, y: 0, z: 0 }, fov: 50 },
                { time: 5000, position: { x: -10, y: 12, z: -10 }, target: { x: 0, y: 0, z: 0 }, fov: 50 },
                { time: 7500, position: { x: 0, y: 8, z: 15 }, target: { x: 0, y: 0, z: 0 }, fov: 55 },
                { time: 10000, position: { x: 0, y: 15, z: 0 }, target: { x: 0, y: 0, z: 0 }, fov: 45 }
            ]
        });

        // Interior Walkthrough Path
        this.cameraPaths.set('interior-walkthrough', {
            name: 'Interior Walkthrough',
            description: 'First-person interior exploration',
            duration: 12000,
            easing: 'easeInOutSine',
            keyframes: [
                { time: 0, position: { x: 0, y: 1.7, z: 5 }, target: { x: 0, y: 1.7, z: 0 }, fov: 75 },
                { time: 3000, position: { x: 2, y: 1.7, z: 2 }, target: { x: 2, y: 1.7, z: 0 }, fov: 80 },
                { time: 6000, position: { x: -2, y: 1.7, z: 2 }, target: { x: -2, y: 1.7, z: 0 }, fov: 80 },
                { time: 9000, position: { x: 0, y: 1.7, z: -2 }, target: { x: 0, y: 1.7, z: 0 }, fov: 75 },
                { time: 12000, position: { x: 0, y: 1.7, z: 5 }, target: { x: 0, y: 1.7, z: 0 }, fov: 75 }
            ]
        });

        // Dynamic Action Path
        this.cameraPaths.set('dynamic-action', {
            name: 'Dynamic Action',
            description: 'Fast-paced dynamic camera movement',
            duration: 5000,
            easing: 'easeInOutBack',
            keyframes: [
                { time: 0, position: { x: 8, y: 4, z: 8 }, target: { x: 0, y: 1, z: 0 }, fov: 60 },
                { time: 1000, position: { x: -8, y: 6, z: -8 }, target: { x: 0, y: 1, z: 0 }, fov: 65 },
                { time: 2000, position: { x: 0, y: 10, z: 0 }, target: { x: 0, y: 1, z: 0 }, fov: 45 },
                { time: 3000, position: { x: 8, y: 2, z: -8 }, target: { x: 0, y: 1, z: 0 }, fov: 70 },
                { time: 4000, position: { x: -8, y: 2, z: 8 }, target: { x: 0, y: 1, z: 0 }, fov: 70 },
                { time: 5000, position: { x: 5, y: 3, z: 5 }, target: { x: 0, y: 1, z: 0 }, fov: 60 }
            ]
        });
    }

    setupCameraModes() {
        this.cameraModes = {
            orbit: {
                name: 'Orbit Camera',
                description: 'Classic orbit around target',
                controls: ['Mouse drag', 'Scroll zoom', 'Right-click pan'],
                handler: () => this.enableOrbitMode()
            },
            drone: {
                name: 'Drone Mode',
                description: 'Free-flying camera with aerial perspective',
                controls: ['WASD move', 'Mouse look', 'Space/Shift altitude'],
                handler: () => this.enableDroneMode()
            },
            cinematic: {
                name: 'Cinematic Mode',
                description: 'Smooth cinematic camera movements',
                controls: ['Path following', 'Auto-smooth', 'Easing curves'],
                handler: () => this.enableCinematicMode()
            },
            walkthrough: {
                name: 'Walkthrough Mode',
                description: 'First-person exploration',
                controls: ['WASD walk', 'Mouse look', 'Jump/ crouch'],
                handler: () => this.enableWalkthroughMode()
            },
            follow: {
                name: 'Follow Mode',
                description: 'Camera follows selected object',
                controls: ['Auto-follow', 'Distance control', 'Smooth tracking'],
                handler: () => this.enableFollowMode()
            }
        };
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled) return;

            switch (e.key.toLowerCase()) {
                case '1':
                    this.switchCameraMode('orbit');
                    break;
                case '2':
                    this.switchCameraMode('drone');
                    break;
                case '3':
                    this.switchCameraMode('cinematic');
                    break;
                case '4':
                    this.switchCameraMode('walkthrough');
                    break;
                case '5':
                    this.switchCameraMode('follow');
                    break;
                case 'p':
                    this.playCameraPath('showroom-intro');
                    break;
                case 'f':
                    this.playCameraPath('vehicle-focus');
                    break;
                case 'd':
                    this.playCameraPath('drone-overview');
                    break;
                case 'w':
                    this.playCameraPath('interior-walkthrough');
                    break;
                case 'a':
                    this.playCameraPath('dynamic-action');
                    break;
                case 'space':
                    e.preventDefault();
                    this.toggleDroneMode();
                    break;
                case 'c':
                    this.toggleCinematicMode();
                    break;
                case 'r':
                    this.resetCamera();
                    break;
                case 'h':
                    this.showCameraHelp();
                    break;
            }
        });
    }

    setupMouseControls() {
        let isMouseDown = false;
        let lastMousePos = { x: 0, y: 0 };

        document.addEventListener('mousedown', (e) => {
            if (!this.isEnabled) return;
            isMouseDown = true;
            lastMousePos = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isEnabled || !isMouseDown) return;

            const deltaX = e.clientX - lastMousePos.x;
            const deltaY = e.clientY - lastMousePos.y;

            if (e.buttons === 1) { // Left click
                this.handleMouseRotation(deltaX, deltaY);
            } else if (e.buttons === 2) { // Right click
                this.handleMousePan(deltaX, deltaY);
            }

            lastMousePos = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        document.addEventListener('wheel', (e) => {
            if (!this.isEnabled) return;
            e.preventDefault();
            this.handleMouseZoom(e.deltaY);
        });

        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => {
            if (this.isEnabled) {
                e.preventDefault();
            }
        });
    }

    // Camera Mode Management
    switchCameraMode(mode) {
        if (!this.cameraModes[mode]) {
            console.error(`Camera mode '${mode}' not found`);
            return;
        }

        this.currentMode = mode;
        this.cameraModes[mode].handler();
        
        // Update camera state
        const state = this.cameraStates[mode];
        if (state && window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraPosition(state.position, state.target);
        }

        this.showNotification(`Switched to ${this.cameraModes[mode].name}`, 'info');
    }

    enableOrbitMode() {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraMode('orbit');
        }
    }

    enableDroneMode() {
        this.droneMode = true;
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraMode('drone');
        }
    }

    enableCinematicMode() {
        this.cinematicMode = true;
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraMode('cinematic');
        }
    }

    enableWalkthroughMode() {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraMode('walkthrough');
        }
    }

    enableFollowMode() {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraMode('follow');
        }
    }

    toggleDroneMode() {
        this.droneMode = !this.droneMode;
        if (this.droneMode) {
            this.enableDroneMode();
        } else {
            this.enableOrbitMode();
        }
    }

    toggleCinematicMode() {
        this.cinematicMode = !this.cinematicMode;
        if (this.cinematicMode) {
            this.enableCinematicMode();
        } else {
            this.enableOrbitMode();
        }
    }

    // Camera Path Management
    playCameraPath(pathName) {
        const path = this.cameraPaths.get(pathName);
        if (!path) {
            console.error(`Camera path '${pathName}' not found`);
            return;
        }

        this.activePath = {
            name: pathName,
            path: path,
            startTime: Date.now(),
            currentKeyframe: 0
        };

        this.showNotification(`Playing: ${path.name}`, 'info');
        this.animateCameraPath();
    }

    animateCameraPath() {
        if (!this.activePath) return;

        const elapsed = Date.now() - this.activePath.startTime;
        const progress = Math.min(elapsed / this.activePath.path.duration, 1);

        // Get interpolated camera position
        const cameraState = this.interpolateCameraPath(progress);
        
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraPosition(cameraState.position, cameraState.target);
            window.PlayCanvasManager.setCameraFOV(cameraState.fov);
        }

        if (progress < 1) {
            requestAnimationFrame(() => this.animateCameraPath());
        } else {
            this.activePath = null;
            this.showNotification('Camera path completed', 'success');
        }
    }

    interpolateCameraPath(progress) {
        const path = this.activePath.path;
        const keyframes = path.keyframes;

        // Find the two keyframes to interpolate between
        let startKeyframe = null;
        let endKeyframe = null;

        for (let i = 0; i < keyframes.length - 1; i++) {
            const current = keyframes[i];
            const next = keyframes[i + 1];
            
            const currentProgress = current.time / path.duration;
            const nextProgress = next.time / path.duration;
            
            if (progress >= currentProgress && progress <= nextProgress) {
                startKeyframe = current;
                endKeyframe = next;
                break;
            }
        }

        if (!startKeyframe || !endKeyframe) {
            return keyframes[keyframes.length - 1];
        }

        // Calculate local progress between keyframes
        const localProgress = (progress - startKeyframe.time / path.duration) / 
                            ((endKeyframe.time - startKeyframe.time) / path.duration);

        // Apply easing
        const easedProgress = this.applyEasing(localProgress, path.easing);

        // Interpolate position, target, and FOV
        const position = this.interpolateVector(startKeyframe.position, endKeyframe.position, easedProgress);
        const target = this.interpolateVector(startKeyframe.target, endKeyframe.target, easedProgress);
        const fov = this.interpolateValue(startKeyframe.fov, endKeyframe.fov, easedProgress);

        return { position, target, fov };
    }

    interpolateVector(start, end, progress) {
        return {
            x: start.x + (end.x - start.x) * progress,
            y: start.y + (end.y - start.y) * progress,
            z: start.z + (end.z - start.z) * progress
        };
    }

    interpolateValue(start, end, progress) {
        return start + (end - start) * progress;
    }

    applyEasing(progress, easingType) {
        switch (easingType) {
            case 'easeInOutCubic':
                return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            case 'easeInOutQuart':
                return progress < 0.5 ? 8 * progress * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 4) / 2;
            case 'easeInOutSine':
                return -(Math.cos(Math.PI * progress) - 1) / 2;
            case 'easeInOutBack':
                const c1 = 1.70158;
                const c2 = c1 * 1.525;
                return progress < 0.5 ? Math.pow(2 * progress, 2) * ((c2 + 1) * 2 * progress - c2) / 2 : (Math.pow(2 * progress - 2, 2) * ((c2 + 1) * (progress * 2 - 2) + c2) + 2) / 2;
            default:
                return progress;
        }
    }

    // Mouse Control Handlers
    handleMouseRotation(deltaX, deltaY) {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.rotateCamera(deltaX * this.cameraSettings.sensitivity, deltaY * this.cameraSettings.sensitivity);
        }
    }

    handleMousePan(deltaX, deltaY) {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.panCamera(deltaX * this.cameraSettings.sensitivity, deltaY * this.cameraSettings.sensitivity);
        }
    }

    handleMouseZoom(deltaY) {
        if (window.PlayCanvasManager) {
            const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
            window.PlayCanvasManager.zoomCamera(zoomFactor);
        }
    }

    // Utility Methods
    resetCamera() {
        const state = this.cameraStates[this.currentMode];
        if (state && window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraPosition(state.position, state.target);
            window.PlayCanvasManager.setCameraFOV(this.cameraSettings.fov);
        }
        
        this.showNotification('Camera reset', 'info');
    }

    showCameraHelp() {
        const helpPanel = document.createElement('div');
        helpPanel.className = 'camera-help-panel';
        helpPanel.innerHTML = `
            <div class="help-header">
                <h3>🎥 Camera Controls</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="help-content">
                <div class="help-section">
                    <h4>Camera Modes</h4>
                    <div class="help-item"><strong>1:</strong> Orbit Camera</div>
                    <div class="help-item"><strong>2:</strong> Drone Mode</div>
                    <div class="help-item"><strong>3:</strong> Cinematic Mode</div>
                    <div class="help-item"><strong>4:</strong> Walkthrough Mode</div>
                    <div class="help-item"><strong>5:</strong> Follow Mode</div>
                </div>
                <div class="help-section">
                    <h4>Camera Paths</h4>
                    <div class="help-item"><strong>P:</strong> Showroom Intro</div>
                    <div class="help-item"><strong>F:</strong> Vehicle Focus</div>
                    <div class="help-item"><strong>D:</strong> Drone Overview</div>
                    <div class="help-item"><strong>W:</strong> Interior Walkthrough</div>
                    <div class="help-item"><strong>A:</strong> Dynamic Action</div>
                </div>
                <div class="help-section">
                    <h4>Controls</h4>
                    <div class="help-item"><strong>Space:</strong> Toggle Drone Mode</div>
                    <div class="help-item"><strong>C:</strong> Toggle Cinematic Mode</div>
                    <div class="help-item"><strong>R:</strong> Reset Camera</div>
                    <div class="help-item"><strong>H:</strong> Show This Help</div>
                </div>
                <div class="help-section">
                    <h4>Mouse Controls</h4>
                    <div class="help-item"><strong>Left Drag:</strong> Rotate Camera</div>
                    <div class="help-item"><strong>Right Drag:</strong> Pan Camera</div>
                    <div class="help-item"><strong>Scroll:</strong> Zoom In/Out</div>
                </div>
            </div>
        `;

        document.body.appendChild(helpPanel);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `camera-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Camera Settings
    setCameraSettings(settings) {
        Object.assign(this.cameraSettings, settings);
        
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.setCameraFOV(this.cameraSettings.fov);
            window.PlayCanvasManager.setCameraSensitivity(this.cameraSettings.sensitivity);
        }
    }

    getCameraInfo() {
        if (window.PlayCanvasManager) {
            return window.PlayCanvasManager.getCameraInfo();
        }
        return null;
    }

    // Cleanup
    destroy() {
        this.activePath = null;
        this.cameraPaths.clear();
        this.cameraModes = null;
        this.isEnabled = false;
    }
}

// Singleton instance
window.AdvancedCameraManager = new AdvancedCameraManager(); 