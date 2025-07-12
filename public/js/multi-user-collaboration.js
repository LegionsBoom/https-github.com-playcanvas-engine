/**
 * Multi-User Spatial Collaboration System
 * 3x2 Container Layout with Host Video Screens and Collaborative Workspaces
 */

class MultiUserCollaboration {
    constructor() {
        this.users = new Map();
        this.localUser = null;
        this.roomId = null;
        this.socket = null;
        this.peerConnections = new Map();
        this.localStream = null;
        this.spatialAudio = null;
        this.collaborativeNotes = new Map();
        this.cursorPositions = new Map();
        
        // 3x2 Layout Configuration
        this.layout = {
            containers: [
                { id: 'host-1', type: 'video', position: { x: 0, y: 0 }, size: { width: 33.33, height: 50 } },
                { id: 'host-2', type: 'video', position: { x: 33.33, y: 0 }, size: { width: 33.33, height: 50 } },
                { id: 'host-3', type: 'video', position: { x: 66.66, y: 0 }, size: { width: 33.33, height: 50 } },
                { id: 'notes-1', type: 'collaborative', position: { x: 0, y: 50 }, size: { width: 33.33, height: 50 } },
                { id: 'notes-2', type: 'collaborative', position: { x: 33.33, y: 50 }, size: { width: 33.33, height: 50 } },
                { id: 'controls', type: 'controls', position: { x: 66.66, y: 50 }, size: { width: 33.33, height: 50 } }
            ]
        };
        
        this.init();
    }

    async init() {
        try {
            await this.initializeWebRTC();
            this.setupSocketConnection();
            this.createSpatialLayout();
            this.initializeCollaborativeFeatures();
            this.setupSpatialAudio();
            this.bindEvents();
        } catch (error) {
            console.error('Failed to initialize multi-user collaboration:', error);
        }
    }

