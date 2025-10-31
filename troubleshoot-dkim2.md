# Troubleshoot DKIM2 Verification

## Check DNS Record

Run these commands to verify the DKIM2 record is published correctly:

### Windows (PowerShell or CMD):
```bash
nslookup -type=CNAME selector2-azurecomm-prod-net._domainkey.pathcte.com
```

### Expected Result:
```
selector2-azurecomm-prod-net._domainkey.pathcte.com canonical name = selector2-azurecomm-prod-net._domainkey.azurecomm.net
```

## Common Issues & Fixes

### 1. Extra Period at the End
Some DNS providers automatically add a period. Check if your record has:

**Wrong:**
- Name: `selector2-azurecomm-prod-net._domainkey.` (extra period)
- Value: `selector2-azurecomm-prod-net._domainkey.azurecomm.net.` (extra period)

**Correct:**
- Name: `selector2-azurecomm-prod-net._domainkey`
- Value: `selector2-azurecomm-prod-net._domainkey.azurecomm.net`

### 2. Missing or Wrong Hostname
Verify the record name is exactly:
```
selector2-azurecomm-prod-net._domainkey
```

**NOT:**
- `selector2._domainkey`
- `selector2-azurecomm._domainkey`
- `_domainkey.selector2-azurecomm-prod-net`

### 3. DNS Propagation Delay
CNAME records can take longer to propagate:
- Wait another 1-2 hours
- Clear DNS cache on your computer:
  ```bash
  ipconfig /flushdns
  ```

### 4. Check Online Tool
Use this to verify DNS propagation worldwide:
- https://dnschecker.org/
- Enter: `selector2-azurecomm-prod-net._domainkey.pathcte.com`
- Select: CNAME
- Should show: `selector2-azurecomm-prod-net._domainkey.azurecomm.net`

### 5. Compare with DKIM1 (Working)
Since DKIM1 is verified, compare the two records in your DNS manager:

**DKIM1 (Working):**
- Name: `selector1-azurecomm-prod-net._domainkey`
- Value: `selector1-azurecomm-prod-net._domainkey.azurecomm.net`

**DKIM2 (Should match format):**
- Name: `selector2-azurecomm-prod-net._domainkey`
- Value: `selector2-azurecomm-prod-net._domainkey.azurecomm.net`

## Quick Fix Steps

1. **Delete the DKIM2 record** in your DNS manager
2. **Re-add it exactly like DKIM1** but with `selector2` instead of `selector1`
3. **Wait 15-30 minutes**
4. **Check Azure Portal** for verification status

## Can You Send Emails Without DKIM2?

**Yes, temporarily!**

You can proceed with Supabase configuration now:
- DKIM1 is enough for basic email authentication
- DKIM2 is a backup/rotation key
- Emails will still be delivered
- DKIM2 will verify eventually

**However, for production:**
- Both DKIM records should be verified
- Better email deliverability
- Reduces spam risk

## Next Steps

1. Try the troubleshooting steps above
2. If still not working after 2 hours, proceed with Supabase anyway
3. Come back and fix DKIM2 later (won't break anything)
