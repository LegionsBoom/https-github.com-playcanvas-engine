// Particle System for SMeditor
// Provides cinematic particle effects: sparkles, smoke, light rays, car reveal effects

class ParticleSystem {
    constructor(app) {
        this.app = app;
        this.particles = new Map();
        this.emitters = new Map();
        this.nextParticleId = 0;
        
        this.init();
    }
    
    init() {
        this.createParticleMaterials();
        this.setupEventListeners();
    }
    
    createParticleMaterials() {
        const device = this.app.graphicsDevice;
        
        // Sparkle material
        this.sparkleMaterial = new pc.StandardMaterial();
        this.sparkleMaterial.diffuse = new pc.Color(1, 1, 1);
        this.sparkleMaterial.emissive = new pc.Color(1, 1, 0.8);
        this.sparkleMaterial.emissiveIntensity = 2.0;
        this.sparkleMaterial.opacity = 0.8;
        this.sparkleMaterial.blendType = pc.BLEND_NORMAL;
        this.sparkleMaterial.depthWrite = false;
        this.sparkleMaterial.update();
        
        // Smoke material
        this.smokeMaterial = new pc.StandardMaterial();
        this.smokeMaterial.diffuse = new pc.Color(0.3, 0.3, 0.3);
        this.smokeMaterial.opacity = 0.6;
        this.smokeMaterial.blendType = pc.BLEND_NORMAL;
        this.smokeMaterial.depthWrite = false;
        this.smokeMaterial.update();
        
        // Light ray material
        this.lightRayMaterial = new pc.StandardMaterial();
        this.lightRayMaterial.diffuse = new pc.Color(1, 1, 0.9);
        this.lightRayMaterial.emissive = new pc.Color(1, 1, 0.9);
        this.lightRayMaterial.emissiveIntensity = 1.5;
        this.lightRayMaterial.opacity = 0.7;
        this.lightRayMaterial.blendType = pc.BLEND_NORMAL;
        this.lightRayMaterial.depthWrite = false;
        this.lightRayMaterial.update();
        
        // Car reveal material
        this.carRevealMaterial = new pc.StandardMaterial();
        this.carRevealMaterial.diffuse = new pc.Color(0, 1, 1);
        this.carRevealMaterial.emissive = new pc.Color(0, 1, 1);
        this.carRevealMaterial.emissiveIntensity = 3.0;
        this.carRevealMaterial.opacity = 0.9;
        this.carRevealMaterial.blendType = pc.BLEND_NORMAL;
        this.carRevealMaterial.depthWrite = false;
        this.carRevealMaterial.update();
    }
    
    setupEventListeners() {
        // Global particle events
        document.addEventListener('particle:sparkle', (e) => {
            this.createSparkleEffect(e.detail.position, e.detail.intensity || 1.0);
        });
        
        document.addEventListener('particle:smoke', (e) => {
            this.createSmokeEffect(e.detail.position, e.detail.duration || 3.0);
        });
        
        document.addEventListener('particle:lightRay', (e) => {
            this.createLightRayEffect(e.detail.position, e.detail.direction, e.detail.intensity || 1.0);
        });
        
        document.addEventListener('particle:carReveal', (e) => {
            this.createCarRevealEffect(e.detail.position, e.detail.scale || 1.0);
        });
    }
    
    // Create sparkle effect
    createSparkleEffect(position, intensity = 1.0) {
        const particleCount = Math.floor(20 * intensity);
        const emitter = {
            id: this.nextParticleId++,
            type: 'sparkle',
            position: position.clone(),
            particles: [],
            active: true,
            duration: 2.0,
            elapsed: 0
        };
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createSparkleParticle(position, intensity);
            emitter.particles.push(particle);
        }
        