    async initializeWebRTC() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: { echoCancellation: true, noiseSuppression: true }
            });
            
            // Create local user
            this.localUser = {
                id: this.generateUserId(),
                name: 'Host',
                stream: this.localStream,
                position: { x: 0, y: 0, z: 0 },
                isLocal: true
            };
            
            this.users.set(this.localUser.id, this.localUser);
        } catch (error) {
            console.error('Failed to access camera/microphone:', error);
        }
    }

    setupSocketConnection() {
        // Initialize Socket.io connection
        this.socket = io('https://your-supabase-realtime-url');
        
        this.socket.on('connect', () => {
            console.log('Connected to collaboration server');
            this.joinRoom();
        });

        this.socket.on('user-joined', (userData) => {
            this.handleUserJoined(userData);
        });

        this.socket.on('user-left', (userId) => {
            this.handleUserLeft(userId);
        });

        this.socket.on('cursor-moved', (data) => {
            this.updateRemoteCursor(data);
        });

        this.socket.on('note-updated', (data) => {
            this.updateCollaborativeNote(data);
        });

        this.socket.on('scene-changed', (data) => {
            this.handleSceneChange(data);
        });

        this.socket.on('voice-command', (data) => {
            this.handleVoiceCommand(data);
        });
    }

    createSpatialLayout() {
        const container = document.createElement('div');
        container.id = 'multi-user-collaboration';
        container.className = 'spatial-collaboration-layout';
        
        // Create 3x2 grid layout
        this.layout.containers.forEach(containerConfig => {
            const element = this.createContainer(containerConfig);
            container.appendChild(element);
        });

        // Add to editor
        const editorContainer = document.querySelector('#editor-container');
        if (editorContainer) {
            editorContainer.appendChild(container);
        }

        this.applyCockpitStyling();
    }

    createContainer(config) {
        const container = document.createElement('div');
        container.id = config.id;
        container.className = `collaboration-container ${config.type}-container`;
        
        container.style.position = 'absolute';
        container.style.left = `${config.position.x}%`;
        container.style.top = `${config.position.y}%`;
        container.style.width = `${config.size.width}%`;
        container.style.height = `${config.size.height}%`;

        switch (config.type) {
            case 'video':
                this.createVideoContainer(container, config);
                break;
            case 'collaborative':
                this.createCollaborativeContainer(container, config);
                break;
            case 'controls':
                this.createControlsContainer(container, config);
                break;
        }

        return container;
    }

    createVideoContainer(container, config) {
        const videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.className = 'host-video';

        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <div class="user-name">Host ${config.id.split('-')[1]}</div>
            <div class="user-status">Online</div>
            <div class="spatial-audio-indicator"></div>
        `;

        const controls = document.createElement('div');
        controls.className = 'video-controls';
        controls.innerHTML = `
            <button class="mute-btn" data-action="mute">
                <i class="fas fa-microphone"></i>
            </button>
            <button class="video-btn" data-action="video">
                <i class="fas fa-video"></i>
            </button>
            <button class="screen-share-btn" data-action="screen-share">
                <i class="fas fa-desktop"></i>
            </button>
        `;

        container.appendChild(videoElement);
        container.appendChild(userInfo);
        container.appendChild(controls);

        // Store reference for later use
        container.videoElement = videoElement;
        container.userInfo = userInfo;
        container.controls = controls;
    }

    createCollaborativeContainer(container, config) {
        const notesArea = document.createElement('div');
        notesArea.className = 'collaborative-notes';
        notesArea.contentEditable = true;
        notesArea.placeholder = 'Collaborative notes...';

        const cursors = document.createElement('div');
        cursors.className = 'remote-cursors';

        const toolbar = document.createElement('div');
        toolbar.className = 'notes-toolbar';
        toolbar.innerHTML = `
            <button class="format-btn" data-format="bold">
                <i class="fas fa-bold"></i>
            </button>
            <button class="format-btn" data-format="italic">
                <i class="fas fa-italic"></i>
            </button>
            <button class="format-btn" data-format="underline">
                <i class="fas fa-underline"></i>
            </button>
            <button class="color-picker-btn">
                <i class="fas fa-palette"></i>
            </button>
            <button class="clear-btn">
                <i class="fas fa-trash"></i>
            </button>
        `;

        container.appendChild(notesArea);
        container.appendChild(cursors);
        container.appendChild(toolbar);

        // Store reference
        container.notesArea = notesArea;
        container.cursors = cursors;
        container.toolbar = toolbar;
    }

    createControlsContainer(container, config) {
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'collaboration-controls';
        controlsPanel.innerHTML = `
            <div class="control-section">
                <h3>Spatial Controls</h3>
                <button class="control-btn" data-action="reset-view">
                    <i class="fas fa-home"></i>
                    Reset View
                </button>
                <button class="control-btn" data-action="follow-host">
                    <i class="fas fa-user-friends"></i>
                    Follow Host
                </button>
                <button class="control-btn" data-action="free-camera">
                    <i class="fas fa-camera"></i>
                    Free Camera
                </button>
            </div>
            
            <div class="control-section">
                <h3>Scene Controls</h3>
                <button class="control-btn" data-action="save-scene">
                    <i class="fas fa-save"></i>
                    Save Scene
                </button>
                <button class="control-btn" data-action="load-scene">
                    <i class="fas fa-folder-open"></i>
                    Load Scene
                </button>
                <button class="control-btn" data-action="export-scene">
                    <i class="fas fa-download"></i>
                    Export
                </button>
            </div>
            
            <div class="control-section">
                <h3>Collaboration</h3>
                <button class="control-btn" data-action="invite-users">
                    <i class="fas fa-user-plus"></i>
                    Invite Users
                </button>
                <button class="control-btn" data-action="record-session">
                    <i class="fas fa-record-vinyl"></i>
                    Record Session
                </button>
                <button class="control-btn" data-action="share-link">
                    <i class="fas fa-share"></i>
                    Share Link
                </button>
            </div>
        `;

        container.appendChild(controlsPanel);
        container.controlsPanel = controlsPanel;
    }

    applyCockpitStyling() {
        const style = document.createElement('style');
        style.textContent = `
            .spatial-collaboration-layout {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                border: 2px solid #00d4ff;
                border-radius: 10px;
                box-shadow: 
                    0 0 20px rgba(0, 212, 255, 0.3),
                    inset 0 0 20px rgba(0, 212, 255, 0.1);
                overflow: hidden;
            }

            .collaboration-container {
                border: 1px solid #00d4ff;
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                box-shadow: 
                    0 0 15px rgba(0, 212, 255, 0.2),
                    inset 0 0 15px rgba(0, 212, 255, 0.05);
                transition: all 0.3s ease;
            }

            .collaboration-container:hover {
                border-color: #00ff88;
                box-shadow: 
                    0 0 25px rgba(0, 255, 136, 0.4),
                    inset 0 0 25px rgba(0, 255, 136, 0.1);
            }

            .host-video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
                border: 2px solid #00d4ff;
            }

            .user-info {
                position: absolute;
                bottom: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.8);
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid #00d4ff;
                color: #00d4ff;
                font-size: 12px;
                backdrop-filter: blur(5px);
            }

            .video-controls {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 8px;
            }

            .video-controls button {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #00d4ff;
                color: #00d4ff;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .video-controls button:hover {
                background: rgba(0, 212, 255, 0.2);
                border-color: #00ff88;
            }

            .collaborative-notes {
                width: 100%;
                height: 100%;
                padding: 15px;
                background: rgba(0, 0, 0, 0.9);
                color: #00d4ff;
                border: none;
                outline: none;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.6;
                resize: none;
                overflow-y: auto;
            }

            .collaborative-notes:focus {
                border: 2px solid #00ff88;
                box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
            }

            .notes-toolbar {
                position: absolute;
                top: 10px;
                left: 10px;
                display: flex;
                gap: 5px;
                background: rgba(0, 0, 0, 0.9);
                padding: 8px;
                border-radius: 6px;
                border: 1px solid #00d4ff;
            }

            .notes-toolbar button {
                background: transparent;
                border: 1px solid #00d4ff;
                color: #00d4ff;
                padding: 6px 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .notes-toolbar button:hover {
                background: rgba(0, 212, 255, 0.2);
                border-color: #00ff88;
            }

            .collaboration-controls {
                padding: 15px;
                height: 100%;
                overflow-y: auto;
            }

            .control-section {
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 8px;
                border: 1px solid #00d4ff;
            }

            .control-section h3 {
                color: #00d4ff;
                margin: 0 0 15px 0;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .control-btn {
                display: block;
                width: 100%;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #00d4ff;
                color: #00d4ff;
                padding: 10px 15px;
                margin-bottom: 8px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                font-size: 12px;
            }

            .control-btn:hover {
                background: rgba(0, 212, 255, 0.2);
                border-color: #00ff88;
                transform: translateX(5px);
            }

            .control-btn i {
                margin-right: 8px;
                width: 16px;
            }

            .remote-cursors {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
            }

            .remote-cursor {
                position: absolute;
                width: 20px;
                height: 20px;
                background: #00ff88;
                border-radius: 50%;
                border: 2px solid #fff;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
            }

            .spatial-audio-indicator {
                width: 8px;
                height: 8px;
                background: #00ff88;
                border-radius: 50%;
                margin-left: 5px;
                animation: audio-pulse 1s infinite;
            }

            @keyframes audio-pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.5; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    initializeCollaborativeFeatures() {
        // Initialize collaborative notes
        this.setupCollaborativeNotes();
        
        // Initialize cursor tracking
        this.setupCursorTracking();
        
        // Initialize voice commands
        this.setupVoiceCommands();
        
        // Initialize scene synchronization
        this.setupSceneSync();
    }

    setupCollaborativeNotes() {
        const notesContainers = document.querySelectorAll('.collaborative-notes');
        
        notesContainers.forEach((container, index) => {
            const noteId = `note-${index + 1}`;
            this.collaborativeNotes.set(noteId, {
                content: '',
                lastModified: Date.now(),
                modifiedBy: null
            });

            container.addEventListener('input', (e) => {
                this.updateNote(noteId, e.target.innerHTML);
            });

            container.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    this.saveNote(noteId);
                }
            });
        });
    }

    setupCursorTracking() {
        document.addEventListener('mousemove', (e) => {
            if (this.localUser) {
                const cursorData = {
                    userId: this.localUser.id,
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now()
                };
                
                this.socket.emit('cursor-moved', cursorData);
                this.updateLocalCursor(cursorData);
            }
        });
    }

    setupVoiceCommands() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            
            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                
                if (event.results[event.results.length - 1].isFinal) {
                    this.processVoiceCommand(transcript);
                }
            };
            
            recognition.start();
        }
    }

    setupSceneSync() {
        // Sync scene changes with other users
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.on('scene-changed', (sceneData) => {
                this.socket.emit('scene-changed', {
                    userId: this.localUser.id,
                    sceneData: sceneData,
                    timestamp: Date.now()
                });
            });
        }
    }

    setupSpatialAudio() {
        // Initialize spatial audio for voice chat
        this.spatialAudio = new SpatialAudioManager();
        this.spatialAudio.initialize();
    }

    bindEvents() {
        // Video controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.video-controls button')) {
                const button = e.target.closest('.video-controls button');
                const action = button.dataset.action;
                this.handleVideoControl(action, button);
            }
        });

        // Collaboration controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.control-btn')) {
                const button = e.target.closest('.control-btn');
                const action = button.dataset.action;
                this.handleCollaborationControl(action);
            }
        });

        // Notes toolbar
        document.addEventListener('click', (e) => {
            if (e.target.closest('.format-btn')) {
                const button = e.target.closest('.format-btn');
                const format = button.dataset.format;
                this.formatNote(format);
            }
        });
    }

    // Event Handlers
    handleUserJoined(userData) {
        this.users.set(userData.id, userData);
        this.createPeerConnection(userData.id);
        this.updateUserList();
    }

    handleUserLeft(userId) {
        this.users.delete(userId);
        this.removePeerConnection(userId);
        this.updateUserList();
    }

    handleVideoControl(action, button) {
        switch (action) {
            case 'mute':
                this.toggleMute(button);
                break;
            case 'video':
                this.toggleVideo(button);
                break;
            case 'screen-share':
                this.toggleScreenShare(button);
                break;
        }
    }

    handleCollaborationControl(action) {
        switch (action) {
            case 'reset-view':
                this.resetView();
                break;
            case 'follow-host':
                this.followHost();
                break;
            case 'free-camera':
                this.enableFreeCamera();
                break;
            case 'save-scene':
                this.saveScene();
                break;
            case 'load-scene':
                this.loadScene();
                break;
            case 'export-scene':
                this.exportScene();
                break;
            case 'invite-users':
                this.inviteUsers();
                break;
            case 'record-session':
                this.recordSession();
                break;
            case 'share-link':
                this.shareLink();
                break;
        }
    }

    // Utility Methods
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    joinRoom() {
        this.roomId = 'room_' + Math.random().toString(36).substr(2, 9);
        this.socket.emit('join-room', {
            roomId: this.roomId,
            user: this.localUser
        });
    }

    updateNote(noteId, content) {
        const note = this.collaborativeNotes.get(noteId);
        if (note) {
            note.content = content;
            note.lastModified = Date.now();
            note.modifiedBy = this.localUser.id;
            
            this.socket.emit('note-updated', {
                noteId: noteId,
                content: content,
                userId: this.localUser.id,
                timestamp: Date.now()
            });
        }
    }

    updateCollaborativeNote(data) {
        const note = this.collaborativeNotes.get(data.noteId);
        if (note && data.userId !== this.localUser.id) {
            note.content = data.content;
            note.lastModified = data.timestamp;
            note.modifiedBy = data.userId;
            
            // Update UI
            const container = document.querySelector(`[data-note-id="${data.noteId}"]`);
            if (container) {
                container.innerHTML = data.content;
            }
        }
    }

    updateLocalCursor(data) {
        // Update local cursor position
        const cursor = document.querySelector('.local-cursor') || this.createCursor(data.userId);
        cursor.style.left = data.x + 'px';
        cursor.style.top = data.y + 'px';
    }

    updateRemoteCursor(data) {
        if (data.userId !== this.localUser.id) {
            const cursor = document.querySelector(`[data-user-id="${data.userId}"]`) || this.createCursor(data.userId);
            cursor.style.left = data.x + 'px';
            cursor.style.top = data.y + 'px';
        }
    }

    createCursor(userId) {
        const cursor = document.createElement('div');
        cursor.className = 'remote-cursor';
        cursor.dataset.userId = userId;
        document.body.appendChild(cursor);
        return cursor;
    }

    processVoiceCommand(transcript) {
        const command = transcript.toLowerCase();
        
        if (command.includes('save scene')) {
            this.saveScene();
        } else if (command.includes('reset view')) {
            this.resetView();
        } else if (command.includes('follow host')) {
            this.followHost();
        } else if (command.includes('free camera')) {
            this.enableFreeCamera();
        } else if (command.includes('invite users')) {
            this.inviteUsers();
        }
        
        // Emit voice command to other users
        this.socket.emit('voice-command', {
            userId: this.localUser.id,
            command: transcript,
            timestamp: Date.now()
        });
    }

    handleVoiceCommand(data) {
        if (data.userId !== this.localUser.id) {
            // Process voice command from other user
            console.log(`Voice command from ${data.userId}: ${data.command}`);
        }
    }

    handleSceneChange(data) {
        if (data.userId !== this.localUser.id && window.PlayCanvasManager) {
            // Apply scene changes from other user
            window.PlayCanvasManager.loadScene(data.sceneData);
        }
    }

    // Video Control Methods
    toggleMute(button) {
        const video = button.closest('.collaboration-container').querySelector('video');
        if (video.srcObject) {
            const audioTrack = video.srcObject.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                button.classList.toggle('muted');
            }
        }
    }

    toggleVideo(button) {
        const video = button.closest('.collaboration-container').querySelector('video');
        if (video.srcObject) {
            const videoTrack = video.srcObject.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                button.classList.toggle('disabled');
            }
        }
    }

    async toggleScreenShare(button) {
        try {
            if (button.classList.contains('sharing')) {
                // Stop screen sharing
                button.classList.remove('sharing');
                // Restore camera
            } else {
                // Start screen sharing
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });
                button.classList.add('sharing');
                // Replace video stream
            }
        } catch (error) {
            console.error('Screen sharing failed:', error);
        }
    }

    // Collaboration Control Methods
    resetView() {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.resetCamera();
        }
    }

    followHost() {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.followUser(this.localUser.id);
        }
    }

    enableFreeCamera() {
        if (window.PlayCanvasManager) {
            window.PlayCanvasManager.enableFreeCamera();
        }
    }

    saveScene() {
        if (window.PlayCanvasManager) {
            const sceneData = window.PlayCanvasManager.exportScene();
            // Save to Supabase
            this.saveToDatabase(sceneData);
        }
    }

    loadScene() {
        // Load scene from database
        this.loadFromDatabase();
    }

    exportScene() {
        if (window.PlayCanvasManager) {
            const sceneData = window.PlayCanvasManager.exportScene();
            this.downloadScene(sceneData);
        }
    }

    inviteUsers() {
        const inviteLink = `${window.location.origin}/join/${this.roomId}`;
        navigator.clipboard.writeText(inviteLink);
        this.showNotification('Invite link copied to clipboard!');
    }

    recordSession() {
        // Start/stop session recording
        this.toggleRecording();
    }

    shareLink() {
        const shareLink = `${window.location.origin}/view/${this.roomId}`;
        navigator.clipboard.writeText(shareLink);
        this.showNotification('Share link copied to clipboard!');
    }

    // Database Methods
    async saveToDatabase(sceneData) {
        try {
            const response = await fetch('/api/scenes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomId: this.roomId,
                    sceneData: sceneData,
                    userId: this.localUser.id
                })
            });
            
            if (response.ok) {
                this.showNotification('Scene saved successfully!');
            }
        } catch (error) {
            console.error('Failed to save scene:', error);
        }
    }

    async loadFromDatabase() {
        try {
            const response = await fetch(`/api/scenes/${this.roomId}`);
            const sceneData = await response.json();
            
            if (window.PlayCanvasManager) {
                window.PlayCanvasManager.loadScene(sceneData);
            }
        } catch (error) {
            console.error('Failed to load scene:', error);
        }
    }

    downloadScene(sceneData) {
        const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scene-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    toggleRecording() {
        // Implement session recording
        console.log('Session recording toggled');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'collaboration-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 212, 255, 0.9);
            color: #000;
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid #00ff88;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateUserList() {
        // Update user list display
        const userCount = this.users.size;
        console.log(`Users in room: ${userCount}`);
    }

    // WebRTC Methods
    createPeerConnection(userId) {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        this.peerConnections.set(userId, peerConnection);
        
        // Add local stream
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, this.localStream);
            });
        }

        // Handle incoming streams
        peerConnection.ontrack = (event) => {
            const videoElement = document.querySelector(`[data-user-id="${userId}"] video`);
            if (videoElement) {
                videoElement.srcObject = event.streams[0];
            }
        };

        return peerConnection;
    }

    removePeerConnection(userId) {
        const peerConnection = this.peerConnections.get(userId);
        if (peerConnection) {
            peerConnection.close();
            this.peerConnections.delete(userId);
        }
    }

    // Cleanup
    destroy() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        this.peerConnections.forEach(connection => {
            connection.close();
        });
        
        if (this.socket) {
            this.socket.disconnect();
        }
        
        // Remove UI elements
        const container = document.querySelector('#multi-user-collaboration');
        if (container) {
            container.remove();
        }
    }
}

