# DNS Records for pathcte.com Email Verification

## Records to Add to Your Domain Registrar

Add these DNS records to verify pathcte.com for Azure Communication Services Email:

### 1. Domain Verification (TXT)
```
Type: TXT
Name: @ (or pathcte.com)
Value: ms-domain-verification=de2e90fb-e363-484c-9b11-1a03411b4ac1
TTL: 3600 (or 1 hour)
```

### 2. SPF Record (TXT)
```
Type: TXT
Name: @ (or pathcte.com)
Value: v=spf1 include:spf.protection.outlook.com -all
TTL: 3600 (or 1 hour)
```

### 3. DKIM Record 1 (CNAME)
```
Type: CNAME
Name: selector1-azurecomm-prod-net._domainkey
Value: selector1-azurecomm-prod-net._domainkey.azurecomm.net
TTL: 3600 (or 1 hour)
```

### 4. DKIM Record 2 (CNAME)
```
Type: CNAME
Name: selector2-azurecomm-prod-net._domainkey
Value: selector2-azurecomm-prod-net._domainkey.azurecomm.net
TTL: 3600 (or 1 hour)
```

### 5. DMARC Record (TXT) - OPTIONAL but Recommended
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@pathcte.com
TTL: 3600 (or 1 hour)
```

## Where to Add These Records

Go to your domain registrar (where you bought pathcte.com):
- **GoDaddy**: DNS Management → Add Record
- **Namecheap**: Advanced DNS → Add New Record
- **Cloudflare**: DNS → Add Record
- **Google Domains**: DNS → Manage Custom Records

## Verification Time

- DNS propagation can take **up to 24 hours**
- Usually completes in **1-4 hours**
- Check status in Azure Portal: Email Communication Service → Domains → pathcte.com

## Verify DNS Propagation

Test if records are live:

```bash
# Test TXT records
nslookup -type=TXT pathcte.com

# Test CNAME records
nslookup -type=CNAME selector1-azurecomm-prod-net._domainkey.pathcte.com
nslookup -type=CNAME selector2-azurecomm-prod-net._domainkey.pathcte.com
```

Or use online tools:
- https://mxtoolbox.com/SuperTool.aspx
- https://dnschecker.org/

## Next Steps

Once all verification statuses show "Verified" in Azure Portal:
1. Get SMTP credentials from Azure
2. Configure Supabase
3. Test sending emails
