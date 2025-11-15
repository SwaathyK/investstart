# Quick Fix: Setting OPENAI_API_KEY in Cloudflare Pages

If you're getting the error: **"Missing credentials. Please pass an apiKey, or set the OPENAI_API_KEY environment variable."**

Follow these steps:

## Step-by-Step Instructions

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Log in to your account

2. **Navigate to Your Pages Project**
   - Click **"Workers & Pages"** in the left sidebar
   - Click on your project name (e.g., "brokee" or "investstart")

3. **Open Settings**
   - Click **"Settings"** in the left sidebar of your project
   - Scroll down to find **"Environment variables"** section

4. **Add the Environment Variable**
   - Click **"Add variable"** button
   - **Variable name**: Type exactly `OPENAI_API_KEY` (case-sensitive, no spaces)
   - **Value**: Paste your OpenAI API key (from your `.env.local` file)
   - **Select environments**: 
     - ✅ Check **"Production"**
     - ✅ Check **"Preview"** (optional but recommended)
   - Click **"Save"**

5. **Redeploy Your Application**
   - Environment variables only work after a new deployment
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on your latest deployment
   - Click **"Retry deployment"**
   - OR push a new commit to trigger automatic deployment

6. **Verify It Works**
   - Wait for deployment to complete (2-5 minutes)
   - Visit your site and test the chatbot
   - The error should be gone!

## Common Mistakes to Avoid

❌ **Don't** add quotes around the API key value  
❌ **Don't** add spaces before or after the variable name  
❌ **Don't** forget to redeploy after adding the variable  
❌ **Don't** only add it to Preview - make sure Production is checked too  

✅ **Do** copy the API key exactly as it appears in your `.env.local`  
✅ **Do** make sure the variable name is exactly `OPENAI_API_KEY`  
✅ **Do** redeploy after adding the variable  
✅ **Do** check both Production and Preview environments  

## Still Not Working?

1. **Double-check the variable name**: It must be exactly `OPENAI_API_KEY` (all caps, underscores)
2. **Verify the API key**: Make sure it's valid and active in your OpenAI account
3. **Check deployment logs**: Go to Deployments → Click on deployment → Check for errors
4. **Try a new deployment**: Sometimes a fresh deployment helps

## Need Your API Key?

If you don't have your API key:
1. Go to https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (you'll only see it once!)
5. Paste it into Cloudflare Pages environment variables


