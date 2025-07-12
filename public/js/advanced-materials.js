/**
 * Advanced Materials System
 * Leverages PlayCanvas material system for professional-grade visuals
 */

class AdvancedMaterialsManager {
    constructor() {
        this.app = null;
        this.materials = new Map();
        this.shaders = new Map();
        this.textures = new Map();
        this.materialPresets = new Map();
        
        this.init();
    }

    init() {
        if (window.PlayCanvasManager) {
            this.app = window.PlayCanvasManager.app;
            this.loadMaterialPresets();
        }
    }

    loadMaterialPresets() {
        // Holographic Material
        this.materialPresets.set('holographic', {
            type: 'custom',
            shader: 'holographic',
            properties: {
                baseColor: [0.1, 0.8, 1.0, 0.8],
                scanlineSpeed: 2.0,
                scanlineIntensity: 0.5,
                flickerIntensity: 0.3,
                rimIntensity: 1.0
            }
        });

        // Neon Material
        this.materialPresets.set('neon', {
            type: 'custom',
            shader: 'neon',
            properties: {
                baseColor: [1.0, 0.2, 0.8, 1.0],
                glowIntensity: 2.0,
                pulseSpeed: 1.5,
                edgeGlow: 0.8
            }
        });

        // Glass Material
        this.materialPresets.set('glass', {
            type: 'pbr',
            properties: {
                baseColor: [0.9, 0.9, 0.9, 0.3],
                metalness: 0.0,
                roughness: 0.0,
                opacity: 0.3,
                refraction: 1.5
            }
        });

        // Metallic Material
        this.materialPresets.set('metallic', {
            type: 'pbr',
            properties: {
                baseColor: [0.8, 0.8, 0.8, 1.0],
                metalness: 1.0,
                roughness: 0.1,
                normalMap: 'metallic_normal',
                aoMap: 'metallic_ao'
            }
        });

        // Car Paint Material
        this.materialPresets.set('carPaint', {
            type: 'pbr',
            properties: {
                baseColor: [0.1, 0.9, 0.8, 1.0],
                metalness: 0.0,
                roughness: 0.1,
                clearcoat: 1.0,
                clearcoatRoughness: 0.0
            }
        });
    }

    // Create PBR Material
    createPBRMaterial(config = {}) {
        const material = new pc.StandardMaterial();
        
        // Base properties
        material.diffuse = new pc.Color(
            config.baseColor?.[0] || 0.5,
            config.baseColor?.[1] || 0.5,
            config.baseColor?.[2] || 0.5
        );
        material.opacity = config.baseColor?.[3] || 1.0;
        
        // PBR properties
        material.metalness = config.metalness || 0.0;
        material.roughness = config.roughness || 0.5;
        
        // Clearcoat (for car paint effect)
        if (config.clearcoat !== undefined) {
            material.clearcoat = config.clearcoat;
            material.clearcoatRoughness = config.clearcoatRoughness || 0.0;
        }
        
        // Normal mapping
        if (config.normalMap) {
            material.normalMap = this.loadTexture(config.normalMap);
            material.normalMapFactor = config.normalMapFactor || 1.0;
        }
        
        // Ambient occlusion
        if (config.aoMap) {
            material.aoMap = this.loadTexture(config.aoMap);
            material.aoMapFactor = config.aoMapFactor || 1.0;
        }
        
        // Emissive
        if (config.emissive) {
            material.emissive = new pc.Color(
                config.emissive[0],
                config.emissive[1],
                config.emissive[2]
            );
            material.emissiveIntensity = config.emissiveIntensity || 1.0;
        }
        
        material.update();
        return material;
    }

    // Create Custom Shader Material
    createCustomMaterial(shaderName, properties = {}) {
        const shader = this.createShader(shaderName);
        if (!shader) return null;

        const material = new pc.StandardMaterial();
        material.shader = shader;
        
        // Set shader properties
        Object.keys(properties).forEach(key => {
            if (material.shader.parameters[key]) {
                material.shader.parameters[key].value = properties[key];
            }
        });
        
        material.update();
        return material;
    }

