// Post-Processing System for SMeditor
// Provides cinematic visual effects: bloom, SSAO, motion blur, depth of field

class PostProcessingManager {
    constructor(app) {
        this.app = app;
        this.effects = new Map();
        this.enabled = true;
        this.quality = 'high'; // 'low', 'medium', 'high'
        
        this.init();
    }
    
    init() {
        this.setupRenderTargets();
        this.createEffects();
        this.setupEventListeners();
    }
    
    setupRenderTargets() {
        const device = this.app.graphicsDevice;
        const width = device.width;
        const height = device.height;
        
        // Main render target
        this.mainTarget = new pc.RenderTarget({
            colorBuffers: [device.createTexture({
                width: width,
                height: height,
                format: pc.PIXELFORMAT_R8_G8_B8_A8,
                mipmaps: false
            })],
            depth: device.createTexture({
                width: width,
                height: height,
                format: pc.PIXELFORMAT_DEPTH,
                mipmaps: false
            })
        });
        
        // Bloom render targets
        this.bloomTarget = new pc.RenderTarget({
            colorBuffers: [device.createTexture({
                width: width / 2,
                height: height / 2,
                format: pc.PIXELFORMAT_R8_G8_B8_A8,
                mipmaps: false
            })]
        });
        
        // SSAO render target
        this.ssaoTarget = new pc.RenderTarget({
            colorBuffers: [device.createTexture({
                width: width,
                height: height,
                format: pc.PIXELFORMAT_R8_G8_B8_A8,
                mipmaps: false
            })]
        });
    }
    
    createEffects() {
        // Bloom Effect
        this.createBloomEffect();
        
        // SSAO Effect
        this.createSSAOEffect();
        
        // Motion Blur Effect
        this.createMotionBlurEffect();
        
        // Depth of Field Effect
        this.createDepthOfFieldEffect();
        
        // Custom Holographic Effect
        this.createHolographicEffect();
        
        // Neon Glow Effect
        this.createNeonGlowEffect();
    }
    
    createBloomEffect() {
        const device = this.app.graphicsDevice;
        
        // Bloom shader
        const bloomShader = {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: `
                attribute vec3 aPosition;
                varying vec2 vUv0;
                void main() {
                    gl_Position = vec4(aPosition, 1.0);
                    vUv0 = aPosition.xy * 0.5 + 0.5;
                }
            `,
            fshader: `
                precision mediump float;
                uniform sampler2D uColorBuffer;
                uniform vec2 uResolution;
                varying vec2 vUv0;
                
                vec3 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
                    vec3 color = vec3(0.0);
                    vec2 off1 = vec2(1.3333333333333333) * direction;
                    color += texture2D(image, uv).rgb * 0.29411764705882354;
                    color += texture2D(image, uv + (off1 / resolution)).rgb * 0.35294117647058826;
                    color += texture2D(image, uv - (off1 / resolution)).rgb * 0.35294117647058826;
                    return color;
                }
                
                void main() {
                    vec3 color = texture2D(uColorBuffer, vUv0).rgb;
                    vec3 bloom = blur13(uColorBuffer, vUv0, uResolution, vec2(1.0, 0.0));
                    bloom += blur13(uColorBuffer, vUv0, uResolution, vec2(0.0, 1.0));
                    bloom *= 0.5;
                    
                    // Brightness threshold
                    float brightness = dot(bloom, vec3(0.2126, 0.7152, 0.0722));
                    bloom *= smoothstep(0.3, 0.7, brightness);
                    
                    gl_FragColor = vec4(color + bloom * 0.5, 1.0);
                }
            `
        };
        
        this.bloomShader = device.createShader(bloomShader);
        this.effects.set('bloom', {
            enabled: true,
            intensity: 0.5,
            threshold: 0.3,
            shader: this.bloomShader
        });
    }
    
