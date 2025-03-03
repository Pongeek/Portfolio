# Setting Up SendGrid for Portfolio Contact Form

## Problem
Your "Get In Touch" form appears to submit successfully, but you don't receive any emails or see requests in your SendGrid account.

## Solution
This is likely due to missing or incorrect SendGrid configuration. Follow these steps to set it up correctly:

## Step 1: Get a SendGrid API Key

1. Sign up for a SendGrid account at [sendgrid.com](https://sendgrid.com/) if you don't already have one
2. Once logged in, go to Settings → API Keys
3. Click "Create API Key"
4. Give it a name like "Portfolio Contact Form"
5. Choose "Restricted Access" and ensure it has at least "Mail Send" permissions
6. Create the key and copy it (you'll only see it once!)

## Step 2: Verify Your Sender Identity

SendGrid requires verified sender identities:

1. In SendGrid, go to Settings → Sender Authentication
2. Choose "Single Sender Verification" (easiest option)
3. Enter your details and verify your email
4. Use this verified email as your FROM address

## Step 3: Configure Your Environment Variables

You need to set two environment variables:

1. `SENDGRID_API_KEY`: Your full API key starting with "SG."
2. `SENDGRID_FROM_EMAIL`: The verified email address you'll be sending from

### Local Testing
Create a `.env` file in your project root:

```
SENDGRID_API_KEY=SG.your_full_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@example.com
```

### Vercel Deployment
In your Vercel project:
1. Go to Settings → Environment Variables
2. Add both variables above
3. Deploy your project again

## Step 4: Test Your Configuration

After setting up the environment variables:
1. Restart your local development server or redeploy
2. Submit a test message through the contact form
3. Check your server logs for debugging information
4. Check your email inbox for the message

## Troubleshooting

If you still don't receive emails:

1. **Check Server Logs**: Look for detailed error messages that might explain what's wrong
2. **SendGrid Activity**: Check your SendGrid dashboard under "Activity" to see if emails are being processed
3. **Spam Folder**: Check your spam/junk folder as the emails might be filtered
4. **SendGrid Limitations**: New SendGrid accounts have sending limits and may require additional verification

## Need More Help?

If you continue having issues:
1. Ensure your API key has the correct permissions
2. Verify your sender email is properly authenticated
3. Check if your SendGrid account is in good standing
4. Make sure your FROM email matches your verified sender identity

Need more detailed assistance? Please provide any specific error messages from your logs. 