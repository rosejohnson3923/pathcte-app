# Configure Supabase to Use Azure Communication Services Email

## Step 1: Get Azure Communication Services Connection String

1. **Go to Azure Portal** (https://portal.azure.com)
2. **Navigate to:** Resource Groups → Pathfinity → [Your Communication Services resource]
   - Look for a resource with type "Communication Services" (not Email Services)
3. **Click "Keys"** in the left menu
4. **Copy the "Primary connection string"**
   - It looks like: `endpoint=https://...communication.azure.com/;accesskey=...`

## Step 2: Extract SMTP Credentials

From your connection string, you need:

**Connection string format:**
```
endpoint=https://pathcte.communication.azure.com/;accesskey=YOUR_ACCESS_KEY_HERE
```

**SMTP Settings:**
```
Host: smtp.azurecomm.net
Port: 587
Username: <your-acs-resource-name>.communication.azure.com
Password: <your-access-key>
From: noreply@pathcte.com
```

**Example:**
- If your endpoint is `https://pathcte-email.communication.azure.com/`
- Username would be: `pathcte-email.communication.azure.com`
- Password would be: the access key from connection string

## Step 3: Configure Supabase SMTP

1. **Go to Supabase Dashboard** (https://supabase.com/dashboard)
2. **Select your PathCTE project**
3. **Navigate to:** Project Settings (⚙️) → Auth → SMTP Settings
4. **Click "Enable Custom SMTP Server"**
5. **Fill in the details:**

```
SMTP Host: smtp.azurecomm.net
SMTP Port: 587
SMTP User: [your-resource-name].communication.azure.com
SMTP Pass: [your-access-key]
Sender Email: noreply@pathcte.com
Sender Name: PathCTE
```

6. **Enable TLS:** Yes
7. **Click "Save"**

## Step 4: Test SMTP Connection

Supabase has a built-in test feature:
1. After saving SMTP settings
2. Click **"Send test email"**
3. Enter your email address
4. Check if you receive the test email

## Step 5: Customize Email Templates

1. **In Supabase Dashboard:** Authentication → Email Templates
2. **Customize these templates:**

### Confirm Signup Email
```html
<h2>Welcome to PathCTE!</h2>
<p>Thanks for signing up. Please confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
```

### Reset Password Email
```html
<h2>Reset Your PathCTE Password</h2>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

### Magic Link Email
```html
<h2>Sign in to PathCTE</h2>
<p>Click the link below to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
```

## Step 6: Add Branding (Optional)

Add PathCTE logo and styling to email templates:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .header { background: linear-gradient(135deg, #9333ea 0%, #14b8a6 100%); padding: 20px; text-align: center; }
    .logo { color: white; font-size: 24px; font-weight: bold; }
    .content { padding: 20px; }
    .button { background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">PathCTE</div>
  </div>
  <div class="content">
    <h2>Welcome to PathCTE!</h2>
    <p>Thanks for signing up. Please confirm your email address:</p>
    <p><a href="{{ .ConfirmationURL }}" class="button">Confirm Email</a></p>
  </div>
</body>
</html>
```

## Alternative: Use Azure Email SDK (Advanced)

If you need more control over emails, you can use the Azure Email SDK directly:

### Install Package
```bash
npm install @azure/communication-email
```

### Send Email Example
```typescript
import { EmailClient } from "@azure/communication-email";

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const client = new EmailClient(connectionString);

const message = {
  senderAddress: "noreply@pathcte.com",
  content: {
    subject: "Welcome to PathCTE!",
    plainText: "Welcome!",
    html: "<h1>Welcome to PathCTE!</h1>",
  },
  recipients: {
    to: [{ address: "user@example.com" }],
  },
};

const poller = await client.beginSend(message);
const result = await poller.pollUntilDone();
```

## Troubleshooting

### Test email not received
- Check spam/junk folder
- Verify DNS records are all "Verified" in Azure Portal
- Wait 24 hours for DNS propagation
- Try sending to different email providers (Gmail, Outlook, etc.)

### SMTP Authentication Failed
- Double-check username format: `resource-name.communication.azure.com`
- Ensure access key is copied correctly (no extra spaces)
- Try regenerating access key in Azure Portal

### Emails go to spam
- Add DMARC record (see DNS_RECORDS.md)
- Ensure SPF and DKIM are verified
- Use professional email content (avoid spam trigger words)
- Warm up the domain by sending emails gradually

## Environment Variables

Add to your `.env` files:

```bash
# Azure Communication Services
VITE_AZURE_COMMUNICATION_CONNECTION_STRING=endpoint=https://...;accesskey=...
VITE_AZURE_EMAIL_FROM=noreply@pathcte.com
```

## Monitoring

Monitor email delivery in Azure Portal:
1. Go to your Email Communication Service
2. Click "Metrics" in left menu
3. View:
   - Messages sent
   - Delivery rate
   - Bounce rate
   - Spam complaints

## Next Steps

After setup:
- ✅ Test all email flows (signup, reset password, etc.)
- ✅ Monitor deliverability for first week
- ✅ Set up email analytics/tracking if needed
- ✅ Create templates for future features (game invites, notifications, etc.)