        this.emitters.set(emitter.id, emitter);
        return emitter.id;
    }
    
    createSparkleParticle(position, intensity) {
        const entity = new pc.Entity(`Sparkle_${this.nextParticleId++}`);
        
        // Create sparkle geometry (small sphere)
        entity.addComponent('model', { type: 'sphere' });
        entity.setLocalScale(0.05, 0.05, 0.05);
        entity.setPosition(position);
        
        // Apply sparkle material
        entity.model.material = this.sparkleMaterial;
        
        // Particle properties
        const particle = {
            entity: entity,
            velocity: new pc.Vec3(
                (Math.random() - 0.5) * 2 * intensity,
                Math.random() * 3 * intensity,
                (Math.random() - 0.5) * 2 * intensity
            ),
            life: 2.0,
            maxLife: 2.0,
            scale: 0.05,
            maxScale: 0.1 * intensity,
            rotationSpeed: new pc.Vec3(
                Math.random() * 360,
                Math.random() * 360,
                Math.random() * 360
            )
        };
        
        this.app.root.addChild(entity);
        this.particles.set(entity.id, particle);
        
        return particle;
    }
    
    // Create smoke effect
    createSmokeEffect(position, duration = 3.0) {
        const emitter = {
            id: this.nextParticleId++,
            type: 'smoke',
            position: position.clone(),
            particles: [],
            active: true,
            duration: duration,
            elapsed: 0,
            emissionRate: 10 // particles per second
        };
        
        this.emitters.set(emitter.id, emitter);
        return emitter.id;
    }
    
    createSmokeParticle(position) {
        const entity = new pc.Entity(`Smoke_${this.nextParticleId++}`);
        
        // Create smoke geometry (sphere)
        entity.addComponent('model', { type: 'sphere' });
        entity.setLocalScale(0.2, 0.2, 0.2);
        entity.setPosition(position);
        
        // Apply smoke material
        entity.model.material = this.smokeMaterial;
        
        // Particle properties
        const particle = {
            entity: entity,
            velocity: new pc.Vec3(
                (Math.random() - 0.5) * 0.5,
                Math.random() * 1.0 + 0.5,
                (Math.random() - 0.5) * 0.5
            ),
            life: 3.0,
            maxLife: 3.0,
            scale: 0.2,
            maxScale: 1.0,
            opacity: 0.6
        };
        
        this.app.root.addChild(entity);
        this.particles.set(entity.id, particle);
        
        return particle;
    }
    
    // Create light ray effect
    createLightRayEffect(position, direction, intensity = 1.0) {
        const entity = new pc.Entity(`LightRay_${this.nextParticleId++}`);
        
        // Create light ray geometry (cylinder)
        entity.addComponent('model', { type: 'cylinder' });
        entity.setLocalScale(0.1, 5.0 * intensity, 0.1);
        entity.setPosition(position);
        
        // Orient towards direction
        const lookAt = position.clone().add(direction);
        entity.lookAt(lookAt);
        
        // Apply light ray material
        entity.model.material = this.lightRayMaterial;
        
        // Particle properties
        const particle = {
            entity: entity,
            life: 1.5,
            maxLife: 1.5,
            scale: 0.1,
            maxScale: 0.2 * intensity,
            opacity: 0.7
        };
        
        this.app.root.addChild(entity);
        this.particles.set(entity.id, particle);
        
        return particle;
    }
    
    // Create car reveal effect
    createCarRevealEffect(position, scale = 1.0) {
        const emitter = {
            id: this.nextParticleId++,
            type: 'carReveal',
            position: position.clone(),
            particles: [],
            active: true,
            duration: 4.0,
            elapsed: 0,
            scale: scale
        };
        
        // Create multiple effects
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const offset = new pc.Vec3(
                Math.cos(angle) * 2 * scale,
                0,
                Math.sin(angle) * 2 * scale
            );
            const effectPos = position.clone().add(offset);
            
            // Light rays
            const rayDirection = offset.clone().normalize();
            const ray = this.createLightRayEffect(effectPos, rayDirection, scale);
            emitter.particles.push(ray);
            
            // Sparkles
            const sparkle = this.createSparkleParticle(effectPos, scale);
            emitter.particles.push(sparkle);
        }
        
        // Center burst
        const centerBurst = this.createSparkleParticle(position, scale * 2);
        emitter.particles.push(centerBurst);
        
        this.emitters.set(emitter.id, emitter);
        return emitter.id;
    }
    
    // Update all particles
    update(dt) {
        // Update emitters
        this.emitters.forEach((emitter, id) => {
            emitter.elapsed += dt;
            
            // Emit new particles for continuous effects
            if (emitter.type === 'smoke' && emitter.active) {
                if (emitter.elapsed % (1.0 / emitter.emissionRate) < dt) {
                    const smokePos = emitter.position.clone();
                    smokePos.x += (Math.random() - 0.5) * 0.5;
                    smokePos.z += (Math.random() - 0.5) * 0.5;
                    const smoke = this.createSmokeParticle(smokePos);
                    emitter.particles.push(smoke);
                }
            }
            
            // Check if emitter should be destroyed
            if (emitter.elapsed >= emitter.duration) {
                emitter.active = false;
            }
        });
        
        // Update particles
        this.particles.forEach((particle, id) => {
            const entity = particle.entity;
            
            // Update life
            particle.life -= dt;
            const lifeRatio = particle.life / particle.maxLife;
            
            if (lifeRatio <= 0) {
                // Destroy particle
                this.app.root.removeChild(entity);
                entity.destroy();
                this.particles.delete(id);
                return;
            }
            
            // Update position
            if (particle.velocity) {
                const newPos = entity.getPosition().clone();
                newPos.add(particle.velocity.clone().scale(dt));
                entity.setPosition(newPos);
                
                // Apply gravity to some particles
                if (particle.type === 'smoke') {
                    particle.velocity.y -= 0.5 * dt; // Gravity
                }
            }
            
            // Update scale
            if (particle.scale !== undefined) {
                const currentScale = entity.getLocalScale().x;
                const targetScale = particle.maxScale * (1 - lifeRatio * 0.5);
                const newScale = currentScale + (targetScale - currentScale) * dt * 2;
                entity.setLocalScale(newScale, newScale, newScale);
            }
            
            // Update opacity
            if (particle.opacity !== undefined) {
                const material = entity.model.material;
                material.opacity = particle.opacity * lifeRatio;
                material.update();
            }
            
            // Update rotation (for sparkles)
            if (particle.rotationSpeed) {
                const currentRotation = entity.getEulerAngles();
                const newRotation = new pc.Vec3(
                    currentRotation.x + particle.rotationSpeed.x * dt,
                    currentRotation.y + particle.rotationSpeed.y * dt,
                    currentRotation.z + particle.rotationSpeed.z * dt
                );
                entity.setEulerAngles(newRotation);
            }
        });
        
        // Clean up inactive emitters
        this.emitters.forEach((emitter, id) => {
            if (!emitter.active && emitter.particles.length === 0) {
                this.emitters.delete(id);
            }
        });
    }
    
    // Public API methods
    createCarReveal(position, scale = 1.0) {
        return this.createCarRevealEffect(position, scale);
    }
    
    createSparkleBurst(position, intensity = 1.0) {
        return this.createSparkleEffect(position, intensity);
    }
    
    createSmokeTrail(position, duration = 3.0) {
        return this.createSmokeEffect(position, duration);
    }
    
    createLightRay(position, direction, intensity = 1.0) {
        return this.createLightRayEffect(position, direction, intensity);
    }
    
    // Stop all particles
    clearAll() {
        this.particles.forEach((particle, id) => {
            const entity = particle.entity;
            this.app.root.removeChild(entity);
            entity.destroy();
        });
        this.particles.clear();
        this.emitters.clear();
    }
    
    // Get particle statistics
    getStats() {
        return {
            activeParticles: this.particles.size,
            activeEmitters: this.emitters.size,
            totalParticleTypes: 4 // sparkle, smoke, lightRay, carReveal
        };
    }
    
    destroy() {
        this.clearAll();
    }
}

// Global particle system instance
window.ParticleSystem = ParticleSystem; 