// Brand Customization JavaScript

class BrandingManager {
    constructor() {
        this.brandData = {
            identity: {
                companyName: '',
                tagline: '',
                websiteUrl: '',
                phoneNumber: ''
            },
            logos: {
                primary: null,
                secondary: null,
                favicon: null
            },
            colors: {
                primary: '#6366f1',
                secondary: '#10b981',
                background: '#ffffff',
                text: '#1f2937'
            },
            typography: {
                primaryFont: 'Inter',
                headingFont: 'inherit'
            },
            domain: {
                subdomain: '',
                customDomain: ''
            },
            social: {
                facebook: '',
                instagram: '',
                twitter: '',
                linkedin: '',
                youtube: '',
                tiktok: ''
            },
            advanced: {
                hideStaticMotionBranding: false,
                customLoadingScreen: false,
                customQRDesign: false
            }
        };

        this.init();
    }

    init() {
        this.setupLogoUploads();
        this.setupColorPickers();
        this.setupColorPresets();
        this.setupFontPreviews();
        this.setupPreviewTabs();
        this.setupFormValidation();
        this.setupEventListeners();
        this.generateQRCode();
        this.loadExistingBrandData();
    }

    setupLogoUploads() {
        const logoTypes = ['primary', 'secondary', 'favicon'];
        
        logoTypes.forEach(type => {
            const uploadArea = document.getElementById(`${type}LogoUpload`);
            const fileInput = document.getElementById(`${type}Logo`);
            const preview = document.getElementById(`${type}LogoPreview`);

            if (uploadArea && fileInput) {
                uploadArea.addEventListener('click', () => fileInput.click());
                
                fileInput.addEventListener('change', (e) => {
                    this.handleLogoUpload(e, type, preview);
                });

                // Drag and drop functionality
                uploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadArea.classList.add('drag-over');
                });

                uploadArea.addEventListener('dragleave', () => {
                    uploadArea.classList.remove('drag-over');
                });

                uploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    uploadArea.classList.remove('drag-over');
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        this.handleLogoUpload({ target: { files } }, type, preview);
                    }
                });
            }
        });
    }

    handleLogoUpload(event, type, previewElement) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            this.showToast('Please upload a valid image file (PNG, JPG, SVG)', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('File size must be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.brandData.logos[type] = imageUrl;
            
            // Update preview
            if (previewElement) {
                previewElement.innerHTML = `<img src="${imageUrl}" alt="${type} logo">`;
            }
            
            this.updatePreviews();
            this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} logo uploaded successfully`, 'success');
        };
        
        reader.readAsDataURL(file);
    }

    setupColorPickers() {
        const colorTypes = ['primary', 'secondary', 'background', 'text'];
        
        colorTypes.forEach(type => {
            const colorPicker = document.getElementById(`${type}Color`);
            const hexInput = document.getElementById(`${type}ColorHex`);
            
            if (colorPicker && hexInput) {
                // Sync color picker with hex input
                colorPicker.addEventListener('input', (e) => {
                    const color = e.target.value;
                    hexInput.value = color;
                    this.brandData.colors[type] = color;
                    this.updatePreviews();
                });

                // Sync hex input with color picker
                hexInput.addEventListener('input', (e) => {
                    const color = e.target.value;
                    if (this.isValidHex(color)) {
                        colorPicker.value = color;
                        this.brandData.colors[type] = color;
                        this.updatePreviews();
                    }
                });

                // Validate hex input on blur
                hexInput.addEventListener('blur', (e) => {
                    const color = e.target.value;
                    if (!this.isValidHex(color)) {
                        e.target.value = this.brandData.colors[type];
                        this.showToast('Please enter a valid hex color code', 'warning');
                    }
                });
            }
        });
    }

    setupColorPresets() {
        const presets = {
            automotive: {
                primary: '#ef4444',
                secondary: '#dc2626',
                background: '#ffffff',
                text: '#1f2937'
            },
            realestate: {
                primary: '#10b981',
                secondary: '#059669',
                background: '#ffffff',
                text: '#1f2937'
            },
            professional: {
                primary: '#3b82f6',
                secondary: '#1d4ed8',
                background: '#ffffff',
                text: '#1f2937'
            },
            luxury: {
                primary: '#8b5cf6',
                secondary: '#7c3aed',
                background: '#000000',
                text: '#ffffff'
            }
        };

        document.querySelectorAll('.preset-item').forEach(item => {
            item.addEventListener('click', () => {
                const preset = item.dataset.preset;
                if (presets[preset]) {
                    this.applyColorPreset(presets[preset]);
                }
            });
        });
    }

    applyColorPreset(preset) {
        Object.keys(preset).forEach(colorType => {
            const color = preset[colorType];
            this.brandData.colors[colorType] = color;
            
            const colorPicker = document.getElementById(`${colorType}Color`);
            const hexInput = document.getElementById(`${colorType}ColorHex`);
            
            if (colorPicker) colorPicker.value = color;
            if (hexInput) hexInput.value = color;
        });
        
        this.updatePreviews();
        this.showToast('Color preset applied successfully', 'success');
    }

    setupFontPreviews() {
        const primaryFontSelect = document.getElementById('primaryFont');
        const headingFontSelect = document.getElementById('headingFont');
        
        if (primaryFontSelect) {
            primaryFontSelect.addEventListener('change', (e) => {
                this.brandData.typography.primaryFont = e.target.value;
                this.updateFontPreviews();
            });
        }
        
        if (headingFontSelect) {
            headingFontSelect.addEventListener('change', (e) => {
                this.brandData.typography.headingFont = e.target.value;
                this.updateFontPreviews();
            });
        }
    }

    updateFontPreviews() {
        const headingPreview = document.getElementById('headingPreview');
        const bodyPreview = document.getElementById('bodyPreview');
        
        if (headingPreview && bodyPreview) {
            const primaryFont = this.brandData.typography.primaryFont;
            const headingFont = this.brandData.typography.headingFont === 'inherit' 
                ? primaryFont 
                : this.brandData.typography.headingFont;
            
            headingPreview.style.fontFamily = `"${headingFont}", sans-serif`;
            bodyPreview.style.fontFamily = `"${primaryFont}", sans-serif`;
            
            // Load fonts dynamically
            this.loadGoogleFont(primaryFont);
            if (headingFont !== primaryFont) {
                this.loadGoogleFont(headingFont);
            }
        }
        
        this.updatePreviews();
    }

    loadGoogleFont(fontName) {
        if (fontName === 'Inter') return; // Already loaded
        
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
        link.rel = 'stylesheet';
        
        // Check if font is already loaded
        const existingLink = document.querySelector(`link[href*="${fontName.replace(' ', '+')}"]`);
        if (!existingLink) {
            document.head.appendChild(link);
        }
    }

    setupPreviewTabs() {
        const tabs = document.querySelectorAll('.preview-tab');
        const contents = document.querySelectorAll('.preview-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}Preview`) {
                        content.classList.add('active');
                    }
                });
                
                // Generate QR code when QR tab is selected
                if (targetTab === 'qr') {
                    this.generateQRCode();
                }
            });
        });
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.brand-input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const field = e.target.id;
                this.brandData.identity[field] = e.target.value;
                this.updatePreviews();
            });
        });

        // Subdomain validation
        const subdomainInput = document.getElementById('subdomain');
        if (subdomainInput) {
            subdomainInput.addEventListener('input', (e) => {
                let value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                e.target.value = value;
                this.brandData.domain.subdomain = value;
                this.updatePreviews();
            });
        }

        // Advanced options
        const advancedCheckboxes = ['hideStaticMotionBranding', 'customLoadingScreen', 'customQRDesign'];
        advancedCheckboxes.forEach(checkbox => {
            const element = document.getElementById(checkbox);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.brandData.advanced[checkbox] = e.target.checked;
                    this.updatePreviews();
                });
            }
        });
    }

    setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('saveBrandBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveBrandSettings());
        }

        // Preview button
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.openPreviewWindow());
        }
    }

    updatePreviews() {
        this.updateMobilePreview();
        this.updateDesktopPreview();
        this.updateQRPreview();
        this.applyCSSVariables();
    }

    updateMobilePreview() {
        const logo = document.getElementById('previewLogo');
        const companyName = document.getElementById('previewCompanyName');
        const tagline = document.getElementById('previewTagline');
        const phone = document.getElementById('previewPhone');
        const website = document.getElementById('previewWebsite');
        
        if (logo && this.brandData.logos.primary) {
            logo.src = this.brandData.logos.primary;
            logo.style.display = 'block';
        } else if (logo) {
            logo.style.display = 'none';
        }
        
        if (companyName) {
            companyName.textContent = this.brandData.identity.companyName || 'Your Company';
        }
        
        if (tagline) {
            tagline.textContent = this.brandData.identity.tagline || 'Your Tagline';
        }
        
        if (phone) {
            phone.textContent = this.brandData.identity.phoneNumber || '📞';
        }
        
        if (website) {
            website.textContent = this.brandData.identity.websiteUrl ? '🌐' : '🌐';
        }
    }

    updateDesktopPreview() {
        const logo = document.getElementById('desktopPreviewLogo');
        const company = document.getElementById('desktopPreviewCompany');
        
        if (logo && this.brandData.logos.primary) {
            logo.src = this.brandData.logos.primary;
            logo.style.display = 'block';
        } else if (logo) {
            logo.style.display = 'none';
        }
        
        if (company) {
            company.textContent = `${this.brandData.identity.companyName || 'Your Company'} Portal`;
        }
    }

    updateQRPreview() {
        const logo = document.getElementById('qrLogoPreview');
        const company = document.getElementById('qrCompanyName');
        const url = document.getElementById('qrUrl');
        
        if (logo && this.brandData.logos.primary) {
            logo.src = this.brandData.logos.primary;
            logo.style.display = 'block';
        } else if (logo) {
            logo.style.display = 'none';
        }
        
        if (company) {
            company.textContent = this.brandData.identity.companyName || 'Your Company';
        }
        
        if (url) {
            const subdomain = this.brandData.domain.subdomain || 'yourcompany';
            url.textContent = `${subdomain}.staticmotion.app`;
        }
    }

    applyCSSVariables() {
        const root = document.documentElement;
        root.style.setProperty('--brand-primary', this.brandData.colors.primary);
        root.style.setProperty('--brand-secondary', this.brandData.colors.secondary);
        
        // Update phone screen colors
        const phoneScreen = document.querySelector('.phone-screen');
        if (phoneScreen) {
            phoneScreen.style.background = this.brandData.colors.background;
        }
        
        const brandedHeader = document.querySelector('.branded-header');
        if (brandedHeader) {
            brandedHeader.style.background = this.brandData.colors.background;
            brandedHeader.style.color = this.brandData.colors.text;
        }
    }

    generateQRCode() {
        const canvas = document.getElementById('qrCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const size = 200;
        
        // Simple QR code placeholder (in production, use a QR library like qrcode.js)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size, size);
        
        // Create a pattern that looks like a QR code
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                if (Math.random() > 0.5) {
                    ctx.fillRect(i * 10, j * 10, 10, 10);
                }
            }
        }
        
        // Add positioning squares
        this.drawQRCorner(ctx, 0, 0);
        this.drawQRCorner(ctx, 140, 0);
        this.drawQRCorner(ctx, 0, 140);
    }

    drawQRCorner(ctx, x, y) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, 60, 60);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 10, y + 10, 40, 40);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 20, y + 20, 20, 20);
    }

    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    async saveBrandSettings() {
        try {
            const saveBtn = document.getElementById('saveBrandBtn');
            if (saveBtn) {
                saveBtn.textContent = 'Saving...';
                saveBtn.disabled = true;
            }

            // Validate required fields
            if (!this.brandData.identity.companyName) {
                this.showToast('Company name is required', 'error');
                return;
            }

            const response = await fetch('/api/brand-settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.brandData)
            });

            if (response.ok) {
                this.showToast('Brand settings saved successfully!', 'success');
                // Store in localStorage as backup
                localStorage.setItem('brandSettings', JSON.stringify(this.brandData));
            } else {
                throw new Error('Failed to save brand settings');
            }
        } catch (error) {
            console.error('Error saving brand settings:', error);
            this.showToast('Failed to save brand settings. Please try again.', 'error');
        } finally {
            const saveBtn = document.getElementById('saveBrandBtn');
            if (saveBtn) {
                saveBtn.textContent = 'Save Brand Settings';
                saveBtn.disabled = false;
            }
        }
    }

    async loadExistingBrandData() {
        try {
            // Try to load from server first
            const response = await fetch('/api/brand-settings');
            if (response.ok) {
                const data = await response.json();
                this.brandData = { ...this.brandData, ...data };
            } else {
                // Fallback to localStorage
                const stored = localStorage.getItem('brandSettings');
                if (stored) {
                    this.brandData = { ...this.brandData, ...JSON.parse(stored) };
                }
            }
            
            this.populateForm();
            this.updatePreviews();
        } catch (error) {
            console.error('Error loading brand data:', error);
            // Try localStorage fallback
            const stored = localStorage.getItem('brandSettings');
            if (stored) {
                this.brandData = { ...this.brandData, ...JSON.parse(stored) };
                this.populateForm();
                this.updatePreviews();
            }
        }
    }

    populateForm() {
        // Populate identity fields
        Object.keys(this.brandData.identity).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = this.brandData.identity[key];
            }
        });

        // Populate color fields
        Object.keys(this.brandData.colors).forEach(key => {
            const colorPicker = document.getElementById(`${key}Color`);
            const hexInput = document.getElementById(`${key}ColorHex`);
            
            if (colorPicker) colorPicker.value = this.brandData.colors[key];
            if (hexInput) hexInput.value = this.brandData.colors[key];
        });

        // Populate typography
        const primaryFont = document.getElementById('primaryFont');
        const headingFont = document.getElementById('headingFont');
        
        if (primaryFont) primaryFont.value = this.brandData.typography.primaryFont;
        if (headingFont) headingFont.value = this.brandData.typography.headingFont;

        // Populate domain
        const subdomain = document.getElementById('subdomain');
        if (subdomain) subdomain.value = this.brandData.domain.subdomain;

        // Populate advanced options
        Object.keys(this.brandData.advanced).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.checked = this.brandData.advanced[key];
            }
        });
    }

    openPreviewWindow() {
        const previewUrl = `/preview?brand=${encodeURIComponent(JSON.stringify(this.brandData))}`;
        window.open(previewUrl, 'brandPreview', 'width=400,height=800');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }
}

