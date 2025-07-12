/**
 * Live Commerce Templates & Showcases
 * Specialized commerce templates for each industry
 */

class LiveCommerceTemplates {
    constructor() {
        this.templates = new Map();
        this.currentShowcase = null;
        this.liveStreamManager = null;
        
        this.init();
    }

    init() {
        this.loadCommerceTemplates();
        this.setupLiveStreamManager();
    }

    loadCommerceTemplates() {
        // Automotive Live Commerce Templates
        this.templates.set('automotive', {
            name: 'Automotive Live Commerce',
            templates: {
                'car-showroom': {
                    name: 'Live Car Showroom',
                    layout: 'showroom-3d',
                    features: ['360-view', 'test-drive-sim', 'financing-calc', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-exterior', label: 'Exterior View' },
                        { position: [0, 0, 0], action: 'show-interior', label: 'Interior View' },
                        { position: [0, 0, 0], action: 'show-engine', label: 'Engine Bay' },
                        { position: [0, 0, 0], action: 'show-specs', label: 'Specifications' }
                    ],
                    widgets: [
                        { type: 'financing-calculator', position: 'bottom-right' },
                        { type: 'test-drive-scheduler', position: 'bottom-left' },
                        { type: 'live-chat', position: 'right-sidebar' },
                        { type: 'viewer-count', position: 'top-right' }
                    ]
                },
                'dealership-tour': {
                    name: 'Live Dealership Tour',
                    layout: 'virtual-tour',
                    features: ['walkthrough', 'inventory-browse', 'sales-team', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-new-cars', label: 'New Vehicles' },
                        { position: [0, 0, 0], action: 'show-used-cars', label: 'Used Vehicles' },
                        { position: [0, 0, 0], action: 'show-service', label: 'Service Center' },
                        { position: [0, 0, 0], action: 'show-finance', label: 'Finance Office' }
                    ]
                },
                'test-drive-live': {
                    name: 'Live Test Drive',
                    layout: 'simulation',
                    features: ['driving-sim', 'route-selection', 'performance-metrics', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'start-test-drive', label: 'Start Test Drive' },
                        { position: [0, 0, 0], action: 'change-route', label: 'Change Route' },
                        { position: [0, 0, 0], action: 'show-metrics', label: 'Performance Data' }
                    ]
                }
            }
        });

