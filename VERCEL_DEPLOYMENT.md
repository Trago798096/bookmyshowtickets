# Vercel Deployment Guide

This guide will help you successfully deploy the IPL Ticket Booking application on Vercel.

## Pre-deployment Checklist

1. Ensure you have a Supabase account and project created
2. Verify your PostgreSQL database is set up correctly
3. Make sure all environment variables are ready

## Environment Variables

When deploying to Vercel, you need to set up the following environment variables:

| Environment Variable | Description |
| -------------------- | ----------- |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NODE_ENV` | Should be set to `production` |

## Deployment Steps

1. **Connect your GitHub repository to Vercel**
   - Sign in to your Vercel account
   - Click "Add New..." > "Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure your project**
   - **Framework Preset**: Choose "Other"
   - **Build Command**: Keep the default `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: Keep the default `npm install`
   - **Development Command**: Leave empty

3. **Environment Variables**
   - Add all the required environment variables mentioned above
   - Make sure to use the exact same variable names as listed

4. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete

## Troubleshooting

If you encounter issues with your deployment, check the following:

1. **Build Logs**: Check the Vercel build logs for any errors
2. **Environment Variables**: Verify all environment variables are set correctly
3. **Database Connection**: Ensure your DATABASE_URL is accessible from Vercel's servers
4. **CORS Issues**: If you see CORS errors in the console, check that your Supabase project has the correct CORS settings

## Subsequent Deployments

After making changes to your code:

1. Commit and push your changes to GitHub
2. Vercel will automatically deploy the new version

## Important Notes

- The serverless API functions are in the `/api` directory
- The frontend is built with Vite and will be served from the `/dist/public` directory
- Make sure your Supabase project allows requests from your Vercel deployment domain