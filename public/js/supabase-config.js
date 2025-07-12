/**
 * Supabase Configuration
 * Centralized configuration for Supabase and Meshroom integration
 */

// Supabase Configuration
const SUPABASE_CONFIG = {
    // Replace with your actual Supabase credentials
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key',
    
    // Meshroom Integration Settings
    meshroom: {
        apiUrl: 'https://meshroom-api.your-domain.com', // Your Meshroom API endpoint
        processingTimeout: 300000, // 5 minutes
        maxFileSize: 50 * 1024 * 1024, // 50MB
        supportedFormats: ['jpg', 'jpeg', 'png', 'tiff'],
        qualityPresets: {
            low: { photos: 20, resolution: 'medium' },
            medium: { photos: 40, resolution: 'high' },
            high: { photos: 80, resolution: 'ultra' }
        }
    },
    
    // Storage Buckets
    storage: {
        assets: 'assets',
        scans: 'scans',
        models: 'models',
        textures: 'textures'
    },
    
    // Real-time Channels
    channels: {
        sceneUpdates: 'scene_updates',
        analyticsUpdates: 'analytics_updates',
        scanProgress: 'scan_progress',
        modelProcessing: 'model_processing'
    }
};

// Environment-based configuration
const getSupabaseConfig = () => {
    // Check for environment variables (for production)
    if (typeof process !== 'undefined' && process.env) {
        return {
            url: process.env.SUPABASE_URL || SUPABASE_CONFIG.url,
            anonKey: process.env.SUPABASE_ANON_KEY || SUPABASE_CONFIG.anonKey,
            meshroom: {
                ...SUPABASE_CONFIG.meshroom,
                apiUrl: process.env.MESHROOM_API_URL || SUPABASE_CONFIG.meshroom.apiUrl
            }
        };
    }
    
    // Check for window variables (for browser)
    if (typeof window !== 'undefined' && window.SUPABASE_CONFIG) {
        return {
            ...SUPABASE_CONFIG,
            ...window.SUPABASE_CONFIG
        };
    }
    
    return SUPABASE_CONFIG;
};

// Initialize Supabase Client
const initializeSupabase = () => {
    const config = getSupabaseConfig();
    
    if (typeof window !== 'undefined' && window.supabase) {
        // Supabase already loaded
        return window.supabase.createClient(config.url, config.anonKey);
    }
    
    console.warn('Supabase client not found. Make sure to include the Supabase script.');
    return null;
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, getSupabaseConfig, initializeSupabase };
} else if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.getSupabaseConfig = getSupabaseConfig;
    window.initializeSupabase = initializeSupabase;
} 