// Utility functions for brand management
const BrandUtils = {
    generateSubdomain(companyName) {
        return companyName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20);
    },

    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    generateCSS(brandData) {
        return `
            :root {
                --brand-primary: ${brandData.colors.primary};
                --brand-secondary: ${brandData.colors.secondary};
                --brand-background: ${brandData.colors.background};
                --brand-text: ${brandData.colors.text};
                --brand-font-primary: "${brandData.typography.primaryFont}", sans-serif;
                --brand-font-heading: "${brandData.typography.headingFont === 'inherit' ? brandData.typography.primaryFont : brandData.typography.headingFont}", sans-serif;
            }
            
            body {
                font-family: var(--brand-font-primary);
                background-color: var(--brand-background);
                color: var(--brand-text);
            }
            
            h1, h2, h3, h4, h5, h6 {
                font-family: var(--brand-font-heading);
            }
            
            .btn-primary {
                background-color: var(--brand-primary);
                border-color: var(--brand-primary);
            }
            
            .btn-secondary {
                color: var(--brand-primary);
                border-color: var(--brand-primary);
            }
        `;
    },

    exportBrandKit(brandData) {
        const kit = {
            css: this.generateCSS(brandData),
            colors: brandData.colors,
            fonts: brandData.typography,
            logos: brandData.logos,
            identity: brandData.identity
        };
        
        const blob = new Blob([JSON.stringify(kit, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brandData.identity.companyName || 'brand'}-kit.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
};

// Initialize branding manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.brandingManager = new BrandingManager();
    
    // Add CSS for drag and drop states
    const style = document.createElement('style');
    style.textContent = `
        .logo-upload-area.drag-over {
            border-color: var(--brand-primary);
            background-color: rgba(99, 102, 241, 0.05);
        }
    `;
    document.head.appendChild(style);
});

// Export for global access
window.BrandingManager = BrandingManager;
window.BrandUtils = BrandUtils;