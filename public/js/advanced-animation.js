/**
 * Advanced Animation System
 * Leverages PlayCanvas animation system for professional-grade animations
 */

class AdvancedAnimationManager {
    constructor() {
        this.app = null;
        this.animations = new Map();
        this.animationStates = new Map();
        this.blendTrees = new Map();
        this.proceduralAnimations = new Map();
        this.animationEvents = new Map();
        
        this.init();
    }

    init() {
        if (window.PlayCanvasManager) {
            this.app = window.PlayCanvasManager.app;
            this.setupAnimationEvents();
        }
    }

    setupAnimationEvents() {
        if (!this.app) return;

        // Animation events
        this.app.on('animationend', (entity, animation) => {
            this.handleAnimationEnd(entity, animation);
        });

        this.app.on('animationstart', (entity, animation) => {
            this.handleAnimationStart(entity, animation);
        });

        this.app.on('update', (dt) => {
            this.updateAnimations(dt);
        });
    }

    // Skeletal Animation
    createSkeletalAnimation(entity, animationData) {
        if (!entity.animation) {
            entity.addComponent('animation');
        }

        const animation = new pc.Animation();
        animation.duration = animationData.duration || 1.0;
        animation.loop = animationData.loop !== false;
        animation.speed = animationData.speed || 1.0;

        // Create animation tracks
        if (animationData.tracks) {
            animationData.tracks.forEach(track => {
                const animationTrack = new pc.AnimationTrack(track.name);
                
                // Keyframe data
                if (track.keyframes) {
                    track.keyframes.forEach(keyframe => {
                        animationTrack.addKeyframe(keyframe.time, keyframe.value);
                    });
                }
                
                animation.addTrack(animationTrack);
            });
        }

        entity.animation.addClip(animationData.name, animation);
        this.animations.set(entity.id, animation);

        return animation;
    }

    // Blend Trees
    createBlendTree(entity, blendTreeData) {
        const blendTree = {
            entity: entity,
            layers: new Map(),
            weights: new Map(),
            transitions: new Map(),
            currentState: blendTreeData.initialState || 'idle'
        };

        // Add animation layers
        blendTreeData.layers.forEach(layer => {
            blendTree.layers.set(layer.name, {
                animation: layer.animation,
                weight: layer.weight || 1.0,
                speed: layer.speed || 1.0,
                loop: layer.loop !== false
            });
        });

        // Add transitions
        if (blendTreeData.transitions) {
            blendTreeData.transitions.forEach(transition => {
                blendTree.transitions.set(transition.from + '->' + transition.to, {
                    duration: transition.duration || 0.3,
                    easing: transition.easing || 'linear'
                });
            });
        }

        this.blendTrees.set(entity.id, blendTree);
        return blendTree;
    }

    // Procedural Animation
    createProceduralAnimation(entity, type, config = {}) {
        const procedural = {
            entity: entity,
            type: type,
            config: config,
            active: true,
            time: 0
        };

        switch (type) {
            case 'bob':
                procedural.update = (dt) => this.updateBobAnimation(procedural, dt);
                break;
            case 'sway':
                procedural.update = (dt) => this.updateSwayAnimation(procedural, dt);
                break;
            case 'pulse':
                procedural.update = (dt) => this.updatePulseAnimation(procedural, dt);
                break;
            case 'orbit':
                procedural.update = (dt) => this.updateOrbitAnimation(procedural, dt);
                break;
            case 'wave':
                procedural.update = (dt) => this.updateWaveAnimation(procedural, dt);
                break;
        }

        this.proceduralAnimations.set(entity.id, procedural);
        return procedural;
    }

    // Bob Animation (floating up and down)
    updateBobAnimation(procedural, dt) {
        const { entity, config } = procedural;
        const amplitude = config.amplitude || 0.5;
        const frequency = config.frequency || 2.0;
        const offset = config.offset || 0;

        procedural.time += dt;
        const bob = Math.sin(procedural.time * frequency + offset) * amplitude;
        
        const position = entity.getPosition();
        position.y += bob;
        entity.setPosition(position);
    }

    // Sway Animation (side to side)
    updateSwayAnimation(procedural, dt) {
        const { entity, config } = procedural;
        const amplitude = config.amplitude || 0.3;
        const frequency = config.frequency || 1.5;
        const axis = config.axis || 'x';

        procedural.time += dt;
        const sway = Math.sin(procedural.time * frequency) * amplitude;
        
        const position = entity.getPosition();
        position[axis] += sway;
        entity.setPosition(position);
    }

