# Deployment Guide - StorySearch AI

This guide provides step-by-step instructions for deploying StorySearch AI to various platforms, with a focus on Lovable.app deployment.

## 🚀 Lovable.app Deployment (Recommended)

Lovable.app is the recommended deployment platform for this project as it's specifically mentioned in the requirements.

### Prerequisites
- Git repository with your code
- Lovable.app account
- Environment variables configured

### Steps

1. **Prepare Your Repository**
   ```bash
   # Ensure your code is committed and pushed
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Lovable.app**
   - Visit [Lovable.app](https://lovable.app)
   - Sign in or create an account
   - Click "New Project" or "Import from Git"
   - Connect your GitHub/GitLab repository

3. **Configure Build Settings**
   - **Framework**: React
   - **Build Command**: `pnpm run build` or `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` or `npm install`
   - **Node Version**: 18.x or higher

4. **Set Environment Variables**
   ```env
   VITE_STORYBLOK_ACCESS_TOKEN=your_storyblok_token
   VITE_ALGOLIA_APP_ID=your_algolia_app_id
   VITE_ALGOLIA_API_KEY=your_algolia_api_key
   VITE_ALGOLIA_INDEX_NAME=your_algolia_index
   ```

5. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete
   - Your app will be available at `https://your-project.lovable.app`

## 🌐 Alternative Deployment Options

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Navigate to your project settings
   - Add environment variables in the "Environment Variables" section

### Netlify

1. **Build the project**
   ```bash
   pnpm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify Dashboard**
   - Drag and drop the `dist` folder to Netlify
   - Configure environment variables in site settings

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deployment script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Build and deploy**
   ```bash
   pnpm run build
   pnpm run deploy
   ```

## 🔧 Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_STORYBLOK_ACCESS_TOKEN` | Storyblok API access token | `your_storyblok_token` |
| `VITE_ALGOLIA_APP_ID` | Algolia application ID | `your_algolia_app_id` |
| `VITE_ALGOLIA_API_KEY` | Algolia search API key | `your_algolia_api_key` |
| `VITE_ALGOLIA_INDEX_NAME` | Algolia search index name | `storysearch_content` |

### Getting API Keys

#### Storyblok
1. Create a Storyblok account at [storyblok.com](https://www.storyblok.com)
2. Create a new space
3. Go to Settings → Access Tokens
4. Copy the "Preview" access token

#### Algolia
1. Create an Algolia account at [algolia.com](https://www.algolia.com)
2. Create a new application
3. Go to API Keys section
4. Copy the Application ID and Search-Only API Key
5. Create an index for your content

## 🏗️ Build Configuration

### Vite Configuration

The project uses Vite for building. The configuration is optimized for production:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})
```

### Performance Optimizations

- **Code Splitting**: Automatic chunk splitting for better loading
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and CSS optimization
- **Lazy Loading**: Components loaded on demand

## 🔍 Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are configured
- [ ] Build completes without errors (`pnpm run build`)
- [ ] All routes work correctly in production
- [ ] API integrations are tested
- [ ] Performance is optimized
- [ ] SEO meta tags are configured
- [ ] Error handling is implemented
- [ ] Analytics are set up (if required)

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Check variable names match exactly
   - Restart development server after changes

3. **Routing Issues**
   - Configure redirects for SPA routing
   - Add `_redirects` file for Netlify
   - Configure `vercel.json` for Vercel

4. **API Errors**
   - Verify API keys are correct
   - Check CORS settings
   - Ensure API endpoints are accessible

### Support

For deployment issues:
1. Check the platform-specific documentation
2. Review build logs for errors
3. Test locally with production build
4. Contact platform support if needed

## 📊 Monitoring

After deployment, monitor:
- **Performance**: Page load times and Core Web Vitals
- **Errors**: JavaScript errors and API failures
- **Usage**: User interactions and search queries
- **Uptime**: Service availability

## 🔄 Continuous Deployment

Set up automatic deployments:
1. Connect your Git repository
2. Configure build triggers
3. Set up branch-based deployments
4. Enable preview deployments for PRs

---

**Ready to deploy StorySearch AI!** 🚀

For the latest deployment updates, check the main README.md file.