// Spatial Audio Manager
class SpatialAudioManager {
    constructor() {
        this.audioContext = null;
        this.spatialSources = new Map();
        this.listener = null;
    }

    initialize() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.setupListener();
    }

    setupListener() {
        this.listener = this.audioContext.listener;
        // Set listener position and orientation
        this.listener.setPosition(0, 0, 0);
        this.listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    addSpatialSource(userId, stream, position) {
        const source = this.audioContext.createMediaStreamSource(stream);
        const gainNode = this.audioContext.createGain();
        const panner = this.audioContext.createPanner();
        
        source.connect(gainNode);
        gainNode.connect(panner);
        panner.connect(this.audioContext.destination);
        
        panner.setPosition(position.x, position.y, position.z);
        panner.setDistanceModel('inverse');
        panner.setMaxDistance(100);
        panner.setRefDistance(1);
        panner.setRolloffFactor(1);
        
        this.spatialSources.set(userId, { source, gainNode, panner });
    }

    updateSourcePosition(userId, position) {
        const spatialSource = this.spatialSources.get(userId);
        if (spatialSource) {
            spatialSource.panner.setPosition(position.x, position.y, position.z);
        }
    }

    removeSpatialSource(userId) {
        const spatialSource = this.spatialSources.get(userId);
        if (spatialSource) {
            spatialSource.source.disconnect();
            spatialSource.gainNode.disconnect();
            spatialSource.panner.disconnect();
            this.spatialSources.delete(userId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.MultiUserCollaboration = new MultiUserCollaboration();
});

// Export for global access
window.MultiUserCollaboration = MultiUserCollaboration;
window.SpatialAudioManager = SpatialAudioManager; 