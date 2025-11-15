# Cloudflare Pages Deployment Guide

This guide will help you deploy your Brokee application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin main
```

## Step 2: Deploy to Cloudflare Pages

### Option A: Deploy via Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Sign in or create a free account

2. **Create a New Pages Project**
   - Click on "Workers & Pages" in the sidebar
   - Click "Create application"
   - Select "Pages" tab
   - Click "Connect to Git"

3. **Connect Your Repository**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Cloudflare to access your repositories
   - Select the `investstart` repository
   - Click "Begin setup"

4. **Configure Build Settings**
   - **Project name**: `brokee` (or your preferred name)
   - **Production branch**: `main` (or `master`)
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave as default)

5. **Add Environment Variables**
   - Click "Add environment variable"
   - Add the following:
     - **Variable name**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key (the one from `.env.local`)
   - Click "Save and Deploy"

6. **Deploy**
   - Cloudflare will automatically build and deploy your application
   - The deployment will take a few minutes
   - Once complete, you'll get a URL like: `https://brokee.pages.dev`

### Option B: Deploy via Wrangler CLI

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create a Pages Project**
   ```bash
   wrangler pages project create brokee
   ```

4. **Deploy**
   ```bash
   npm run build
   wrangler pages deploy .next --project-name=brokee
   ```

## Step 3: Configure Custom Domain (Optional)

Cloudflare Pages provides a free `.pages.dev` subdomain, but you can also use a custom domain:

1. In your Cloudflare Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain name
4. Follow the DNS configuration instructions

## Step 4: Environment Variables (IMPORTANT!)

**This is critical for the chatbot to work!** Make sure to add environment variables correctly:

1. **Go to your Cloudflare Pages project**
   - In the Cloudflare Dashboard, navigate to your Pages project
   - Click on **"Settings"** in the left sidebar
   - Scroll down to **"Environment variables"** section

2. **Add the environment variable for ALL environments:**
   - Click **"Add variable"**
   - **Variable name**: `OPENAI_API_KEY` (must be exactly this, case-sensitive)
   - **Value**: Your OpenAI API key (starts with `sk-proj-...` or `sk-...`)
   - **Important**: Make sure to add it for:
     - ✅ **Production** environment
     - ✅ **Preview** environment  
     - ✅ **Branch** environment (if you have branch deployments)
   
   You can add the same variable to all environments at once, or add them separately.

3. **After adding the variable:**
   - Click **"Save"**
   - **Redeploy your application** (go to Deployments → Retry deployment, or push a new commit)
   - Environment variables are only available after a new deployment

4. **Verify the variable is set:**
   - Check that `OPENAI_API_KEY` appears in the Environment variables list
   - Make sure it's enabled for Production (and Preview if needed)
   - The value should show as masked (****) for security

## Important Notes

- **Environment Variables**: Never commit `.env.local` to Git. Add them in Cloudflare Pages dashboard instead.
- **Build Time**: First build may take 5-10 minutes. Subsequent builds are faster.
- **Free Tier**: Cloudflare Pages free tier includes:
  - Unlimited requests
  - Unlimited bandwidth
  - 500 builds per month
  - Custom domains

## Troubleshooting

### Build Fails
- Check the build logs in Cloudflare Pages dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Cloudflare Pages uses Node.js 18.x by default)

### API Routes Not Working
- Make sure environment variables are set correctly
- Check that API routes are in the `app/api` directory
- Verify the route handlers are properly exported

### Environment Variables Not Working

**If you see "Missing credentials" or "OPENAI_API_KEY is not configured":**

1. **Verify the variable is set correctly:**
   - Go to your Pages project → Settings → Environment variables
   - Check that `OPENAI_API_KEY` exists (exact spelling, case-sensitive)
   - Verify it's enabled for **Production** environment (and Preview if testing)
   - Make sure the value is your actual API key (not empty)

2. **Redeploy after adding variables:**
   - Environment variables only take effect after a new deployment
   - Go to Deployments → Click "Retry deployment" on the latest deployment
   - Or push a new commit to trigger a new deployment

3. **Check variable scope:**
   - Production variables: Only available in production deployments
   - Preview variables: Only available in preview deployments
   - Make sure you've added the variable to the correct environment

4. **Verify API key format:**
   - OpenAI API keys start with `sk-proj-` or `sk-`
   - Make sure there are no extra spaces or quotes in the value
   - Copy the key directly from OpenAI dashboard

5. **Test in different environments:**
   - If it works in Preview but not Production, check Production environment variables
   - If it works locally but not in Cloudflare, the variable isn't set in Cloudflare

6. **Check build logs:**
   - Go to Deployments → Click on a deployment → View build logs
   - Look for any errors related to environment variables
   - The API key won't appear in logs (it's masked), but errors will show

## Your Deployment URL

After deployment, your app will be available at:
- **Default**: `https://brokee.pages.dev` (or your project name)
- **Custom Domain**: Your custom domain if configured

## Continuous Deployment

Cloudflare Pages automatically deploys on every push to your main branch. You can also:
- Set up preview deployments for pull requests
- Configure branch-specific deployments
- Set up custom build commands per branch

