-- Static Motion SaaS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Types Enum
CREATE TYPE user_type AS ENUM ('automotive', 'realestate', 'enterprise', 'superadmin');

-- Subscription Status Enum
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'unpaid', 'trialing');

-- Scene Status Enum
CREATE TYPE scene_status AS ENUM ('draft', 'published', 'archived', 'featured');

-- Asset Types Enum
CREATE TYPE asset_type AS ENUM ('image', 'video', '3d-model', 'document', 'audio', 'spatial-audio', 'ar-asset');

-- Interaction Types Enum
CREATE TYPE interaction_type AS ENUM ('view', 'container_click', 'share', 'ar_view', 'voice_command', 'gesture', 'camera_path', 'audio_play', 'ai_suggestion');

-- Users Table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    user_type user_type NOT NULL DEFAULT 'automotive',
    company_name TEXT,
    phone TEXT,
    industry_focus TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}', -- AI learning data, UI preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT NOT NULL,
    status subscription_status NOT NULL DEFAULT 'trialing',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations Table (for enterprise customers)
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization Members Table
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'member', 'viewer'
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(organization_id, user_id)
);

-- Scenes Table (spatial content experiences)
CREATE TABLE public.scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    industry_type user_type NOT NULL,
    template_type TEXT NOT NULL, -- 'grid-3x3', 'grid-2x2', etc.
    world_type TEXT NOT NULL DEFAULT 'flat', -- 'flat', 'globe'
    physics_mode TEXT DEFAULT 'floating',
    status scene_status DEFAULT 'draft',
    containers JSONB DEFAULT '{}',
    brand_settings JSONB DEFAULT '{}',
    
    -- Advanced Features Support
    spatial_audio_settings JSONB DEFAULT '{}', -- Audio environment, soundscapes
    ai_features_enabled BOOLEAN DEFAULT TRUE,
    mobile_ar_enabled BOOLEAN DEFAULT TRUE,
    camera_paths JSONB DEFAULT '[]', -- Cinematic camera paths
    post_processing JSONB DEFAULT '{}', -- Bloom, SSAO, effects
    particle_systems JSONB DEFAULT '[]', -- Particle effects
    scene_graph JSONB DEFAULT '{}', -- Hierarchical scene structure
    spatial_ui JSONB DEFAULT '[]', -- Holographic panels, 3D buttons
    
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scene Analytics Table (Enhanced)
CREATE TABLE public.scene_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id UUID REFERENCES public.scenes(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip_address INET,
    country TEXT,
    device_type TEXT, -- 'mobile', 'tablet', 'desktop', 'vr', 'ar'
    interaction_type interaction_type NOT NULL,
    interaction_data JSONB, -- Detailed interaction data
    session_duration INTEGER, -- Session duration in seconds
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets Table (Enhanced for spatial content)
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES public.scenes(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    asset_type asset_type NOT NULL,
    metadata JSONB DEFAULT '{}', -- Spatial positioning, audio settings, etc.
    
    -- Spatial Asset Properties
    spatial_position JSONB, -- {x, y, z} coordinates
    spatial_rotation JSONB, -- {x, y, z} rotation
    spatial_scale JSONB, -- {x, y, z} scale
    spatial_audio_settings JSONB, -- Audio source properties
    ar_compatible BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates Table (Enhanced)
CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    industry_type user_type NOT NULL,
    template_data JSONB NOT NULL,
    preview_image TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.users(id),
    usage_count INTEGER DEFAULT 0,
    
    -- Advanced Template Features
    spatial_audio_template JSONB, -- Pre-configured audio environments
    ai_suggestions JSONB, -- AI-powered content suggestions
    camera_paths JSONB, -- Pre-built camera paths
    post_processing_preset JSONB, -- Visual effects presets
    mobile_ar_features JSONB, -- AR-specific features
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Learning Data Table
CREATE TABLE public.ai_learning_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES public.scenes(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'layout_created', 'content_added', 'camera_path_used'
    action_data JSONB NOT NULL, -- Detailed action information
    context JSONB, -- Scene context, user preferences
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spatial Audio Environments Table
CREATE TABLE public.spatial_audio_environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    environment_type TEXT NOT NULL, -- 'showroom', 'outdoor', 'night', 'dynamic'
    audio_tracks JSONB NOT NULL, -- Array of audio track configurations
    volume_settings JSONB DEFAULT '{}',
    reverb_settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Camera Paths Table
CREATE TABLE public.camera_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    path_type TEXT NOT NULL, -- 'showroom-intro', 'vehicle-focus', 'drone-overview'
    keyframes JSONB NOT NULL, -- Array of camera keyframes
    duration INTEGER NOT NULL, -- Duration in milliseconds
    easing_type TEXT DEFAULT 'easeInOutCubic',
    created_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post-Processing Presets Table
CREATE TABLE public.post_processing_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    preset_type TEXT NOT NULL, -- 'cinematic', 'holographic', 'neon', 'realistic'
    bloom_settings JSONB DEFAULT '{}',
    ssao_settings JSONB DEFAULT '{}',
    motion_blur_settings JSONB DEFAULT '{}',
    depth_of_field_settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Particle System Presets Table
CREATE TABLE public.particle_system_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    particle_type TEXT NOT NULL, -- 'sparkles', 'smoke', 'light-rays', 'car-reveal'
    particle_settings JSONB NOT NULL,
    emission_settings JSONB DEFAULT '{}',
    lifetime_settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Commands Table
CREATE TABLE public.voice_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    command_text TEXT NOT NULL,
    command_type TEXT NOT NULL, -- 'layout', 'camera', 'audio', 'ai'
    parameters JSONB, -- Extracted command parameters
    success_rate NUMERIC DEFAULT 0, -- Success rate percentage
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mobile AR Sessions Table
CREATE TABLE public.mobile_ar_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES public.scenes(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL, -- 'ar', 'vr', 'mobile'
    device_info JSONB, -- Device capabilities, orientation
    gesture_data JSONB, -- Gesture interactions
    session_duration INTEGER, -- Duration in seconds
    interactions_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Usage Analytics Table (Enhanced)
CREATE TABLE public.usage_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL, -- 'scenes_created', 'scenes_published', 'storage_used', 'ai_suggestions_used', 'ar_sessions'
    metric_value NUMERIC NOT NULL,
    metric_data JSONB, -- Additional metric data
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, metric_name, date)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spatial_audio_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camera_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_processing_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.particle_system_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_ar_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: users can view their own
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (user_id = auth.uid());

-- Organizations: members can view, owners can manage
CREATE POLICY "Organization members can view" ON public.organizations
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
    );

-- Scenes: users can manage their own scenes
CREATE POLICY "Users can manage own scenes" ON public.scenes
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Public can view published scenes" ON public.scenes
    FOR SELECT USING (published = true);

-- Assets: users can manage their own assets
CREATE POLICY "Users can manage own assets" ON public.assets
    FOR ALL USING (user_id = auth.uid());

-- Templates: all authenticated users can view
CREATE POLICY "Authenticated users can view templates" ON public.templates
    FOR SELECT USING (auth.role() = 'authenticated');

-- AI Learning Data: users can manage their own
CREATE POLICY "Users can manage own AI data" ON public.ai_learning_data
    FOR ALL USING (user_id = auth.uid());

-- Spatial Audio: users can view public, manage own
CREATE POLICY "Users can view public audio environments" ON public.spatial_audio_environments
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can manage own audio environments" ON public.spatial_audio_environments
    FOR ALL USING (created_by = auth.uid());

-- Camera Paths: users can view public, manage own
CREATE POLICY "Users can view public camera paths" ON public.camera_paths
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can manage own camera paths" ON public.camera_paths
    FOR ALL USING (created_by = auth.uid());

-- Post-Processing Presets: users can view public, manage own
CREATE POLICY "Users can view public presets" ON public.post_processing_presets
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can manage own presets" ON public.post_processing_presets
    FOR ALL USING (created_by = auth.uid());

-- Particle System Presets: users can view public, manage own
CREATE POLICY "Users can view public particle presets" ON public.particle_system_presets
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can manage own particle presets" ON public.particle_system_presets
    FOR ALL USING (created_by = auth.uid());

-- Voice Commands: users can manage their own
CREATE POLICY "Users can manage own voice commands" ON public.voice_commands
    FOR ALL USING (user_id = auth.uid());

-- Mobile AR Sessions: users can manage their own
CREATE POLICY "Users can manage own AR sessions" ON public.mobile_ar_sessions
    FOR ALL USING (user_id = auth.uid());

-- Superadmin access to everything
CREATE POLICY "Superadmin full access" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND user_type = 'superadmin'
        )
    );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_organizations_updated_at BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_scenes_updated_at BEFORE UPDATE ON public.scenes
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Indexes for performance
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_scenes_user_id ON public.scenes(user_id);
CREATE INDEX idx_scenes_published ON public.scenes(published);
CREATE INDEX idx_scenes_industry_type ON public.scenes(industry_type);
CREATE INDEX idx_scenes_status ON public.scenes(status);
CREATE INDEX idx_scene_analytics_scene_id ON public.scene_analytics(scene_id);
CREATE INDEX idx_scene_analytics_timestamp ON public.scene_analytics(timestamp);
CREATE INDEX idx_scene_analytics_interaction_type ON public.scene_analytics(interaction_type);
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_scene_id ON public.assets(scene_id);
CREATE INDEX idx_assets_asset_type ON public.assets(asset_type);
CREATE INDEX idx_templates_industry_type ON public.templates(industry_type);
CREATE INDEX idx_usage_analytics_user_id_date ON public.usage_analytics(user_id, date);
CREATE INDEX idx_ai_learning_data_user_id ON public.ai_learning_data(user_id);
CREATE INDEX idx_ai_learning_data_action_type ON public.ai_learning_data(action_type);
CREATE INDEX idx_voice_commands_user_id ON public.voice_commands(user_id);
CREATE INDEX idx_mobile_ar_sessions_user_id ON public.mobile_ar_sessions(user_id);

