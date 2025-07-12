/**
 * Industry Dashboards
 * Full functionality dashboards for each industry
 */

class IndustryDashboardManager {
    constructor() {
        this.currentIndustry = 'general';
        this.dashboards = new Map();
        this.liveShoppingSystem = null;
        this.analyticsSystem = null;
        
        this.init();
    }

    init() {
        this.loadDashboardConfigurations();
        this.setupLiveShoppingSystem();
        this.setupAnalyticsSystem();
    }

    loadDashboardConfigurations() {
        // Automotive Dashboard
        this.dashboards.set('automotive', {
            name: 'Automotive Dashboard',
            metrics: ['vehicleViews', 'testDrives', 'inquiries', 'sales', 'conversions'],
            features: {
                inventory: true,
                testDrive: true,
                financing: true,
                service: true,
                analytics: true,
                liveStreaming: true
            },
            widgets: [
                { id: 'vehicle-inventory', type: 'inventory', title: 'Vehicle Inventory' },
                { id: 'test-drive-scheduler', type: 'scheduler', title: 'Test Drive Scheduler' },
                { id: 'financing-calculator', type: 'calculator', title: 'Financing Calculator' },
                { id: 'service-appointments', type: 'appointments', title: 'Service Appointments' },
                { id: 'sales-analytics', type: 'analytics', title: 'Sales Analytics' },
                { id: 'live-showroom', type: 'livestream', title: 'Live Showroom' }
            ]
        });

        // Real Estate Dashboard
        this.dashboards.set('realestate', {
            name: 'Real Estate Dashboard',
            metrics: ['propertyViews', 'virtualTours', 'inquiries', 'showings', 'closings'],
            features: {
                propertyManagement: true,
                virtualTours: true,
                leadManagement: true,
                marketAnalytics: true,
                mortgageCalculator: true,
                liveStreaming: true
            },
            widgets: [
                { id: 'property-inventory', type: 'inventory', title: 'Property Inventory' },
                { id: 'virtual-tour-scheduler', type: 'scheduler', title: 'Virtual Tour Scheduler' },
                { id: 'lead-management', type: 'leads', title: 'Lead Management' },
                { id: 'market-analytics', type: 'analytics', title: 'Market Analytics' },
                { id: 'mortgage-calculator', type: 'calculator', title: 'Mortgage Calculator' },
                { id: 'live-property-tours', type: 'livestream', title: 'Live Property Tours' }
            ]
        });

        // Fashion Dashboard
        this.dashboards.set('fashion', {
            name: 'Fashion Dashboard',
            metrics: ['productViews', 'virtualTryOns', 'purchases', 'returns', 'revenue'],
            features: {
                inventory: true,
                virtualTryOn: true,
                eCommerce: true,
                trendAnalytics: true,
                sizeRecommendations: true,
                liveStreaming: true
            },
            widgets: [
                { id: 'product-inventory', type: 'inventory', title: 'Product Inventory' },
                { id: 'virtual-try-on', type: 'virtual-try-on', title: 'Virtual Try-On' },
                { id: 'ecommerce-analytics', type: 'analytics', title: 'E-commerce Analytics' },
                { id: 'trend-analysis', type: 'trends', title: 'Trend Analysis' },
                { id: 'size-recommendations', type: 'recommendations', title: 'Size Recommendations' },
                { id: 'live-fashion-shows', type: 'livestream', title: 'Live Fashion Shows' }
            ]
        });

        // Makeup & Beauty Dashboard
        this.dashboards.set('makeup', {
            name: 'Beauty Dashboard',
            metrics: ['productViews', 'virtualTryOns', 'tutorialViews', 'purchases', 'revenue'],
            features: {
                inventory: true,
                virtualMakeup: true,
                tutorials: true,
                beautyAnalytics: true,
                skinToneMatching: true,
                liveStreaming: true
            },
            widgets: [
                { id: 'beauty-inventory', type: 'inventory', title: 'Beauty Inventory' },
                { id: 'virtual-makeup', type: 'virtual-makeup', title: 'Virtual Makeup' },
                { id: 'tutorial-manager', type: 'tutorials', title: 'Tutorial Manager' },
                { id: 'beauty-analytics', type: 'analytics', title: 'Beauty Analytics' },
                { id: 'skin-tone-matcher', type: 'matcher', title: 'Skin Tone Matcher' },
                { id: 'live-beauty-sessions', type: 'livestream', title: 'Live Beauty Sessions' }
            ]
        });

        // Education Dashboard
        this.dashboards.set('education', {
            name: 'Education Dashboard',
            metrics: ['studentEngagement', 'lessonViews', 'quizScores', 'completionRates', 'progress'],
            features: {
                lessonManagement: true,
                studentProgress: true,
                assessments: true,
                collaboration: true,
                analytics: true,
                liveStreaming: true
            },
            widgets: [
                { id: 'lesson-manager', type: 'lessons', title: 'Lesson Manager' },
                { id: 'student-progress', type: 'progress', title: 'Student Progress' },
                { id: 'assessment-tools', type: 'assessments', title: 'Assessment Tools' },
                { id: 'collaboration-hub', type: 'collaboration', title: 'Collaboration Hub' },
                { id: 'education-analytics', type: 'analytics', title: 'Education Analytics' },
                { id: 'live-classrooms', type: 'livestream', title: 'Live Classrooms' }
            ]
        });

        // General Dashboard
        this.dashboards.set('general', {
            name: 'General Dashboard',
            metrics: ['contentViews', 'engagement', 'conversions', 'revenue', 'growth'],
            features: {
                contentManagement: true,
                analytics: true,
                branding: true,
                socialIntegration: true,
                customForms: true,
                liveStreaming: true
            },
            widgets: [
                { id: 'content-manager', type: 'content', title: 'Content Manager' },
                { id: 'analytics-overview', type: 'analytics', title: 'Analytics Overview' },
                { id: 'branding-tools', type: 'branding', title: 'Branding Tools' },
                { id: 'social-integration', type: 'social', title: 'Social Integration' },
                { id: 'custom-forms', type: 'forms', title: 'Custom Forms' },
                { id: 'live-streaming', type: 'livestream', title: 'Live Streaming' }
            ]
        });
    }

