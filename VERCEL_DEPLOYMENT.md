# Vercel Deployment Guide for Portfolio Website

This document explains how to deploy your portfolio website to Vercel and connect it to your Cloudflare domain.

## Vercel Deployment Steps

### 1. Prepare Your Project
- Your project has been set up with serverless API functions in the `server/api` directory
- The `vercel.json` file has been configured to handle routing and serverless functions
- All necessary dependencies like `@vercel/node` and `@sendgrid/mail` have been installed

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com/) and sign up/login with GitHub
2. Import your GitHub repository
3. The build settings will be automatically detected from your `vercel.json` file
4. Add the following environment variables:
   - `SENDGRID_API_KEY`: Your SendGrid API key for email functionality
   - `SENDGRID_FROM_EMAIL`: The email address emails will be sent from
   - `CONTACT_EMAIL`: The email address where contact form submissions will be sent

5. Click "Deploy"

### 3. Connect Your Cloudflare Domain (maxmullo.com)

#### In Vercel:
1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your domain: `maxmullo.com`
4. Vercel will provide DNS records to add to Cloudflare

#### In Cloudflare:
1. Log in to your Cloudflare account
2. Select your domain (maxmullo.com)
3. Go to DNS settings
4. Add the records provided by Vercel:
   - Type: `CNAME`
   - Name: `@` (or as specified by Vercel)
   - Target: (the value provided by Vercel)
   - Set Proxy status to "DNS only" (gray cloud) initially

5. After DNS verification is complete, you can enable the Cloudflare proxy (orange cloud)

### 4. Verify Deployment

After deployment, check the following to ensure everything works:
- Visit your website at `maxmullo.com`
- Test the contact form to ensure emails are being sent correctly
- Verify that all project data is loading properly
- Check that your profile image is displaying correctly

## Troubleshooting

### Common Issues:
1. **API Routes Not Working**: Check that your `vercel.json` file is correctly configured
2. **Images Not Loading**: Ensure that static assets are in the `public` directory
3. **Email Functionality Not Working**: Verify that SendGrid API key is correctly set in environment variables

### Serverless Function Logs:
1. Go to your Vercel dashboard
2. Select your project
3. Click on "Functions" to see deployed serverless functions
4. Click on a specific function to view logs and debug issues

## Database Considerations

Since SQLite is used in development but isn't suitable for serverless environments, the deployed version:
- Reads project data directly from `projects.json`
- Uses file system for static data
- For more complex data needs, consider migrating to:
  - Vercel KV (for key-value storage)
  - Vercel Postgres
  - MongoDB Atlas
  - Supabase 