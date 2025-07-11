-- Static Motion SaaS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Types Enum
CREATE TYPE user_type AS ENUM ('automotive', 'realestate', 'enterprise', 'superadmin');

-- Subscription Status Enum
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'unpaid', 'trialing');

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
    containers JSONB DEFAULT '{}',
    brand_settings JSONB DEFAULT '{}',
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scene Analytics Table
CREATE TABLE public.scene_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id UUID REFERENCES public.scenes(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip_address INET,
    country TEXT,
    device_type TEXT, -- 'mobile', 'tablet', 'desktop'
    interaction_type TEXT, -- 'view', 'container_click', 'share', 'ar_view'
    interaction_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets Table (uploaded files)
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES public.scenes(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    asset_type TEXT NOT NULL, -- 'image', 'video', '3d-model', 'document'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates Table (pre-built layouts)
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Analytics Table
CREATE TABLE public.usage_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL, -- 'scenes_created', 'scenes_published', 'storage_used'
    metric_value NUMERIC NOT NULL,
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
CREATE INDEX idx_scene_analytics_scene_id ON public.scene_analytics(scene_id);
CREATE INDEX idx_scene_analytics_timestamp ON public.scene_analytics(timestamp);
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_scene_id ON public.assets(scene_id);
CREATE INDEX idx_templates_industry_type ON public.templates(industry_type);
CREATE INDEX idx_usage_analytics_user_id_date ON public.usage_analytics(user_id, date);

-- Sample data for testing
INSERT INTO public.templates (name, description, industry_type, template_data, preview_image) VALUES
('Automotive Showcase', 'Perfect for displaying vehicle features and specifications', 'automotive', '{"layout": "grid-3x3", "containers": 9, "suggested_content": ["vehicle-specs", "color-picker", "pricing"]}', '/templates/automotive-showcase.jpg'),
('Property Tour', 'Ideal for real estate virtual tours and property details', 'realestate', '{"layout": "grid-2x2", "containers": 4, "suggested_content": ["property-details", "virtual-tour", "agent-contact"]}', '/templates/property-tour.jpg'),
('Feature Gallery', 'General purpose layout for showcasing products or services', 'automotive', '{"layout": "linear", "containers": 5, "suggested_content": ["image", "text", "video"]}', '/templates/feature-gallery.jpg');

-- Create superadmin user function
CREATE OR REPLACE FUNCTION create_superadmin(admin_email TEXT, admin_password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- This would typically be called from a migration or setup script
    -- In practice, create the auth user first via Supabase Auth, then update the user_type
    RETURN 'Superadmin setup instructions: Create user via Supabase Auth, then update user_type to superadmin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;