    createSSAOEffect() {
        const device = this.app.graphicsDevice;
        
        // SSAO shader
        const ssaoShader = {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: `
                attribute vec3 aPosition;
                varying vec2 vUv0;
                void main() {
                    gl_Position = vec4(aPosition, 1.0);
                    vUv0 = aPosition.xy * 0.5 + 0.5;
                }
            `,
            fshader: `
                precision mediump float;
                uniform sampler2D uColorBuffer;
                uniform sampler2D uDepthBuffer;
                uniform vec2 uResolution;
                uniform vec3 uKernel[16];
                uniform float uRadius;
                uniform float uBias;
                varying vec2 vUv0;
                
                float getDepth(vec2 uv) {
                    return texture2D(uDepthBuffer, uv).r;
                }
                
                vec3 getViewPos(vec2 uv) {
                    float depth = getDepth(uv);
                    vec3 clipPos = vec3(uv * 2.0 - 1.0, depth * 2.0 - 1.0);
                    return clipPos;
                }
                
                void main() {
                    vec3 fragPos = getViewPos(vUv0);
                    float occlusion = 0.0;
                    
                    for(int i = 0; i < 16; ++i) {
                        vec3 samplePos = fragPos + uKernel[i] * uRadius;
                        vec2 offset = samplePos.xy / samplePos.z * 0.5 + 0.5;
                        float sampleDepth = getDepth(offset);
                        
                        float rangeCheck = smoothstep(0.0, 1.0, uRadius / abs(fragPos.z - sampleDepth));
                        occlusion += (sampleDepth <= samplePos.z + uBias ? 1.0 : 0.0) * rangeCheck;
                    }
                    
                    occlusion = 1.0 - (occlusion / 16.0);
                    gl_FragColor = vec4(vec3(occlusion), 1.0);
                }
            `
        };
        
        this.ssaoShader = device.createShader(ssaoShader);
        this.effects.set('ssao', {
            enabled: true,
            radius: 0.5,
            bias: 0.025,
            shader: this.ssaoShader
        });
    }
    
    createMotionBlurEffect() {
        const device = this.app.graphicsDevice;
        
        // Motion blur shader
        const motionBlurShader = {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: `
                attribute vec3 aPosition;
                varying vec2 vUv0;
                void main() {
                    gl_Position = vec4(aPosition, 1.0);
                    vUv0 = aPosition.xy * 0.5 + 0.5;
                }
            `,
            fshader: `
                precision mediump float;
                uniform sampler2D uColorBuffer;
                uniform vec2 uVelocity;
                uniform float uIntensity;
                varying vec2 vUv0;
                
                void main() {
                    vec2 velocity = uVelocity * uIntensity;
                    vec3 color = texture2D(uColorBuffer, vUv0).rgb;
                    
                    for(int i = 1; i < 8; ++i) {
                        vec2 offset = velocity * float(i) / 8.0;
                        color += texture2D(uColorBuffer, vUv0 + offset).rgb;
                        color += texture2D(uColorBuffer, vUv0 - offset).rgb;
                    }
                    
                    gl_FragColor = vec4(color / 15.0, 1.0);
                }
            `
        };
        
        this.motionBlurShader = device.createShader(motionBlurShader);
        this.effects.set('motionBlur', {
            enabled: false,
            intensity: 0.3,
            shader: this.motionBlurShader
        });
    }
    
