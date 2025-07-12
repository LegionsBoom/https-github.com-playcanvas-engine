// Supabase Client Configuration
// This file handles all Supabase database connections and API calls

class SupabaseClient {
    constructor() {
        // Initialize Supabase client
        this.supabase = window.supabase;
        
        if (!this.supabase) {
            console.error('Supabase client not found. Make sure to include the Supabase script.');
            return;
        }

        this.init();
    }

    init() {
        // Set up auth state listener
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.onUserSignIn(session);
            } else if (event === 'SIGNED_OUT') {
                this.onUserSignOut();
            }
        });

        // Check if user is already signed in
        this.getCurrentUser();
    }

    // Authentication Methods
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    // User Profile Methods
    async createUserProfile(userId, profileData) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([{
                    id: userId,
                    email: profileData.email,
                    full_name: profileData.full_name,
                    user_type: profileData.user_type,
                    company_name: profileData.company_name,
                    phone: profileData.phone,
                    industry_focus: profileData.industry_focus
                }]);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create user profile error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get user profile error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update(updates)
                .eq('id', userId);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update user profile error:', error);
            return { success: false, error: error.message };
        }
    }

    // Scene Management Methods
    async createScene(sceneData) {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await this.supabase
                .from('scenes')
                .insert([{
                    user_id: user.id,
                    title: sceneData.title,
                    description: sceneData.description,
                    industry_type: sceneData.industry_type,
                    template_type: sceneData.template_type,
                    world_type: sceneData.world_type,
                    physics_mode: sceneData.physics_mode,
                    containers: sceneData.containers,
                    brand_settings: sceneData.brand_settings
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create scene error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateScene(sceneId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('scenes')
                .update(updates)
                .eq('id', sceneId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update scene error:', error);
            return { success: false, error: error.message };
        }
    }

    async getScene(sceneId) {
        try {
            const { data, error } = await this.supabase
                .from('scenes')
                .select('*')
                .eq('id', sceneId)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get scene error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserScenes(userId) {
        try {
            const { data, error } = await this.supabase
                .from('scenes')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get user scenes error:', error);
            return { success: false, error: error.message };
        }
    }

    async publishScene(sceneId) {
        try {
            const { data, error } = await this.supabase
                .from('scenes')
                .update({
                    published: true,
                    published_at: new Date().toISOString()
                })
                .eq('id', sceneId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Publish scene error:', error);
            return { success: false, error: error.message };
        }
    }

    // Asset Management Methods
    async uploadAsset(file, sceneId = null) {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `assets/${user.id}/${fileName}`;

            // Upload file to Supabase Storage
            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            // Create asset record in database
            const { data, error } = await this.supabase
                .from('assets')
                .insert([{
                    user_id: user.id,
                    scene_id: sceneId,
                    filename: fileName,
                    original_name: file.name,
                    mime_type: file.type,
                    file_size: file.size,
                    file_url: urlData.publicUrl,
                    asset_type: this.getAssetType(file.type)
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Upload asset error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserAssets(userId) {
        try {
            const { data, error } = await this.supabase
                .from('assets')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get user assets error:', error);
            return { success: false, error: error.message };
        }
    }

    // Analytics Methods
    async trackSceneView(sceneId, analyticsData = {}) {
        try {
            const { data, error } = await this.supabase
                .from('scene_analytics')
                .insert([{
                    scene_id: sceneId,
                    user_agent: navigator.userAgent,
                    ip_address: analyticsData.ip_address,
                    country: analyticsData.country,
                    device_type: this.getDeviceType(),
                    interaction_type: 'view',
                    interaction_data: analyticsData
                }]);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Track scene view error:', error);
            return { success: false, error: error.message };
        }
    }

    async trackInteraction(sceneId, interactionType, interactionData = {}) {
        try {
            const { data, error } = await this.supabase
                .from('scene_analytics')
                .insert([{
                    scene_id: sceneId,
                    user_agent: navigator.userAgent,
                    device_type: this.getDeviceType(),
                    interaction_type: interactionType,
                    interaction_data: interactionData
                }]);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Track interaction error:', error);
            return { success: false, error: error.message };
        }
    }

    // Template Methods
    async getTemplates(industryType = null) {
        try {
            let query = this.supabase
                .from('templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (industryType) {
                query = query.eq('industry_type', industryType);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get templates error:', error);
            return { success: false, error: error.message };
        }
    }

    // Subscription Methods
    async getUserSubscription(userId) {
        try {
            const { data, error } = await this.supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get user subscription error:', error);
            return { success: false, error: error.message };
        }
    }

    // Utility Methods
    getAssetType(mimeType) {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.includes('model') || mimeType.includes('gltf')) return '3d-model';
        return 'document';
    }

    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile/.test(userAgent)) return 'mobile';
        if (/tablet/.test(userAgent)) return 'tablet';
        return 'desktop';
    }

    // Event Handlers
    onUserSignIn(session) {
        console.log('User signed in:', session.user);
        // Trigger any necessary UI updates
        if (window.onUserSignIn) {
            window.onUserSignIn(session);
        }
    }

    onUserSignOut() {
        console.log('User signed out');
        // Trigger any necessary UI updates
        if (window.onUserSignOut) {
            window.onUserSignOut();
        }
    }
}

// Initialize Supabase client when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Supabase script is loaded
    if (typeof window.supabase !== 'undefined') {
        window.supabaseClient = new SupabaseClient();
    } else {
        console.error('Supabase script not loaded. Please include the Supabase CDN script.');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseClient;
} 