-- Sample data for testing (Enhanced)
INSERT INTO public.templates (name, description, industry_type, template_data, spatial_audio_template, ai_suggestions, camera_paths, post_processing_preset, mobile_ar_features) VALUES
('Automotive Showcase Pro', 'Advanced automotive showcase with spatial audio and AI features', 'automotive', 
 '{"layout": "grid-3x3", "containers": 9, "suggested_content": ["vehicle-specs", "color-picker", "pricing"]}',
 '{"environment": "showroom", "tracks": ["ambient_music", "crowd_murmur"], "volume": 0.6}',
 '{"suggestions": ["Add vehicle specifications", "Include color picker", "Add pricing calculator"]}',
 '{"paths": ["showroom-intro", "vehicle-focus", "drone-overview"]}',
 '{"bloom": true, "ssao": true, "motion_blur": false, "holographic": true}',
 '{"gestures_enabled": true, "ar_support": true, "voice_commands": true}'),

('Property Tour Pro', 'Immersive real estate tour with AR features', 'realestate', 
 '{"layout": "grid-2x2", "containers": 4, "suggested_content": ["property-details", "virtual-tour", "agent-contact"]}',
 '{"environment": "outdoor", "tracks": ["wind", "traffic", "birds"], "volume": 0.5}',
 '{"suggestions": ["Add property details", "Include virtual tour", "Add agent contact"]}',
 '{"paths": ["interior-walkthrough", "outdoor-overview"]}',
 '{"bloom": true, "ssao": true, "motion_blur": true, "realistic": true}',
 '{"gestures_enabled": true, "ar_support": true, "voice_commands": true}'),

