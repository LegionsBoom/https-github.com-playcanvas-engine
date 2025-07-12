const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// In-memory storage for scenes (use database in production)
const scenes = new Map();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.get('/viewer/:sceneId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewer.html'));
});

// API Routes
app.post('/api/scenes', (req, res) => {
    const sceneId = uuidv4();
    const scene = {
        id: sceneId,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    scenes.set(sceneId, scene);
    
    res.json({ sceneId, scene });
});

app.get('/api/scenes/:sceneId', (req, res) => {
    const scene = scenes.get(req.params.sceneId);
    if (!scene) {
        return res.status(404).json({ error: 'Scene not found' });
    }
    res.json(scene);
});

app.post('/api/qrcode/:sceneId', async (req, res) => {
    try {
        const sceneUrl = `${req.protocol}://${req.get('host')}/viewer/${req.params.sceneId}`;
        const qrCode = await QRCode.toDataURL(sceneUrl);
        res.json({ qrCode, url: sceneUrl });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// Supabase API Endpoints
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, userData } = req.body;
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });

        if (error) throw error;

        // Create user profile
        if (data.user) {
            const { error: profileError } = await supabase
                .from('users')
                .insert([{
                    id: data.user.id,
                    email: email,
                    full_name: userData.full_name,
                    user_type: userData.user_type,
                    company_name: userData.company_name,
                    phone: userData.phone,
                    industry_focus: userData.user_type
                }]);

            if (profileError) {
                console.error('Profile creation error:', profileError);
            }
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/signout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Signout error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/user/profile', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;

        res.json({ success: true, data: profile });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/scenes', async (req, res) => {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const sceneData = req.body;
        const { data, error } = await supabase
            .from('scenes')
            .insert([{
                user_id: user.id,
                title: sceneData.title || 'Untitled Scene',
                description: sceneData.description || '',
                industry_type: sceneData.industry_type || 'general',
                template_type: sceneData.template_type || 'grid-3x3',
                world_type: sceneData.world_type || 'flat',
                physics_mode: sceneData.physics_mode || 'floating',
                containers: sceneData.containers || {},
                brand_settings: sceneData.brand_settings || {}
            }])
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Create scene error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/scenes/:sceneId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('scenes')
            .select('*')
            .eq('id', req.params.sceneId)
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Get scene error:', error);
        res.status(404).json({ error: 'Scene not found' });
    }
});

app.put('/api/scenes/:sceneId', async (req, res) => {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabase
            .from('scenes')
            .update(req.body)
            .eq('id', req.params.sceneId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Update scene error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/scenes/:sceneId/publish', async (req, res) => {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabase
            .from('scenes')
            .update({
                published: true,
                published_at: new Date().toISOString()
            })
            .eq('id', req.params.sceneId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Publish scene error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/user/scenes', async (req, res) => {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabase
            .from('scenes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Get user scenes error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/analytics/track', async (req, res) => {
    try {
        const { sceneId, interactionType, interactionData } = req.body;
        
        const { data, error } = await supabase
            .from('scene_analytics')
            .insert([{
                scene_id: sceneId,
                user_agent: req.headers['user-agent'],
                ip_address: req.ip,
                device_type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
                interaction_type: interactionType,
                interaction_data: interactionData
            }]);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Track analytics error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`SMeditor server running on port ${PORT}`);
    console.log(`Editor: http://localhost:${PORT}`);
});