    setupLiveShoppingSystem() {
        this.liveShoppingSystem = {
            // WebRTC for live streaming
            webrtc: null,
            // Live chat system
            chat: null,
            // Product showcase during live streams
            productShowcase: null,
            // Real-time analytics
            analytics: null,
            
            init() {
                this.initWebRTC();
                this.initChat();
                this.initProductShowcase();
                this.initAnalytics();
            },

            initWebRTC() {
                // Initialize WebRTC for live streaming
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                        .then(stream => {
                            this.webrtc = stream;
                            console.log('Live streaming ready');
                        })
                        .catch(err => {
                            console.error('Live streaming not available:', err);
                        });
                }
            },

            initChat() {
                this.chat = {
                    messages: [],
                    participants: [],
                    
                    sendMessage(message, user) {
                        this.messages.push({
                            id: Date.now(),
                            text: message,
                            user: user,
                            timestamp: new Date()
                        });
                        this.broadcastMessage(message, user);
                    },

                    broadcastMessage(message, user) {
                        // Broadcast to all participants
                        if (window.SpatialAudioManager) {
                            window.SpatialAudioManager.playNotificationSound();
                        }
                    }
                };
            },

            initProductShowcase() {
                this.productShowcase = {
                    currentProduct: null,
                    products: [],
                    
                    showProduct(product) {
                        this.currentProduct = product;
                        this.displayProduct(product);
                        this.announceProduct(product);
                    },

                    displayProduct(product) {
                        // Display product in 3D space
                        if (window.PlayCanvasManager) {
                            window.PlayCanvasManager.showProduct(product);
                        }
                    },

                    announceProduct(product) {
                        // Announce product to live audience
                        this.chat.sendMessage(`🎉 Now showcasing: ${product.name}`, 'System');
                    }
                };
            },

            initAnalytics() {
                this.analytics = {
                    viewers: 0,
                    engagement: 0,
                    sales: 0,
                    
                    trackViewer() {
                        this.viewers++;
                        this.updateAnalytics();
                    },

                    trackEngagement(action) {
                        this.engagement++;
                        this.updateAnalytics();
                    },

                    trackSale(product, amount) {
                        this.sales += amount;
                        this.updateAnalytics();
                    },

                    updateAnalytics() {
                        // Update dashboard metrics
                        this.updateDashboardMetrics();
                    }
                };
            },

            startLiveStream(industry) {
                console.log(`Starting live stream for ${industry}`);
                
                // Industry-specific live stream setup
                switch (industry) {
                    case 'automotive':
                        this.startCarShowroom();
                        break;
                    case 'realestate':
                        this.startPropertyTour();
                        break;
                    case 'fashion':
                        this.startFashionShow();
                        break;
                    case 'makeup':
                        this.startBeautySession();
                        break;
                    case 'education':
                        this.startLiveClass();
                        break;
                    default:
                        this.startGeneralStream();
                }
            },

            startCarShowroom() {
                // Automotive live stream
                this.chat.sendMessage('🚗 Welcome to our live car showroom!', 'Host');
                this.productShowcase.showProduct({ name: 'Featured Vehicle', type: 'car' });
            },

            startPropertyTour() {
                // Real estate live stream
                this.chat.sendMessage('🏠 Welcome to our live property tour!', 'Host');
                this.productShowcase.showProduct({ name: 'Featured Property', type: 'property' });
            },

            startFashionShow() {
                // Fashion live stream
                this.chat.sendMessage('👗 Welcome to our live fashion show!', 'Host');
                this.productShowcase.showProduct({ name: 'Featured Collection', type: 'fashion' });
            },

            startBeautySession() {
                // Beauty live stream
                this.chat.sendMessage('💄 Welcome to our live beauty session!', 'Host');
                this.productShowcase.showProduct({ name: 'Featured Beauty Product', type: 'beauty' });
            },

            startLiveClass() {
                // Education live stream
                this.chat.sendMessage('🎓 Welcome to our live class!', 'Host');
                this.productShowcase.showProduct({ name: 'Featured Lesson', type: 'lesson' });
            },

            startGeneralStream() {
                // General live stream
                this.chat.sendMessage('🎥 Welcome to our live stream!', 'Host');
                this.productShowcase.showProduct({ name: 'Featured Content', type: 'content' });
            }
        };