('Feature Gallery Pro', 'Professional gallery with advanced effects', 'automotive', 
 '{"layout": "linear", "containers": 5, "suggested_content": ["image", "text", "video"]}',
 '{"environment": "dynamic", "tracks": ["interactive_beeps", "hover_sounds"], "volume": 0.7}',
 '{"suggestions": ["Add product images", "Include feature descriptions", "Add demo videos"]}',
 '{"paths": ["dynamic-action", "cinematic-intro"]}',
 '{"bloom": true, "ssao": false, "motion_blur": true, "neon": true}',
 '{"gestures_enabled": true, "ar_support": false, "voice_commands": true}');

-- Insert sample spatial audio environments
INSERT INTO public.spatial_audio_environments (name, description, environment_type, audio_tracks, volume_settings, reverb_settings, is_public) VALUES
('Car Showroom', 'Elegant showroom atmosphere with subtle ambient music', 'showroom',
 '["ambient_music", "crowd_murmur", "footsteps"]',
 '{"master": 0.7, "ambient": 0.4, "reverb": 0.3}',
 '{"level": 0.3, "decay": 2.0, "preDelay": 0.1}',
 true),

('Outdoor Display', 'Natural outdoor environment with wind and traffic', 'outdoor',
 '["wind", "traffic", "birds", "leaves"]',
 '{"master": 0.6, "ambient": 0.5, "reverb": 0.1}',
 '{"level": 0.1, "decay": 1.0, "preDelay": 0.05}',
 true),