    // Pulse Animation (scale)
    updatePulseAnimation(procedural, dt) {
        const { entity, config } = procedural;
        const amplitude = config.amplitude || 0.2;
        const frequency = config.frequency || 3.0;
        const baseScale = config.baseScale || 1.0;

        procedural.time += dt;
        const pulse = Math.sin(procedural.time * frequency) * amplitude + 1.0;
        const scale = baseScale * pulse;
        
        entity.setLocalScale(scale, scale, scale);
    }

    // Orbit Animation (circular motion)
    updateOrbitAnimation(procedural, dt) {
        const { entity, config } = procedural;
        const radius = config.radius || 2.0;
        const speed = config.speed || 1.0;
        const center = config.center || new pc.Vec3(0, 0, 0);
        const axis = config.axis || 'y';

        procedural.time += dt;
        const angle = procedural.time * speed;
        
        let x, y, z;
        if (axis === 'y') {
            x = center.x + Math.cos(angle) * radius;
            y = center.y;
            z = center.z + Math.sin(angle) * radius;
        } else if (axis === 'x') {
            x = center.x;
            y = center.y + Math.cos(angle) * radius;
            z = center.z + Math.sin(angle) * radius;
        } else {
            x = center.x + Math.cos(angle) * radius;
            y = center.y + Math.sin(angle) * radius;
            z = center.z;
        }
        
        entity.setPosition(x, y, z);
    }

    // Wave Animation (complex motion)
    updateWaveAnimation(procedural, dt) {
        const { entity, config } = procedural;
        const amplitude = config.amplitude || 0.5;
        const frequency = config.frequency || 2.0;
        const waveCount = config.waveCount || 3;

        procedural.time += dt;
        
        const position = entity.getPosition();
        const wave = Math.sin(procedural.time * frequency) * 
                    Math.sin(procedural.time * frequency * waveCount) * amplitude;
        
        position.y += wave;
        entity.setPosition(position);
    }

    // Animation Events
    addAnimationEvent(entity, animationName, time, callback) {
        if (!this.animationEvents.has(entity.id)) {
            this.animationEvents.set(entity.id, new Map());
        }

        const entityEvents = this.animationEvents.get(entity.id);
        if (!entityEvents.has(animationName)) {
            entityEvents.set(animationName, []);
        }

        entityEvents.get(animationName).push({
            time: time,
            callback: callback,
            triggered: false
        });
    }

    // Animation State Machine
    createAnimationStateMachine(entity, states) {
        const stateMachine = {
            entity: entity,
            states: new Map(),
            currentState: states.initial || 'idle',
            transitions: new Map(),
            timeInState: 0
        };

        // Add states
        Object.keys(states.states).forEach(stateName => {
            const state = states.states[stateName];
            stateMachine.states.set(stateName, {
                animation: state.animation,
                loop: state.loop !== false,
                speed: state.speed || 1.0,
                events: state.events || []
            });
        });

        // Add transitions
        if (states.transitions) {
            states.transitions.forEach(transition => {
                stateMachine.transitions.set(transition.from + '->' + transition.to, {
                    condition: transition.condition,
                    duration: transition.duration || 0.3
                });
            });
        }

        return stateMachine;
    }

    // Morph Target Animation
    createMorphTargetAnimation(entity, morphTargetData) {
        const morphAnimation = {
            entity: entity,
            targets: new Map(),
            weights: new Map(),
            duration: morphTargetData.duration || 1.0,
            loop: morphTargetData.loop !== false
        };

        // Add morph targets
        morphTargetData.targets.forEach(target => {
            morphAnimation.targets.set(target.name, {
                weight: target.weight || 0.0,
                targetWeight: target.targetWeight || 1.0,
                speed: target.speed || 1.0
            });
        });

        return morphAnimation;
    }

    // Camera Animation
    createCameraAnimation(camera, animationData) {
        const cameraAnimation = {
            camera: camera,
            keyframes: animationData.keyframes || [],
            duration: animationData.duration || 5.0,
            loop: animationData.loop !== false,
            easing: animationData.easing || 'linear',
            currentTime: 0
        };

        return cameraAnimation;
    }

