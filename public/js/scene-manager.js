// Scene Manager for Static Motion
// Handles scene creation, saving, loading, and management with Supabase integration

class SceneManager {
    constructor() {
        this.currentScene = null;
        this.sceneId = null;
        this.isDirty = false;
        this.autoSaveInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSceneFromURL();
        this.startAutoSave();
    }

    setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('save-scene');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveScene());
        }

        // Auto-save toggle
        const autoSaveToggle = document.getElementById('auto-save-toggle');
        if (autoSaveToggle) {
            autoSaveToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startAutoSave();
                } else {
                    this.stopAutoSave();
                }
            });
        }

        // Scene title input
        const sceneTitle = document.getElementById('scene-title');
        if (sceneTitle) {
            sceneTitle.addEventListener('input', () => {
                this.markDirty();
            });
        }

        // Scene description input
        const sceneDescription = document.getElementById('scene-description');
        if (sceneDescription) {
            sceneDescription.addEventListener('input', () => {
                this.markDirty();
            });
        }

        // Publish button
        const publishBtn = document.getElementById('publish-scene');
        if (publishBtn) {
            publishBtn.addEventListener('click', () => this.publishScene());
        }

        // Before unload warning
        window.addEventListener('beforeunload', (e) => {
            if (this.isDirty) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        });
    }

    loadSceneFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const sceneId = urlParams.get('scene');
        
        if (sceneId) {
            this.loadScene(sceneId);
        } else {
            this.createNewScene();
        }
    }

    async createNewScene() {
        if (!window.authManager || !window.authManager.isAuthenticated) {
            this.showError('Please sign in to create scenes');
            return;
        }

        this.currentScene = {
            title: 'Untitled Scene',
            description: '',
            industry_type: 'general',
            template_type: 'grid-3x3',
            world_type: 'flat',
            physics_mode: 'floating',
            containers: {},
            brand_settings: {
                primaryColor: '#007bff',
                companyName: '',
                logo: null
            },
            published: false
        };

        this.sceneId = null;
        this.isDirty = true;
        this.updateSceneUI();
        this.showSuccess('New scene created');
    }

    async loadScene(sceneId) {
        if (!window.supabaseClient) {
            this.showError('Database connection not available');
            return;
        }

        try {
            this.showLoading(true);
            const result = await window.supabaseClient.getScene(sceneId);
            
            if (result.success) {
                this.currentScene = result.data;
                this.sceneId = sceneId;
                this.isDirty = false;
                this.updateSceneUI();
                this.showSuccess('Scene loaded successfully');
            } else {
                this.showError('Failed to load scene: ' + result.error);
                this.createNewScene();
            }
        } catch (error) {
            this.showError('Error loading scene: ' + error.message);
            this.createNewScene();
        } finally {
            this.showLoading(false);
        }
    }

    async saveScene() {
        if (!window.authManager || !window.authManager.isAuthenticated) {
            this.showError('Please sign in to save scenes');
            return;
        }

        if (!window.supabaseClient) {
            this.showError('Database connection not available');
            return;
        }

        try {
            this.showLoading(true);
            
            // Get current scene data from editor
            const sceneData = this.getCurrentSceneData();
            
            let result;
            if (this.sceneId) {
                // Update existing scene
                result = await window.supabaseClient.updateScene(this.sceneId, sceneData);
            } else {
                // Create new scene
                result = await window.supabaseClient.createScene(sceneData);
                if (result.success) {
                    this.sceneId = result.data.id;
                    // Update URL without reload
                    const url = new URL(window.location);
                    url.searchParams.set('scene', this.sceneId);
                    window.history.pushState({}, '', url);
                }
            }

            if (result.success) {
                this.isDirty = false;
                this.showSuccess('Scene saved successfully');
                this.updateSceneUI();
            } else {
                this.showError('Failed to save scene: ' + result.error);
            }
        } catch (error) {
            this.showError('Error saving scene: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async publishScene() {
        if (!this.sceneId) {
            await this.saveScene();
        }

        if (!this.sceneId) {
            this.showError('Please save the scene before publishing');
            return;
        }

        try {
            this.showLoading(true);
            const result = await window.supabaseClient.publishScene(this.sceneId);
            
            if (result.success) {
                this.currentScene.published = true;
                this.currentScene.published_at = result.data.published_at;
                this.updateSceneUI();
                this.showSuccess('Scene published successfully!');
                this.showPublishModal();
            } else {
                this.showError('Failed to publish scene: ' + result.error);
            }
        } catch (error) {
            this.showError('Error publishing scene: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    getCurrentSceneData() {
        // Get data from the editor UI
        const title = document.getElementById('scene-title')?.value || 'Untitled Scene';
        const description = document.getElementById('scene-description')?.value || '';
        const industryType = document.querySelector('.mode-btn.active')?.dataset.industry || 'general';
        const templateType = document.querySelector('.template-item.active')?.dataset.template || 'grid-3x3';
        const worldType = document.querySelector('.world-btn.active')?.id.replace('-world', '') || 'flat';
        const physicsMode = document.getElementById('physics-mode')?.value || 'floating';

        // Get containers data from editor
        const containers = {};
        const containerElements = document.querySelectorAll('.container-slot');
        containerElements.forEach((container, index) => {
            const content = container.querySelector('.container-content');
            if (content) {
                containers[index] = {
                    type: content.dataset.type,
                    data: JSON.parse(content.dataset.content || '{}')
                };
            }
        });

        // Get brand settings
        const brandSettings = {
            primaryColor: document.getElementById('primary-color')?.value || '#007bff',
            companyName: document.getElementById('company-name')?.value || '',
            logo: this.currentScene?.brand_settings?.logo || null
        };

        return {
            title,
            description,
            industry_type: industryType,
            template_type: templateType,
            world_type: worldType,
            physics_mode: physicsMode,
            containers,
            brand_settings: brandSettings
        };
    }

    updateSceneUI() {
        if (!this.currentScene) return;

        // Update title and description
        const titleInput = document.getElementById('scene-title');
        const descriptionInput = document.getElementById('scene-description');
        
        if (titleInput) titleInput.value = this.currentScene.title;
        if (descriptionInput) descriptionInput.value = this.currentScene.description;

        // Update industry mode
        const industryMode = this.currentScene.industry_type;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeModeBtn = document.querySelector(`[data-industry="${industryMode}"]`);
        if (activeModeBtn) activeModeBtn.classList.add('active');

        // Update template
        const templateType = this.currentScene.template_type;
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeTemplate = document.querySelector(`[data-template="${templateType}"]`);
        if (activeTemplate) activeTemplate.classList.add('active');

        // Update world type
        const worldType = this.currentScene.world_type;
        document.querySelectorAll('.world-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeWorldBtn = document.getElementById(`${worldType}-world`);
        if (activeWorldBtn) activeWorldBtn.classList.add('active');

        // Update physics mode
        const physicsMode = document.getElementById('physics-mode');
        if (physicsMode) physicsMode.value = this.currentScene.physics_mode;

        // Update brand settings
        const primaryColor = document.getElementById('primary-color');
        const companyName = document.getElementById('company-name');
        
        if (primaryColor) primaryColor.value = this.currentScene.brand_settings?.primaryColor || '#007bff';
        if (companyName) companyName.value = this.currentScene.brand_settings?.companyName || '';

        // Update containers if they exist
        if (this.currentScene.containers) {
            this.loadContainers();
        }

        // Update publish status
        this.updatePublishStatus();
    }

    loadContainers() {
        const containers = this.currentScene.containers;
        if (!containers) return;

        Object.keys(containers).forEach(index => {
            const containerData = containers[index];
            const containerElement = document.querySelector(`[data-index="${index}"]`);
            
            if (containerElement && containerData) {
                this.loadContainerContent(containerElement, containerData);
            }
        });
    }

    loadContainerContent(containerElement, containerData) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'container-content';
        contentDiv.dataset.type = containerData.type;
        contentDiv.dataset.content = JSON.stringify(containerData.data);

        // Create content based on type
        switch (containerData.type) {
            case 'image':
                contentDiv.innerHTML = `<img src="${containerData.data.url}" alt="${containerData.data.alt || ''}">`;
                break;
            case 'text':
                contentDiv.innerHTML = `<div class="text-content">${containerData.data.text}</div>`;
                break;
            case 'video':
                contentDiv.innerHTML = `<video src="${containerData.data.url}" controls></video>`;
                break;
            case 'contact':
                contentDiv.innerHTML = `
                    <div class="contact-info">
                        <h4>${containerData.data.name}</h4>
                        <p>${containerData.data.email}</p>
                        <p>${containerData.data.phone}</p>
                    </div>
                `;
                break;
            default:
                contentDiv.innerHTML = `<div class="content-placeholder">${containerData.type}</div>`;
        }

        containerElement.appendChild(contentDiv);
    }

    updatePublishStatus() {
        const publishBtn = document.getElementById('publish-scene');
        const publishStatus = document.getElementById('publish-status');
        
        if (this.currentScene?.published) {
            if (publishBtn) publishBtn.textContent = 'Update Published Scene';
            if (publishStatus) {
                publishStatus.innerHTML = `
                    <span class="status-badge published">Published</span>
                    <span class="publish-date">${this.formatDate(this.currentScene.published_at)}</span>
                `;
            }
        } else {
            if (publishBtn) publishBtn.textContent = 'Publish Scene';
            if (publishStatus) {
                publishStatus.innerHTML = '<span class="status-badge draft">Draft</span>';
            }
        }
    }

    showPublishModal() {
        const modal = document.getElementById('publish-modal');
        if (modal) {
            modal.style.display = 'block';
            
            // Generate QR code and share link
            const shareUrl = `${window.location.origin}/viewer/${this.sceneId}`;
            const qrCodeElement = document.getElementById('publish-qr-code');
            const shareLinkElement = document.getElementById('publish-share-link');
            
            if (qrCodeElement) {
                // Generate QR code (you'll need a QR code library)
                qrCodeElement.innerHTML = `<div class="qr-placeholder">QR Code for: ${shareUrl}</div>`;
            }
            
            if (shareLinkElement) {
                shareLinkElement.value = shareUrl;
            }
        }
    }

    startAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            if (this.isDirty && this.currentScene) {
                this.saveScene();
            }
        }, 30000); // Auto-save every 30 seconds
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    markDirty() {
        this.isDirty = true;
        const saveBtn = document.getElementById('save-scene');
        if (saveBtn) {
            saveBtn.classList.add('dirty');
        }
    }

    showLoading(show) {
        const loadingElements = document.querySelectorAll('.loading-spinner');
        loadingElements.forEach(el => {
            el.style.display = show ? 'block' : 'none';
        });
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize Scene Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sceneManager = new SceneManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SceneManager;
} 