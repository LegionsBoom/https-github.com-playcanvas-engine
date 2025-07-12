/**
 * Spatial Audio System
 * 3D soundscapes and interactive audio for immersive experiences
 */

class SpatialAudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.sources = new Map();
        this.environments = new Map();
        this.listener = { x: 0, y: 0, z: 0 };
        this.isEnabled = false;
        this.volume = 0.7;
        this.reverb = 0.3;
        this.ambientVolume = 0.4;
        
        this.init();
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            
            // Create audio processing nodes
            this.createAudioNodes();
            
            // Load default soundscapes
            await this.loadDefaultSoundscapes();
            
            this.isEnabled = true;
            console.log('Spatial Audio System initialized');
        } catch (error) {
            console.error('Failed to initialize spatial audio:', error);
        }
    }

    createAudioNodes() {
        // Reverb node
        this.reverbNode = this.audioContext.createConvolver();
        this.createReverbImpulse();
        
        // Compressor for dynamic range
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -24;
        this.compressor.knee.value = 30;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;
        
        // EQ for frequency shaping
        this.eq = this.audioContext.createBiquadFilter();
        this.eq.type = 'lowpass';
        this.eq.frequency.value = 8000;
        this.eq.Q.value = 1;
        
        // Connect audio chain
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.eq);
        this.eq.connect(this.reverbNode);
        this.reverbNode.connect(this.audioContext.destination);
    }

    createReverbImpulse() {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 2; // 2 second reverb
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        this.reverbNode.buffer = impulse;
    }

    async loadDefaultSoundscapes() {
        const soundscapes = {
            'showroom': {
                name: 'Car Showroom',
                description: 'Elegant showroom atmosphere with subtle ambient music',
                tracks: ['ambient_music', 'crowd_murmur', 'footsteps'],
                volume: 0.6
            },
            'outdoor': {
                name: 'Outdoor Display',
                description: 'Natural outdoor environment with wind and traffic',
                tracks: ['wind', 'traffic', 'birds', 'leaves'],
                volume: 0.5
            },
            'night': {
                name: 'Night Mode',
                description: 'Quiet night atmosphere with distant city sounds',
                tracks: ['night_ambience', 'distant_traffic', 'crickets'],
                volume: 0.4
            },
            'dynamic': {
                name: 'Dynamic Experience',
                description: 'Interactive audio that responds to user actions',
                tracks: ['interactive_beeps', 'hover_sounds', 'selection_feedback'],
                volume: 0.7
            }
        };

        for (const [key, soundscape] of Object.entries(soundscapes)) {
            this.environments.set(key, soundscape);
        }
    }

    // 3D Audio Source Management
    createAudioSource(id, options = {}) {
        const {
            x = 0, y = 0, z = 0,
            volume = 1.0,
            loop = false,
            spatial = true,
            maxDistance = 100,
            rolloffFactor = 1
        } = options;

        const source = {
            id,
            position: { x, y, z },
            volume,
            loop,
            spatial,
            maxDistance,
            rolloffFactor,
            audioBuffer: null,
            sourceNode: null,
            gainNode: null,
            pannerNode: null,
            isPlaying: false
        };

        this.sources.set(id, source);
        return source;
    }

    async loadAudioSource(id, audioUrl, options = {}) {
        const source = this.createAudioSource(id, options);
        
        try {
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            source.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            console.log(`Audio loaded for source: ${id}`);
        } catch (error) {
            console.error(`Failed to load audio for source ${id}:`, error);
        }
        
        return source;
    }

    playAudioSource(id, options = {}) {
        const source = this.sources.get(id);
        if (!source || !source.audioBuffer) return;

        // Stop existing playback
        if (source.sourceNode) {
            source.sourceNode.stop();
        }

        // Create new audio nodes
        source.sourceNode = this.audioContext.createBufferSource();
        source.gainNode = this.audioContext.createGain();
        source.pannerNode = this.audioContext.createPanner();

        // Configure spatial audio
        if (source.spatial) {
            source.pannerNode.panningModel = 'HRTF';
            source.pannerNode.distanceModel = 'inverse';
            source.pannerNode.maxDistance = source.maxDistance;
            source.pannerNode.rolloffFactor = source.rolloffFactor;
            source.pannerNode.refDistance = 1;
            
            // Set 3D position
            source.pannerNode.setPosition(source.position.x, source.position.y, source.position.z);
        }

        // Configure audio properties
        source.sourceNode.buffer = source.audioBuffer;
        source.sourceNode.loop = source.loop;
        source.gainNode.gain.value = source.volume * this.volume;

        // Connect audio chain
        source.sourceNode.connect(source.gainNode);
        if (source.spatial) {
            source.gainNode.connect(source.pannerNode);
            source.pannerNode.connect(this.masterGain);
        } else {
            source.gainNode.connect(this.masterGain);
        }

        // Start playback
        source.sourceNode.start();
        source.isPlaying = true;

        // Handle playback end
        source.sourceNode.onended = () => {
            source.isPlaying = false;
        };
    }

    stopAudioSource(id) {
        const source = this.sources.get(id);
        if (source && source.sourceNode) {
            source.sourceNode.stop();
            source.isPlaying = false;
        }
    }

    updateAudioSourcePosition(id, x, y, z) {
        const source = this.sources.get(id);
        if (source && source.spatial) {
            source.position = { x, y, z };
            if (source.pannerNode) {
                source.pannerNode.setPosition(x, y, z);
            }
        }
    }

    // Listener Management
    updateListenerPosition(x, y, z) {
        this.listener = { x, y, z };
        
        // Update all spatial audio sources
        this.sources.forEach(source => {
            if (source.spatial && source.pannerNode) {
                const distance = this.calculateDistance(
                    this.listener, source.position
                );
                
                // Apply distance-based volume
                const volume = Math.max(0, 1 - (distance / source.maxDistance));
                source.gainNode.gain.value = source.volume * this.volume * volume;
            }
        });
    }

    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Interactive Audio Features
    createInteractiveAudio(containerId, options = {}) {
        const {
            hoverSound = 'hover_beep',
            clickSound = 'click_confirm',
            selectSound = 'selection_feedback',
            volume = 0.6
        } = options;

        const interactiveAudio = {
            containerId,
            hoverSound,
            clickSound,
            selectSound,
            volume,
            isEnabled: true
        };

        // Add event listeners to container
        const container = document.getElementById(containerId);
        if (container) {
            container.addEventListener('mouseenter', () => {
                if (interactiveAudio.isEnabled) {
                    this.playAudioSource(hoverSound, { volume: interactiveAudio.volume });
                }
            });

            container.addEventListener('click', () => {
                if (interactiveAudio.isEnabled) {
                    this.playAudioSource(clickSound, { volume: interactiveAudio.volume });
                }
            });
        }

        return interactiveAudio;
    }

    // Ambient Soundscapes
    playSoundscape(environmentKey) {
        const environment = this.environments.get(environmentKey);
        if (!environment) return;

        // Stop current soundscape
        this.stopCurrentSoundscape();

        // Play environment tracks
        environment.tracks.forEach(track => {
            this.playAudioSource(track, {
                volume: environment.volume * this.ambientVolume,
                loop: true,
                spatial: false
            });
        });

        this.currentSoundscape = environmentKey;
    }

    stopCurrentSoundscape() {
        if (this.currentSoundscape) {
            const environment = this.environments.get(this.currentSoundscape);
            if (environment) {
                environment.tracks.forEach(track => {
                    this.stopAudioSource(track);
                });
            }
        }
    }

    // Audio Effects and Processing
    setReverbLevel(level) {
        this.reverb = Math.max(0, Math.min(1, level));
        this.reverbNode.gain.value = this.reverb;
    }

    setMasterVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.masterGain.gain.value = this.volume;
    }

    setAmbientVolume(volume) {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
    }

    // Voice Commands Integration
    setupVoiceCommands() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };

            this.recognition.start();
        }
    }

    processVoiceCommand(command) {
        console.log('Voice command:', command);

        if (command.includes('play') || command.includes('start')) {
            if (command.includes('showroom')) {
                this.playSoundscape('showroom');
            } else if (command.includes('outdoor')) {
                this.playSoundscape('outdoor');
            } else if (command.includes('night')) {
                this.playSoundscape('night');
            }
        } else if (command.includes('stop') || command.includes('mute')) {
            this.stopCurrentSoundscape();
        } else if (command.includes('volume')) {
            if (command.includes('up')) {
                this.setMasterVolume(Math.min(1, this.volume + 0.1));
            } else if (command.includes('down')) {
                this.setMasterVolume(Math.max(0, this.volume - 0.1));
            }
        }
    }

    // Cleanup
    destroy() {
        this.sources.forEach(source => {
            if (source.sourceNode) {
                source.sourceNode.stop();
            }
        });

        if (this.audioContext) {
            this.audioContext.close();
        }

        this.sources.clear();
        this.environments.clear();
    }
}

// Singleton instance
window.SpatialAudioManager = new SpatialAudioManager(); 