    // Update all animations
    updateAnimations(dt) {
        // Update procedural animations
        this.proceduralAnimations.forEach((procedural, entityId) => {
            if (procedural.active && procedural.update) {
                procedural.update(dt);
            }
        });

        // Update blend trees
        this.blendTrees.forEach((blendTree, entityId) => {
            this.updateBlendTree(blendTree, dt);
        });

        // Update animation events
        this.updateAnimationEvents(dt);
    }

    updateBlendTree(blendTree, dt) {
        const currentLayer = blendTree.layers.get(blendTree.currentState);
        if (!currentLayer) return;

        // Update layer weights based on transitions
        blendTree.layers.forEach((layer, layerName) => {
            if (layerName === blendTree.currentState) {
                layer.weight = Math.min(layer.weight + dt * 2, 1.0);
            } else {
                layer.weight = Math.max(layer.weight - dt * 2, 0.0);
            }
        });
    }

    updateAnimationEvents(dt) {
        this.animationEvents.forEach((entityEvents, entityId) => {
            entityEvents.forEach((events, animationName) => {
                events.forEach(event => {
                    if (!event.triggered) {
                        // Check if animation time matches event time
                        const animation = this.animations.get(entityId);
                        if (animation && animation.currentTime >= event.time) {
                            event.callback();
                            event.triggered = true;
                        }
                    }
                });
            });
        });
    }

    // Animation Controls
    playAnimation(entity, animationName, options = {}) {
        if (!entity.animation) return;

        const clip = entity.animation.clips[animationName];
        if (!clip) return;

        entity.animation.play(animationName, options);
    }

    stopAnimation(entity, animationName) {
        if (!entity.animation) return;
        entity.animation.stop(animationName);
    }

    pauseAnimation(entity, animationName) {
        if (!entity.animation) return;
        entity.animation.pause(animationName);
    }

    setAnimationSpeed(entity, animationName, speed) {
        if (!entity.animation) return;
        const clip = entity.animation.clips[animationName];
        if (clip) {
            clip.speed = speed;
        }
    }

    // Blend Tree Controls
    transitionToState(blendTree, newState, duration = 0.3) {
        const transition = blendTree.transitions.get(blendTree.currentState + '->' + newState);
        if (transition) {
            blendTree.currentState = newState;
            blendTree.timeInState = 0;
        }
    }

    // Procedural Animation Controls
    setProceduralAnimationActive(entityId, active) {
        const procedural = this.proceduralAnimations.get(entityId);
        if (procedural) {
            procedural.active = active;
        }
    }

    // Animation Events
    handleAnimationStart(entity, animation) {
        console.log('Animation started:', entity.name, animation.name);
        
        // Reset animation events
        const entityEvents = this.animationEvents.get(entity.id);
        if (entityEvents && entityEvents.has(animation.name)) {
            entityEvents.get(animation.name).forEach(event => {
                event.triggered = false;
            });
        }
    }

    handleAnimationEnd(entity, animation) {
        console.log('Animation ended:', entity.name, animation.name);
        
        // Trigger end events
        if (window.SpatialAudioManager) {
            window.SpatialAudioManager.playAnimationEndSound(entity, animation);
        }
    }

    // Animation Utilities
    createIdleAnimation(entity) {
        return this.createProceduralAnimation(entity, 'bob', {
            amplitude: 0.1,
            frequency: 1.0
        });
    }

    createHoverAnimation(entity) {
        return this.createProceduralAnimation(entity, 'sway', {
            amplitude: 0.2,
            frequency: 0.8,
            axis: 'x'
        });
    }

    createPulseAnimation(entity) {
        return this.createProceduralAnimation(entity, 'pulse', {
            amplitude: 0.1,
            frequency: 2.0,
            baseScale: 1.0
        });
    }

    createOrbitAnimation(entity, center, radius) {
        return this.createProceduralAnimation(entity, 'orbit', {
            center: center,
            radius: radius,
            speed: 0.5,
            axis: 'y'
        });
    }

    // Cleanup
    destroy() {
        this.animations.clear();
        this.animationStates.clear();
        this.blendTrees.clear();
        this.proceduralAnimations.clear();
        this.animationEvents.clear();
    }
}

// Initialize Advanced Animation
window.AdvancedAnimationManager = new AdvancedAnimationManager(); 