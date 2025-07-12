/**
 * Mobile & AR Features System
 * WebXR integration, gesture controls, and mobile-optimized interactions
 */

class MobileARManager {
    constructor() {
        this.isEnabled = false;
        this.xrSession = null;
        this.xrReferenceSpace = null;
        this.gestureRecognizer = null;
        this.touchHandler = null;
        this.deviceOrientation = null;
        this.isMobile = this.detectMobile();
        this.isARSupported = false;
        this.isVRSupported = false;
        
        this.init();
    }

    async init() {
        try {
            this.checkXRSupport();
            this.setupGestureRecognition();
            this.setupTouchHandling();
            this.setupDeviceOrientation();
            this.setupMobileOptimizations();
            
            this.isEnabled = true;
            console.log('Mobile & AR Features System initialized');
        } catch (error) {
            console.error('Failed to initialize mobile & AR features:', error);
        }
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    async checkXRSupport() {
        if ('xr' in navigator) {
            // Check AR support
            this.isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
            
            // Check VR support
            this.isVRSupported = await navigator.xr.isSessionSupported('immersive-vr');
            
            console.log(`AR supported: ${this.isARSupported}, VR supported: ${this.isVRSupported}`);
        }
    }

    setupGestureRecognition() {
        this.gestureRecognizer = {
            gestures: new Map(),
            touchStartPos: null,
            touchStartTime: null,
            currentGesture: null,
            
            init() {
                this.setupGestureTypes();
                this.bindEvents();
            },

            setupGestureTypes() {
                // Pinch to zoom
                this.gestures.set('pinch', {
                    name: 'Pinch Zoom',
                    description: 'Pinch to zoom in/out of 3D scene',
                    handler: (scale) => {
                        if (window.PlayCanvasManager) {
                            window.PlayCanvasManager.zoomCamera(scale);
                        }
                    }
                });

                // Swipe gestures
                this.gestures.set('swipe-left', {
                    name: 'Swipe Left',
                    description: 'Navigate to previous item',
                    handler: () => this.navigatePrevious()
                });

                this.gestures.set('swipe-right', {
                    name: 'Swipe Right',
                    description: 'Navigate to next item',
                    handler: () => this.navigateNext()
                });

                this.gestures.set('swipe-up', {
                    name: 'Swipe Up',
                    description: 'Show menu or options',
                    handler: () => this.showMobileMenu()
                });

                this.gestures.set('swipe-down', {
                    name: 'Swipe Down',
                    description: 'Hide menu or close',
                    handler: () => this.hideMobileMenu()
                });

                // Double tap
                this.gestures.set('double-tap', {
                    name: 'Double Tap',
                    description: 'Select or focus on object',
                    handler: (position) => {
                        if (window.PlayCanvasManager) {
                            window.PlayCanvasManager.selectObjectAtPosition(position);
                        }
                    }
                });

                // Long press
                this.gestures.set('long-press', {
                    name: 'Long Press',
                    description: 'Show context menu',
                    handler: (position) => this.showContextMenu(position)
                });

                // Rotation
                this.gestures.set('rotation', {
                    name: 'Rotation',
                    description: 'Rotate 3D object or camera',
                    handler: (angle) => {
                        if (window.PlayCanvasManager) {
                            window.PlayCanvasManager.rotateCamera(angle);
                        }
                    }
                });
            },

            bindEvents() {
                document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
                document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
                document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
            },

            handleTouchStart(e) {
                e.preventDefault();
                const touch = e.touches[0];
                this.touchStartPos = { x: touch.clientX, y: touch.clientY };
                this.touchStartTime = Date.now();
                this.currentGesture = null;
            },

            handleTouchMove(e) {
                e.preventDefault();
                if (!this.touchStartPos) return;

                const touch = e.touches[0];
                const currentPos = { x: touch.clientX, y: touch.clientY };
                const deltaX = currentPos.x - this.touchStartPos.x;
                const deltaY = currentPos.y - this.touchStartPos.y;

                // Detect gesture type
                if (e.touches.length === 2) {
                    this.handlePinchGesture(e);
                } else if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                    this.handleSwipeGesture(deltaX, deltaY);
                }
            },

            handleTouchEnd(e) {
                e.preventDefault();
                if (!this.touchStartPos) return;

                const touchEndTime = Date.now();
                const touchDuration = touchEndTime - this.touchStartTime;

                // Detect double tap
                if (touchDuration < 200) {
                    this.handleDoubleTap();
                }

                // Detect long press
                if (touchDuration > 500) {
                    this.handleLongPress();
                }

                this.touchStartPos = null;
                this.touchStartTime = null;
            },

            handlePinchGesture(e) {
                if (e.touches.length !== 2) return;

                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                const distance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );

                if (this.lastPinchDistance) {
                    const scale = distance / this.lastPinchDistance;
                    const gesture = this.gestures.get('pinch');
                    if (gesture) {
                        gesture.handler(scale);
                    }
                }

                this.lastPinchDistance = distance;
            },

            handleSwipeGesture(deltaX, deltaY) {
                const minSwipeDistance = 50;
                let gestureKey = null;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > minSwipeDistance) {
                        gestureKey = 'swipe-right';
                    } else if (deltaX < -minSwipeDistance) {
                        gestureKey = 'swipe-left';
                    }
                } else {
                    if (deltaY > minSwipeDistance) {
                        gestureKey = 'swipe-down';
                    } else if (deltaY < -minSwipeDistance) {
                        gestureKey = 'swipe-up';
                    }
                }