('Night Mode', 'Quiet night atmosphere with distant city sounds', 'night',
 '["night_ambience", "distant_traffic", "crickets"]',
 '{"master": 0.5, "ambient": 0.4, "reverb": 0.2}',
 '{"level": 0.2, "decay": 1.5, "preDelay": 0.08}',
 true);

-- Insert sample camera paths
INSERT INTO public.camera_paths (name, description, path_type, keyframes, duration, easing_type, is_public) VALUES
('Showroom Introduction', 'Cinematic introduction to the showroom', 'showroom-intro',
 '[{"time": 0, "position": {"x": 15, "y": 8, "z": 15}, "target": {"x": 0, "y": 2, "z": 0}, "fov": 45},
   {"time": 2000, "position": {"x": 8, "y": 4, "z": 8}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 60},
   {"time": 4000, "position": {"x": 5, "y": 3, "z": 5}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 70},
   {"time": 6000, "position": {"x": 3, "y": 2, "z": 3}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 80},
   {"time": 8000, "position": {"x": 5, "y": 3, "z": 5}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 60}]',
 8000, 'easeInOutCubic', true),

('Vehicle Focus', 'Focus on vehicle features', 'vehicle-focus',
 '[{"time": 0, "position": {"x": 5, "y": 3, "z": 5}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 60},
   {"time": 1500, "position": {"x": 3, "y": 2, "z": 0}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 70},
   {"time": 3000, "position": {"x": -3, "y": 2, "z": 0}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 70},
   {"time": 4500, "position": {"x": 0, "y": 4, "z": 3}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 65},
   {"time": 6000, "position": {"x": 5, "y": 3, "z": 5}, "target": {"x": 0, "y": 1, "z": 0}, "fov": 60}]',
 6000, 'easeInOutQuart', true);

-- Insert sample post-processing presets
INSERT INTO public.post_processing_presets (name, description, preset_type, bloom_settings, ssao_settings, motion_blur_settings, depth_of_field_settings, is_public) VALUES
('Cinematic', 'Professional cinematic look', 'cinematic',
 '{"enabled": true, "intensity": 0.8, "threshold": 0.7, "radius": 0.8}',
 '{"enabled": true, "radius": 0.5, "intensity": 0.8, "bias": 0.025}',
 '{"enabled": true, "samples": 16, "intensity": 0.5}',
 '{"enabled": true, "focalDistance": 10, "focalRange": 5, "bokehScale": 2}',
 true),

('Holographic', 'Futuristic holographic effect', 'holographic',
 '{"enabled": true, "intensity": 1.2, "threshold": 0.5, "radius": 1.0}',
 '{"enabled": false}',
 '{"enabled": false}',
 '{"enabled": false}',
 true),

('Neon', 'Vibrant neon aesthetic', 'neon',
 '{"enabled": true, "intensity": 1.5, "threshold": 0.3, "radius": 1.2}',
 '{"enabled": true, "radius": 0.3, "intensity": 0.6, "bias": 0.01}',
 '{"enabled": false}',
 '{"enabled": false}',
 true);

-- Create superadmin user function
CREATE OR REPLACE FUNCTION create_superadmin(admin_email TEXT, admin_password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- This would typically be called from a migration or setup script
    -- In practice, create the auth user first via Supabase Auth, then update the user_type
    RETURN 'Superadmin setup instructions: Create user via Supabase Auth, then update user_type to superadmin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;