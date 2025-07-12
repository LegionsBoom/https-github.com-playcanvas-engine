// Tooltip Manager for Static Motion Cockpit
// Provides accessible tooltips with cockpit theme styling

class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.currentTarget = null;
        this.showTimeout = null;
        this.hideTimeout = null;
        this.init();
    }
    
    init() {
        this.createTooltip();
        this.setupGlobalListeners();
    }
    
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'cockpit-tooltip';
        this.tooltip.setAttribute('role', 'tooltip');
        this.tooltip.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.tooltip);
    }
    
    setupGlobalListeners() {
        // Mouse events
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('mouseout', this.handleMouseOut.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Keyboard events for accessibility
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        document.addEventListener('focusout', this.handleFocusOut.bind(this));
        
        // Touch events for mobile
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    handleMouseOver(e) {
        const target = e.target.closest('[data-tooltip]');
        if (target && target !== this.currentTarget) {
            this.showTooltip(target, e);
        }
    }
    
    handleMouseOut(e) {
        const target = e.target.closest('[data-tooltip]');
        if (target === this.currentTarget) {
            this.hideTooltip();
        }
    }
    
    handleMouseMove(e) {
        if (this.tooltip && this.tooltip.style.display === 'block') {
            this.positionTooltip(e.clientX, e.clientY);
        }
    }
    
    handleFocusIn(e) {
        const target = e.target.closest('[data-tooltip]');
        if (target && target !== this.currentTarget) {
            this.showTooltip(target, e, true);
        }
    }
    
    handleFocusOut(e) {
        const target = e.target.closest('[data-tooltip]');
        if (target === this.currentTarget) {
            this.hideTooltip();
        }
    }
    
    handleTouchStart(e) {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            this.showTooltip(target, e, false, true);
        }
    }
    
    handleTouchEnd(e) {
        this.hideTooltip();
    }
    
    showTooltip(target, event, isKeyboard = false, isTouch = false) {
        clearTimeout(this.hideTimeout);
        
        const tooltipText = target.getAttribute('data-tooltip');
        const tooltipPosition = target.getAttribute('data-tooltip-position') || 'top';
        const tooltipDelay = parseInt(target.getAttribute('data-tooltip-delay')) || 500;
        
        if (!tooltipText) return;
        
        this.currentTarget = target;
        this.tooltip.textContent = tooltipText;
        this.tooltip.setAttribute('aria-hidden', 'false');
        
        // Position tooltip
        if (isKeyboard || isTouch) {
            const rect = target.getBoundingClientRect();
            this.positionTooltip(rect.left + rect.width / 2, rect.top, tooltipPosition);
        } else {
            this.positionTooltip(event.clientX, event.clientY, tooltipPosition);
        }
        
        // Show with delay (except for keyboard/touch)
        if (isKeyboard || isTouch) {
            this.tooltip.style.display = 'block';
            this.tooltip.classList.add('visible');
        } else {
            this.showTimeout = setTimeout(() => {
                this.tooltip.style.display = 'block';
                this.tooltip.classList.add('visible');
            }, tooltipDelay);
        }
    }
    
    hideTooltip() {
        clearTimeout(this.showTimeout);
        
        this.hideTimeout = setTimeout(() => {
            if (this.tooltip) {
                this.tooltip.classList.remove('visible');
                this.tooltip.style.display = 'none';
                this.tooltip.setAttribute('aria-hidden', 'true');
            }
            this.currentTarget = null;
        }, 100);
    }
    
    positionTooltip(x, y, position = 'top') {
        if (!this.tooltip) return;
        
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const offset = 8;
        
        let left, top;
        
        switch (position) {
            case 'top':
                left = x - tooltipRect.width / 2;
                top = y - tooltipRect.height - offset;
                break;
            case 'bottom':
                left = x - tooltipRect.width / 2;
                top = y + offset;
                break;
            case 'left':
                left = x - tooltipRect.width - offset;
                top = y - tooltipRect.height / 2;
                break;
            case 'right':
                left = x + offset;
                top = y - tooltipRect.height / 2;
                break;
            default:
                left = x - tooltipRect.width / 2;
                top = y - tooltipRect.height - offset;
        }
        
        // Keep tooltip within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (left < 0) left = 0;
        if (left + tooltipRect.width > viewportWidth) {
            left = viewportWidth - tooltipRect.width;
        }
        if (top < 0) top = 0;
        if (top + tooltipRect.height > viewportHeight) {
            top = viewportHeight - tooltipRect.height;
        }
        
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }
    
    // Public method to add tooltip to an element
    addTooltip(element, text, position = 'top', delay = 500) {
        element.setAttribute('data-tooltip', text);
        element.setAttribute('data-tooltip-position', position);
        element.setAttribute('data-tooltip-delay', delay);
        element.setAttribute('tabindex', '0'); // Make focusable for keyboard navigation
    }
    
    // Public method to remove tooltip from an element
    removeTooltip(element) {
        element.removeAttribute('data-tooltip');
        element.removeAttribute('data-tooltip-position');
        element.removeAttribute('data-tooltip-delay');
        element.removeAttribute('tabindex');
    }
    
    // Public method to show tooltip programmatically
    showTooltipFor(element, text, position = 'top') {
        this.tooltip.textContent = text;
        this.tooltip.setAttribute('aria-hidden', 'false');
        
        const rect = element.getBoundingClientRect();
        this.positionTooltip(rect.left + rect.width / 2, rect.top, position);
        
        this.tooltip.style.display = 'block';
        this.tooltip.classList.add('visible');
    }
    
    // Public method to hide tooltip programmatically
    hideTooltipFor() {
        this.hideTooltip();
    }
}

// Global tooltip manager instance
window.TooltipManager = new TooltipManager(); 