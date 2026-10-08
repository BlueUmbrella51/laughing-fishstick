# Salesforce Data 360 Web SDK Demo — GitHub Pages

A static, no-build demo with consent, page views, product events, add-to-cart, CTA clicks, identification, and a local event log.

## Deploy on GitHub Pages

1. Create a **public** GitHub repository (e.g. `salesforce-event-lab`).
2. Upload `index.html` and `config.js` to the repository root and commit them.
3. Go to **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
4. Open `https://YOUR_USERNAME.github.io/salesforce-event-lab/` after deployment. GitHub Pages provides HTTPS.
5. In Salesforce Data 360, configure a **Web Connector** / Web SDK and obtain the Salesforce-generated JavaScript loader snippet. Paste the exact snippet into `config.js` and commit. SDK installation details vary by Salesforce configuration and SDK version.
6. Allowlist/configure the exact GitHub Pages origin and site URL in Salesforce wherever your connector requires it. Ensure your schema, event mappings, and identity mapping match the events in `index.html`.
7. On the website, opt in to tracking, click **Initialize SDK**, then test events. Inspect browser DevTools **Network** and Salesforce Data 360 ingestion results to verify delivery.

## Important

- The demo calls `SalesforceInteractions.init`, `sendEvent`, and `updateConsents` and expects `window.SalesforceInteractions` from the Salesforce SDK loader.
- The event names and payloads are **illustrative**, not guaranteed to match your Salesforce Web Connector schema. Customize them to the actual Salesforce schema / supported event shape.
- The consent checkbox is a demo only; for a real website implement a proper consent management platform, persistent consent preferences, and legally appropriate consent handling.
- Do **not** put private credentials or tokens in this public GitHub repository.
- GitHub Pages is free for eligible public repositories, but Salesforce licensing/ingestion may incur costs.
- The on-screen log reports calls to the SDK; it does not guarantee server-side ingestion.
