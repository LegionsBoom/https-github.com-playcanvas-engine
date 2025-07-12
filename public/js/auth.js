// Authentication Module for Static Motion
// Handles user authentication, signup, signin, and session management

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Sign up form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Sign in form
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => this.handleSignin(e));
        }

        // Sign out button
        const signoutBtn = document.getElementById('signout-btn');
        if (signoutBtn) {
            signoutBtn.addEventListener('click', () => this.handleSignout());
        }

        // Industry selection
        const industrySelect = document.getElementById('industry-select');
        if (industrySelect) {
            industrySelect.addEventListener('change', (e) => {
                this.updateIndustryFeatures(e.target.value);
            });
        }
    }

    async checkAuthState() {
        if (window.supabaseClient) {
            const user = await window.supabaseClient.getCurrentUser();
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                this.onUserAuthenticated(user);
            } else {
                this.onUserNotAuthenticated();
            }
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const fullName = formData.get('full_name');
        const companyName = formData.get('company_name');
        const userType = formData.get('user_type');
        const phone = formData.get('phone');

        this.showLoading(true);

        try {
            // Sign up with Supabase Auth
            const signupResult = await window.supabaseClient.signUp(email, password, {
                full_name: fullName,
                company_name: companyName,
                user_type: userType,
                phone: phone
            });

            if (signupResult.success) {
                // Create user profile in our database
                const profileResult = await window.supabaseClient.createUserProfile(
                    signupResult.data.user.id,
                    {
                        email: email,
                        full_name: fullName,
                        user_type: userType,
                        company_name: companyName,
                        phone: phone,
                        industry_focus: userType
                    }
                );

                if (profileResult.success) {
                    this.showSuccess('Account created successfully! Please check your email to verify your account.');
                    this.redirectToEditor();
                } else {
                    this.showError('Error creating user profile: ' + profileResult.error);
                }
            } else {
                this.showError('Signup failed: ' + signupResult.error);
            }
        } catch (error) {
            this.showError('An unexpected error occurred: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async handleSignin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        this.showLoading(true);

        try {
            const result = await window.supabaseClient.signIn(email, password);
            
            if (result.success) {
                this.currentUser = result.data.user;
                this.isAuthenticated = true;
                this.onUserAuthenticated(result.data.user);
                this.showSuccess('Welcome back!');
                this.redirectToEditor();
            } else {
                this.showError('Sign in failed: ' + result.error);
            }
        } catch (error) {
            this.showError('An unexpected error occurred: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async handleSignout() {
        try {
            const result = await window.supabaseClient.signOut();
            
            if (result.success) {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.onUserNotAuthenticated();
                this.showSuccess('Signed out successfully');
                this.redirectToHome();
            } else {
                this.showError('Sign out failed: ' + result.error);
            }
        } catch (error) {
            this.showError('An unexpected error occurred: ' + error.message);
        }
    }

    updateIndustryFeatures(industry) {
        const featuresContainer = document.getElementById('industry-features');
        if (!featuresContainer) return;

        const features = {
            automotive: [
                '🚗 Interactive Car Showcases',
                '🎨 Color Configurators',
                '📊 Vehicle Specifications',
                '💰 Pricing Calculators',
                '📍 Feature Hotspots',
                '🔄 360° Vehicle Views'
            ],
            realestate: [
                '🏠 Virtual Property Tours',
                '📐 Interactive Floor Plans',
                '🌳 Neighborhood Information',
                '📊 Property Details',
                '👥 Agent Contact Info',
                '📱 Mobile-Optimized Viewing'
            ]
        };

        const industryFeatures = features[industry] || [];
        
        featuresContainer.innerHTML = industryFeatures.map(feature => 
            `<div class="feature-item">${feature}</div>`
        ).join('');
    }

    onUserAuthenticated(user) {
        // Update UI for authenticated user
        const authElements = document.querySelectorAll('.auth-required');
        const guestElements = document.querySelectorAll('.guest-only');
        
        authElements.forEach(el => el.style.display = 'block');
        guestElements.forEach(el => el.style.display = 'none');

        // Update user info in header
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <div class="user-avatar">
                    ${user.user_metadata?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div class="user-details">
                    <div class="user-name">${user.user_metadata?.full_name || 'User'}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            `;
        }

        // Load user's scenes if on editor page
        if (window.smeditor) {
            this.loadUserScenes();
        }
    }

    onUserNotAuthenticated() {
        // Update UI for guest user
        const authElements = document.querySelectorAll('.auth-required');
        const guestElements = document.querySelectorAll('.guest-only');
        
        authElements.forEach(el => el.style.display = 'none');
        guestElements.forEach(el => el.style.display = 'block');

        // Clear user info
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.innerHTML = '';
        }
    }

    async loadUserScenes() {
        if (!window.supabaseClient || !this.currentUser) return;

        try {
            const result = await window.supabaseClient.getUserScenes(this.currentUser.id);
            
            if (result.success) {
                this.displayUserScenes(result.data);
            } else {
                console.error('Failed to load user scenes:', result.error);
            }
        } catch (error) {
            console.error('Error loading user scenes:', error);
        }
    }

    displayUserScenes(scenes) {
        const scenesContainer = document.getElementById('user-scenes');
        if (!scenesContainer) return;

        if (scenes.length === 0) {
            scenesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎨</div>
                    <h3>No scenes yet</h3>
                    <p>Create your first spatial experience to get started!</p>
                    <button class="btn-primary" onclick="window.location.href='/editor'">
                        Create Your First Scene
                    </button>
                </div>
            `;
            return;
        }

        scenesContainer.innerHTML = scenes.map(scene => `
            <div class="scene-card" data-scene-id="${scene.id}">
                <div class="scene-preview">
                    <div class="scene-template">${scene.template_type}</div>
                </div>
                <div class="scene-info">
                    <h4>${scene.title}</h4>
                    <p>${scene.description || 'No description'}</p>
                    <div class="scene-meta">
                        <span class="scene-status ${scene.published ? 'published' : 'draft'}">
                            ${scene.published ? 'Published' : 'Draft'}
                        </span>
                        <span class="scene-date">${this.formatDate(scene.created_at)}</span>
                    </div>
                </div>
                <div class="scene-actions">
                    <button class="btn-secondary" onclick="window.location.href='/editor?scene=${scene.id}'">
                        Edit
                    </button>
                    <button class="btn-primary" onclick="window.location.href='/viewer/${scene.id}'">
                        View
                    </button>
                </div>
            </div>
        `).join('');
    }

    redirectToEditor() {
        if (window.location.pathname !== '/editor') {
            window.location.href = '/editor';
        }
    }

    redirectToHome() {
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    }

    showLoading(show) {
        const loadingElements = document.querySelectorAll('.loading-spinner');
        loadingElements.forEach(el => {
            el.style.display = show ? 'block' : 'none';
        });

        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(btn => {
            btn.disabled = show;
            btn.textContent = show ? 'Loading...' : btn.dataset.originalText || 'Submit';
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
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize Auth Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
} 