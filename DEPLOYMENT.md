# 🚀 Deployment Guide - Static Motion Platform

## 📋 Prerequisites

- Node.js 16+ installed
- Supabase account and project
- Meshroom installed (for local processing) or Meshroom API endpoint
- Git repository access

## 🔧 Step 1: Configure Supabase

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 1.2 Set Up Database Schema
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the complete schema from `database/schema.sql`
4. Verify all tables are created successfully

### 1.3 Configure Storage Buckets
1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - `assets` (for general assets)
   - `scans` (for 3D scan photos)
   - `models` (for processed 3D models)
   - `textures` (for model textures)

3. Set bucket policies:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public downloads for published content
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id IN ('assets', 'models'));
```

### 1.4 Enable Real-time Features
1. Go to Database > Replication
2. Enable real-time for:
   - `scenes`
   - `scene_analytics`
   - `assets`
   - `model_processing_jobs`

## 🔧 Step 2: Configure Meshroom Integration

### 2.1 Local Meshroom Setup (Recommended for Development)
1. Download Meshroom from [alicevision.org](https://alicevision.org)
2. Install Meshroom on your server
3. Set up Meshroom API server:

```bash
# Install Meshroom API dependencies
pip install fastapi uvicorn python-multipart

# Create meshroom-api.py
cat > meshroom-api.py << 'EOF'
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
import subprocess
import os
import tempfile
import shutil
from pathlib import Path

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "meshroom": "available"}

@app.post("/process")
async def process_photos(
    photos: list[UploadFile] = File(...),
    quality: str = Form("medium"),
    format: str = Form("glb"),
    optimize: bool = Form(True),
    generate_texture: bool = Form(True)
):
    # Create temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        # Save uploaded photos
        photo_paths = []
        for i, photo in enumerate(photos):
            photo_path = os.path.join(temp_dir, f"photo_{i:04d}.jpg")
            with open(photo_path, "wb") as f:
                f.write(photo.file.read())
            photo_paths.append(photo_path)
        
        # Run Meshroom processing
        output_dir = os.path.join(temp_dir, "output")
        os.makedirs(output_dir, exist_ok=True)
        
        # Meshroom command
        cmd = [
            "meshroom_batch",
            "--input", temp_dir,
            "--output", output_dir,
            "--quality", quality,
            "--format", format
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            return {"error": result.stderr}
        
        # Find generated model
        model_file = None
        for file in os.listdir(output_dir):
            if file.endswith(f".{format}"):
                model_file = os.path.join(output_dir, file)
                break
        
        if not model_file:
            return {"error": "No model generated"}
        
        # Return model file
        return FileResponse(
            model_file,
            media_type="model/gltf-binary",
            filename=f"model.{format}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
EOF

# Run Meshroom API server
python meshroom-api.py
```

### 2.2 Cloud Meshroom Setup (Production)
1. Set up a cloud server with Meshroom
2. Configure the API endpoint in `public/js/supabase-config.js`
3. Set up proper authentication and rate limiting

## 🔧 Step 3: Update Configuration

### 3.1 Update Supabase Configuration
Edit `public/js/supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-actual-project.supabase.co',
    anonKey: 'your-actual-anon-key',
    
    meshroom: {
        apiUrl: 'http://localhost:8001', // or your cloud endpoint
        processingTimeout: 300000,
        maxFileSize: 50 * 1024 * 1024,
        supportedFormats: ['jpg', 'jpeg', 'png', 'tiff'],
        qualityPresets: {
            low: { photos: 20, resolution: 'medium' },
            medium: { photos: 40, resolution: 'high' },
            high: { photos: 80, resolution: 'ultra' }
        }
    }
};
```

### 3.2 Environment Variables (Production)
For production, set environment variables:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export MESHROOM_API_URL="https://meshroom-api.your-domain.com"
```

## 🔧 Step 4: Test Integration

### 4.1 Run Test Script
Create `test-integration.js`:

```javascript
// Test Supabase connection
async function testSupabase() {
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) throw error;
        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error);
        return false;
    }
}

// Test Meshroom connection
async function testMeshroom() {
    try {
        const response = await fetch(`${config.meshroom.apiUrl}/health`);
        if (response.ok) {
            console.log('✅ Meshroom API connection successful');
            return true;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Meshroom API connection failed:', error);
        return false;
    }
}

// Test 3D scanner
async function testScanner() {
    try {
        if (window.Scanner3DIntegration) {
            console.log('✅ 3D Scanner integration available');
            return true;
        } else {
            throw new Error('Scanner integration not found');
        }
    } catch (error) {
        console.error('❌ 3D Scanner test failed:', error);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🧪 Running integration tests...');
    
    const results = {
        supabase: await testSupabase(),
        meshroom: await testMeshroom(),
        scanner: await testScanner()
    };
    
    console.log('\n📊 Test Results:');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test}`);
    });
    
    const allPassed = Object.values(results).every(Boolean);
    console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'}`);
    
    return allPassed;
}

