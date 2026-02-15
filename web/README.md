# Web Control Panel

This directory contains the GitHub Pages scaffold for the SmartContractAudit control panel and dashboard.

## Contents

- **index.html** - Main dashboard showing recent scan runs, statistics, and artifacts
- **billing.html** - Sponsorship tiers and billing/payment page
- **README.md** - This file

## Setup Instructions

### Enable GitHub Pages

1. Go to your repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select:
   - Branch: `main` (or `cuberai-init` for testing)
   - Folder: `/web`
4. Click "Save"
5. GitHub will provide your site URL (e.g., `https://solanaremix.github.io/SmartContractAudit/`)

### Configuration

The web interface uses:

- **Tailwind CSS CDN** - For styling (no build step required)
- **Vanilla JavaScript** - No framework dependencies
- **Static HTML** - Can be hosted anywhere

### Integration with GitHub Actions

The dashboard is designed to display results from the GitAntivirus workflow:

1. Workflow runs create artifacts (SMARTBRAIN.log, AUDIT-REPORT.md, .quarantine/)
2. Artifacts are uploaded to GitHub Actions
3. Dashboard can fetch and display these artifacts via GitHub API

To integrate:

```javascript
// Example: Fetch workflow runs
const response = await fetch(
  'https://api.github.com/repos/OWNER/REPO/actions/runs',
  {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  }
);
const data = await response.json();
// Process and display workflow runs
```

### Billing Integration

The billing.html page includes placeholders for payment integration:

#### Stripe Checkout

1. Sign up at [stripe.com](https://stripe.com)
2. Create products for each sponsorship tier
3. Get your API keys (test keys first)
4. Update the `STRIPE_TEST_KEY` in billing.html
5. Implement server-side checkout session creation
6. Test with Stripe test cards
7. Replace with production keys when ready

**Test Card**: 4242 4242 4242 4242 (any future expiry, any CVC)

#### Cash App

For Cash App payments:

1. Set up a Cash App business account
2. Share your $cashtag
3. Manual invoice and confirmation process

### Sponsor Links

The web interface is complementary to the `.github/FUNDING.yml` file:

- **FUNDING.yml** - Shows up in GitHub UI ("Sponsor this project")
- **Web Interface** - Full-featured sponsorship and dashboard experience
- **Both** - Can link to each other for seamless experience

Update `.github/FUNDING.yml`:

```yaml
github: [your-github-username]
custom: ["https://solanaremix.github.io/SmartContractAudit/web/billing.html"]
```

## Features

### Dashboard (index.html)

- **Stats Overview**: Total scans, high severity issues, success rate
- **Recent Runs**: Table of recent security scans
- **Artifacts**: Links to download SMARTBRAIN.log, AUDIT-REPORT.md, .quarantine/
- **Sponsor CTA**: Call-to-action for sponsorship

### Billing (billing.html)

- **Sponsorship Tiers**: Bronze, Silver, Gold, Platinum
- **Pricing Details**: Monthly and annual pricing with savings
- **Payment Options**: Stripe, cryptocurrency, Cash App
- **Integration Instructions**: How to set up real payments

## Customization

### Branding

Update colors in both HTML files:

```javascript
// Current gradient
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// Change to your brand colors
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Content

- Update sponsor tier prices in billing.html
- Modify dashboard stats and layout in index.html
- Add custom sections as needed
- Update footer links

### Analytics

Add analytics tracking:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_ID');
</script>
```

## Security Notes

⚠️ **Important Security Considerations**:

1. **No Secrets**: Never commit API keys or secrets to HTML files
2. **Server-Side**: Payment processing must be server-side
3. **HTTPS**: Always use HTTPS for payment pages
4. **Validation**: Validate all user input server-side
5. **PCI Compliance**: Use Stripe Checkout (PCI compliant) rather than custom forms

## Development

### Local Testing

Serve locally for development:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Then visit http://localhost:8000
```

### Production Deployment

For production:

1. Test thoroughly with Stripe test mode
2. Replace test keys with production keys
3. Implement proper backend API for checkout
4. Add error handling and logging
5. Set up monitoring and alerts

## API Integration

To connect the dashboard to real scan data:

```javascript
// Fetch workflow runs from GitHub API
async function fetchWorkflowRuns() {
  const response = await fetch(
    'https://api.github.com/repos/SolanaRemix/SmartContractAudit/actions/runs',
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add authentication if needed for private repos
        // 'Authorization': 'token YOUR_TOKEN'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch workflow runs');
  }
  
  const data = await response.json();
  return data.workflow_runs;
}

// Fetch artifacts for a run
async function fetchArtifacts(runId) {
  const response = await fetch(
    `https://api.github.com/repos/SolanaRemix/SmartContractAudit/actions/runs/${runId}/artifacts`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch artifacts');
  }
  
  const data = await response.json();
  return data.artifacts;
}
```

## Troubleshooting

### GitHub Pages Not Working

- Check that Pages is enabled in repository settings
- Verify the correct branch and folder are selected
- Wait a few minutes for initial deployment
- Check the Actions tab for Pages build errors

### Stripe Integration Issues

- Verify API keys are correct (test vs production)
- Check browser console for errors
- Ensure server-side endpoint is accessible
- Test with Stripe test cards first

### Dashboard Not Loading Data

- Check GitHub API rate limits
- Verify repository name and owner are correct
- Ensure workflow has run at least once
- Check browser console for errors

## Support

For questions about the web interface:

- Open an issue on GitHub
- See main documentation in repository root
- Contact: sponsors@cuberai.example

## License

This web interface is part of the SmartContractAudit project and is licensed under Apache 2.0.

---

**Note**: This is a static site scaffold. Implement proper backend services for production use, especially for payment processing.
