/**
 * Advanced Physics System
 * Leverages PlayCanvas physics engine for realistic interactions
 */

class AdvancedPhysicsManager {
    constructor() {
        this.app = null;
        this.physicsWorld = null;
        this.rigidBodies = new Map();
        this.constraints = new Map();
        this.forceFields = new Map();
        this.physicsEnabled = true;
        
        this.init();
    }

    init() {
        if (window.PlayCanvasManager) {
            this.app = window.PlayCanvasManager.app;
            this.setupPhysicsWorld();
        }
    }

    setupPhysicsWorld() {
        if (!this.app) return;

        // Initialize physics world
        this.physicsWorld = new pc.PhysicsWorld();
        this.app.systems.add(this.physicsWorld);

        // Set gravity
        this.physicsWorld.gravity = new pc.Vec3(0, -9.81, 0);

        // Enable physics debugging
        this.physicsWorld.debugDraw = true;

        console.log('Advanced Physics System initialized');
    }

    // Rigid Body Physics
    createRigidBody(entity, mass = 1, shape = 'box') {
        if (!this.physicsWorld) return;

        const rigidBody = new pc.RigidBodyComponent();
        rigidBody.mass = mass;
        rigidBody.type = mass > 0 ? pc.BODYTYPE_DYNAMIC : pc.BODYTYPE_STATIC;

        // Add collision shape
        const collision = new pc.CollisionComponent();
        switch (shape) {
            case 'sphere':
                collision.type = pc.COLLISIONTYPE_SPHERE;
                collision.radius = 0.5;
                break;
            case 'cylinder':
                collision.type = pc.COLLISIONTYPE_CYLINDER;
                collision.radius = 0.5;
                collision.height = 1;
                break;
            case 'capsule':
                collision.type = pc.COLLISIONTYPE_CAPSULE;
                collision.radius = 0.5;
                collision.height = 1;
                break;
            default: // box
                collision.type = pc.COLLISIONTYPE_BOX;
                collision.halfExtents = new pc.Vec3(0.5, 0.5, 0.5);
                break;
        }

        entity.addComponent(rigidBody);
        entity.addComponent(collision);

        this.rigidBodies.set(entity.id, { entity, rigidBody, collision });
        return { rigidBody, collision };
    }

    // Vehicle Physics
    createVehicle(entity, config = {}) {
        if (!this.physicsWorld) return;

        const vehicle = new pc.VehicleComponent();
        
        // Vehicle configuration
        vehicle.mass = config.mass || 1500;
        vehicle.maxEngineForce = config.maxEngineForce || 2000;
        vehicle.maxBrakeForce = config.maxBrakeForce || 100;
        vehicle.suspensionStiffness = config.suspensionStiffness || 30;
        vehicle.suspensionDamping = config.suspensionDamping || 2.3;
        vehicle.suspensionCompression = config.suspensionCompression || 4.4;
        vehicle.rollInfluence = config.rollInfluence || 0.1;
        vehicle.frictionSlip = config.frictionSlip || 100;
        vehicle.maxSuspensionTravelCm = config.maxSuspensionTravelCm || 500;
        vehicle.maxSuspensionForce = config.maxSuspensionForce || 6000;

        // Add wheels
        const wheelPositions = config.wheelPositions || [
            { x: -1, y: 0, z: 2 },   // Front Left
            { x: 1, y: 0, z: 2 },    // Front Right
            { x: -1, y: 0, z: -2 },  // Rear Left
            { x: 1, y: 0, z: -2 }    // Rear Right
        ];

        wheelPositions.forEach((pos, index) => {
            const wheel = new pc.Entity(`Wheel_${index}`);
            wheel.setLocalPosition(pos.x, pos.y, pos.z);
            
            const wheelCollision = new pc.CollisionComponent();
            wheelCollision.type = pc.COLLISIONTYPE_SPHERE;
            wheelCollision.radius = 0.4;
            
            wheel.addComponent(wheelCollision);
            entity.addChild(wheel);
            
            vehicle.addWheel(wheel);
        });

        entity.addComponent(vehicle);
        return vehicle;
    }

    // Force Fields
    createForceField(position, radius, force, type = 'attract') {
        if (!this.physicsWorld) return;

        const forceField = new pc.Entity('ForceField');
        forceField.setPosition(position);

        const field = {
            position: position,
            radius: radius,
            force: force,
            type: type, // 'attract', 'repel', 'turbulence', 'vortex'
            active: true
        };

        this.forceFields.set(forceField.id, field);
        this.app.root.addChild(forceField);

        // Visual representation
        const sphere = new pc.Entity('FieldVisual');
        sphere.addComponent('model', { type: 'sphere' });
        sphere.setLocalScale(radius, radius, radius);
        
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(0.2, 0.8, 1.0);
        material.opacity = 0.3;
        material.blendType = pc.BLEND_NORMAL;
        sphere.model.material = material;
        
        forceField.addChild(sphere);

        return field;
    }