// Run tests when page loads
document.addEventListener('DOMContentLoaded', runTests);
```

### 4.2 Manual Testing
1. Open the editor in your browser
2. Click the "3D Scanner" button
3. Allow camera permissions
4. Take some test photos
5. Verify processing works
6. Check that models are saved to Supabase

## 🔧 Step 5: Production Deployment

### 5.1 Set Up Production Server
1. Deploy your application to a web server
2. Set up HTTPS certificates
3. Configure environment variables
4. Set up monitoring and logging

### 5.2 Configure CDN (Optional)
For better performance, set up a CDN:
- Cloudflare
- AWS CloudFront
- Azure CDN

### 5.3 Set Up Monitoring
1. Configure error tracking (Sentry)
2. Set up performance monitoring
3. Configure analytics tracking
4. Set up uptime monitoring

## 🔧 Step 6: Security Considerations

### 6.1 Supabase Security
1. Enable Row Level Security (RLS)
2. Configure proper policies
3. Set up authentication providers
4. Monitor for suspicious activity

### 6.2 Meshroom Security
1. Set up API authentication
2. Configure rate limiting
3. Set up file size limits
4. Monitor processing jobs

### 6.3 Application Security
1. Enable HTTPS
2. Set up CSP headers
3. Configure CORS properly
4. Validate all inputs

## 🔧 Step 7: Performance Optimization

### 7.1 Database Optimization
1. Set up proper indexes
2. Configure connection pooling
3. Monitor query performance
4. Set up caching

### 7.2 Asset Optimization
1. Compress images and models
2. Set up proper caching headers
3. Use CDN for static assets
4. Optimize 3D models for web

### 7.3 Processing Optimization
1. Set up job queues for Meshroom
2. Configure auto-scaling
3. Monitor processing times
4. Optimize photo quality settings

## 📊 Monitoring and Analytics

### 8.1 Set Up Analytics
1. Track user interactions
2. Monitor processing success rates
3. Track model quality metrics
4. Monitor system performance

### 8.2 Key Metrics to Track
- User engagement with 3D scanner
- Processing success rate
- Model quality scores
- Processing time averages
- Storage usage
- API response times

## 🚀 Launch Checklist

- [ ] Supabase project configured
- [ ] Database schema deployed
- [ ] Storage buckets created
- [ ] Meshroom API running
- [ ] Configuration updated
- [ ] Integration tests passing
- [ ] Security measures in place
- [ ] Performance optimized
- [ ] Monitoring configured
- [ ] Documentation updated

## 🆘 Troubleshooting

### Common Issues

1. **Supabase Connection Failed**
   - Check URL and API key
   - Verify network connectivity
   - Check CORS settings

2. **Meshroom Processing Fails**
   - Check Meshroom installation
   - Verify API endpoint
   - Check file permissions
   - Monitor server resources

3. **Camera Not Working**
   - Check HTTPS requirement
   - Verify camera permissions
   - Test on different browsers

4. **Models Not Saving**
   - Check Supabase storage policies
   - Verify file size limits
   - Check authentication status

### Support Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Meshroom Documentation](https://alicevision.org)
- [PlayCanvas Documentation](https://developer.playcanvas.com)

## 🎯 Next Steps

1. **Test the complete integration**
2. **Deploy to staging environment**
3. **Run load tests**
4. **Deploy to production**
5. **Monitor and optimize**

Your platform is now ready for production with full Supabase and Meshroom integration! 🚀 