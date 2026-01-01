# Web Control Panel

## Overview

This directory contains a simple web-based dashboard for SmartContractAudit, designed to be published via GitHub Pages.

## Contents

- **index.html**: Main dashboard showing recent scans, statistics, and sponsor call-to-action
- **billing.html**: Sponsorship tiers and payment instructions (Stripe, Cash App, crypto)
- **README.md**: This file

## Publishing to GitHub Pages

### Quick Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to Pages section
   - Source: Deploy from a branch
   - Branch: Select `main` (or `CyberAi` for this branch)
   - Folder: Select `/web`
   - Click Save

2. **Access Your Site**:
   - URL will be: `https://solanaremix.github.io/SmartContractAudit/`
   - Wait 1-2 minutes for initial deployment

### Custom Domain (Optional)

1. Add `CNAME` file in web/ directory:
   ```
   smartcontractaudit.example.com
   ```

2. Configure DNS:
   - Add CNAME record: `www` → `solanaremix.github.io`
   - Add A records for apex domain (see GitHub docs)

3. Enable HTTPS in GitHub Pages settings

## Features

### Dashboard (index.html)

- **Hero Section**: Project introduction and CTAs
- **Statistics**: Key metrics (scans, vulnerabilities, value protected)
- **Recent Scans**: Placeholder scan results with security scores
- **Sponsor CTA**: Prominent call-to-action for sponsorships
- **Documentation Links**: Quick access to all docs
- **Responsive Design**: Mobile-friendly Tailwind CSS

### Billing (billing.html)

- **Tier Comparison**: Bronze, Silver, Gold, Platinum tiers
- **Payment Methods**:
  - **Stripe**: Via GitHub Sponsors (recommended)
  - **Cash App**: Direct payment instructions
  - **Cryptocurrency**: BTC, ETH, SOL, USDC/USDT
  - **Bank Transfer**: For enterprise/platinum
- **FAQ Section**: Common billing questions
- **No Keys/Secrets**: Placeholder instructions only

## Technology Stack

- **Framework**: Pure HTML/CSS/JavaScript
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Font Awesome 6 (via CDN)
- **Fonts**: Inter from Google Fonts

## Security Notes

### What's Included (Safe)

✅ Placeholder UI  
✅ Links to documentation  
✅ Instructions for payments (no keys)  
✅ Static HTML/CSS/JS only  

### What's NOT Included (Secure)

❌ **No API keys or secrets**  
❌ **No Stripe publishable keys**  
❌ **No wallet private keys**  
❌ **No authentication tokens**  
❌ **No backend code**

**Payment Processing**: All actual payment processing happens through:
- GitHub Sponsors (Stripe backend)
- Direct external services (Cash App, crypto wallets)
- Manual invoicing

## Customization

### Update Branding

1. Replace logo references (currently using Font Awesome shield icon)
2. Update color scheme in Tailwind classes
3. Add real logo files to `/web/assets/` (create directory)

### Add Real Data

To connect to real scan data:

1. **Option A**: Static JSON
   - Generate JSON files from scans
   - Load via fetch() in JavaScript
   - Update dashboard dynamically

2. **Option B**: API Integration
   - Build separate API backend
   - Call from JavaScript
   - CORS configuration required

3. **Option C**: Build Process
   - Generate static site from data
   - Use GitHub Actions to rebuild on changes

### Example: Load Real Data

```javascript
// Add to index.html script section
async function loadRecentScans() {
    try {
        const response = await fetch('/data/recent-scans.json');
        const scans = await response.json();
        displayScans(scans);
    } catch (error) {
        console.log('Using placeholder data');
    }
}
```

## Integration with FUNDING.yml

The web interface links to sponsorship options defined in `/FUNDING.yml`:

```yaml
github: [username]  # Links to GitHub Sponsors
custom: ['mailto:funding@cuberai.example']  # Billing inquiries
```

Update FUNDING.yml with real values when ready.

## Development

### Local Testing

```bash
# Option 1: Python HTTP server
cd web
python -m http.server 8000
# Visit http://localhost:8000

# Option 2: Node.js http-server
npx http-server web -p 8000

# Option 3: VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

### Making Changes

1. Edit HTML files in `/web/` directory
2. Test locally
3. Commit and push to GitHub
4. GitHub Pages automatically rebuilds (1-2 minutes)

## Deployment

### GitHub Pages Deployment

**Automatic**:
- Push to main branch
- GitHub Pages rebuilds automatically
- Changes live in 1-2 minutes

**Manual Trigger**:
- Go to Actions tab
- Find "pages build and deployment" workflow
- Click "Re-run all jobs" if needed

### Monitoring

Check deployment status:
- Actions tab: Shows build status
- Settings → Pages: Shows last deployment
- Site URL: Test live version

## Limitations

### GitHub Pages Limitations

- Static sites only (no backend)
- No server-side processing
- No database
- No environment variables
- 1GB size limit
- 100GB bandwidth/month (soft limit)

### Workarounds

- **Backend**: Use external API service
- **Database**: Use external service (Firebase, Supabase)
- **Auth**: Use GitHub OAuth or external auth
- **Processing**: GitHub Actions for builds

## Maintenance

### Regular Updates

- Update statistics periodically
- Add new features to dashboard
- Keep dependencies updated (Tailwind, Font Awesome)
- Test on multiple devices/browsers

### Analytics (Optional)

Add analytics to track visitors:

```html
<!-- Google Analytics (example) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

Or use privacy-friendly alternatives:
- Plausible Analytics
- Simple Analytics
- GoatCounter

## Support

### Issues

- Web interface bugs: Open GitHub issue with `web` label
- GitHub Pages problems: Check GitHub Status
- Design suggestions: Open discussion

### Resources

- [GitHub Pages Docs](https://docs.github.com/pages)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Font Awesome Icons](https://fontawesome.com/icons)

## License

Same as project: Apache-2.0

The web interface is part of SmartContractAudit and follows the same license terms.

## Contributing

Improvements to the web interface are welcome!

1. Fork the repository
2. Make changes to `/web/` files
3. Test locally
4. Submit pull request
5. Follow CONTRIBUTING.md guidelines

---

**Last Updated**: 2026-01-01  
**Status**: Placeholder/Template  
**Production Ready**: No (placeholders need real data)  
**Security Reviewed**: Yes (no secrets included)
