# Static Motion Editor (SMeditor)

**Spatial Content Experience Platform**

Transform traditional 2D data presentation into immersive 3D spatial experiences using PlayCanvas engine. SMeditor allows content creators to build spatial worlds where users can explore data through QR codes or shareable links on their mobile devices.

## 🚀 Features

### For Content Creators
- **Drag & Drop Editor**: Intuitive interface for building spatial content
- **Template System**: Pre-built layouts (3x3 Grid, 2x2 Center, Linear, Circular)
- **World Types**: Flat world and Globe environments
- **Data Types**: Image, Text, Contact, Video, 3D Models
- **Brand Customization**: Logo, colors, and company branding
- **Real-time Preview**: See your spatial content before publishing
- **QR Code Generation**: Instant shareable links for mobile viewing

### For End Users
- **Mobile-Optimized**: Touch controls and responsive design
- **3D Navigation**: Pinch to zoom, drag to rotate
- **Interactive Containers**: Tap to explore content
- **AR Support**: View 3D models in augmented reality (coming soon)
- **Social Sharing**: WhatsApp, Email, Copy link
- **Fullscreen Mode**: Immersive viewing experience

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Engine**: PlayCanvas WebGL Engine
- **Backend**: Node.js, Express
- **File Upload**: Multer
- **QR Generation**: qrcode library
- **Mobile**: Touch-optimized UI/UX

## 📱 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd static-motion-editor

# Install dependencies
npm install

# Start the development server
npm run dev

# Or start in production mode
npm start
```

The SMeditor will be available at:
- **Editor**: http://localhost:3000
- **Viewer**: http://localhost:3000/viewer/{sceneId}

## 🎯 Usage Guide

### Creating Your First Spatial Experience

1. **Choose a Template**
   - Select from 4 layouts: 3x3 Grid, 2x2 Center, Linear, or Circular
   - Switch between Flat World and Globe World environments

2. **Add Content**
   - Drag colored data balls onto containers
   - Each ball represents a different content type:
     - 🔴 **Image**: Photos, graphics, artwork
     - 🟢 **Text**: Messages, descriptions, information
     - 🟡 **Contact**: Name, phone, email details
     - 🟣 **Video**: MP4 video content
     - 🟠 **3D Model**: GLB/GLTF models with AR support

3. **Customize Content**
   - Click containers to edit their content
   - Upload files, enter text, add contact information
   - Configure AR settings for 3D models

4. **Brand Your Experience**
   - Upload company logo
   - Set primary brand color
   - Add company name

5. **Preview & Publish**
   - Use the Preview button to see your 3D scene
   - Click Publish to generate QR code and shareable link
   - Share via mobile for spatial viewing

### Mobile Viewing Experience

Users scan QR codes or click links to:
- Explore 3D spatial content on their phones
- Tap containers to view detailed content
- Navigate with touch gestures
- Share experiences with others
- View 3D models in AR (when supported)

## 🏗 Architecture

### File Structure
```
static-motion-editor/
├── public/
│   ├── css/
│   │   ├── editor.css      # Editor interface styles
│   │   └── viewer.css      # Mobile viewer styles
│   ├── js/
│   │   ├── editor.js       # Editor functionality
│   │   └── viewer.js       # Mobile viewer logic
│   ├── editor.html         # Main editor interface
│   └── viewer.html         # Mobile viewer interface
├── uploads/                # User-uploaded files
├── server.js              # Express server
├── package.json           # Dependencies
└── README.md
```

### Data Flow
1. **Editor** → Create/edit spatial scenes
2. **Server** → Store scene data and generate QR codes
3. **Viewer** → Load and render scenes in 3D
4. **Mobile** → Touch interaction and content display

## 🎨 Customization

### Adding New Data Types
1. Add color definition in CSS
2. Update data ball creation in `editor.js`
3. Implement content generation in `viewer.js`
4. Add content editor UI in `showContentEditor()`

### Creating New Templates
1. Define layout positions in `getContainerPositions()`
2. Add template preview in HTML
3. Update container generation logic
4. Add CSS styles for layout

### Brand Customization
- Logo upload and display
- Primary color theming
- Company name integration
- Custom styling options

## 🚀 Production Deployment

### Environment Setup
```bash
# Set production environment
export NODE_ENV=production

# Install production dependencies only
npm install --production

# Start the server
npm start
```

### Recommended Hosting
- **Heroku**: Simple deployment with file storage
- **AWS**: S3 for file uploads, EC2 for server
- **DigitalOcean**: Droplets with volume storage
- **Vercel/Netlify**: Static assets with serverless functions

### Database Integration
For production, replace in-memory storage with:
- MongoDB for scene data
- PostgreSQL for structured data
- Redis for session management

## 📊 Performance Optimization

### Mobile Performance
- Optimized PlayCanvas settings
- Level-of-detail (LOD) for 3D models
- Compressed textures and assets
- Efficient touch controls

### Loading Speed
- Asset preloading
- Progressive enhancement
- Lazy loading for heavy content
- CDN for static assets

## 🔮 Future Enhancements

### Planned Features
- **AI-Powered Layouts**: Smart template suggestions
- **Multi-User Collaboration**: Team editing capabilities
- **Analytics Dashboard**: Engagement metrics
- **Advanced 3D Models**: Interactive hotspots and animations
- **WebXR Integration**: Full AR/VR support
- **Voice Navigation**: Audio-guided experiences

### Industry Expansions
- **Real Estate**: Virtual property tours
- **Automotive**: Interactive car showcases
- **E-commerce**: 3D product catalogs
- **Education**: Immersive learning experiences

## 📄 API Reference

### Scene Management
```javascript
// Create scene
POST /api/scenes
Content-Type: application/json
{
  "template": "grid-3x3",
  "world": "flat",
  "containers": {...},
  "brandSettings": {...}
}

// Get scene
GET /api/scenes/:sceneId

// Generate QR code
POST /api/qrcode/:sceneId
```

### File Upload
```javascript
// Upload file
POST /api/upload
Content-Type: multipart/form-data
FormData: file
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@staticmotion.com
- Documentation: [docs.staticmotion.com]

---

**Static Motion** - *Transforming data presentation through spatial experiences*