        // Real Estate Live Commerce Templates
        this.templates.set('realestate', {
            name: 'Real Estate Live Commerce',
            templates: {
                'property-showcase': {
                    name: 'Live Property Showcase',
                    layout: 'virtual-tour',
                    features: ['walkthrough', 'room-highlights', 'neighborhood-info', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-living-room', label: 'Living Room' },
                        { position: [0, 0, 0], action: 'show-kitchen', label: 'Kitchen' },
                        { position: [0, 0, 0], action: 'show-bedrooms', label: 'Bedrooms' },
                        { position: [0, 0, 0], action: 'show-bathrooms', label: 'Bathrooms' },
                        { position: [0, 0, 0], action: 'show-backyard', label: 'Backyard' }
                    ],
                    widgets: [
                        { type: 'mortgage-calculator', position: 'bottom-right' },
                        { type: 'property-details', position: 'left-sidebar' },
                        { type: 'live-chat', position: 'right-sidebar' },
                        { type: 'viewer-count', position: 'top-right' }
                    ]
                },
                'neighborhood-tour': {
                    name: 'Live Neighborhood Tour',
                    layout: 'map-view',
                    features: ['area-exploration', 'amenities-highlight', 'school-info', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-schools', label: 'Schools' },
                        { position: [0, 0, 0], action: 'show-parks', label: 'Parks' },
                        { position: [0, 0, 0], action: 'show-shopping', label: 'Shopping' },
                        { position: [0, 0, 0], action: 'show-transport', label: 'Transportation' }
                    ]
                },
                'open-house-live': {
                    name: 'Live Open House',
                    layout: 'multi-room',
                    features: ['agent-guided', 'q-and-a', 'instant-offers', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'ask-question', label: 'Ask Question' },
                        { position: [0, 0, 0], action: 'make-offer', label: 'Make Offer' },
                        { position: [0, 0, 0], action: 'schedule-viewing', label: 'Schedule Viewing' }
                    ]
                }
            }
        });

        // Fashion Live Commerce Templates
        this.templates.set('fashion', {
            name: 'Fashion Live Commerce',
            templates: {
                'runway-show': {
                    name: 'Live Fashion Show',
                    layout: 'runway-3d',
                    features: ['model-walkthrough', 'outfit-details', 'instant-purchase', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-outfit-details', label: 'Outfit Details' },
                        { position: [0, 0, 0], action: 'virtual-try-on', label: 'Virtual Try-On' },
                        { position: [0, 0, 0], action: 'add-to-cart', label: 'Add to Cart' },
                        { position: [0, 0, 0], action: 'buy-now', label: 'Buy Now' }
                    ],
                    widgets: [
                        { type: 'shopping-cart', position: 'bottom-right' },
                        { type: 'size-guide', position: 'left-sidebar' },
                        { type: 'live-chat', position: 'right-sidebar' },
                        { type: 'viewer-count', position: 'top-right' }
                    ]
                },
                'boutique-tour': {
                    name: 'Live Boutique Tour',
                    layout: 'store-layout',
                    features: ['section-browsing', 'styling-tips', 'size-recommendations', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-dresses', label: 'Dresses' },
                        { position: [0, 0, 0], action: 'show-tops', label: 'Tops' },
                        { position: [0, 0, 0], action: 'show-bottoms', label: 'Bottoms' },
                        { position: [0, 0, 0], action: 'show-accessories', label: 'Accessories' }
                    ]
                },
                'styling-session': {
                    name: 'Live Styling Session',
                    layout: 'styling-studio',
                    features: ['personal-styling', 'outfit-creation', 'size-matching', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'create-outfit', label: 'Create Outfit' },
                        { position: [0, 0, 0], action: 'get-styling-tips', label: 'Styling Tips' },
                        { position: [0, 0, 0], action: 'find-size', label: 'Find My Size' }
                    ]
                }
            }
        });

        // Makeup & Beauty Live Commerce Templates
        this.templates.set('makeup', {
            name: 'Beauty Live Commerce',
            templates: {
                'beauty-showcase': {
                    name: 'Live Beauty Showcase',
                    layout: 'beauty-studio',
                    features: ['virtual-makeup', 'product-demo', 'skin-tone-matching', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'try-foundation', label: 'Try Foundation' },
                        { position: [0, 0, 0], action: 'try-lipstick', label: 'Try Lipstick' },
                        { position: [0, 0, 0], action: 'try-eyeshadow', label: 'Try Eyeshadow' },
                        { position: [0, 0, 0], action: 'try-blush', label: 'Try Blush' }
                    ],
                    widgets: [
                        { type: 'beauty-cart', position: 'bottom-right' },
                        { type: 'skin-tone-matcher', position: 'left-sidebar' },
                        { type: 'live-chat', position: 'right-sidebar' },
                        { type: 'viewer-count', position: 'top-right' }
                    ]
                },
                'tutorial-live': {
                    name: 'Live Tutorial Session',
                    layout: 'tutorial-studio',
                    features: ['step-by-step', 'product-highlight', 'instant-purchase', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-step-1', label: 'Step 1' },
                        { position: [0, 0, 0], action: 'show-step-2', label: 'Step 2' },
                        { position: [0, 0, 0], action: 'show-step-3', label: 'Step 3' },
                        { position: [0, 0, 0], action: 'buy-products', label: 'Buy Products' }
                    ]
                },
                'consultation-live': {
                    name: 'Live Beauty Consultation',
                    layout: 'consultation-room',
                    features: ['personal-consultation', 'product-recommendations', 'skin-analysis', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'skin-analysis', label: 'Skin Analysis' },
                        { position: [0, 0, 0], action: 'get-recommendations', label: 'Get Recommendations' },
                        { position: [0, 0, 0], action: 'book-consultation', label: 'Book Consultation' }
                    ]
                }
            }
        });

        // Education Live Commerce Templates
        this.templates.set('education', {
            name: 'Education Live Commerce',
            templates: {
                'course-showcase': {
                    name: 'Live Course Showcase',
                    layout: 'classroom-3d',
                    features: ['lesson-preview', 'interactive-demo', 'enrollment-process', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'preview-lesson', label: 'Preview Lesson' },
                        { position: [0, 0, 0], action: 'show-curriculum', label: 'Curriculum' },
                        { position: [0, 0, 0], action: 'meet-instructor', label: 'Meet Instructor' },
                        { position: [0, 0, 0], action: 'enroll-now', label: 'Enroll Now' }
                    ],
                    widgets: [
                        { type: 'course-cart', position: 'bottom-right' },
                        { type: 'course-details', position: 'left-sidebar' },
                        { type: 'live-chat', position: 'right-sidebar' },
                        { type: 'viewer-count', position: 'top-right' }
                    ]
                },
                'virtual-campus': {
                    name: 'Live Virtual Campus',
                    layout: 'campus-tour',
                    features: ['facility-tour', 'program-highlights', 'student-life', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-libraries', label: 'Libraries' },
                        { position: [0, 0, 0], action: 'show-labs', label: 'Labs' },
                        { position: [0, 0, 0], action: 'show-dorms', label: 'Dormitories' },
                        { position: [0, 0, 0], action: 'show-dining', label: 'Dining Halls' }
                    ]
                },
                'live-lecture': {
                    name: 'Live Lecture Session',
                    layout: 'lecture-hall',
                    features: ['live-teaching', 'interactive-qa', 'material-download', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'ask-question', label: 'Ask Question' },
                        { position: [0, 0, 0], action: 'download-materials', label: 'Download Materials' },
                        { position: [0, 0, 0], action: 'join-discussion', label: 'Join Discussion' }
                    ]
                }
            }
        });

        // General Live Commerce Templates
        this.templates.set('general', {
            name: 'General Live Commerce',
            templates: {
                'product-showcase': {
                    name: 'Live Product Showcase',
                    layout: 'showcase-3d',
                    features: ['product-demo', 'feature-highlight', 'instant-purchase', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-features', label: 'Features' },
                        { position: [0, 0, 0], action: 'show-specs', label: 'Specifications' },
                        { position: [0, 0, 0], action: 'show-reviews', label: 'Reviews' },
                        { position: [0, 0, 0], action: 'buy-now', label: 'Buy Now' }
                    ],
                    widgets: [
                        { type: 'shopping-cart', position: 'bottom-right' },
                        { type: 'product-details', position: 'left-sidebar' },
                        { type: 'live-chat', position: 'right-sidebar' },
                        { type: 'viewer-count', position: 'top-right' }
                    ]
                },
                'brand-story': {
                    name: 'Live Brand Story',
                    layout: 'story-experience',
                    features: ['brand-narrative', 'behind-scenes', 'community-engagement', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'show-story', label: 'Our Story' },
                        { position: [0, 0, 0], action: 'show-process', label: 'Our Process' },
                        { position: [0, 0, 0], action: 'show-team', label: 'Our Team' },
                        { position: [0, 0, 0], action: 'join-community', label: 'Join Community' }
                    ]
                },
                'interactive-event': {
                    name: 'Live Interactive Event',
                    layout: 'event-space',
                    features: ['audience-participation', 'real-time-polling', 'exclusive-offers', 'live-chat'],
                    hotspots: [
                        { position: [0, 0, 0], action: 'vote-poll', label: 'Vote in Poll' },
                        { position: [0, 0, 0], action: 'claim-offer', label: 'Claim Offer' },
                        { position: [0, 0, 0], action: 'ask-question', label: 'Ask Question' }
                    ]
                }
            }
        });
    }

    setupLiveStreamManager() {
        this.liveStreamManager = {
            currentStream: null,
            viewers: 0,
            engagement: 0,
            sales: 0,
            
            startStream(template, industry) {
                this.currentStream = {
                    template: template,
                    industry: industry,
                    startTime: new Date(),
                    viewers: 0,
                    engagement: 0,
                    sales: 0,
                    products: [],
                    chat: []
                };
                
                this.initializeStreamUI(template, industry);
                this.startViewerTracking();
                this.showFeedback(`🎥 Live stream started for ${industry} ${template.name}`);
            },

            initializeStreamUI(template, industry) {
                const streamContainer = document.createElement('div');
                streamContainer.className = 'live-stream-container';
                streamContainer.innerHTML = this.createStreamUI(template, industry);
                
                document.body.appendChild(streamContainer);
                this.setupStreamControls(template);
            },

            createStreamUI(template, industry) {
                return `
                    <div class="stream-overlay">
                        <div class="stream-header">
                            <div class="stream-info">
                                <h3>${template.name}</h3>
                                <span class="stream-status">🔴 LIVE</span>
                            </div>
                            <div class="stream-stats">
                                <span class="viewer-count">👥 <span id="viewer-count">0</span></span>
                                <span class="engagement-count">❤️ <span id="engagement-count">0</span></span>
                                <span class="sales-count">💰 <span id="sales-count">0</span></span>
                            </div>
                        </div>
                        
                        <div class="stream-content">
                            <div class="main-viewport">
                                <canvas id="stream-canvas" class="stream-canvas"></canvas>
                                <div class="hotspot-overlay" id="hotspot-overlay"></div>
                            </div>
                            
                            <div class="stream-sidebar">
                                <div class="chat-container">
                                    <div class="chat-messages" id="chat-messages"></div>
                                    <div class="chat-input">
                                        <input type="text" id="chat-input" placeholder="Type a message...">
                                        <button id="send-chat">Send</button>
                                    </div>
                                </div>
                                
                                <div class="widgets-container">
                                    ${this.createWidgetsHTML(template.widgets)}
                                </div>
                            </div>
                        </div>
                        
                        <div class="stream-controls">
                            <button id="pause-stream" class="stream-btn">⏸️ Pause</button>
                            <button id="end-stream" class="stream-btn">⏹️ End Stream</button>
                            <button id="share-stream" class="stream-btn">📤 Share</button>
                        </div>
                    </div>
                `;
            },

            createWidgetsHTML(widgets) {
                return widgets.map(widget => `
                    <div class="stream-widget ${widget.type}" data-position="${widget.position}">
                        <div class="widget-header">
                            <h4>${this.getWidgetTitle(widget.type)}</h4>
                        </div>
                        <div class="widget-content" id="${widget.type}-widget">
                            ${this.getWidgetContent(widget.type)}
                        </div>
                    </div>
                `).join('');
            },

            getWidgetTitle(type) {
                const titles = {
                    'financing-calculator': 'Financing Calculator',
                    'test-drive-scheduler': 'Test Drive Scheduler',
                    'live-chat': 'Live Chat',
                    'viewer-count': 'Viewers',
                    'mortgage-calculator': 'Mortgage Calculator',
                    'property-details': 'Property Details',
                    'shopping-cart': 'Shopping Cart',
                    'size-guide': 'Size Guide',
                    'beauty-cart': 'Beauty Cart',
                    'skin-tone-matcher': 'Skin Tone Matcher',
                    'course-cart': 'Course Cart',
                    'course-details': 'Course Details',
                    'product-details': 'Product Details'
                };
                return titles[type] || type;
            },

            getWidgetContent(type) {
                switch (type) {
                    case 'financing-calculator':
                        return this.createFinancingCalculator();
                    case 'mortgage-calculator':
                        return this.createMortgageCalculator();
                    case 'shopping-cart':
                        return this.createShoppingCart();
                    case 'skin-tone-matcher':
                        return this.createSkinToneMatcher();
                    case 'live-chat':
                        return this.createLiveChat();
                    default:
                        return '<div class="widget-placeholder">Widget content</div>';
                }
            },

            createFinancingCalculator() {
                return `
                    <div class="calculator-widget">
                        <div class="input-group">
                            <label>Vehicle Price</label>
                            <input type="number" id="vehicle-price" placeholder="$30,000">
                        </div>
                        <div class="input-group">
                            <label>Down Payment</label>
                            <input type="number" id="down-payment" placeholder="$5,000">
                        </div>
                        <div class="input-group">
                            <label>Interest Rate (%)</label>
                            <input type="number" id="interest-rate" placeholder="3.5">
                        </div>
                        <div class="input-group">
                            <label>Term (months)</label>
                            <input type="number" id="loan-term" placeholder="60">
                        </div>
                        <button id="calculate-payment" class="calc-btn">Calculate Payment</button>
                        <div class="result" id="payment-result"></div>
                    </div>
                `;
            },

            createMortgageCalculator() {
                return `
                    <div class="calculator-widget">
                        <div class="input-group">
                            <label>Home Price</label>
                            <input type="number" id="home-price" placeholder="$500,000">
                        </div>
                        <div class="input-group">
                            <label>Down Payment</label>
                            <input type="number" id="mortgage-down" placeholder="$100,000">
                        </div>
                        <div class="input-group">
                            <label>Interest Rate (%)</label>
                            <input type="number" id="mortgage-rate" placeholder="4.0">
                        </div>
                        <div class="input-group">
                            <label>Term (years)</label>
                            <input type="number" id="mortgage-term" placeholder="30">
                        </div>
                        <button id="calculate-mortgage" class="calc-btn">Calculate Payment</button>
                        <div class="result" id="mortgage-result"></div>
                    </div>
                `;
            },

            createShoppingCart() {
                return `
                    <div class="cart-widget">
                        <div class="cart-items" id="cart-items">
                            <div class="empty-cart">Your cart is empty</div>
                        </div>
                        <div class="cart-total">
                            <span>Total: $<span id="cart-total">0.00</span></span>
                        </div>
                        <button id="checkout-btn" class="checkout-btn">Checkout</button>
                    </div>
                `;
            },

            createSkinToneMatcher() {
                return `
                    <div class="matcher-widget">
                        <div class="skin-tones">
                            <div class="tone-option" data-tone="fair">Fair</div>
                            <div class="tone-option" data-tone="light">Light</div>
                            <div class="tone-option" data-tone="medium">Medium</div>
                            <div class="tone-option" data-tone="olive">Olive</div>
                            <div class="tone-option" data-tone="dark">Dark</div>
                            <div class="tone-option" data-tone="deep">Deep</div>
                        </div>
                        <div class="matched-products" id="matched-products">
                            <h5>Recommended Products</h5>
                            <div class="product-list"></div>
                        </div>
                    </div>
                `;
            },

            createLiveChat() {
                return `
                    <div class="chat-widget">
                        <div class="chat-messages" id="widget-chat-messages"></div>
                        <div class="chat-input">
                            <input type="text" id="widget-chat-input" placeholder="Type a message...">
                            <button id="widget-send-chat">Send</button>
                        </div>
                    </div>
                `;
            },

            setupStreamControls(template) {
                // Setup hotspot interactions
                this.setupHotspots(template.hotspots);
                
                // Setup widget interactions
                this.setupWidgetInteractions(template.widgets);
                
                // Setup chat functionality
                this.setupChatFunctionality();
                
                // Setup stream controls
                this.setupStreamControlButtons();
            },

            setupHotspots(hotspots) {
                const overlay = document.getElementById('hotspot-overlay');
                if (!overlay) return;

                hotspots.forEach((hotspot, index) => {
                    const hotspotElement = document.createElement('div');
                    hotspotElement.className = 'hotspot';
                    hotspotElement.style.left = `${50 + Math.random() * 20}%`;
                    hotspotElement.style.top = `${30 + Math.random() * 40}%`;
                    hotspotElement.innerHTML = `
                        <div class="hotspot-icon">📍</div>
                        <div class="hotspot-label">${hotspot.label}</div>
                    `;
                    
                    hotspotElement.addEventListener('click', () => {
                        this.handleHotspotAction(hotspot.action);
                    });
                    
                    overlay.appendChild(hotspotElement);
                });
            },

            handleHotspotAction(action) {
                switch (action) {
                    case 'show-exterior':
                        this.showProductView('exterior');
                        break;
                    case 'show-interior':
                        this.showProductView('interior');
                        break;
                    case 'virtual-try-on':
                        this.startVirtualTryOn();
                        break;
                    case 'add-to-cart':
                        this.addToCart();
                        break;
                    case 'buy-now':
                        this.buyNow();
                        break;
                    default:
                        console.log(`Hotspot action: ${action}`);
                }
            },

            setupWidgetInteractions(widgets) {
                // Setup calculator interactions
                const calcBtn = document.getElementById('calculate-payment');
                if (calcBtn) {
                    calcBtn.addEventListener('click', () => this.calculatePayment());
                }

                const mortgageBtn = document.getElementById('calculate-mortgage');
                if (mortgageBtn) {
                    mortgageBtn.addEventListener('click', () => this.calculateMortgage());
                }

                // Setup skin tone matcher
                document.querySelectorAll('.tone-option').forEach(option => {
                    option.addEventListener('click', (e) => {
                        this.matchSkinTone(e.target.dataset.tone);
                    });
                });
            },

            setupChatFunctionality() {
                const chatInput = document.getElementById('chat-input');
                const sendBtn = document.getElementById('send-chat');
                
                if (chatInput && sendBtn) {
                    sendBtn.addEventListener('click', () => {
                        this.sendChatMessage();
                    });
                    
                    chatInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.sendChatMessage();
                        }
                    });
                }
            },

            setupStreamControlButtons() {
                const pauseBtn = document.getElementById('pause-stream');
                const endBtn = document.getElementById('end-stream');
                const shareBtn = document.getElementById('share-stream');
                
                if (pauseBtn) {
                    pauseBtn.addEventListener('click', () => this.pauseStream());
                }
                
                if (endBtn) {
                    endBtn.addEventListener('click', () => this.endStream());
                }
                
                if (shareBtn) {
                    shareBtn.addEventListener('click', () => this.shareStream());
                }
            },

            startViewerTracking() {
                // Simulate viewer tracking
                setInterval(() => {
                    this.currentStream.viewers += Math.floor(Math.random() * 3);
                    this.updateViewerCount();
                }, 5000);
            },

            updateViewerCount() {
                const viewerElement = document.getElementById('viewer-count');
                if (viewerElement && this.currentStream) {
                    viewerElement.textContent = this.currentStream.viewers;
                }
            },

            sendChatMessage() {
                const input = document.getElementById('chat-input');
                const message = input.value.trim();
                
                if (message) {
                    this.addChatMessage('Viewer', message);
                    input.value = '';
                    
                    // Simulate engagement
                    this.currentStream.engagement++;
                    this.updateEngagementCount();
                }
            },

            addChatMessage(user, message) {
                const chatContainer = document.getElementById('chat-messages');
                if (chatContainer) {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'chat-message';
                    messageElement.innerHTML = `
                        <span class="message-user">${user}:</span>
                        <span class="message-text">${message}</span>
                        <span class="message-time">${new Date().toLocaleTimeString()}</span>
                    `;
                    chatContainer.appendChild(messageElement);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            },

            updateEngagementCount() {
                const engagementElement = document.getElementById('engagement-count');
                if (engagementElement && this.currentStream) {
                    engagementElement.textContent = this.currentStream.engagement;
                }
            },

            calculatePayment() {
                const price = parseFloat(document.getElementById('vehicle-price').value) || 0;
                const down = parseFloat(document.getElementById('down-payment').value) || 0;
                const rate = parseFloat(document.getElementById('interest-rate').value) || 0;
                const term = parseFloat(document.getElementById('loan-term').value) || 0;

                if (price && rate && term) {
                    const principal = price - down;
                    const monthlyRate = rate / 100 / 12;
                    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
                    
                    const resultElement = document.getElementById('payment-result');
                    if (resultElement) {
                        resultElement.innerHTML = `
                            <div class="payment-breakdown">
                                <div>Monthly Payment: $${payment.toFixed(2)}</div>
                                <div>Total Interest: $${(payment * term - principal).toFixed(2)}</div>
                                <div>Total Cost: $${(payment * term).toFixed(2)}</div>
                            </div>
                        `;
                    }
                }
            },

            calculateMortgage() {
                const price = parseFloat(document.getElementById('home-price').value) || 0;
                const down = parseFloat(document.getElementById('mortgage-down').value) || 0;
                const rate = parseFloat(document.getElementById('mortgage-rate').value) || 0;
                const term = parseFloat(document.getElementById('mortgage-term').value) || 0;

                if (price && rate && term) {
                    const principal = price - down;
                    const monthlyRate = rate / 100 / 12;
                    const months = term * 12;
                    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
                    
                    const resultElement = document.getElementById('mortgage-result');
                    if (resultElement) {
                        resultElement.innerHTML = `
                            <div class="payment-breakdown">
                                <div>Monthly Payment: $${payment.toFixed(2)}</div>
                                <div>Total Interest: $${(payment * months - principal).toFixed(2)}</div>
                                <div>Total Cost: $${(payment * months).toFixed(2)}</div>
                            </div>
                        `;
                    }
                }
            },

            matchSkinTone(tone) {
                const products = this.getProductsForSkinTone(tone);
                const productList = document.querySelector('.product-list');
                if (productList) {
                    productList.innerHTML = products.map(product => `
                        <div class="product-item">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">$${product.price}</div>
                            <button class="add-to-cart-btn" data-product="${product.id}">Add to Cart</button>
                        </div>
                    `).join('');
                }
            },

            getProductsForSkinTone(tone) {
                const products = {
                    fair: [
                        { id: 1, name: 'Fair Foundation', price: 29.99 },
                        { id: 2, name: 'Light Concealer', price: 19.99 }
                    ],
                    light: [
                        { id: 3, name: 'Light Foundation', price: 29.99 },
                        { id: 4, name: 'Medium Concealer', price: 19.99 }
                    ],
                    medium: [
                        { id: 5, name: 'Medium Foundation', price: 29.99 },
                        { id: 6, name: 'Dark Concealer', price: 19.99 }
                    ],
                    olive: [
                        { id: 7, name: 'Olive Foundation', price: 29.99 },
                        { id: 8, name: 'Olive Concealer', price: 19.99 }
                    ],
                    dark: [
                        { id: 9, name: 'Dark Foundation', price: 29.99 },
                        { id: 10, name: 'Deep Concealer', price: 19.99 }
                    ],
                    deep: [
                        { id: 11, name: 'Deep Foundation', price: 29.99 },
                        { id: 12, name: 'Rich Concealer', price: 19.99 }
                    ]
                };
                return products[tone] || [];
            },

            pauseStream() {
                this.showFeedback('⏸️ Stream paused');
            },

            endStream() {
                this.showFeedback('⏹️ Stream ended');
                this.saveStreamAnalytics();
                this.cleanupStream();
            },

            shareStream() {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                    this.showFeedback('📤 Stream link copied to clipboard!');
                });
            },

            saveStreamAnalytics() {
                if (this.currentStream) {
                    const analytics = {
                        duration: new Date() - this.currentStream.startTime,
                        viewers: this.currentStream.viewers,
                        engagement: this.currentStream.engagement,
                        sales: this.currentStream.sales,
                        industry: this.currentStream.industry,
                        template: this.currentStream.template.name
                    };
                    
                    console.log('Stream Analytics:', analytics);
                    // Save to database
                    this.saveToDatabase(analytics);
                }
            },

            saveToDatabase(analytics) {
                // Save to Supabase or local storage
                if (window.SupabaseManager) {
                    window.SupabaseManager.saveStreamAnalytics(analytics);
                } else {
                    localStorage.setItem('streamAnalytics', JSON.stringify(analytics));
                }
            },

            cleanupStream() {
                const streamContainer = document.querySelector('.live-stream-container');
                if (streamContainer) {
                    streamContainer.remove();
                }
                this.currentStream = null;
            },

            showFeedback(message) {
                if (window.SMeditor) {
                    window.SMeditor.showFeedback(message);
                } else {
                    console.log(message);
                }
            }
        };
    }

    // Public methods
    startLiveCommerce(industry, templateName) {
        const industryTemplates = this.templates.get(industry);
        if (!industryTemplates) {
            console.error(`No templates found for industry: ${industry}`);
            return;
        }

        const template = industryTemplates.templates[templateName];
        if (!template) {
            console.error(`No template found: ${templateName}`);
            return;
        }

        this.liveStreamManager.startStream(template, industry);
    }

    getAvailableTemplates(industry) {
        const industryTemplates = this.templates.get(industry);
        return industryTemplates ? Object.keys(industryTemplates.templates) : [];
    }

    getTemplateDetails(industry, templateName) {
        const industryTemplates = this.templates.get(industry);
        return industryTemplates?.templates[templateName] || null;
    }
}

// Initialize Live Commerce Templates
window.LiveCommerceTemplates = new LiveCommerceTemplates(); 