    // Create Holographic Shader
    createHolographicShader() {
        const vertexShader = `
            attribute vec3 aPosition;
            attribute vec2 aUv0;
            attribute vec3 aNormal;
            
            uniform mat4 matrix_model;
            uniform mat4 matrix_viewProjection;
            
            varying vec2 vUv0;
            varying vec3 vNormal;
            varying vec3 vWorldPos;
            
            void main() {
                vec4 worldPos = matrix_model * vec4(aPosition, 1.0);
                gl_Position = matrix_viewProjection * worldPos;
                vUv0 = aUv0;
                vNormal = normalize((matrix_model * vec4(aNormal, 0.0)).xyz);
                vWorldPos = worldPos.xyz;
            }
        `;

        const fragmentShader = `
            precision mediump float;
            
            uniform vec3 uBaseColor;
            uniform float uScanlineSpeed;
            uniform float uScanlineIntensity;
            uniform float uFlickerIntensity;
            uniform float uRimIntensity;
            uniform float uTime;
            
            varying vec2 vUv0;
            varying vec3 vNormal;
            varying vec3 vWorldPos;
            
            void main() {
                // Scanline effect
                float scanline = sin(vUv0.y * 50.0 + uTime * uScanlineSpeed) * 0.5 + 0.5;
                scanline *= uScanlineIntensity;
                
                // Flicker effect
                float flicker = sin(uTime * 10.0) * 0.5 + 0.5;
                flicker *= uFlickerIntensity;
                
                // Rim lighting
                vec3 viewDir = normalize(-vWorldPos);
                float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
                rim = pow(rim, 3.0) * uRimIntensity;
                
                // Combine effects
                vec3 color = uBaseColor;
                color += scanline + flicker + rim;
                
                gl_FragColor = vec4(color, 0.8);
            }
        `;

        return this.createShader('holographic', vertexShader, fragmentShader);
    }