    createDepthOfFieldEffect() {
        const device = this.app.graphicsDevice;
        
        // Depth of field shader
        const dofShader = {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: `
                attribute vec3 aPosition;
                varying vec2 vUv0;
                void main() {
                    gl_Position = vec4(aPosition, 1.0);
                    vUv0 = aPosition.xy * 0.5 + 0.5;
                }
            `,
            fshader: `
                precision mediump float;
                uniform sampler2D uColorBuffer;
                uniform sampler2D uDepthBuffer;
                uniform float uFocusDistance;
                uniform float uFocusRange;
                uniform float uBlurStrength;
                varying vec2 vUv0;
                
                float getDepth(vec2 uv) {
                    return texture2D(uDepthBuffer, uv).r;
                }
                
                void main() {
                    float depth = getDepth(vUv0);
                    float blur = abs(depth - uFocusDistance) / uFocusRange;
                    blur = min(blur, 1.0) * uBlurStrength;
                    
                    vec3 color = texture2D(uColorBuffer, vUv0).rgb;
                    
                    if(blur > 0.01) {
                        vec3 blurred = vec3(0.0);
                        float total = 0.0;
                        
                        for(int i = -4; i <= 4; ++i) {
                            for(int j = -4; j <= 4; ++j) {
                                vec2 offset = vec2(float(i), float(j)) * blur * 0.01;
                                float weight = 1.0 / (1.0 + length(offset) * 2.0);
                                blurred += texture2D(uColorBuffer, vUv0 + offset).rgb * weight;
                                total += weight;
                            }
                        }
                        
                        color = blurred / total;
                    }
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        };
        
        this.dofShader = device.createShader(dofShader);
        this.effects.set('depthOfField', {
            enabled: false,
            focusDistance: 5.0,
            focusRange: 2.0,
            blurStrength: 0.5,
            shader: this.dofShader
        });
    }
    
    createHolographicEffect() {
        const device = this.app.graphicsDevice;
        
        // Holographic shader
        const holographicShader = {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: `
                attribute vec3 aPosition;
                varying vec2 vUv0;
                void main() {
                    gl_Position = vec4(aPosition, 1.0);
                    vUv0 = aPosition.xy * 0.5 + 0.5;
                }
            `,
            fshader: `
                precision mediump float;
                uniform sampler2D uColorBuffer;
                uniform float uTime;
                uniform vec3 uHologramColor;
                uniform float uScanlineSpeed;
                uniform float uGlitchIntensity;
                varying vec2 vUv0;
                
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                void main() {
                    vec3 color = texture2D(uColorBuffer, vUv0).rgb;
                    
                    // Scanlines
                    float scanline = sin(vUv0.y * 100.0 + uTime * uScanlineSpeed) * 0.5 + 0.5;
                    scanline = smoothstep(0.4, 0.6, scanline);
                    
                    // Glitch effect
                    float glitch = random(vec2(uTime * 0.1, vUv0.y));
                    if(glitch < uGlitchIntensity) {
                        vec2 offset = vec2(random(vec2(uTime, 0.0)) - 0.5, 0.0) * 0.01;
                        color = texture2D(uColorBuffer, vUv0 + offset).rgb;
                    }
                    
                    // Hologram color overlay
                    vec3 hologram = mix(color, uHologramColor, 0.3);
                    hologram *= scanline;
                    
                    // Flicker
                    float flicker = sin(uTime * 10.0) * 0.1 + 0.9;
                    hologram *= flicker;
                    
                    gl_FragColor = vec4(hologram, 1.0);
                }
            `
        };
        
        this.holographicShader = device.createShader(holographicShader);
        this.effects.set('holographic', {
            enabled: false,
            color: new pc.Color(0.0, 1.0, 0.8),
            scanlineSpeed: 2.0,
            glitchIntensity: 0.1,
            shader: this.holographicShader
        });
    }
    
    createNeonGlowEffect() {
        const device = this.app.graphicsDevice;
        
        // Neon glow shader
        const neonShader = {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: `
                attribute vec3 aPosition;
                varying vec2 vUv0;
                void main() {
                    gl_Position = vec4(aPosition, 1.0);
                    vUv0 = aPosition.xy * 0.5 + 0.5;
                }
            `,
            fshader: `
                precision mediump float;
                uniform sampler2D uColorBuffer;
                uniform vec3 uNeonColor;
                uniform float uIntensity;
                uniform float uPulseSpeed;
                uniform float uTime;
                varying vec2 vUv0;
                
                void main() {
                    vec3 color = texture2D(uColorBuffer, vUv0).rgb;
                    
                    // Pulse effect
                    float pulse = sin(uTime * uPulseSpeed) * 0.5 + 0.5;
                    
                    // Neon glow
                    vec3 neon = uNeonColor * uIntensity * pulse;
                    
                    // Add glow to bright areas
                    float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722));
                    neon *= smoothstep(0.3, 0.7, brightness);
                    
                    gl_FragColor = vec4(color + neon, 1.0);
                }
            `
        };
        
        this.neonShader = device.createShader(neonShader);
        this.effects.set('neonGlow', {
            enabled: false,
            color: new pc.Color(1.0, 0.0, 1.0),
            intensity: 0.5,
            pulseSpeed: 3.0,
            shader: this.neonShader
        });
    }
    
    setupEventListeners() {
        // Quality settings
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' && e.ctrlKey) {
                e.preventDefault();
                this.toggleEffect('bloom');
            }
            if (e.key === 'o' && e.ctrlKey) {
                e.preventDefault();
                this.toggleEffect('ssao');
            }
            if (e.key === 'i' && e.ctrlKey) {
                e.preventDefault();
                this.toggleEffect('motionBlur');
            }
        });
    }
    
    // Apply post-processing effects
    applyEffects() {
        if (!this.enabled) return;
        
        const device = this.app.graphicsDevice;
        const camera = this.app.scene.camera;
        
        // Store original render target
        const originalTarget = device.renderTarget;
        
        // Apply effects in order
        if (this.effects.get('bloom').enabled) {
            this.applyBloom();
        }
        
        if (this.effects.get('ssao').enabled) {
            this.applySSAO();
        }
        
        if (this.effects.get('motionBlur').enabled) {
            this.applyMotionBlur();
        }
        
        if (this.effects.get('depthOfField').enabled) {
            this.applyDepthOfField();
        }
        
        if (this.effects.get('holographic').enabled) {
            this.applyHolographic();
        }
        
        if (this.effects.get('neonGlow').enabled) {
            this.applyNeonGlow();
        }
        
        // Restore original render target
        device.setRenderTarget(originalTarget);
    }
    
    applyBloom() {
        const effect = this.effects.get('bloom');
        const device = this.app.graphicsDevice;
        
        device.setRenderTarget(this.bloomTarget);
        device.setShader(effect.shader);
        
        // Set uniforms
        effect.shader.setParameter('uColorBuffer', this.mainTarget.colorBuffers[0]);
        effect.shader.setParameter('uResolution', new pc.Vec2(device.width, device.height));
        
        // Draw fullscreen quad
        this.drawFullscreenQuad();
    }
    
    applySSAO() {
        const effect = this.effects.get('ssao');
        const device = this.app.graphicsDevice;
        
        device.setRenderTarget(this.ssaoTarget);
        device.setShader(effect.shader);
        
        // Generate kernel
        const kernel = [];
        for (let i = 0; i < 16; ++i) {
            const sample = new pc.Vec3(
                Math.random() * 2.0 - 1.0,
                Math.random() * 2.0 - 1.0,
                Math.random()
            );
            sample.normalize();
            sample.scale(Math.random());
            const scale = i / 16.0;
            sample.scale(scale);
            kernel.push(sample);
        }
        
        // Set uniforms
        effect.shader.setParameter('uColorBuffer', this.mainTarget.colorBuffers[0]);
        effect.shader.setParameter('uDepthBuffer', this.mainTarget.depth);
        effect.shader.setParameter('uResolution', new pc.Vec2(device.width, device.height));
        effect.shader.setParameter('uRadius', effect.radius);
        effect.shader.setParameter('uBias', effect.bias);
        effect.shader.setParameter('uKernel', kernel);
        
        this.drawFullscreenQuad();
    }
    
    applyMotionBlur() {
        const effect = this.effects.get('motionBlur');
        const device = this.app.graphicsDevice;
        
        // Calculate velocity based on camera movement
        const velocity = new pc.Vec2(0, 0);
        if (this.lastCameraPos) {
            const currentPos = this.app.scene.camera.getPosition();
            velocity.x = (currentPos.x - this.lastCameraPos.x) * 0.1;
            velocity.y = (currentPos.y - this.lastCameraPos.y) * 0.1;
        }
        this.lastCameraPos = this.app.scene.camera.getPosition().clone();
        
        device.setShader(effect.shader);
        effect.shader.setParameter('uColorBuffer', this.mainTarget.colorBuffers[0]);
        effect.shader.setParameter('uVelocity', velocity);
        effect.shader.setParameter('uIntensity', effect.intensity);
        
        this.drawFullscreenQuad();
    }
    
    applyDepthOfField() {
        const effect = this.effects.get('depthOfField');
        const device = this.app.graphicsDevice;
        
        device.setShader(effect.shader);
        effect.shader.setParameter('uColorBuffer', this.mainTarget.colorBuffers[0]);
        effect.shader.setParameter('uDepthBuffer', this.mainTarget.depth);
        effect.shader.setParameter('uFocusDistance', effect.focusDistance);
        effect.shader.setParameter('uFocusRange', effect.focusRange);
        effect.shader.setParameter('uBlurStrength', effect.blurStrength);
        
        this.drawFullscreenQuad();
    }
    
    applyHolographic() {
        const effect = this.effects.get('holographic');
        const device = this.app.graphicsDevice;
        
        device.setShader(effect.shader);
        effect.shader.setParameter('uColorBuffer', this.mainTarget.colorBuffers[0]);
        effect.shader.setParameter('uTime', this.app.getTime() * 0.001);
        effect.shader.setParameter('uHologramColor', effect.color);
        effect.shader.setParameter('uScanlineSpeed', effect.scanlineSpeed);
        effect.shader.setParameter('uGlitchIntensity', effect.glitchIntensity);
        
        this.drawFullscreenQuad();
    }
    
    applyNeonGlow() {
        const effect = this.effects.get('neonGlow');
        const device = this.app.graphicsDevice;
        
        device.setShader(effect.shader);
        effect.shader.setParameter('uColorBuffer', this.mainTarget.colorBuffers[0]);
        effect.shader.setParameter('uNeonColor', effect.color);
        effect.shader.setParameter('uIntensity', effect.intensity);
        effect.shader.setParameter('uPulseSpeed', effect.pulseSpeed);
        effect.shader.setParameter('uTime', this.app.getTime() * 0.001);
        
        this.drawFullscreenQuad();
    }
    
    drawFullscreenQuad() {
        const device = this.app.graphicsDevice;
        
        // Create fullscreen quad
        const positions = new Float32Array([
            -1, -1, 0,
             1, -1, 0,
             1,  1, 0,
            -1,  1, 0
        ]);
        
        const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
        
        const mesh = new pc.Mesh(device);
        mesh.setPositions(positions);
        mesh.setIndices(indices);
        mesh.update(pc.PRIMITIVE_TRIANGLES);
        
        // Draw
        device.setVertexBuffer(mesh.vertexBuffer, 0);
        device.setIndexBuffer(mesh.indexBuffer);
        device.draw(mesh.indexBuffer, mesh.indexBuffer.numIndices, pc.PRIMITIVE_TRIANGLES);
    }
    
    // Public API
    toggleEffect(effectName) {
        const effect = this.effects.get(effectName);
        if (effect) {
            effect.enabled = !effect.enabled;
            console.log(`${effectName} effect ${effect.enabled ? 'enabled' : 'disabled'}`);
        }
    }
    
    setEffectParameter(effectName, parameter, value) {
        const effect = this.effects.get(effectName);
        if (effect && effect[parameter] !== undefined) {
            effect[parameter] = value;
        }
    }
    
    setQuality(quality) {
        this.quality = quality;
        // Adjust effect parameters based on quality
        switch (quality) {
            case 'low':
                this.setEffectParameter('bloom', 'intensity', 0.3);
                this.setEffectParameter('ssao', 'radius', 0.3);
                break;
            case 'medium':
                this.setEffectParameter('bloom', 'intensity', 0.5);
                this.setEffectParameter('ssao', 'radius', 0.5);
                break;
            case 'high':
                this.setEffectParameter('bloom', 'intensity', 0.7);
                this.setEffectParameter('ssao', 'radius', 0.7);
                break;
        }
    }
    
    enableCinematicMode() {
        this.effects.get('bloom').enabled = true;
        this.effects.get('ssao').enabled = true;
        this.effects.get('depthOfField').enabled = true;
        this.effects.get('motionBlur').enabled = true;
    }
    
    enableHolographicMode() {
        this.effects.get('holographic').enabled = true;
        this.effects.get('neonGlow').enabled = true;
    }
    
    destroy() {
        // Clean up resources
        if (this.mainTarget) this.mainTarget.destroy();
        if (this.bloomTarget) this.bloomTarget.destroy();
        if (this.ssaoTarget) this.ssaoTarget.destroy();
    }
}

// Global post-processing manager
window.PostProcessingManager = PostProcessingManager; 