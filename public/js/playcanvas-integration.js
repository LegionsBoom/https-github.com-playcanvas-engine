// PlayCanvas Integration Manager (Refactored)
class PlayCanvasManager extends pc.events {
    constructor(canvasId) {
        super();
        this.canvasId = canvasId;
        this.app = null;
        this.camera = null;
        this.walkthroughMode = false;
        this.walkthroughPath = [];
        this.walkthroughSpheres = [];
        this.walkthroughLine = null;
        this.walkthroughAnimating = false;
        this.pointerHandler = this.onPointerDown.bind(this);
        this.dragState = {
            isDragging: false,
            dragElement: null,
            dragPreview: null,
            dragData: null
        };
        this._init();
    }

    _init() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) {
            console.error('PlayCanvas canvas not found!');
            return;
        }
        this.app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
        });
        this.app.start();
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
        window.addEventListener('resize', () => this.app.resizeCanvas(), false);
        this.app.scene.ambientLight = new pc.Color(0.3, 0.3, 0.4);

        // Camera
        this.camera = new pc.Entity('Camera');
        this.camera.addComponent('camera', {
            clearColor: new pc.Color(0.08, 0.12, 0.18, 1)
        });
        this.camera.setLocalPosition(0, 0, 6);
        this.app.root.addChild(this.camera);

        // Orbit Camera script
        this.enableOrbitCamera();

        // Light
        const light = new pc.Entity('Directional Light');
        light.addComponent('light', {
            type: 'directional',
            color: new pc.Color(1, 1, 1),
            intensity: 1.2
        });
        light.setLocalEulerAngles(45, 30, 0);
        this.app.root.addChild(light);

        // Car placeholder (box)
        const box = new pc.Entity('Box');
        box.addComponent('model', { type: 'box' });
        box.setLocalScale(2.2, 1, 4);
        this.app.root.addChild(box);
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(0.1, 0.9, 0.8);
        material.emissive = new pc.Color(0.0, 1.0, 0.8);
        material.emissiveIntensity = 1.5;
        material.update();
        box.model.material = material;

        // Animate box (for demo)
        this.app.on('update', (dt) => {
            if (!this.walkthroughAnimating) box.rotate(0, 20 * dt, 0);
        });

        // Walkthrough click handler
        canvas.addEventListener('pointerdown', this.pointerHandler);
        
        // Drag and drop handlers
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const canvas = document.getElementById(this.canvasId);
        
        // Global drag event listeners
        document.addEventListener('dragstart', this.onDragStart.bind(this));
        document.addEventListener('dragend', this.onDragEnd.bind(this));
        document.addEventListener('dragover', this.onDragOver.bind(this));
        document.addEventListener('drop', this.onDrop.bind(this));
        
        // Canvas-specific handlers
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.updateDragPreview(e);
        });
        
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleDrop(e);
        });
    }

    onDragStart(e) {
        const dragElement = e.target.closest('[data-draggable]');
        if (!dragElement) return;
        
        this.dragState.isDragging = true;
        this.dragState.dragElement = dragElement;
        this.dragState.dragData = {
            type: dragElement.dataset.type || 'content',
            id: dragElement.dataset.id,
            name: dragElement.dataset.name,
            properties: JSON.parse(dragElement.dataset.properties || '{}')
        };
        
        // Create drag preview in 3D scene
        this.createDragPreview();
        
        this.fire('drag:start', this.dragState.dragData);
    }

    onDragEnd(e) {
        if (this.dragState.dragPreview) {
            this.dragState.dragPreview.destroy();
            this.dragState.dragPreview = null;
        }
        
        this.dragState.isDragging = false;
        this.dragState.dragElement = null;
        this.dragState.dragData = null;
        
        this.fire('drag:end');
    }

    onDragOver(e) {
        e.preventDefault();
        if (this.dragState.isDragging) {
            this.updateDragPreview(e);
        }
    }

    onDrop(e) {
        e.preventDefault();
        this.handleDrop(e);
    }

    createDragPreview() {
        if (this.dragState.dragPreview) {
            this.dragState.dragPreview.destroy();
        }
        
        const preview = new pc.Entity('DragPreview');
        preview.addComponent('model', { type: 'box' });
        preview.setLocalScale(1, 1, 1);
        
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(0.2, 0.8, 0.9);
        material.emissive = new pc.Color(0.1, 0.4, 0.5);
        material.emissiveIntensity = 0.8;
        material.opacity = 0.6;
        material.blendType = pc.BLEND_NORMAL;
        material.update();
        
        preview.model.material = material;
        this.app.root.addChild(preview);
        this.dragState.dragPreview = preview;
    }

    updateDragPreview(e) {
        if (!this.dragState.dragPreview) return;
        
        const canvas = document.getElementById(this.canvasId);
        const rect = canvas.getBoundingClientRect();
        const camera = this.camera.camera;
        
        // Convert screen coordinates to world coordinates
        const from = this.camera.getPosition().clone();
        const to = camera.screenToWorld(e.clientX, e.clientY, 0.0, rect.width, rect.height);
        const dir = to.clone().sub(from).normalize();
        
        // Raycast to ground plane (y = 0)
        const t = -from.y / dir.y;
        const dropPosition = from.clone().add(dir.scale(t));
        
        this.dragState.dragPreview.setPosition(dropPosition);
    }

    handleDrop(e) {
        if (!this.dragState.isDragging || !this.dragState.dragData) return;
        
        const canvas = document.getElementById(this.canvasId);
        const rect = canvas.getBoundingClientRect();
        const camera = this.camera.camera;
        
        // Calculate drop position
        const from = this.camera.getPosition().clone();
        const to = camera.screenToWorld(e.clientX, e.clientY, 0.0, rect.width, rect.height);
        const dir = to.clone().sub(from).normalize();
        const t = -from.y / dir.y;
        const dropPosition = from.clone().add(dir.scale(t));
        
        // Create the actual content entity
        this.createContentEntity(this.dragState.dragData, dropPosition);
        
        this.fire('content:created', {
            data: this.dragState.dragData,
            position: dropPosition
        });
    }

    createContentEntity(data, position) {
        const entity = new pc.Entity(data.name || 'Content');
        
        // Add model component based on type
        switch (data.type) {
            case 'vehicle':
                entity.addComponent('model', { type: 'box' });
                entity.setLocalScale(2.2, 1, 4);
                break;
            case 'hotspot':
                entity.addComponent('model', { type: 'sphere' });
                entity.setLocalScale(0.5, 0.5, 0.5);
                break;
            case 'content':
            default:
                entity.addComponent('model', { type: 'box' });
                entity.setLocalScale(1, 1, 1);
                break;
        }
        
        entity.setPosition(position);
        
        // Apply material based on type
        const material = new pc.StandardMaterial();
        switch (data.type) {
            case 'vehicle':
                material.diffuse = new pc.Color(0.1, 0.9, 0.8);
                material.emissive = new pc.Color(0.0, 1.0, 0.8);
                material.emissiveIntensity = 1.5;
                break;
            case 'hotspot':
                material.diffuse = new pc.Color(1.0, 0.5, 0.0);
                material.emissive = new pc.Color(1.0, 0.5, 0.0);
                material.emissiveIntensity = 2.0;
                break;
            default:
                material.diffuse = new pc.Color(0.7, 0.7, 0.7);
                break;
        }
        material.update();
        entity.model.material = material;
        
        // Add custom properties
        entity.contentData = data;
        
        this.app.root.addChild(entity);
        
        return entity;
    }

    // Public method to enable drag-and-drop on UI elements
    enableDragOnElement(element, data) {
        element.setAttribute('draggable', 'true');
        element.setAttribute('data-draggable', 'true');
        element.setAttribute('data-type', data.type);
        element.setAttribute('data-id', data.id);
        element.setAttribute('data-name', data.name);
        element.setAttribute('data-properties', JSON.stringify(data.properties || {}));
    }

    enableOrbitCamera() {
        if (!this.camera.script) {
            this.camera.addComponent('script');
        }
        if (!this.camera.script.instances['orbitCamera']) {
            this.camera.script.create('orbitCamera', {
                attributes: {
                    distanceMax: 20,
                    distanceMin: 2,
                    pitchAngleMax: 90,
                    pitchAngleMin: -45,
                    inertiaFactor: 0.2,
                    focusEntity: null,
                    frameOnStart: false
                }
            });
        }
    }

    disableOrbitCamera() {
        if (this.camera.script && this.camera.script.instances['orbitCamera']) {
            this.camera.script.destroy('orbitCamera');
        }
    }

    toggleCameraMode(mode) {
        // mode: 'orbit' | 'walkthrough'
        if (mode === 'orbit') {
            this.enableOrbitCamera();
            this.walkthroughMode = false;
        } else if (mode === 'walkthrough') {
            this.disableOrbitCamera();
            this.walkthroughMode = true;
        }
    }

    destroy() {
        if (this.app) {
            this.app.destroy();
            this.app = null;
        }
        this.walkthroughPath = [];
        this.walkthroughSpheres.forEach(s => s.destroy());
        this.walkthroughSpheres = [];
        if (this.walkthroughLine) {
            this.walkthroughLine.destroy();
            this.walkthroughLine = null;
        }
        this.camera = null;
        this.walkthroughAnimating = false;
        const canvas = document.getElementById(this.canvasId);
        if (canvas) canvas.removeEventListener('pointerdown', this.pointerHandler);
    }

    startWalkthrough() {
        this.walkthroughMode = true;
        this.disableOrbitCamera();
        this.walkthroughPath = [];
        this.walkthroughSpheres.forEach(s => s.destroy());
        this.walkthroughSpheres = [];
        if (this.walkthroughLine) { this.walkthroughLine.destroy(); this.walkthroughLine = null; }
        this.fire('walkthrough:start');
    }

    finishWalkthrough() {
        this.walkthroughMode = false;
        this.enableOrbitCamera();
        this.fire('walkthrough:end', this.walkthroughPath);
    }

    async playWalkthrough() {
        if (this.walkthroughPath.length < 2) return;
        this.walkthroughAnimating = true;
        const cam = this.camera;
        for (let i = 0; i < this.walkthroughPath.length - 1; i++) {
            const from = this.walkthroughPath[i].clone();
            const to = this.walkthroughPath[i + 1].clone();
            const duration = 1.2; // seconds
            let t = 0;
            while (t < duration) {
                const alpha = t / duration;
                const pos = from.clone().lerp(to, alpha);
                cam.setPosition(pos);
                cam.lookAt(to);
                await new Promise(r => setTimeout(r, 16));
                t += 0.016;
            }
            cam.setPosition(to);
            cam.lookAt(to);
            await new Promise(r => setTimeout(r, 400));
        }
        this.walkthroughAnimating = false;
        this.fire('walkthrough:playend');
    }

    onPointerDown(e) {
        if (!this.walkthroughMode) return;
        const canvas = document.getElementById(this.canvasId);
        const rect = canvas.getBoundingClientRect();
        const camera = this.camera.camera;
        const from = this.camera.getPosition().clone();
        const to = camera.screenToWorld(e.clientX, e.clientY, 0.0, rect.width, rect.height);
        const dir = to.clone().sub(from).normalize();
        const t = -from.y / dir.y;
        const pos = from.clone().add(dir.scale(t));
        this.walkthroughPath.push(pos.clone());
        this.addWalkthroughSphere(pos);
        this.updateWalkthroughLine();
        this.fire('walkthrough:waypoint', pos.clone());
    }

    addWalkthroughSphere(pos) {
        const sphere = new pc.Entity('Waypoint');
        sphere.addComponent('model', { type: 'sphere' });
        sphere.setLocalScale(0.25, 0.25, 0.25);
        sphere.setPosition(pos);
        const mat = new pc.StandardMaterial();
        mat.diffuse = new pc.Color(0.0, 1.0, 0.8);
        mat.emissive = new pc.Color(0.0, 1.0, 0.8);
        mat.emissiveIntensity = 2.5;
        mat.update();
        sphere.model.material = mat;
        this.app.root.addChild(sphere);
        this.walkthroughSpheres.push(sphere);
    }

    updateWalkthroughLine() {
        if (this.walkthroughLine) {
            this.app.root.removeChild(this.walkthroughLine);
            this.walkthroughLine.destroy();
            this.walkthroughLine = null;
        }
        if (this.walkthroughPath.length < 2) return;
        const line = new pc.Entity('WalkthroughLine');
        const positions = this.walkthroughPath.map(p => [p.x, p.y, p.z]).flat();
        const mesh = new pc.Mesh(this.app.graphicsDevice);
        mesh.setPositions(positions);
        mesh.setIndices(Array.from({length: this.walkthroughPath.length}, (_, i) => i));
        mesh.update(pc.PRIMITIVE_LINESTRIP);
        const meshInstance = new pc.MeshInstance(mesh, new pc.StandardMaterial());
        meshInstance.material.emissive = new pc.Color(0.0, 1.0, 0.8);
        meshInstance.material.emissiveIntensity = 2.0;
        meshInstance.material.update();
        const model = new pc.Model();
        model.graph = new pc.GraphNode();
        model.meshInstances = [meshInstance];
        line.addComponent('model');
        line.model.model = model;
        this.app.root.addChild(line);
        this.walkthroughLine = line;
    }
}

// Singleton instance
window.PlayCanvasManager = new PlayCanvasManager('playcanvas-canvas');

// UI wiring
window.addEventListener('DOMContentLoaded', () => {
    const manager = window.PlayCanvasManager;
    const startBtn = document.getElementById('start-walkthrough');
    const finishBtn = document.getElementById('finish-walkthrough');
    const playBtn = document.getElementById('play-walkthrough');
    if (startBtn && finishBtn && playBtn) {
        startBtn.onclick = () => {
            manager.startWalkthrough();
            startBtn.style.display = 'none';
            finishBtn.style.display = '';
            playBtn.style.display = 'none';
        };
        finishBtn.onclick = () => {
            manager.finishWalkthrough();
            finishBtn.style.display = 'none';
            playBtn.style.display = '';
            startBtn.style.display = '';
        };
        playBtn.onclick = () => {
            manager.playWalkthrough();
        };
    }
}); 