# Supabase Setup Guide for Static Motion

This guide will help you configure Supabase integration for the Static Motion platform.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `static-motion-platform`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
   - **Service role key** (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env` file in your project root:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database/schema.sql`
3. Paste it into the SQL editor and click "Run"
4. This will create all necessary tables and policies

## 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
3. Go to **Authentication** → **Providers**
4. Enable Email provider (should be enabled by default)
5. Optionally configure other providers (Google, GitHub, etc.)

## 6. Set Up Storage Buckets

1. Go to **Storage** → **Buckets**
2. Create a new bucket called `assets`
3. Set it to **Public** (for now - you can make it private later with RLS)
4. Go to **Storage** → **Policies**
5. Add the following policies for the `assets` bucket:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload assets" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public to view published assets
CREATE POLICY "Public can view assets" ON storage.objects
FOR SELECT USING (true);

-- Allow users to update their own assets
CREATE POLICY "Users can update own assets" ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## 7. Update Frontend Configuration

In `public/editor.html`, update the Supabase configuration:

```javascript
window.supabase = supabase.createClient(
    'YOUR_SUPABASE_URL',  // Replace with your actual URL
    'YOUR_SUPABASE_ANON_KEY'  // Replace with your actual anon key
);
```

## 8. Test the Integration

1. Start your server: `npm start`
2. Go to `http://localhost:3000`
3. Try to sign up with a test account
4. Check the Supabase dashboard to see if the user was created
5. Try creating a scene and check if it's saved to the database

## 9. Create a Super Admin User

1. Sign up normally through the platform
2. In Supabase dashboard, go to **Table Editor** → **users**
3. Find your user and change `user_type` to `superadmin`
4. This will give you access to the admin dashboard

## 10. Verify Row Level Security (RLS)

The schema includes RLS policies that ensure:
- Users can only access their own data
- Published scenes are publicly viewable
- Assets are properly secured
- Analytics are tracked appropriately

## Troubleshooting

### Common Issues:

1. **"Supabase client not found"**
   - Make sure you've included the Supabase script in your HTML
   - Check that the URL and key are correct

2. **"Not authenticated" errors**
   - Check that authentication is properly configured
   - Verify the user is signed in

3. **"Permission denied" errors**
   - Check that RLS policies are properly set up
   - Verify the user has the correct permissions

4. **File upload errors**
   - Check that the storage bucket exists and is public
   - Verify storage policies are configured correctly

### Debug Mode:

Add this to your `.env` file to see detailed logs:

```bash
DEBUG=supabase:*
```

## Next Steps

Once Supabase is configured:

1. **Set up Stripe** for payment processing
2. **Configure email** for notifications
3. **Set up a CDN** for better performance
4. **Configure monitoring** and analytics
5. **Set up backups** for your database

## Security Best Practices

1. **Never commit your `.env` file** to version control
2. **Use environment variables** for all sensitive data
3. **Regularly rotate** your API keys
4. **Monitor your database** for unusual activity
5. **Set up alerts** for failed authentication attempts
6. **Use HTTPS** in production
7. **Implement rate limiting** on your API endpoints

## Production Deployment

When deploying to production:

1. Update your Supabase site URL to your production domain
2. Set up a custom domain for your Supabase project
3. Configure proper CORS settings
4. Set up monitoring and logging
5. Configure backups and disaster recovery
6. Set up SSL certificates
7. Configure a CDN for static assets

---

For more help, check the [Supabase documentation](https://supabase.com/docs) or create an issue in the project repository. 