    // Create Neon Shader
    createNeonShader() {
        const vertexShader = `
            attribute vec3 aPosition;
            attribute vec2 aUv0;
            attribute vec3 aNormal;
            
            uniform mat4 matrix_model;
            uniform mat4 matrix_viewProjection;
            
            varying vec2 vUv0;
            varying vec3 vNormal;
            varying vec3 vWorldPos;
            
            void main() {
                vec4 worldPos = matrix_model * vec4(aPosition, 1.0);
                gl_Position = matrix_viewProjection * worldPos;
                vUv0 = aUv0;
                vNormal = normalize((matrix_model * vec4(aNormal, 0.0)).xyz);
                vWorldPos = worldPos.xyz;
            }
        `;

        const fragmentShader = `
            precision mediump float;
            
            uniform vec3 uBaseColor;
            uniform float uGlowIntensity;
            uniform float uPulseSpeed;
            uniform float uEdgeGlow;
            uniform float uTime;
            
            varying vec2 vUv0;
            varying vec3 vNormal;
            varying vec3 vWorldPos;
            
            void main() {
                // Pulse effect
                float pulse = sin(uTime * uPulseSpeed) * 0.5 + 0.5;
                
                // Edge glow
                vec3 viewDir = normalize(-vWorldPos);
                float edge = 1.0 - max(dot(vNormal, viewDir), 0.0);
                edge = pow(edge, 2.0) * uEdgeGlow;
                
                // Combine effects
                vec3 color = uBaseColor;
                color *= (1.0 + pulse * uGlowIntensity);
                color += edge;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        return this.createShader('neon', vertexShader, fragmentShader);
    }

    // Create Shader
    createShader(name, vertexShader, fragmentShader) {
        if (this.shaders.has(name)) {
            return this.shaders.get(name);
        }

        const shader = new pc.Shader(this.app.graphicsDevice, {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION,
                aUv0: pc.SEMANTIC_TEXCOORD0,
                aNormal: pc.SEMANTIC_NORMAL
            },
            vshader: vertexShader,
            fshader: fragmentShader
        });

        this.shaders.set(name, shader);
        return shader;
    }

    // Load Texture
    loadTexture(textureName) {
        if (this.textures.has(textureName)) {
            return this.textures.get(textureName);
        }

        // Create placeholder texture
        const texture = new pc.Texture(this.app.graphicsDevice, {
            width: 512,
            height: 512,
            format: pc.PIXELFORMAT_R8_G8_B8_A8
        });

        this.textures.set(textureName, texture);
        return texture;
    }

    // Apply Material Preset
    applyMaterialPreset(entity, presetName, customProperties = {}) {
        const preset = this.materialPresets.get(presetName);
        if (!preset) {
            console.error('Material preset not found:', presetName);
            return;
        }

        let material;
        const properties = { ...preset.properties, ...customProperties };

        switch (preset.type) {
            case 'pbr':
                material = this.createPBRMaterial(properties);
                break;
            case 'custom':
                material = this.createCustomMaterial(preset.shader, properties);
                break;
            default:
                material = this.createPBRMaterial(properties);
        }

        if (material && entity.model) {
            entity.model.material = material;
            this.materials.set(entity.id, { material, preset: presetName, properties });
        }

        return material;
    }

    // Create Car Paint Material
    createCarPaintMaterial(color, metallic = false) {
        const material = new pc.StandardMaterial();
        
        // Convert hex color to RGB
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;
        
        material.diffuse = new pc.Color(r, g, b);
        material.metalness = metallic ? 0.1 : 0.0;
        material.roughness = 0.1;
        material.clearcoat = 1.0;
        material.clearcoatRoughness = 0.0;
        
        // Add subtle reflection
        material.reflectivity = 0.8;
        
        material.update();
        return material;
    }

    // Create Glass Material
    createGlassMaterial(color = [0.9, 0.9, 0.9], opacity = 0.3) {
        const material = new pc.StandardMaterial();
        
        material.diffuse = new pc.Color(color[0], color[1], color[2]);
        material.opacity = opacity;
        material.metalness = 0.0;
        material.roughness = 0.0;
        material.reflectivity = 0.9;
        material.refraction = 1.5;
        material.blendType = pc.BLEND_NORMAL;
        
        material.update();
        return material;
    }

    // Create Holographic Material
    createHolographicMaterial(color = [0.1, 0.8, 1.0]) {
        const material = this.createCustomMaterial('holographic', {
            uBaseColor: color,
            uScanlineSpeed: 2.0,
            uScanlineIntensity: 0.5,
            uFlickerIntensity: 0.3,
            uRimIntensity: 1.0,
            uTime: 0.0
        });

        // Update time uniform
        if (this.app) {
            this.app.on('update', (dt) => {
                if (material && material.shader && material.shader.parameters.uTime) {
                    material.shader.parameters.uTime.value += dt;
                }
            });
        }

        return material;
    }

    // Create Neon Material
    createNeonMaterial(color = [1.0, 0.2, 0.8]) {
        const material = this.createCustomMaterial('neon', {
            uBaseColor: color,
            uGlowIntensity: 2.0,
            uPulseSpeed: 1.5,
            uEdgeGlow: 0.8,
            uTime: 0.0
        });

        // Update time uniform
        if (this.app) {
            this.app.on('update', (dt) => {
                if (material && material.shader && material.shader.parameters.uTime) {
                    material.shader.parameters.uTime.value += dt;
                }
            });
        }

        return material;
    }

    // Material Animation
    animateMaterial(entity, animationType, duration = 2000) {
        const materialData = this.materials.get(entity.id);
        if (!materialData) return;

        const material = materialData.material;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1.0);

            switch (animationType) {
                case 'pulse':
                    const pulseIntensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
                    material.emissiveIntensity = pulseIntensity * 2.0;
                    break;
                    
                case 'fade':
                    material.opacity = 1.0 - progress;
                    break;
                    
                case 'colorShift':
                    const hue = progress * 360;
                    const color = this.hsvToRgb(hue, 1.0, 1.0);
                    material.diffuse = new pc.Color(color[0], color[1], color[2]);
                    break;
            }

            material.update();

            if (progress < 1.0) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Color conversion utilities
    hsvToRgb(h, s, v) {
        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;

        let r, g, b;
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }

        return [r + m, g + m, b + m];
    }

    // Cleanup
    destroy() {
        this.materials.clear();
        this.shaders.clear();
        this.textures.clear();
        this.materialPresets.clear();
    }
}

// Initialize Advanced Materials
window.AdvancedMaterialsManager = new AdvancedMaterialsManager(); 