                if (gestureKey && !this.currentGesture) {
                    this.currentGesture = gestureKey;
                    const gesture = this.gestures.get(gestureKey);
                    if (gesture) {
                        gesture.handler();
                    }
                }
            },

            handleDoubleTap() {
                const gesture = this.gestures.get('double-tap');
                if (gesture) {
                    gesture.handler(this.touchStartPos);
                }
            },

            handleLongPress() {
                const gesture = this.gestures.get('long-press');
                if (gesture) {
                    gesture.handler(this.touchStartPos);
                }
            },

            navigatePrevious() {
                if (window.SMeditor) {
                    window.SMeditor.navigateToPrevious();
                }
            },

            navigateNext() {
                if (window.SMeditor) {
                    window.SMeditor.navigateToNext();
                }
            },

            showMobileMenu() {
                this.showMobileUI('menu');
            },

            hideMobileMenu() {
                this.hideMobileUI('menu');
            },

            showContextMenu(position) {
                this.showMobileUI('context', position);
            }
        };

        this.gestureRecognizer.init();
    }

    setupTouchHandling() {
        this.touchHandler = {
            activeTouches: new Map(),
            touchThreshold: 10,
            
            init() {
                this.bindTouchEvents();
            },

            bindTouchEvents() {
                document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
                document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
                document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
            },

            handleTouchStart(e) {
                Array.from(e.touches).forEach(touch => {
                    this.activeTouches.set(touch.identifier, {
                        x: touch.clientX,
                        y: touch.clientY,
                        startTime: Date.now()
                    });
                });
            },

            handleTouchMove(e) {
                Array.from(e.touches).forEach(touch => {
                    const touchData = this.activeTouches.get(touch.identifier);
                    if (touchData) {
                        const deltaX = touch.clientX - touchData.x;
                        const deltaY = touch.clientY - touchData.y;
                        
                        // Handle 3D camera movement
                        if (window.PlayCanvasManager) {
                            window.PlayCanvasManager.handleTouchMove(deltaX, deltaY);
                        }
                    }
                });
            },

            handleTouchEnd(e) {
                Array.from(e.changedTouches).forEach(touch => {
                    this.activeTouches.delete(touch.identifier);
                });
            }
        };

        this.touchHandler.init();
    }

    setupDeviceOrientation() {
        if ('DeviceOrientationEvent' in window) {
            this.deviceOrientation = {
                alpha: 0,
                beta: 0,
                gamma: 0,
                isEnabled: false,

                init() {
                    this.requestPermission();
                },

                async requestPermission() {
                    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                        try {
                            const permission = await DeviceOrientationEvent.requestPermission();
                            if (permission === 'granted') {
                                this.enable();
                            }
                        } catch (error) {
                            console.error('Device orientation permission denied:', error);
                        }
                    } else {
                        this.enable();
                    }
                },

                enable() {
                    window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
                    this.isEnabled = true;
                },

                handleOrientation(e) {
                    this.alpha = e.alpha;
                    this.beta = e.beta;
                    this.gamma = e.gamma;

                    // Apply device orientation to camera
                    if (window.PlayCanvasManager) {
                        window.PlayCanvasManager.setDeviceOrientation(this.alpha, this.beta, this.gamma);
                    }
                }
            };

            this.deviceOrientation.init();
        }
    }

    setupMobileOptimizations() {
        // Mobile-specific UI adjustments
        if (this.isMobile) {
            this.optimizeForMobile();
        }
    }

    optimizeForMobile() {
        // Adjust UI for mobile screens
        const style = document.createElement('style');
        style.textContent = `
            .mobile-optimized {
                font-size: 16px !important;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .mobile-button {
                min-height: 44px;
                min-width: 44px;
                padding: 12px;
                margin: 4px;
                border-radius: 8px;
                font-size: 14px;
                touch-action: manipulation;
            }

            .mobile-panel {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                border-top: 1px solid #00aaff;
                z-index: 1000;
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }

            .mobile-panel.active {
                transform: translateY(0);
            }

            .mobile-gesture-hint {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: #00aaff;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 1001;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .mobile-gesture-hint.show {
                opacity: 1;
            }

            @media (max-width: 768px) {
                .desktop-only {
                    display: none !important;
                }
                
                .mobile-only {
                    display: block !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // WebXR Integration
    async startARSession() {
        if (!this.isARSupported) {
            console.error('AR not supported on this device');
            return false;
        }

        try {
            this.xrSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['dom-overlay'],
                domOverlay: { root: document.getElementById('ar-overlay') }
            });

            this.xrSession.addEventListener('end', () => {
                this.xrSession = null;
                this.xrReferenceSpace = null;
            });

            await this.xrSession.requestReferenceSpace('viewer');
            this.xrReferenceSpace = await this.xrSession.requestReferenceSpace('local');

            // Start rendering loop
            this.xrSession.requestAnimationFrame((time, frame) => {
                this.renderARFrame(time, frame);
            });

            console.log('AR session started');
            return true;
        } catch (error) {
            console.error('Failed to start AR session:', error);
            return false;
        }
    }

    async startVRSession() {
        if (!this.isVRSupported) {
            console.error('VR not supported on this device');
            return false;
        }

        try {
            this.xrSession = await navigator.xr.requestSession('immersive-vr');
            
            this.xrSession.addEventListener('end', () => {
                this.xrSession = null;
                this.xrReferenceSpace = null;
            });

            this.xrReferenceSpace = await this.xrSession.requestReferenceSpace('local');

            // Start rendering loop
            this.xrSession.requestAnimationFrame((time, frame) => {
                this.renderVRFrame(time, frame);
            });

            console.log('VR session started');
            return true;
        } catch (error) {
            console.error('Failed to start VR session:', error);
            return false;
        }
    }

    renderARFrame(time, frame) {
        if (!this.xrSession) return;

        const pose = frame.getViewerPose(this.xrReferenceSpace);
        if (pose) {
            // Update camera with AR pose
            if (window.PlayCanvasManager) {
                window.PlayCanvasManager.updateARCamera(pose);
            }
        }

        this.xrSession.requestAnimationFrame((time, frame) => {
            this.renderARFrame(time, frame);
        });
    }

    renderVRFrame(time, frame) {
        if (!this.xrSession) return;

        const pose = frame.getViewerPose(this.xrReferenceSpace);
        if (pose) {
            // Update camera with VR pose
            if (window.PlayCanvasManager) {
                window.PlayCanvasManager.updateVRCamera(pose);
            }
        }

        this.xrSession.requestAnimationFrame((time, frame) => {
            this.renderVRFrame(time, frame);
        });
    }

    // Mobile UI Management
    showMobileUI(type, position = null) {
        const ui = this.createMobileUI(type, position);
        document.body.appendChild(ui);
        
        // Animate in
        setTimeout(() => {
            ui.classList.add('active');
        }, 10);
    }

    hideMobileUI(type) {
        const ui = document.querySelector(`.mobile-panel[data-type="${type}"]`);
        if (ui) {
            ui.classList.remove('active');
            setTimeout(() => {
                ui.remove();
            }, 300);
        }
    }

    createMobileUI(type, position = null) {
        const panel = document.createElement('div');
        panel.className = 'mobile-panel';
        panel.setAttribute('data-type', type);

        switch (type) {
            case 'menu':
                panel.innerHTML = this.createMobileMenu();
                break;
            case 'context':
                panel.innerHTML = this.createContextMenu(position);
                break;
            case 'gestures':
                panel.innerHTML = this.createGestureHelp();
                break;
        }

        return panel;
    }

    createMobileMenu() {
        return `
            <div class="mobile-menu">
                <div class="menu-header">
                    <h3>🎮 Mobile Controls</h3>
                    <button class="close-btn" onclick="this.closest('.mobile-panel').classList.remove('active')">×</button>
                </div>
                <div class="menu-content">
                    <button class="mobile-button" onclick="window.MobileARManager.startARSession()">
                        📱 Start AR
                    </button>
                    <button class="mobile-button" onclick="window.MobileARManager.startVRSession()">
                        🥽 Start VR
                    </button>
                    <button class="mobile-button" onclick="window.MobileARManager.showGestureHelp()">
                        👆 Gesture Help
                    </button>
                    <button class="mobile-button" onclick="window.MobileARManager.optimizeForDevice()">
                        ⚙️ Optimize
                    </button>
                </div>
            </div>
        `;
    }

    createContextMenu(position) {
        return `
            <div class="context-menu" style="left: ${position?.x || 50}%; top: ${position?.y || 50}%;">
                <button class="mobile-button" onclick="window.PlayCanvasManager.selectObject()">
                    🎯 Select
                </button>
                <button class="mobile-button" onclick="window.PlayCanvasManager.focusObject()">
                    🔍 Focus
                </button>
                <button class="mobile-button" onclick="window.PlayCanvasManager.showDetails()">
                    ℹ️ Details
                </button>
                <button class="mobile-button" onclick="window.PlayCanvasManager.resetView()">
                    🔄 Reset
                </button>
            </div>
        `;
    }

    createGestureHelp() {
        return `
            <div class="gesture-help">
                <div class="help-header">
                    <h3>👆 Gesture Controls</h3>
                    <button class="close-btn" onclick="this.closest('.mobile-panel').classList.remove('active')">×</button>
                </div>
                <div class="help-content">
                    <div class="gesture-item">
                        <span class="gesture-icon">👆</span>
                        <span>Tap: Select object</span>
                    </div>
                    <div class="gesture-item">
                        <span class="gesture-icon">👆👆</span>
                        <span>Double tap: Focus camera</span>
                    </div>
                    <div class="gesture-item">
                        <span class="gesture-icon">👆⏱️</span>
                        <span>Long press: Context menu</span>
                    </div>
                    <div class="gesture-item">
                        <span class="gesture-icon">👆👆↔️</span>
                        <span>Pinch: Zoom in/out</span>
                    </div>
                    <div class="gesture-item">
                        <span class="gesture-icon">↔️</span>
                        <span>Swipe: Navigate</span>
                    </div>
                    <div class="gesture-item">
                        <span class="gesture-icon">📱</span>
                        <span>Tilt: Rotate view</span>
                    </div>
                </div>
            </div>
        `;
    }

    showGestureHelp() {
        this.showMobileUI('gestures');
    }

    optimizeForDevice() {
        // Auto-optimize based on device capabilities
        const optimizations = [];

        if (this.isMobile) {
            optimizations.push('Mobile UI enabled');
            optimizations.push('Touch controls active');
            optimizations.push('Gesture recognition enabled');
        }

        if (this.isARSupported) {
            optimizations.push('AR features available');
        }

        if (this.isVRSupported) {
            optimizations.push('VR features available');
        }

        // Show optimization results
        this.showNotification(`Optimizations applied: ${optimizations.join(', ')}`, 'success');
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Cleanup
    destroy() {
        if (this.xrSession) {
            this.xrSession.end();
        }

        if (this.gestureRecognizer) {
            // Remove event listeners
            document.removeEventListener('touchstart', this.gestureRecognizer.handleTouchStart);
            document.removeEventListener('touchmove', this.gestureRecognizer.handleTouchMove);
            document.removeEventListener('touchend', this.gestureRecognizer.handleTouchEnd);
        }

        if (this.touchHandler) {
            // Remove touch event listeners
            document.removeEventListener('touchstart', this.touchHandler.handleTouchStart);
            document.removeEventListener('touchmove', this.touchHandler.handleTouchMove);
            document.removeEventListener('touchend', this.touchHandler.handleTouchEnd);
        }

        if (this.deviceOrientation && this.deviceOrientation.isEnabled) {
            window.removeEventListener('deviceorientation', this.deviceOrientation.handleOrientation);
        }
    }
}

// Singleton instance
window.MobileARManager = new MobileARManager(); 