        this.liveShoppingSystem.init();
    }

    setupAnalyticsSystem() {
        this.analyticsSystem = {
            metrics: {},
            reports: {},
            
            trackMetric(industry, metric, value) {
                if (!this.metrics[industry]) {
                    this.metrics[industry] = {};
                }
                if (!this.metrics[industry][metric]) {
                    this.metrics[industry][metric] = [];
                }
                this.metrics[industry][metric].push({
                    value: value,
                    timestamp: new Date()
                });
            },

            getMetric(industry, metric, timeframe = '24h') {
                const data = this.metrics[industry]?.[metric] || [];
                const now = new Date();
                const filtered = data.filter(item => {
                    const diff = now - item.timestamp;
                    switch (timeframe) {
                        case '1h': return diff <= 3600000;
                        case '24h': return diff <= 86400000;
                        case '7d': return diff <= 604800000;
                        case '30d': return diff <= 2592000000;
                        default: return true;
                    }
                });
                return filtered.map(item => item.value);
            },

            generateReport(industry, timeframe = '24h') {
                const dashboard = this.dashboards.get(industry);
                const report = {
                    industry: industry,
                    timeframe: timeframe,
                    metrics: {},
                    insights: []
                };

                dashboard.metrics.forEach(metric => {
                    const values = this.getMetric(industry, metric, timeframe);
                    report.metrics[metric] = {
                        current: values[values.length - 1] || 0,
                        average: values.reduce((a, b) => a + b, 0) / values.length || 0,
                        trend: this.calculateTrend(values)
                    };
                });

                report.insights = this.generateInsights(report.metrics, industry);
                return report;
            },

            calculateTrend(values) {
                if (values.length < 2) return 'stable';
                const recent = values.slice(-5);
                const older = values.slice(-10, -5);
                const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
                const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
                
                if (recentAvg > olderAvg * 1.1) return 'increasing';
                if (recentAvg < olderAvg * 0.9) return 'decreasing';
                return 'stable';
            },

            generateInsights(metrics, industry) {
                const insights = [];
                
                // Industry-specific insights
                switch (industry) {
                    case 'automotive':
                        if (metrics.testDrives?.current > 10) {
                            insights.push('🚗 High test drive interest - consider promoting financing options');
                        }
                        break;
                    case 'realestate':
                        if (metrics.virtualTours?.current > 5) {
                            insights.push('🏠 Strong virtual tour engagement - schedule more live tours');
                        }
                        break;
                    case 'fashion':
                        if (metrics.virtualTryOns?.current > 20) {
                            insights.push('👗 High virtual try-on usage - showcase trending items');
                        }
                        break;
                    case 'makeup':
                        if (metrics.tutorialViews?.current > 15) {
                            insights.push('💄 Popular tutorial content - create more beauty guides');
                        }
                        break;
                    case 'education':
                        if (metrics.studentEngagement?.current > 80) {
                            insights.push('🎓 High student engagement - consider advanced topics');
                        }
                        break;
                }

                return insights;
            }
        };
    }

    showDashboard(industry) {
        const dashboard = this.dashboards.get(industry);
        if (!dashboard) return;

        this.currentIndustry = industry;
        this.createDashboardUI(dashboard);
        this.loadDashboardData(industry);
    }

    createDashboardUI(dashboard) {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');

        title.textContent = dashboard.name;
        content.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <div class="dashboard-stats">
                        ${this.createStatsHTML(dashboard.metrics)}
                    </div>
                    <div class="dashboard-controls">
                        <button id="start-live-stream" class="dashboard-btn">Start Live Stream</button>
                        <button id="generate-report" class="dashboard-btn">Generate Report</button>
                        <button id="export-data" class="dashboard-btn">Export Data</button>
                    </div>
                </div>
                
                <div class="dashboard-widgets">
                    ${this.createWidgetsHTML(dashboard.widgets)}
                </div>
                
                <div class="dashboard-insights">
                    <h4>AI Insights</h4>
                    <div id="insights-container" class="insights-list">
                        <!-- Insights will be populated here -->
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        this.setupDashboardEvents(dashboard);
    }

    createStatsHTML(metrics) {
        return metrics.map(metric => `
            <div class="stat-card">
                <div class="stat-value" id="${metric}-value">0</div>
                <div class="stat-label">${this.formatMetricName(metric)}</div>
                <div class="stat-trend" id="${metric}-trend">↗️</div>
            </div>
        `).join('');
    }

    createWidgetsHTML(widgets) {
        return widgets.map(widget => `
            <div class="dashboard-widget" id="${widget.id}">
                <div class="widget-header">
                    <h4>${widget.title}</h4>
                    <button class="widget-expand">⤢</button>
                </div>
                <div class="widget-content">
                    ${this.createWidgetContent(widget)}
                </div>
            </div>
        `).join('');
    }

    createWidgetContent(widget) {
        switch (widget.type) {
            case 'inventory':
                return this.createInventoryWidget(widget);
            case 'analytics':
                return this.createAnalyticsWidget(widget);
            case 'livestream':
                return this.createLiveStreamWidget(widget);
            case 'calculator':
                return this.createCalculatorWidget(widget);
            default:
                return `<div class="widget-placeholder">${widget.title} content</div>`;
        }
    }

    createInventoryWidget(widget) {
        return `
            <div class="inventory-widget">
                <div class="inventory-stats">
                    <span>Total: <strong id="total-count">0</strong></span>
                    <span>Available: <strong id="available-count">0</strong></span>
                    <span>Featured: <strong id="featured-count">0</strong></span>
                </div>
                <div class="inventory-list" id="inventory-list">
                    <!-- Inventory items will be populated here -->
                </div>
                <button class="add-item-btn">+ Add Item</button>
            </div>
        `;
    }

    createAnalyticsWidget(widget) {
        return `
            <div class="analytics-widget">
                <div class="chart-container">
                    <canvas id="${widget.id}-chart"></canvas>
                </div>
                <div class="analytics-summary">
                    <div class="summary-item">
                        <span class="label">Total Views</span>
                        <span class="value" id="total-views">0</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Engagement</span>
                        <span class="value" id="engagement-rate">0%</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Conversions</span>
                        <span class="value" id="conversion-rate">0%</span>
                    </div>
                </div>
            </div>
        `;
    }

    createLiveStreamWidget(widget) {
        return `
            <div class="livestream-widget">
                <div class="stream-preview">
                    <video id="stream-video" autoplay muted></video>
                    <div class="stream-overlay">
                        <div class="viewer-count">👥 <span id="viewer-count">0</span> viewers</div>
                        <div class="engagement-count">❤️ <span id="engagement-count">0</span> likes</div>
                    </div>
                </div>
                <div class="stream-controls">
                    <button id="start-stream" class="stream-btn">Start Stream</button>
                    <button id="stop-stream" class="stream-btn">Stop Stream</button>
                    <button id="share-stream" class="stream-btn">Share</button>
                </div>
                <div class="chat-container">
                    <div class="chat-messages" id="chat-messages">
                        <!-- Chat messages will appear here -->
                    </div>
                    <div class="chat-input">
                        <input type="text" id="chat-input" placeholder="Type a message...">
                        <button id="send-message">Send</button>
                    </div>
                </div>
            </div>
        `;
    }

    createCalculatorWidget(widget) {
        return `
            <div class="calculator-widget">
                <div class="calculator-inputs">
                    <div class="input-group">
                        <label>Amount</label>
                        <input type="number" id="calc-amount" placeholder="Enter amount">
                    </div>
                    <div class="input-group">
                        <label>Rate (%)</label>
                        <input type="number" id="calc-rate" placeholder="Interest rate">
                    </div>
                    <div class="input-group">
                        <label>Term (months)</label>
                        <input type="number" id="calc-term" placeholder="Loan term">
                    </div>
                </div>
                <div class="calculator-results">
                    <div class="result-item">
                        <span class="label">Monthly Payment</span>
                        <span class="value" id="monthly-payment">$0</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Total Interest</span>
                        <span class="value" id="total-interest">$0</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Total Amount</span>
                        <span class="value" id="total-amount">$0</span>
                    </div>
                </div>
                <button id="calculate-btn" class="calc-btn">Calculate</button>
            </div>
        `;
    }

    setupDashboardEvents(dashboard) {
        // Live stream events
        document.getElementById('start-live-stream')?.addEventListener('click', () => {
            this.liveShoppingSystem.startLiveStream(this.currentIndustry);
        });

        // Report generation
        document.getElementById('generate-report')?.addEventListener('click', () => {
            const report = this.analyticsSystem.generateReport(this.currentIndustry);
            this.displayReport(report);
        });

        // Calculator events
        document.getElementById('calculate-btn')?.addEventListener('click', () => {
            this.calculatePayment();
        });

        // Live stream controls
        document.getElementById('start-stream')?.addEventListener('click', () => {
            this.startLiveStream();
        });

        // Chat events
        document.getElementById('send-message')?.addEventListener('click', () => {
            this.sendChatMessage();
        });
    }

    loadDashboardData(industry) {
        // Load industry-specific data
        this.loadInventoryData(industry);
        this.loadAnalyticsData(industry);
        this.updateMetrics(industry);
        this.generateInsights(industry);
    }

    loadInventoryData(industry) {
        // Simulate loading inventory data
        const inventory = this.getInventoryData(industry);
        this.displayInventory(inventory);
    }

    loadAnalyticsData(industry) {
        // Load analytics data
        const analytics = this.analyticsSystem.generateReport(industry);
        this.displayAnalytics(analytics);
    }

    updateMetrics(industry) {
        const dashboard = this.dashboards.get(industry);
        dashboard.metrics.forEach(metric => {
            const value = this.analyticsSystem.getMetric(industry, metric, '24h').pop() || 0;
            const element = document.getElementById(`${metric}-value`);
            if (element) {
                element.textContent = this.formatMetricValue(metric, value);
            }
        });
    }

    generateInsights(industry) {
        const report = this.analyticsSystem.generateReport(industry);
        const insightsContainer = document.getElementById('insights-container');
        if (insightsContainer) {
            insightsContainer.innerHTML = report.insights.map(insight => 
                `<div class="insight-item">${insight}</div>`
            ).join('');
        }
    }

    // Utility methods
    formatMetricName(metric) {
        return metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    formatMetricValue(metric, value) {
        switch (metric) {
            case 'revenue':
            case 'sales':
                return `$${value.toLocaleString()}`;
            case 'conversions':
            case 'engagement':
                return `${value}%`;
            default:
                return value.toLocaleString();
        }
    }

    getInventoryData(industry) {
        // Simulate inventory data
        const inventory = {
            automotive: [
                { id: 1, name: 'Tesla Model 3', type: 'Electric', price: 45000, status: 'Available' },
                { id: 2, name: 'BMW X5', type: 'SUV', price: 65000, status: 'Available' }
            ],
            realestate: [
                { id: 1, name: 'Modern Downtown Loft', type: 'Apartment', price: 350000, status: 'Available' },
                { id: 2, name: 'Suburban Family Home', type: 'House', price: 550000, status: 'Available' }
            ],
            fashion: [
                { id: 1, name: 'Designer Dress', type: 'Clothing', price: 299, status: 'In Stock' },
                { id: 2, name: 'Premium Handbag', type: 'Accessories', price: 599, status: 'In Stock' }
            ],
            makeup: [
                { id: 1, name: 'Foundation Set', type: 'Makeup', price: 49, status: 'In Stock' },
                { id: 2, name: 'Lipstick Collection', type: 'Makeup', price: 29, status: 'In Stock' }
            ]
        };
        return inventory[industry] || [];
    }

    displayInventory(inventory) {
        const container = document.getElementById('inventory-list');
        if (container) {
            container.innerHTML = inventory.map(item => `
                <div class="inventory-item">
                    <div class="item-info">
                        <strong>${item.name}</strong>
                        <span class="item-type">${item.type}</span>
                    </div>
                    <div class="item-price">$${item.price.toLocaleString()}</div>
                    <div class="item-status ${item.status.toLowerCase()}">${item.status}</div>
                </div>
            `).join('');
        }
    }

    displayAnalytics(analytics) {
        // Update analytics widgets
        Object.keys(analytics.metrics).forEach(metric => {
            const element = document.getElementById(`${metric}-value`);
            if (element) {
                element.textContent = this.formatMetricValue(metric, analytics.metrics[metric].current);
            }
        });
    }

    displayReport(report) {
        // Create a new modal for the report
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');

        title.textContent = `${report.industry} Analytics Report`;
        content.innerHTML = `
            <div class="report-container">
                <div class="report-header">
                    <h3>${report.timeframe} Report</h3>
                    <div class="report-metrics">
                        ${Object.keys(report.metrics).map(metric => `
                            <div class="report-metric">
                                <span class="metric-name">${this.formatMetricName(metric)}</span>
                                <span class="metric-value">${this.formatMetricValue(metric, report.metrics[metric].current)}</span>
                                <span class="metric-trend ${report.metrics[metric].trend}">${this.getTrendIcon(report.metrics[metric].trend)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="report-insights">
                    <h4>Key Insights</h4>
                    ${report.insights.map(insight => `<div class="insight">${insight}</div>`).join('')}
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    getTrendIcon(trend) {
        switch (trend) {
            case 'increasing': return '↗️';
            case 'decreasing': return '↘️';
            default: return '→';
        }
    }

    calculatePayment() {
        const amount = parseFloat(document.getElementById('calc-amount').value) || 0;
        const rate = parseFloat(document.getElementById('calc-rate').value) || 0;
        const term = parseFloat(document.getElementById('calc-term').value) || 0;

        if (amount && rate && term) {
            const monthlyRate = rate / 100 / 12;
            const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
            const totalAmount = monthlyPayment * term;
            const totalInterest = totalAmount - amount;

            document.getElementById('monthly-payment').textContent = `$${monthlyPayment.toFixed(2)}`;
            document.getElementById('total-interest').textContent = `$${totalInterest.toFixed(2)}`;
            document.getElementById('total-amount').textContent = `$${totalAmount.toFixed(2)}`;
        }
    }

    startLiveStream() {
        if (this.liveShoppingSystem) {
            this.liveShoppingSystem.startLiveStream(this.currentIndustry);
            document.getElementById('start-stream').textContent = 'Stop Stream';
            document.getElementById('start-stream').classList.add('streaming');
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message && this.liveShoppingSystem) {
            this.liveShoppingSystem.chat.sendMessage(message, 'User');
            input.value = '';
            
            // Display message in chat
            const chatContainer = document.getElementById('chat-messages');
            if (chatContainer) {
                const messageElement = document.createElement('div');
                messageElement.className = 'chat-message';
                messageElement.innerHTML = `
                    <span class="message-user">User:</span>
                    <span class="message-text">${message}</span>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                `;
                chatContainer.appendChild(messageElement);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }
}

// Initialize Industry Dashboard Manager
window.IndustryDashboardManager = new IndustryDashboardManager(); 