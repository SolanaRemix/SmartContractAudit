# Web Control Panel

GitHub Pages static site for SmartContractAudit dashboard.

## 🎯 Overview

This directory contains a lightweight, static web control panel for monitoring and managing SmartContractAudit operations via GitHub Pages.

## 📁 Files

- **index.html** - Main dashboard with stats, recent activity, and quick actions
- **billing.html** - Pricing plans and subscription management (with Stripe placeholder)
- **README.md** - This file

## 🚀 Deployment

### Enable GitHub Pages

1. Go to repository Settings
2. Navigate to Pages
3. Set Source to: Deploy from a branch
4. Select branch: `cuberai-init` (or `main`)
5. Set folder: `/web`
6. Click Save

Your site will be available at:
```
https://solanaremix.github.io/SmartContractAudit/
```

### Custom Domain (Optional)

1. Add a `CNAME` file to this directory with your domain:
   ```
   smartcontractaudit.example.com
   ```

2. Configure DNS with your registrar:
   ```
   Type: CNAME
   Name: smartcontractaudit (or @)
   Value: solanaremix.github.io
   ```

3. Enable HTTPS in GitHub Pages settings

## 🎨 Features

### Dashboard (index.html)

- **Real-time stats**: Scans, issues, deployments, health score
- **Recent activity**: Latest scans and audits
- **Quick actions**: One-click access to SmartBrain commands
- **Configuration**: Visual display of current settings

### Billing (billing.html)

- **Pricing plans**: Open Source (Free), Pro ($99/mo), Enterprise (Custom)
- **Stripe integration**: Placeholder for payment processing
- **FAQ section**: Common questions and answers

## 🔧 Customization

### Update Stats API

Replace placeholder data in `index.html`:

```javascript
// Current (placeholder)
document.getElementById('scans-today').textContent = '5';

// With API call
fetch('/api/stats')
    .then(response => response.json())
    .then(data => {
        document.getElementById('scans-today').textContent = data.scans;
    });
```

### Stripe Integration

To enable real payments in `billing.html`:

1. **Get Stripe keys**:
   - Sign up at https://stripe.com
   - Get publishable and secret keys

2. **Add Stripe.js**:
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   ```

3. **Initialize Stripe**:
   ```javascript
   const stripe = Stripe('pk_test_your_publishable_key');
   ```

4. **Create Checkout Session**:
   ```javascript
   async function openCheckout(plan) {
       const response = await fetch('/api/create-checkout-session', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ plan })
       });
       const session = await response.json();
       await stripe.redirectToCheckout({ sessionId: session.id });
   }
   ```

5. **Backend endpoint** (example):
   ```javascript
   // Node.js/Express
   app.post('/api/create-checkout-session', async (req, res) => {
       const session = await stripe.checkout.sessions.create({
           payment_method_types: ['card'],
           line_items: [{
               price: 'price_XXX', // Your Stripe price ID
               quantity: 1,
           }],
           mode: 'subscription',
           success_url: 'https://yoursite.com/success',
           cancel_url: 'https://yoursite.com/cancel',
       });
       res.json({ id: session.id });
   });
   ```

### Custom Styling

The site uses Tailwind CSS via CDN. To customize:

1. **Inline customization**:
   ```html
   <style>
       .custom-gradient {
           background: linear-gradient(135deg, #your-colors);
       }
   </style>
   ```

2. **Use Tailwind config**:
   ```javascript
   tailwind.config = {
       theme: {
           extend: {
               colors: {
                   'brand': '#your-color',
               }
           }
       }
   }
   ```

## 🔐 Security Notes

### Static Site Limitations

This is a **static site** with no backend. Important considerations:

- ✅ **Safe for**: Displaying public information, documentation, static content
- ❌ **NOT safe for**: Processing payments, storing secrets, user authentication

### What's Safe

- HTML/CSS/JavaScript
- Client-side interactions
- Links to GitHub repository
- Placeholder payment forms
- Documentation and guides

### What Requires Backend

- Payment processing (use Stripe Checkout hosted pages)
- User authentication (use OAuth, GitHub Apps)
- Database operations (use external APIs)
- Secret management (use environment variables on backend)

### Recommended Architecture

```
┌─────────────────────────────────────────┐
│  GitHub Pages (Static Frontend)        │
│  - index.html (dashboard)               │
│  - billing.html (pricing display)       │
└───────────┬─────────────────────────────┘
            │
            │ API calls
            ↓
┌─────────────────────────────────────────┐
│  Backend Service (Separate)            │
│  - Stripe API integration               │
│  - Database operations                  │
│  - Authentication                        │
└─────────────────────────────────────────┘
```

## 📊 Analytics (Optional)

### Google Analytics

Add to `<head>` in both HTML files:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Plausible Analytics (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🐛 Troubleshooting

### Site Not Loading

1. Check GitHub Pages is enabled in repository settings
2. Verify branch and folder are correct
3. Wait 5-10 minutes for first deployment
4. Check for build errors in Actions tab

### Styles Not Applying

1. Ensure Tailwind CDN is loading:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   ```
2. Check browser console for errors
3. Clear browser cache

### Links Not Working

1. Use relative paths for internal links
2. Use absolute URLs for external links
3. Ensure filenames match exactly (case-sensitive)

## 🚀 Future Enhancements

- [ ] Real-time data from GitHub API
- [ ] Interactive charts and graphs
- [ ] User authentication via GitHub OAuth
- [ ] Webhook integration for live updates
- [ ] Dark mode toggle
- [ ] Mobile app (PWA)

## 📞 Support

- **Documentation**: See parent repository README
- **Issues**: GitHub Issues for bug reports
- **Questions**: GitHub Discussions

## 📄 License

Part of SmartContractAudit project, following the same license.

---

**Deployment URL**: https://solanaremix.github.io/SmartContractAudit/  
**Status**: Static site (no backend)  
**Framework**: Tailwind CSS + Vanilla JavaScript