    // Constraints
    createConstraint(entityA, entityB, type = 'hinge', config = {}) {
        if (!this.physicsWorld) return;

        let constraint;
        
        switch (type) {
            case 'hinge':
                constraint = new pc.HingeConstraint();
                constraint.setPivotA(config.pivotA || new pc.Vec3(0, 0, 0));
                constraint.setPivotB(config.pivotB || new pc.Vec3(0, 0, 0));
                constraint.setAxisA(config.axisA || new pc.Vec3(0, 1, 0));
                constraint.setAxisB(config.axisB || new pc.Vec3(0, 1, 0));
                break;
                
            case 'spring':
                constraint = new pc.SpringConstraint();
                constraint.setPivotA(config.pivotA || new pc.Vec3(0, 0, 0));
                constraint.setPivotB(config.pivotB || new pc.Vec3(0, 0, 0));
                constraint.setSpringStiffness(config.stiffness || 100);
                constraint.setSpringDamping(config.damping || 10);
                break;
                
            case 'rope':
                constraint = new pc.ConeTwistConstraint();
                constraint.setPivotA(config.pivotA || new pc.Vec3(0, 0, 0));
                constraint.setPivotB(config.pivotB || new pc.Vec3(0, 0, 0));
                constraint.setLimit(config.swingSpan1 || 1, config.swingSpan2 || 1, config.twistSpan || 1);
                break;
        }

        if (constraint) {
            this.physicsWorld.addConstraint(constraint, entityA, entityB);
            this.constraints.set(constraint.id, { constraint, entityA, entityB, type });
        }

        return constraint;
    }

    // Physics Events
    setupPhysicsEvents() {
        if (!this.app) return;

        // Collision events
        this.app.on('collisionstart', (entityA, entityB) => {
            this.handleCollisionStart(entityA, entityB);
        });

        this.app.on('collisionend', (entityA, entityB) => {
            this.handleCollisionEnd(entityA, entityB);
        });

        // Physics update
        this.app.on('update', (dt) => {
            this.updatePhysics(dt);
        });
    }

    handleCollisionStart(entityA, entityB) {
        console.log('Collision started:', entityA.name, entityB.name);
        
        // Trigger collision effects
        this.createCollisionEffect(entityA.getPosition());
        
        // Play collision sound
        if (window.SpatialAudioManager) {
            window.SpatialAudioManager.playCollisionSound(entityA, entityB);
        }
    }

    handleCollisionEnd(entityA, entityB) {
        console.log('Collision ended:', entityA.name, entityB.name);
    }

    createCollisionEffect(position) {
        if (window.ParticleSystemManager) {
            window.ParticleSystemManager.createImpactBurst(position);
        }
    }

    updatePhysics(dt) {
        // Update force fields
        this.forceFields.forEach((field, id) => {
            if (!field.active) return;
            
            this.rigidBodies.forEach((body, bodyId) => {
                const distance = body.entity.getPosition().distance(field.position);
                
                if (distance < field.radius) {
                    const force = this.calculateForceFieldForce(body.entity, field);
                    body.rigidBody.applyForce(force);
                }
            });
        });
    }

    calculateForceFieldForce(entity, field) {
        const direction = entity.getPosition().sub(field.position).normalize();
        const distance = entity.getPosition().distance(field.position);
        const strength = field.force * (1 - distance / field.radius);
        
        switch (field.type) {
            case 'attract':
                return direction.scale(-strength);
            case 'repel':
                return direction.scale(strength);
            case 'turbulence':
                return new pc.Vec3(
                    Math.sin(Date.now() * 0.001) * strength,
                    Math.cos(Date.now() * 0.001) * strength,
                    Math.sin(Date.now() * 0.002) * strength
                );
            case 'vortex':
                const tangent = new pc.Vec3(-direction.z, 0, direction.x);
                return tangent.scale(strength);
            default:
                return new pc.Vec3(0, 0, 0);
        }
    }

    // Physics Debugging
    togglePhysicsDebug() {
        if (this.physicsWorld) {
            this.physicsWorld.debugDraw = !this.physicsWorld.debugDraw;
        }
    }

    // Physics Settings
    setGravity(x, y, z) {
        if (this.physicsWorld) {
            this.physicsWorld.gravity = new pc.Vec3(x, y, z);
        }
    }

    setPhysicsEnabled(enabled) {
        this.physicsEnabled = enabled;
        if (this.physicsWorld) {
            this.physicsWorld.enabled = enabled;
        }
    }

    // Cleanup
    destroy() {
        this.rigidBodies.clear();
        this.constraints.clear();
        this.forceFields.clear();
        
        if (this.physicsWorld) {
            this.app.systems.remove(this.physicsWorld);
        }
    }
}

// Initialize Advanced Physics
window.AdvancedPhysicsManager = new AdvancedPhysicsManager(); 