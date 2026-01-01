# Web Dashboard

## Overview

This directory contains a lightweight GitHub Pages scaffold for SmartContractAudit dashboard and billing pages.

## Files

- **index.html**: Main dashboard with scan results, artifacts, and quick links
- **billing.html**: Payment integration page with multiple payment options
- **README.md**: This file

## Features

### Dashboard (index.html)
- Scan statistics overview
- Recent scan runs table
- Artifact downloads
- Quick links to documentation
- Sponsor call-to-action
- Responsive design (Tailwind CSS)

### Billing (billing.html)
- Stripe Checkout integration (test mode)
- Cash App P2P payments
- GitHub Sponsors link
- Open Collective link
- Cryptocurrency support (placeholder)
- Integration instructions

## Deployment

### GitHub Pages

1. **Enable GitHub Pages**
   ```
   Settings → Pages → Source: Deploy from branch
   Branch: main → /web directory
   ```

2. **Access Your Site**
   ```
   https://[username].github.io/[repository]/
   ```

### Custom Domain (Optional)

1. Add custom domain in Settings → Pages
2. Create CNAME record pointing to [username].github.io
3. Wait for DNS propagation
4. Enable HTTPS

## Payment Integration

### Stripe Setup

1. **Create Stripe Account**
   - Visit https://stripe.com
   - Complete registration
   - Verify your business

2. **Get API Keys**
   - Dashboard → Developers → API Keys
   - Copy Publishable Key (starts with `pk_test_` or `pk_live_`)
   - **NEVER commit secret keys!**

3. **Update billing.html**
   ```javascript
   // Replace this line:
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_REPLACE_WITH_YOUR_TEST_KEY';
   
   // With your actual test key:
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_key';
   ```

4. **Create Products**
   - Dashboard → Products
   - Create donation products
   - Note the Price IDs

5. **Backend Required**
   - Stripe Checkout requires server-side session creation
   - Example backend (Node.js):
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   app.post('/create-checkout-session', async (req, res) => {
     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [{
         price: 'price_xxx', // Your price ID
         quantity: 1,
       }],
       mode: 'payment',
       success_url: 'https://yoursite.com/success',
       cancel_url: 'https://yoursite.com/cancel',
     });
     res.json({ id: session.id });
   });
   ```

### Cash App Setup

1. **Create Cash App Account**
   - Download Cash App
   - Create account
   - Set up Cash Tag

2. **Update billing.html**
   ```html
   <!-- Replace with your Cash Tag -->
   <code>$SmartContractAudit</code>
   ```

3. **Update Links**
   ```html
   <a href="https://cash.app/$YourCashTag">
   ```

### GitHub Sponsors

See [FUNDING.yml](../FUNDING.yml) for GitHub Sponsors configuration.

1. **Enable Sponsors**
   - Settings → Features → Sponsorships
   - Complete sponsor profile

2. **Update Links**
   - Replace sponsor links in billing.html
   - Update FUNDING.yml with your username

### Open Collective

1. **Create Collective**
   - Visit https://opencollective.com
   - Create collective for your project

2. **Update Links**
   - Replace Open Collective links
   - Add to FUNDING.yml

## Security Notes

### What NOT to Include

- ❌ Stripe Secret Keys (sk_test_xxx or sk_live_xxx)
- ❌ API credentials
- ❌ Private keys
- ❌ Database passwords
- ❌ User data

### What IS Safe to Include

- ✅ Stripe Publishable Keys (pk_test_xxx or pk_live_xxx)
- ✅ Cash App Tags (public)
- ✅ GitHub usernames
- ✅ Social media links
- ✅ Public wallet addresses

### Best Practices

1. **Environment Variables**: Use env vars for sensitive data
2. **Backend Processing**: Handle payments server-side
3. **HTTPS Only**: Always use HTTPS for payment pages
4. **Test Mode**: Test thoroughly before going live
5. **Rate Limiting**: Implement rate limiting on backend
6. **Logging**: Log transactions (not card data)
7. **PCI Compliance**: Follow PCI DSS guidelines

## Customization

### Colors

The dashboard uses Tailwind CSS. Key colors:
- Primary Blue: `blue-600`
- Success Green: `green-600`
- Warning Yellow: `yellow-600`
- Error Red: `red-600`

### Branding

1. Replace logo/brand name
2. Update color scheme
3. Add your own images
4. Customize footer links

### Content

1. Update statistics (currently placeholder)
2. Add real scan data
3. Link to actual artifacts
4. Update documentation links

## Development

### Local Testing

```bash
# Simple HTTP server
python -m http.server 8000
# or
npx serve web/

# Visit http://localhost:8000
```

### With Backend

If integrating with backend:

```bash
# Start your backend
npm start

# Open web files
# Update API endpoints in HTML
```

## Dynamic Data

To make dashboard dynamic, connect to your API:

```javascript
// Example: Fetch scan data
async function loadScans() {
  try {
    const response = await fetch('/api/scans');
    const scans = await response.json();
    
    // Update dashboard
    displayScans(scans);
  } catch (error) {
    console.error('Failed to load scans:', error);
  }
}
```

## Monitoring

### Analytics

Add Google Analytics or similar:

```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

Add Sentry or similar:

```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'your-dsn' });
</script>
```

## Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Cash App](https://cash.app)

## Support

For questions about the web dashboard:
- GitHub Issues
- Email: support@cuberai.example

---

*Last updated: 2026-01-01*
