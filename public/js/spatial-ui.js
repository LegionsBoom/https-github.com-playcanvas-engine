// Spatial UI Components for SMeditor
// Gaming-grade UI with holographic panels, 3D buttons, and interactive elements

class SpatialUI {
    constructor() {
        this.components = new Map();
        this.activeComponents = new Set();
        this.uiLayer = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.createUILayer();
        this.setupEventListeners();
        this.isInitialized = true;
    }
    
    createUILayer() {
        // Create UI layer for 3D components
        this.uiLayer = document.createElement('div');
        this.uiLayer.className = 'spatial-ui-layer';
        this.uiLayer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(this.uiLayer);
    }
    
    setupEventListeners() {
        // Global UI events
        document.addEventListener('spatial-ui:create', (e) => {
            this.createComponent(e.detail.type, e.detail.config);
        });
        
        document.addEventListener('spatial-ui:destroy', (e) => {
            this.destroyComponent(e.detail.id);
        });
        
        // Keyboard shortcuts for UI
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                this.toggleHolographicMode();
            }
        });
    }
    
    // Holographic Panel Component
    createHolographicPanel(config = {}) {
        const panelId = this.generateComponentId('holographic-panel');
        
        const panel = document.createElement('div');
        panel.className = 'spatial-holographic-panel';
        panel.id = panelId;
        
        // Apply configuration
        const defaultConfig = {
            title: 'Holographic Panel',
            content: '',
            position: { x: 50, y: 50 },
            size: { width: 300, height: 200 },
            theme: 'cyber',
            glowColor: '#00ffe7',
            scanlines: true,
            glitch: false
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        panel.innerHTML = `
            <div class="holographic-header">
                <div class="holographic-title">${finalConfig.title}</div>
                <div class="holographic-controls">
                    <button class="holographic-btn minimize" title="Minimize">−</button>
                    <button class="holographic-btn close" title="Close">×</button>
                </div>
            </div>
            <div class="holographic-content">
                ${finalConfig.content}
            </div>
            ${finalConfig.scanlines ? '<div class="holographic-scanlines"></div>' : ''}
            ${finalConfig.glitch ? '<div class="holographic-glitch"></div>' : ''}
        `;
        
        // Apply positioning and sizing
        panel.style.left = `${finalConfig.position.x}px`;
        panel.style.top = `${finalConfig.position.y}px`;
        panel.style.width = `${finalConfig.size.width}px`;
        panel.style.height = `${finalConfig.size.height}px`;
        panel.style.setProperty('--glow-color', finalConfig.glowColor);
        
        // Add to UI layer
        this.uiLayer.appendChild(panel);
        
        // Store component
        this.components.set(panelId, {
            type: 'holographic-panel',
            element: panel,
            config: finalConfig
        });
        
        // Setup interactions
        this.setupPanelInteractions(panel, panelId);
        
        return panelId;
    }
    
    // 3D Button Component
    create3DButton(config = {}) {
        const buttonId = this.generateComponentId('3d-button');
        
        const button = document.createElement('button');
        button.className = 'spatial-3d-button';
        button.id = buttonId;
        
        const defaultConfig = {
            text: '3D Button',
            icon: '',
            size: 'medium',
            theme: 'cyber',
            glowColor: '#00ffe7',
            onClick: null,
            position: { x: 50, y: 50 }
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        button.innerHTML = `
            <div class="button-3d-content">
                ${finalConfig.icon ? `<div class="button-icon">${finalConfig.icon}</div>` : ''}
                <span class="button-text">${finalConfig.text}</span>
            </div>
            <div class="button-3d-glow"></div>
        `;
        
        // Apply styling
        button.classList.add(`size-${finalConfig.size}`, `theme-${finalConfig.theme}`);
        button.style.left = `${finalConfig.position.x}px`;
        button.style.top = `${finalConfig.position.y}px`;
        button.style.setProperty('--glow-color', finalConfig.glowColor);
        
        // Add to UI layer
        this.uiLayer.appendChild(button);
        
        // Store component
        this.components.set(buttonId, {
            type: '3d-button',
            element: button,
            config: finalConfig
        });
        
        // Setup interactions
        this.setupButtonInteractions(button, buttonId, finalConfig.onClick);
        
        return buttonId;
    }
    
    // Floating Tooltip Component
    createFloatingTooltip(config = {}) {
        const tooltipId = this.generateComponentId('floating-tooltip');
        
        const tooltip = document.createElement('div');
        tooltip.className = 'spatial-floating-tooltip';
        tooltip.id = tooltipId;
        
        const defaultConfig = {
            text: 'Tooltip',
            position: { x: 50, y: 50 },
            theme: 'cyber',
            glowColor: '#00ffe7',
            autoHide: true,
            hideDelay: 3000
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-text">${finalConfig.text}</div>
                <div class="tooltip-arrow"></div>
            </div>
        `;
        
        // Apply positioning and styling
        tooltip.style.left = `${finalConfig.position.x}px`;
        tooltip.style.top = `${finalConfig.position.y}px`;
        tooltip.style.setProperty('--glow-color', finalConfig.glowColor);
        
        // Add to UI layer
        this.uiLayer.appendChild(tooltip);
        
        // Store component
        this.components.set(tooltipId, {
            type: 'floating-tooltip',
            element: tooltip,
            config: finalConfig
        });
        
        // Auto-hide if configured
        if (finalConfig.autoHide) {
            setTimeout(() => {
                this.destroyComponent(tooltipId);
            }, finalConfig.hideDelay);
        }
        
        return tooltipId;
    }
    
    // Progress Indicator Component
    createProgressIndicator(config = {}) {
        const progressId = this.generateComponentId('progress-indicator');
        
        const progress = document.createElement('div');
        progress.className = 'spatial-progress-indicator';
        progress.id = progressId;
        
        const defaultConfig = {
            value: 0,
            max: 100,
            text: 'Progress',
            theme: 'cyber',
            glowColor: '#00ffe7',
            position: { x: 50, y: 50 },
            size: { width: 200, height: 20 }
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        progress.innerHTML = `
            <div class="progress-header">
                <span class="progress-text">${finalConfig.text}</span>
                <span class="progress-value">${finalConfig.value}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(finalConfig.value / finalConfig.max) * 100}%"></div>
            </div>
        `;
        
        // Apply positioning and sizing
        progress.style.left = `${finalConfig.position.x}px`;
        progress.style.top = `${finalConfig.position.y}px`;
        progress.style.width = `${finalConfig.size.width}px`;
        progress.style.height = `${finalConfig.size.height}px`;
        progress.style.setProperty('--glow-color', finalConfig.glowColor);
        
        // Add to UI layer
        this.uiLayer.appendChild(progress);
        
        // Store component
        this.components.set(progressId, {
            type: 'progress-indicator',
            element: progress,
            config: finalConfig
        });
        
        return progressId;
    }
    
    // Mini-map Component
    createMiniMap(config = {}) {
        const minimapId = this.generateComponentId('mini-map');
        
        const minimap = document.createElement('div');
        minimap.className = 'spatial-mini-map';
        minimap.id = minimapId;
        
        const defaultConfig = {
            size: 150,
            position: { x: 20, y: 20 },
            theme: 'cyber',
            glowColor: '#00ffe7',
            showPlayer: true,
            showWaypoints: true
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        minimap.innerHTML = `
            <div class="minimap-header">
                <span class="minimap-title">Navigation</span>
            </div>
            <div class="minimap-content">
                <canvas class="minimap-canvas" width="${finalConfig.size}" height="${finalConfig.size}"></canvas>
                ${finalConfig.showPlayer ? '<div class="minimap-player"></div>' : ''}
                ${finalConfig.showWaypoints ? '<div class="minimap-waypoints"></div>' : ''}
            </div>
        `;
        
        // Apply positioning and sizing
        minimap.style.left = `${finalConfig.position.x}px`;
        minimap.style.top = `${finalConfig.position.y}px`;
        minimap.style.width = `${finalConfig.size}px`;
        minimap.style.height = `${finalConfig.size}px`;
        minimap.style.setProperty('--glow-color', finalConfig.glowColor);
        
        // Add to UI layer
        this.uiLayer.appendChild(minimap);
        
        // Store component
        this.components.set(minimapId, {
            type: 'mini-map',
            element: minimap,
            config: finalConfig
        });
        
        // Setup minimap functionality
        this.setupMiniMapInteractions(minimap, minimapId);
        
        return minimapId;
    }
    
    // Interactive Menu Component
    createInteractiveMenu(config = {}) {
        const menuId = this.generateComponentId('interactive-menu');
        
        const menu = document.createElement('div');
        menu.className = 'spatial-interactive-menu';
        menu.id = menuId;
        
        const defaultConfig = {
            items: [],
            position: { x: 50, y: 50 },
            theme: 'cyber',
            glowColor: '#00ffe7',
            orientation: 'vertical'
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        const menuItems = finalConfig.items.map(item => `
            <div class="menu-item" data-action="${item.action}">
                <div class="menu-item-icon">${item.icon}</div>
                <div class="menu-item-text">${item.text}</div>
            </div>
        `).join('');
        
        menu.innerHTML = `
            <div class="menu-content">
                ${menuItems}
            </div>
        `;
        
        // Apply positioning and styling
        menu.style.left = `${finalConfig.position.x}px`;
        menu.style.top = `${finalConfig.position.y}px`;
        menu.style.setProperty('--glow-color', finalConfig.glowColor);
        menu.classList.add(`orientation-${finalConfig.orientation}`);
        
        // Add to UI layer
        this.uiLayer.appendChild(menu);
        
        // Store component
        this.components.set(menuId, {
            type: 'interactive-menu',
            element: menu,
            config: finalConfig
        });
        
        // Setup menu interactions
        this.setupMenuInteractions(menu, menuId);
        
        return menuId;
    }
    
    // Setup Interactions
    setupPanelInteractions(panel, panelId) {
        const header = panel.querySelector('.holographic-header');
        const minimizeBtn = panel.querySelector('.minimize');
        const closeBtn = panel.querySelector('.close');
        
        // Draggable functionality
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            header.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - dragOffset.x;
                const y = e.clientY - dragOffset.y;
                panel.style.left = `${x}px`;
                panel.style.top = `${y}px`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });
        
        // Minimize functionality
        minimizeBtn?.addEventListener('click', () => {
            panel.classList.toggle('minimized');
        });
        
        // Close functionality
        closeBtn?.addEventListener('click', () => {
            this.destroyComponent(panelId);
        });
    }
    
    setupButtonInteractions(button, buttonId, onClick) {
        // 3D button effects
        button.addEventListener('mouseenter', () => {
            button.classList.add('hover');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('hover');
        });
        
        button.addEventListener('mousedown', () => {
            button.classList.add('pressed');
        });
        
        button.addEventListener('mouseup', () => {
            button.classList.remove('pressed');
        });
        
        // Click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (onClick) {
                onClick(buttonId, button);
            }
            
            // Add click effect
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
        });
    }
    
    setupMiniMapInteractions(minimap, minimapId) {
        const canvas = minimap.querySelector('.minimap-canvas');
        const ctx = canvas.getContext('2d');
        
        // Draw minimap
        this.drawMiniMap(ctx, canvas.width, canvas.height);
        
        // Click to navigate
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Convert to world coordinates and navigate
            this.navigateToPosition(x, y);
        });
    }
    
    setupMenuInteractions(menu, menuId) {
        const menuItems = menu.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleMenuAction(action, menuId);
            });
            
            item.addEventListener('mouseenter', () => {
                item.classList.add('hover');
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('hover');
            });
        });
    }
    
    // Utility Methods
    generateComponentId(type) {
        return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    destroyComponent(componentId) {
        const component = this.components.get(componentId);
        if (component) {
            if (component.element.parentNode) {
                component.element.parentNode.removeChild(component.element);
            }
            this.components.delete(componentId);
            this.activeComponents.delete(componentId);
        }
    }
    
    updateComponent(componentId, updates) {
        const component = this.components.get(componentId);
        if (component) {
            Object.assign(component.config, updates);
            this.applyComponentUpdates(component, updates);
        }
    }
    
    applyComponentUpdates(component, updates) {
        const element = component.element;
        
        if (updates.position) {
            element.style.left = `${updates.position.x}px`;
            element.style.top = `${updates.position.y}px`;
        }
        
        if (updates.size) {
            element.style.width = `${updates.size.width}px`;
            element.style.height = `${updates.size.height}px`;
        }
        
        if (updates.glowColor) {
            element.style.setProperty('--glow-color', updates.glowColor);
        }
    }
    
    // Mini-map functionality
    drawMiniMap(ctx, width, height) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 231, 0.3)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        
        for (let i = 0; i < height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        
        // Draw player position (center)
        ctx.fillStyle = '#00ffe7';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    navigateToPosition(x, y) {
        // Convert minimap coordinates to world coordinates
        const worldX = (x - 75) * 0.1; // Scale factor
        const worldZ = (y - 75) * 0.1;
        
        // Navigate camera to position
        if (window.PlayCanvasManager && window.PlayCanvasManager.camera) {
            const camera = window.PlayCanvasManager.camera;
            const currentPos = camera.getPosition();
            camera.setPosition(currentPos.x + worldX, currentPos.y, currentPos.z + worldZ);
        }
    }
    
    handleMenuAction(action, menuId) {
        // Handle different menu actions
        switch (action) {
            case 'save':
                if (window.sceneGraph) {
                    window.sceneGraph.saveScene(window.sceneGraph.getActiveScene()?.id);
                }
                break;
            case 'load':
                // Trigger scene load dialog
                document.dispatchEvent(new CustomEvent('scene:load-dialog'));
                break;
            case 'settings':
                // Open settings panel
                this.createHolographicPanel({
                    title: 'Settings',
                    content: '<div>Settings content here</div>',
                    position: { x: 100, y: 100 }
                });
                break;
            case 'help':
                // Show help tooltip
                this.createFloatingTooltip({
                    text: 'Help information here',
                    position: { x: 200, y: 200 }
                });
                break;
        }
    }
    
    // Holographic mode toggle
    toggleHolographicMode() {
        document.body.classList.toggle('holographic-mode');
        
        if (document.body.classList.contains('holographic-mode')) {
            this.showFeedback('Holographic mode enabled');
        } else {
            this.showFeedback('Holographic mode disabled');
        }
    }
    
    // Public API
    getComponent(componentId) {
        return this.components.get(componentId);
    }
    
    getAllComponents() {
        return Array.from(this.components.values());
    }
    
    clearAll() {
        this.components.forEach((component, id) => {
            this.destroyComponent(id);
        });
    }
    
    showFeedback(message, type = 'success') {
        if (window.smeditor) {
            window.smeditor.showFeedback(message);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    destroy() {
        this.clearAll();
        if (this.uiLayer && this.uiLayer.parentNode) {
            this.uiLayer.parentNode.removeChild(this.uiLayer);
        }
    }
}

// Global spatial UI instance
window.SpatialUI = new SpatialUI(); 