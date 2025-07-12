// Color Picker Module for Static Motion Cockpit
// Provides modern, accessible color selection for automotive features

class ColorPicker {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            initialColor: '#00ffe7',
            onChange: null,
            onClose: null,
            theme: 'cockpit', // cockpit, automotive, branding
            ...options
        };
        
        this.isOpen = false;
        this.currentColor = this.options.initialColor;
        this.pickerElement = null;
        
        this.init();
    }
    
    init() {
        this.createPicker();
        this.setupEventListeners();
        this.applyTheme();
    }
    
    createPicker() {
        this.pickerElement = document.createElement('div');
        this.pickerElement.className = 'color-picker cockpit-theme';
        this.pickerElement.innerHTML = `
            <div class="color-picker-header">
                <span class="color-picker-title">Color Selection</span>
                <button class="color-picker-close" aria-label="Close color picker">×</button>
            </div>
            <div class="color-picker-content">
                <div class="color-preview">
                    <div class="color-swatch" style="background-color: ${this.currentColor}"></div>
                    <input type="text" class="color-hex" value="${this.currentColor}" placeholder="#000000">
                </div>
                <div class="color-controls">
                    <div class="hue-slider">
                        <label for="hue">Hue</label>
                        <input type="range" id="hue" min="0" max="360" value="180">
                    </div>
                    <div class="saturation-slider">
                        <label for="saturation">Saturation</label>
                        <input type="range" id="saturation" min="0" max="100" value="100">
                    </div>
                    <div class="lightness-slider">
                        <label for="lightness">Lightness</label>
                        <input type="range" id="lightness" min="0" max="100" value="50">
                    </div>
                </div>
                <div class="color-presets">
                    <div class="preset-grid">
                        <button class="preset-color" data-color="#00ffe7" style="background-color: #00ffe7"></button>
                        <button class="preset-color" data-color="#ff0066" style="background-color: #ff0066"></button>
                        <button class="preset-color" data-color="#00ff88" style="background-color: #00ff88"></button>
                        <button class="preset-color" data-color="#ffaa00" style="background-color: #ffaa00"></button>
                        <button class="preset-color" data-color="#0088ff" style="background-color: #0088ff"></button>
                        <button class="preset-color" data-color="#ff0088" style="background-color: #ff0088"></button>
                        <button class="preset-color" data-color="#8800ff" style="background-color: #8800ff"></button>
                        <button class="preset-color" data-color="#00ffaa" style="background-color: #00ffaa"></button>
                    </div>
                </div>
                <div class="color-actions">
                    <button class="apply-color cockpit-btn">Apply</button>
                    <button class="cancel-color cockpit-btn">Cancel</button>
                </div>
            </div>
        `;
        
        this.container.appendChild(this.pickerElement);
    }
    
    setupEventListeners() {
        const closeBtn = this.pickerElement.querySelector('.color-picker-close');
        const hexInput = this.pickerElement.querySelector('.color-hex');
        const hueSlider = this.pickerElement.querySelector('#hue');
        const saturationSlider = this.pickerElement.querySelector('#saturation');
        const lightnessSlider = this.pickerElement.querySelector('#lightness');
        const presetColors = this.pickerElement.querySelectorAll('.preset-color');
        const applyBtn = this.pickerElement.querySelector('.apply-color');
        const cancelBtn = this.pickerElement.querySelector('.cancel-color');
        
        // Close button
        closeBtn.addEventListener('click', () => this.close());
        
        // Hex input
        hexInput.addEventListener('input', (e) => {
            const color = e.target.value;
            if (this.isValidHex(color)) {
                this.updateColor(color);
            }
        });
        
        // HSL sliders
        hueSlider.addEventListener('input', (e) => {
            this.updateFromHSL();
        });
        
        saturationSlider.addEventListener('input', (e) => {
            this.updateFromHSL();
        });
        
        lightnessSlider.addEventListener('input', (e) => {
            this.updateFromHSL();
        });
        
        // Preset colors
        presetColors.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.updateColor(color);
            });
        });
        
        // Action buttons
        applyBtn.addEventListener('click', () => {
            if (this.options.onChange) {
                this.options.onChange(this.currentColor);
            }
            this.close();
        });
        
        cancelBtn.addEventListener('click', () => {
            this.close();
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.pickerElement.contains(e.target) && this.isOpen) {
                this.close();
            }
        });
    }
    
    updateColor(color) {
        this.currentColor = color;
        const swatch = this.pickerElement.querySelector('.color-swatch');
        const hexInput = this.pickerElement.querySelector('.color-hex');
        
        swatch.style.backgroundColor = color;
        hexInput.value = color;
        
        // Update HSL sliders
        const hsl = this.hexToHSL(color);
        this.pickerElement.querySelector('#hue').value = hsl.h;
        this.pickerElement.querySelector('#saturation').value = hsl.s;
        this.pickerElement.querySelector('#lightness').value = hsl.l;
    }
    
    updateFromHSL() {
        const h = parseInt(this.pickerElement.querySelector('#hue').value);
        const s = parseInt(this.pickerElement.querySelector('#saturation').value);
        const l = parseInt(this.pickerElement.querySelector('#lightness').value);
        
        const color = this.hslToHex(h, s, l);
        this.updateColor(color);
    }
    
    hexToHSL(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        
        return `#${rHex}${gHex}${bHex}`;
    }
    
    isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }
    
    applyTheme() {
        const themes = {
            cockpit: {
                primary: '#00ffe7',
                secondary: '#181f2a',
                accent: '#ff0066'
            },
            automotive: {
                primary: '#ffaa00',
                secondary: '#1a1a1a',
                accent: '#00ff88'
            },
            branding: {
                primary: '#8800ff',
                secondary: '#2a1a3a',
                accent: '#ff0088'
            }
        };
        
        const theme = themes[this.options.theme] || themes.cockpit;
        this.pickerElement.style.setProperty('--primary-color', theme.primary);
        this.pickerElement.style.setProperty('--secondary-color', theme.secondary);
        this.pickerElement.style.setProperty('--accent-color', theme.accent);
    }
    
    open() {
        this.pickerElement.style.display = 'block';
        this.isOpen = true;
        this.pickerElement.focus();
    }
    
    close() {
        this.pickerElement.style.display = 'none';
        this.isOpen = false;
        if (this.options.onClose) {
            this.options.onClose();
        }
    }
    
    getColor() {
        return this.currentColor;
    }
    
    setColor(color) {
        this.updateColor(color);
    }
}

// Global color picker instance
window.ColorPicker = ColorPicker; 