// Super Admin Dashboard JavaScript

class AdminDashboard {
    constructor() {
        this.currentTab = 'dashboard';
        this.data = {
            users: [],
            subscriptions: [],
            analytics: {},
            systemStatus: {}
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabNavigation();
        this.loadDashboardData();
        this.initializeCharts();
        this.setupRealTimeUpdates();
    }

    setupEventListeners() {
        // Refresh data button
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshAllData());
        }

        // Export data button
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Search functionality
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => this.filterUsers(e.target.value));
        }

        // Filter controls
        const userTypeFilter = document.getElementById('userTypeFilter');
        const subscriptionFilter = document.getElementById('subscriptionFilter');
        
        if (userTypeFilter) {
            userTypeFilter.addEventListener('change', () => this.applyUserFilters());
        }
        
        if (subscriptionFilter) {
            subscriptionFilter.addEventListener('change', () => this.applyUserFilters());
        }

        // Settings save
        const saveSettingsBtn = document.querySelector('.settings-actions .btn-primary');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Clear logs
        const clearLogsBtn = document.querySelector('.clear-logs-btn');
        if (clearLogsBtn) {
            clearLogsBtn.addEventListener('click', () => this.clearSystemLogs());
        }
    }

    setupTabNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        const tabContents = document.querySelectorAll('.tab-content');

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = item.dataset.tab;
                
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
    }

    switchTab(tabName) {
        // Update menu active state
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');

        // Update page title and subtitle
        this.updatePageHeader(tabName);
        
        // Load tab-specific data
        this.loadTabData(tabName);
        
        this.currentTab = tabName;
    }

    updatePageHeader(tabName) {
        const titles = {
            dashboard: { title: 'Dashboard', subtitle: 'Platform overview and key metrics' },
            analytics: { title: 'Analytics', subtitle: 'Detailed platform analytics and insights' },
            users: { title: 'User Management', subtitle: 'Manage platform users and accounts' },
            subscriptions: { title: 'Subscriptions', subtitle: 'Monitor and manage user subscriptions' },
            organizations: { title: 'Organizations', subtitle: 'Enterprise accounts and teams' },
            scenes: { title: 'Scene Management', subtitle: 'All spatial experiences on the platform' },
            templates: { title: 'Template Library', subtitle: 'Manage scene templates and layouts' },
            assets: { title: 'Asset Management', subtitle: 'Platform-wide asset storage and usage' },
            system: { title: 'System Status', subtitle: 'Server health and system monitoring' },
            billing: { title: 'Billing & Revenue', subtitle: 'Financial overview and billing management' },
            settings: { title: 'Platform Settings', subtitle: 'Configure platform-wide settings' }
        };

        const header = titles[tabName] || { title: 'Dashboard', subtitle: 'Platform overview' };
        document.getElementById('page-title').textContent = header.title;
        document.getElementById('page-subtitle').textContent = header.subtitle;
    }

    async loadDashboardData() {
        try {
            this.showLoading(true);
            
            // Simulate API calls (replace with actual endpoints)
            const [usersData, subscriptionsData, analyticsData, systemData] = await Promise.all([
                this.fetchData('/api/admin/users'),
                this.fetchData('/api/admin/subscriptions'),
                this.fetchData('/api/admin/analytics'),
                this.fetchData('/api/admin/system-status')
            ]);

            this.data.users = usersData || this.generateMockUsers();
            this.data.subscriptions = subscriptionsData || this.generateMockSubscriptions();
            this.data.analytics = analyticsData || this.generateMockAnalytics();
            this.data.systemStatus = systemData || this.generateMockSystemStatus();

            this.updateDashboardMetrics();
            this.updateRecentActivity();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showToast('Error loading dashboard data', 'error');
            // Use mock data as fallback
            this.data.users = this.generateMockUsers();
            this.data.subscriptions = this.generateMockSubscriptions();
            this.updateDashboardMetrics();
        } finally {
            this.showLoading(false);
        }
    }

    async loadTabData(tabName) {
        switch (tabName) {
            case 'users':
                await this.loadUsersData();
                break;
            case 'subscriptions':
                await this.loadSubscriptionsData();
                break;
            case 'system':
                await this.loadSystemData();
                break;
            case 'analytics':
                await this.loadAnalyticsData();
                break;
        }
    }

    async loadUsersData() {
        const usersTableBody = document.querySelector('#usersTable tbody');
        if (!usersTableBody) return;

        usersTableBody.innerHTML = '';
        
        this.data.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${this.getIndustryColor(user.type)}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.8rem;">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-weight: 500;">${user.name}</div>
                            <div style="font-size: 0.85rem; color: #6b7280;">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge ${user.type}">${this.formatUserType(user.type)}</span>
                </td>
                <td>
                    <span class="badge ${user.subscription.status}">${user.subscription.plan}</span>
                </td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>${this.formatDate(user.lastActive)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-btn" onclick="adminDashboard.viewUser('${user.id}')">View</button>
                        <button class="action-btn secondary" onclick="adminDashboard.editUser('${user.id}')">Edit</button>
                    </div>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    }

    async loadSubscriptionsData() {
        const subscriptionsTableBody = document.querySelector('#subscriptionsTable tbody');
        if (!subscriptionsTableBody) return;

        subscriptionsTableBody.innerHTML = '';
        
        this.data.subscriptions.forEach(subscription => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div>
                        <div style="font-weight: 500;">${subscription.customerName}</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">${subscription.customerEmail}</div>
                    </div>
                </td>
                <td>${subscription.plan}</td>
                <td>
                    <span class="badge ${subscription.status}">${subscription.status}</span>
                </td>
                <td>$${subscription.amount}/month</td>
                <td>${this.formatDate(subscription.nextPayment)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-btn" onclick="adminDashboard.viewSubscription('${subscription.id}')">View</button>
                        <button class="action-btn secondary" onclick="adminDashboard.manageSubscription('${subscription.id}')">Manage</button>
                    </div>
                </td>
            `;
            subscriptionsTableBody.appendChild(row);
        });
    }

    updateDashboardMetrics() {
        // Update metric cards with real data
        const totalUsers = this.data.users.length;
        const activeSubscriptions = this.data.subscriptions.filter(s => s.status === 'active').length;
        const monthlyRevenue = this.data.subscriptions
            .filter(s => s.status === 'active')
            .reduce((total, s) => total + s.amount, 0);
        const totalScenes = 8492; // This would come from actual data

        document.querySelector('.metric-card:nth-child(1) .metric-value').textContent = totalUsers.toLocaleString();
        document.querySelector('.metric-card:nth-child(2) .metric-value').textContent = activeSubscriptions.toLocaleString();
        document.querySelector('.metric-card:nth-child(3) .metric-value').textContent = `$${monthlyRevenue.toLocaleString()}`;
        document.querySelector('.metric-card:nth-child(4) .metric-value').textContent = totalScenes.toLocaleString();
    }

    initializeCharts() {
        // Initialize charts (placeholder - would use Chart.js or similar)
        this.initUserGrowthChart();
        this.initRevenueByIndustryChart();
    }

    initUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart');
        if (!ctx) return;

        // Placeholder for chart initialization
        ctx.style.backgroundColor = '#f3f4f6';
        ctx.style.border = '1px solid #e5e7eb';
        ctx.style.borderRadius = '8px';
        ctx.style.display = 'flex';
        ctx.style.alignItems = 'center';
        ctx.style.justifyContent = 'center';
        ctx.textContent = 'User Growth Chart (Chart.js integration needed)';
    }

    initRevenueByIndustryChart() {
        const ctx = document.getElementById('revenueByIndustryChart');
        if (!ctx) return;

        // Placeholder for chart initialization
        ctx.style.backgroundColor = '#f3f4f6';
        ctx.style.border = '1px solid #e5e7eb';
        ctx.style.borderRadius = '8px';
        ctx.style.display = 'flex';
        ctx.style.alignItems = 'center';
        ctx.style.justifyContent = 'center';
        ctx.textContent = 'Revenue by Industry Chart';
    }

    setupRealTimeUpdates() {
        // Set up WebSocket or polling for real-time updates
        setInterval(() => {
            if (this.currentTab === 'dashboard') {
                this.updateMetricsInRealTime();
            }
        }, 30000); // Update every 30 seconds
    }

    async refreshAllData() {
        this.showToast('Refreshing data...', 'info');
        await this.loadDashboardData();
        await this.loadTabData(this.currentTab);
        this.showToast('Data refreshed successfully', 'success');
    }

    async exportData() {
        try {
            this.showToast('Preparing export...', 'info');
            
            const exportData = {
                users: this.data.users,
                subscriptions: this.data.subscriptions,
                analytics: this.data.analytics,
                systemStatus: this.data.systemStatus,
                exportedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `static-motion-admin-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            this.showToast('Data exported successfully', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Export failed', 'error');
        }
    }

    filterUsers(searchTerm) {
        const filteredUsers = this.data.users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayFilteredUsers(filteredUsers);
    }

    applyUserFilters() {
        const typeFilter = document.getElementById('userTypeFilter').value;
        const subscriptionFilter = document.getElementById('subscriptionFilter').value;
        const searchTerm = document.getElementById('userSearch').value;

        let filteredUsers = [...this.data.users];

        if (typeFilter) {
            filteredUsers = filteredUsers.filter(user => user.type === typeFilter);
        }

        if (subscriptionFilter) {
            filteredUsers = filteredUsers.filter(user => user.subscription.status === subscriptionFilter);
        }

        if (searchTerm) {
            filteredUsers = filteredUsers.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        this.displayFilteredUsers(filteredUsers);
    }

    displayFilteredUsers(users) {
        const usersTableBody = document.querySelector('#usersTable tbody');
        if (!usersTableBody) return;

        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${this.getIndustryColor(user.type)}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.8rem;">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-weight: 500;">${user.name}</div>
                            <div style="font-size: 0.85rem; color: #6b7280;">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge ${user.type}">${this.formatUserType(user.type)}</span></td>
                <td><span class="badge ${user.subscription.status}">${user.subscription.plan}</span></td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>${this.formatDate(user.lastActive)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-btn" onclick="adminDashboard.viewUser('${user.id}')">View</button>
                        <button class="action-btn secondary" onclick="adminDashboard.editUser('${user.id}')">Edit</button>
                    </div>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    }

    async saveSettings() {
        try {
            this.showToast('Saving settings...', 'info');
            
            const settings = {
                platformName: document.querySelector('[value="Static Motion"]').value,
                defaultDomain: document.querySelector('[value="staticmotion.app"]').value,
                supportEmail: document.querySelector('[value="support@staticmotion.app"]').value,
                // Add more settings as needed
            };

            // Simulate API call
            await this.fetchData('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            this.showToast('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Settings save error:', error);
            this.showToast('Failed to save settings', 'error');
        }
    }

    clearSystemLogs() {
        const logsContainer = document.querySelector('.logs-container');
        if (logsContainer) {
            logsContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">Logs cleared</p>';
            this.showToast('System logs cleared', 'success');
        }
    }

    // User management actions
    viewUser(userId) {
        const user = this.data.users.find(u => u.id === userId);
        if (user) {
            this.showModal('userModal', user);
        }
    }

    editUser(userId) {
        console.log('Edit user:', userId);
        this.showToast('Edit user functionality would be implemented here', 'info');
    }

    viewSubscription(subscriptionId) {
        console.log('View subscription:', subscriptionId);
        this.showToast('View subscription functionality would be implemented here', 'info');
    }

    manageSubscription(subscriptionId) {
        console.log('Manage subscription:', subscriptionId);
        this.showToast('Manage subscription functionality would be implemented here', 'info');
    }

    // Utility methods
    async fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatUserType(type) {
        const types = {
            automotive: 'Automotive',
            realestate: 'Real Estate',
            enterprise: 'Enterprise',
            superadmin: 'Super Admin'
        };
        return types[type] || type;
    }

    getIndustryColor(type) {
        const colors = {
            automotive: '#ef4444',
            realestate: '#10b981',
            enterprise: '#8b5cf6',
            superadmin: '#6366f1'
        };
        return colors[type] || '#6b7280';
    }

    showLoading(show) {
        // Implementation for loading states
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.disabled = show;
            refreshBtn.innerHTML = show ? 
                '<span class="btn-icon">⏳</span>Loading...' : 
                '<span class="btn-icon">🔄</span>Refresh';
        }
    }

    showModal(modalId, data = null) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            if (data) {
                // Populate modal with data
                console.log('Modal data:', data);
            }
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Mock data generators (replace with real API calls)
    generateMockUsers() {
        return [
            {
                id: '1',
                name: 'John Smith',
                email: 'john@autodealer.com',
                type: 'automotive',
                subscription: { plan: 'Automotive Professional', status: 'active' },
                createdAt: '2024-01-10',
                lastActive: '2024-01-15'
            },
            {
                id: '2',
                name: 'Sarah Johnson',
                email: 'sarah@premierrealty.com',
                type: 'realestate',
                subscription: { plan: 'Real Estate Professional', status: 'active' },
                createdAt: '2024-01-08',
                lastActive: '2024-01-14'
            },
            {
                id: '3',
                name: 'Mike Rodriguez',
                email: 'mike@luxuryprops.com',
                type: 'realestate',
                subscription: { plan: 'Real Estate Professional', status: 'active' },
                createdAt: '2024-01-12',
                lastActive: '2024-01-15'
            },
            {
                id: '4',
                name: 'Lisa Chen',
                email: 'lisa@elitemotors.com',
                type: 'automotive',
                subscription: { plan: 'Automotive Professional', status: 'active' },
                createdAt: '2024-01-05',
                lastActive: '2024-01-14'
            }
        ];
    }

    generateMockSubscriptions() {
        return [
            {
                id: 'sub_1',
                customerName: 'AutoDealer Pro',
                customerEmail: 'billing@autodealer.com',
                plan: 'Automotive Professional',
                status: 'active',
                amount: 499,
                nextPayment: '2024-02-15'
            },
            {
                id: 'sub_2',
                customerName: 'Premier Realty',
                customerEmail: 'billing@premierrealty.com',
                plan: 'Real Estate Professional',
                status: 'active',
                amount: 199,
                nextPayment: '2024-02-12'
            },
            {
                id: 'sub_3',
                customerName: 'Elite Motors',
                customerEmail: 'billing@elitemotors.com',
                plan: 'Automotive Professional',
                status: 'active',
                amount: 499,
                nextPayment: '2024-02-18'
            },
            {
                id: 'sub_4',
                customerName: 'Luxury Properties LLC',
                customerEmail: 'billing@luxuryprops.com',
                plan: 'Real Estate Professional',
                status: 'active',
                amount: 199,
                nextPayment: '2024-02-20'
            }
        ];
    }

    generateMockAnalytics() {
        return {
            userGrowth: [100, 150, 200, 280, 350, 420, 500],
            revenueByIndustry: {
                automotive: 68013,
                realestate: 27018,
                enterprise: 37973
            }
        };
    }

    generateMockSystemStatus() {
        return {
            serverStatus: 'online',
            databaseStatus: 'connected',
            storageUsed: 48,
            cdnStatus: 'active'
        };
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
    
    // Modal close functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
        if (e.target.classList.contains('modal-close')) {
            e.target.closest('.modal').style.display = 'none';
        }
    });

    // Add dynamic styles for badges and action buttons
    const style = document.createElement('style');
    style.textContent = `
        .badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge.automotive { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .badge.realestate { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .badge.enterprise { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .badge.trialing { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .badge.canceled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        
        .action-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #e5e7eb;
            background: white;
            border-radius: 6px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .action-btn:hover {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.05);
        }
        
        .action-btn.secondary {
            background: #f9fafb;
        }
    `;
    document.head.appendChild(style);
});

// Export for global access
window.AdminDashboard = AdminDashboard;