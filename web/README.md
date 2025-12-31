# 🌐 GitAntivirus Web Control Panel

## Overview

This directory contains a **static web control panel** for GitAntivirus that can be deployed to **GitHub Pages** or any static hosting service.

## 📁 Structure

```
web/
├── index.html      # Main dashboard
├── billing.html    # Billing and pricing page
└── README.md       # This file
```

## 🚀 Features

### Dashboard (`index.html`)
- **Quick Stats:** Total scans, issues found, PRs created, active agents
- **Recent Scans Table:** View scan history and status
- **Reports Section:** Access security reports
- **Action Buttons:** Run scans, view reports, configure settings
- **Responsive Design:** Mobile-friendly with Tailwind CSS

### Billing (`billing.html`)
- **Pricing Plans:** Free, Professional, Enterprise tiers
- **Order History:** Track past orders and subscriptions
- **Stripe Integration Placeholder:** Ready for payment processing
- **Responsive Pricing Cards:** Interactive plan selection

## 🎨 Technology Stack

- **HTML5** - Structure
- **Tailwind CSS** (CDN) - Styling and responsiveness
- **Vanilla JavaScript** - Interactivity
- **Stripe.js** (placeholder) - Payment processing (when integrated)

## 🏗️ Deployment

### GitHub Pages

1. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages section
   - Select source branch (e.g., `main`)
   - Set folder to `/web` or root

2. **Configure:**
   - Ensure `index.html` is at root or in `/web`
   - Add custom domain (optional)
   - Enable HTTPS

3. **Access:**
   - URL: `https://SolanaRemix.github.io/SmartContractAudit/`
   - Custom domain: Configure in settings

### Alternative Hosting

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd web
netlify deploy --prod
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd web
vercel --prod
```

**Cloudflare Pages:**
- Connect GitHub repository
- Set build directory to `web`
- Deploy automatically on push

## 🔌 Backend Integration

### API Endpoints (Placeholder)

The dashboard expects these API endpoints (to be implemented):

```javascript
// Get stats
GET /api/stats
Response: { totalScans, issuesFound, prsCreated, activeAgents }

// Get recent scans
GET /api/scans?limit=10
Response: [{ repo, status, issues, date, id }, ...]

// Trigger new scan
POST /api/scan
Body: { repo, mode: "dry-run" | "live" }

// Get reports
GET /api/reports
Response: [{ title, description, url }, ...]

// Create checkout session (Stripe)
POST /api/create-checkout-session
Body: { plan: "pro" | "enterprise" }
Response: { sessionId }
```

### Environment Variables

```bash
# Backend API URL
VITE_API_URL=https://api.gitantivirus.com

# Stripe (for billing)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# GitHub OAuth (optional)
VITE_GITHUB_CLIENT_ID=...
```

## 🔒 Security Notes

### ✅ Safe Practices
- No secrets in frontend code
- API keys loaded from environment
- HTTPS enforced for production
- CORS properly configured
- Input validation on backend

### ⚠️ Important
- Never commit Stripe secret keys
- Use publishable keys only in frontend
- Implement rate limiting on API
- Validate all user inputs on backend
- Use secure session management

## 📝 Customization

### Branding
Edit `index.html` and `billing.html`:
- Update logo SVGs
- Change color scheme (Tailwind classes)
- Modify text and descriptions
- Add/remove sections

### Styling
The site uses Tailwind CSS via CDN. To customize:

```html
<!-- Add custom styles -->
<style>
  .custom-class {
    /* Your styles */
  }
</style>

<!-- Or use Tailwind config -->
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#667eea'
        }
      }
    }
  }
</script>
```

### Functionality
Replace placeholder functions in `<script>` tags with real API calls:

```javascript
// Example: Real API integration
async function runScan() {
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo: selectedRepo, mode: 'dry-run' })
    });
    const data = await response.json();
    alert(`Scan started: ${data.scanId}`);
  } catch (error) {
    console.error('Scan failed:', error);
  }
}
```

## 🧪 Testing Locally

### Simple HTTP Server
```bash
# Python
cd web
python -m http.server 8000

# Node.js
npx http-server -p 8000

# Access: http://localhost:8000
```

### Live Reload (Development)
```bash
# Using live-server
npx live-server web/
```

## 📊 Analytics (Optional)

Add tracking code to `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>

<!-- Or Plausible (privacy-friendly) -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🔧 Troubleshooting

### Issue: Styles not loading
**Solution:** Check Tailwind CDN link is accessible, or host locally

### Issue: CORS errors
**Solution:** Configure backend to allow your domain:
```javascript
// Express.js example
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

### Issue: Stripe not working
**Solution:** Ensure Stripe.js is loaded and publishable key is correct

## 📚 Resources

- **Tailwind CSS:** https://tailwindcss.com
- **Stripe Docs:** https://stripe.com/docs/payments/checkout
- **GitHub Pages:** https://pages.github.com
- **MDN Web Docs:** https://developer.mozilla.org

## 🚀 Next Steps

1. Deploy to GitHub Pages
2. Implement backend API
3. Integrate Stripe payments
4. Add authentication (GitHub OAuth)
5. Connect to real scan data
6. Add real-time updates (WebSockets)

## 📝 License

MIT - Same as parent project

---

*Web Control Panel v1.0.0*
*Built for GitHub Pages | Static & Fast*
