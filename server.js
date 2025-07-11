const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

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
    res.sendFile(path.join(__dirname, 'public', 'editor.html'));
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

app.listen(PORT, () => {
    console.log(`SMeditor server running on port ${PORT}`);
    console.log(`Editor: http://localhost:${PORT}`);
});