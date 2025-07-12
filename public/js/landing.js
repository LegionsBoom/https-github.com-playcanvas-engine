// Static Motion Landing Page JavaScript

class LandingPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupNavbarEffects();
        this.setupAnimations();
        this.setupPlanTracking();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            });

            // Close mobile menu when clicking a link
            const navLinksItems = navLinks.querySelectorAll('a');
            navLinksItems.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                });
            });
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupNavbarEffects() {
        const navbar = document.querySelector('.nav');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-item, .step, .pricing-card, .industry-card');
        animatedElements.forEach(el => observer.observe(el));

        // Add CSS for animations
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .feature-item, .step, .pricing-card, .industry-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .feature-item.animate-in, .step.animate-in, .pricing-card.animate-in, .industry-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .nav.scrolled {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
            
            .nav {
                transition: all 0.3s ease;
            }
            
            @media (max-width: 768px) {
                .nav-links {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .nav-links.active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav-links a {
                    margin-bottom: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupPlanTracking() {
        // Track pricing plan selections
        const planButtons = document.querySelectorAll('.plan-cta');
        
        planButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const plan = button.closest('.pricing-card').querySelector('h3').textContent;
                this.trackEvent('plan_selected', { plan });
            });
        });

        // Track industry card clicks
        const industryCards = document.querySelectorAll('.industry-card');
        
        industryCards.forEach(card => {
            card.addEventListener('click', () => {
                const industry = card.querySelector('h3').textContent;
                this.trackEvent('industry_selected', { industry });
            });
        });
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking (integrate with your preferred analytics service)
        console.log('Event tracked:', eventName, data);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Example: Mixpanel
        if (typeof mixpanel !== 'undefined') {
            mixpanel.track(eventName, data);
        }
    }
}

// Industry-specific page functionality
class IndustryPage {
    constructor(industry) {
        this.industry = industry;
        this.init();
    }

    init() {
        this.setupSignupTracking();
        this.setupDemoRequests();
        this.customizeForIndustry();
    }

    setupSignupTracking() {
        const signupButtons = document.querySelectorAll('[href*="/signup"]');
        
        signupButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('signup_initiated', { 
                    industry: this.industry,
                    source: 'landing_page'
                });
            });
        });
    }

    setupDemoRequests() {
        const demoButtons = document.querySelectorAll('[href*="/demo"]');
        
        demoButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('demo_requested', { 
                    industry: this.industry 
                });
            });
        });
    }

    customizeForIndustry() {
        // Dynamic content customization based on industry
        const industryColors = {
            automotive: '#ef4444',
            realestate: '#10b981',
            enterprise: '#8b5cf6'
        };

        if (industryColors[this.industry]) {
            document.documentElement.style.setProperty('--primary-color', industryColors[this.industry]);
        }
    }

    trackEvent(eventName, data = {}) {
        console.log('Industry Event tracked:', eventName, data);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
    }
}

// Utility functions
const utils = {
    // Get URL parameters
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main landing page functionality
    new LandingPage();

    // Check if we're on an industry-specific page
    const path = window.location.pathname;
    if (path.includes('/automotive')) {
        new IndustryPage('automotive');
    } else if (path.includes('/realestate')) {
        new IndustryPage('realestate');
    } else if (path.includes('/enterprise')) {
        new IndustryPage('enterprise');
    }

    // Handle plan parameter from URL
    const planParam = utils.getUrlParameter('plan');
    if (planParam) {
        const planCard = document.querySelector(`.${planParam}-plan`);
        if (planCard) {
            planCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            planCard.style.border = '2px solid #6366f1';
            planCard.style.transform = 'scale(1.02)';
        }
    }
});

// Export for use in other scripts
window.StaticMotion = {
    LandingPage,
    IndustryPage,
    utils
};