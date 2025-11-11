# Azure Communication Services SMTP Setup - Complete Configuration

## Overview
Both PathCTE and Pathfinity now use Azure Communication Services with proper Entra ID authentication for sending emails via SMTP.

---

## PathCTE Configuration

### Azure Resources
- **Communication Service:** `Pathfinity-Comms-Svcs`
- **Email Service:** `pathcte`
- **Domain:** `pathcte.com` (all DNS records verified ✅)
- **Sender Usernames:** `donotreply`, `noreply`

### Entra ID Application
- **App Name:** `PathCTE-SMTP-Auth`
- **App ID:** `7e31d9bd-19eb-4db8-9376-6bd5d9ca0339`
- **Client Secret:** `<stored in Supabase dashboard>`
- **Tenant ID:** `b6dfd179-ee59-4f1b-addf-0988e75d9cb7`

### SMTP Username
- **Resource Name:** `supabase-pathcte`
- **Username:** `supabase.pathcte`
- **Linked to:** PathCTE-SMTP-Auth app

### Supabase SMTP Settings
```
Project: festwdkldwnpmqxrkiso
Host: smtp.azurecomm.net
Port: 587
Username: supabase.pathcte
Password: <Entra ID application client secret>
Sender Email: noreply@pathcte.com
Sender Name: PathCTE
Enable TLS: Yes
```

### Supabase Redirect URLs
```
Development:
- http://localhost:5173/auth/confirm
- http://localhost:5173/**

Production:
- https://pathcte.com/auth/confirm
- https://pathcte.com/**
- https://www.pathcte.com/auth/confirm
- https://www.pathcte.com/**
```

### Site URL
- **Development:** `http://localhost:5173`
- **Production:** `https://pathcte.com`

---

## Pathfinity Configuration

### Azure Resources
- **Communication Service:** `Pathfinity-Comms-Svcs` (same as PathCTE)
- **Email Service:** `pathfinity-email-service`
- **Domain:** `pathfinity.school` (all DNS records verified ✅)
- **Sender Username:** `donotreply`

### Entra ID Application
- **App Name:** `Pathfinity-SMTP-Auth`
- **App ID:** `e2ee86e0-fcad-4b41-85a2-6af7dfb3bd6e`
- **Client Secret:** `<stored in Supabase dashboard>`
- **Tenant ID:** `b6dfd179-ee59-4f1b-addf-0988e75d9cb7`

### SMTP Username
- **Resource Name:** `supabase-pathfinity`
- **Username:** `supabase.pathfinity`
- **Linked to:** Pathfinity-SMTP-Auth app

### Supabase SMTP Settings
```
Project: [pathfinity.ai project ID]
Host: smtp.azurecomm.net
Port: 587
Username: supabase.pathfinity
Password: <Entra ID application client secret>
Sender Email: DoNotReply@pathfinity.school
Sender Name: Pathfinity
Enable TLS: Yes
```

### Supabase Redirect URLs
```
Development:
- http://localhost:3000/auth/confirm (or appropriate dev URL)

Production:
- https://pathfinity.ai/auth/confirm
- https://pathfinity.ai/**
- https://www.pathfinity.ai/auth/confirm
- https://www.pathfinity.ai/**
```

---

## How It Works

### Authentication Flow
1. **Entra ID App** provides identity for SMTP authentication
2. **Service Principal** has Contributor role on Communication Service
3. **SMTP Username** links the app to the Communication Service
4. **Client Secret** is used as the SMTP password
5. Supabase authenticates using Username + Client Secret

### Email Sending Flow
1. User signs up in Supabase
2. Supabase connects to `smtp.azurecomm.net:587`
3. Authenticates with SMTP Username and Client Secret
4. Azure validates the credentials via Entra ID
5. Email is sent from the configured sender address
6. User receives confirmation email
7. User clicks link → redirected to `/auth/confirm`
8. App verifies token with Supabase
9. Database trigger creates user profile
10. User is redirected to dashboard

---

## Code Changes

### PathCTE
- ✅ Created `AuthConfirmPage.tsx`
- ✅ Added `/auth/confirm` route to `App.tsx`
- ✅ Removed manual profile creation from auth service
- ✅ Profile created automatically by database trigger

### Pathfinity
- ✅ Created `AuthConfirmPage.tsx`
- ✅ Added `/auth/confirm` route to `App.tsx`

---

## Testing Checklist

### PathCTE
- [x] User can sign up
- [x] Confirmation email is sent
- [x] Email link redirects to `/auth/confirm`
- [x] Email is verified successfully
- [x] Profile is created automatically
- [x] User is redirected to dashboard

### Pathfinity
- [ ] User can sign up
- [ ] Confirmation email is sent
- [ ] Email link redirects to `/auth/confirm`
- [ ] Email is verified successfully
- [ ] Profile is created automatically
- [ ] User is redirected to dashboard

---

## Troubleshooting

### "535 5.7.3 Authentication unsuccessful"
- Check SMTP Username matches Azure configuration
- Verify Client Secret is correct and not expired
- Ensure Service Principal has Contributor role

### "Invalid email sender username"
- Verify sender email domain matches linked domain
- Check sender username exists in Azure domain settings
- Ensure domain is linked to Communication Service

### "localhost refused to connect"
- Update Supabase redirect URLs
- Set correct Site URL in Supabase
- Verify `/auth/confirm` route exists in app

---

## Maintenance

### Rotating Client Secrets
Client secrets expire after 2 years. To rotate:

1. Generate new secret:
   ```bash
   az ad app credential reset --id <app-id> --append
   ```

2. Update Supabase SMTP password with new secret

3. Delete old secret after verification

### Adding New Sender Addresses
To add a new sender email:

1. Add sender username in Azure domain settings
2. Update Supabase sender email configuration

---

## Security Notes

- ⚠️ Client secrets are sensitive credentials - never commit to git
- ✅ Secrets are stored securely in Supabase dashboard
- ✅ Service principals have minimal required permissions
- ✅ Secrets expire after 2 years for security

---

## Support Resources

- [Azure Communication Services SMTP Docs](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/send-email-smtp/send-email-smtp)
- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- Cleanup Script: `scripts/cleanup-test-users.mjs`
