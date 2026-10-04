# Relay — AI Team for Solo Founders ⚡

> **Release Ops for Developers**: The automated distribution, marketing, and changelog engine triggered directly from git releases.

Turn git releases into punchy 𝕏 threads, LinkedIn founder stories, changelogs, and vector social cards with 1-tap review.

---

## 🚀 Key Features (v1.0.0)

- 🌐 **High-Conversion Developer Landing Page (`/`)**: Linear/Raycast devtool aesthetic with an interactive live sandbox, before/after voice diff, comparison matrix, and transparent founder pricing.
- 📥 **Approval Inbox (`/queue`)**: Requirement F4 safety — zero autonomous publishing without explicit founder review. 1-tap Approve, inline edit, or reject.
- 🧭 **Editorial Onboarding Guide**: Interactive 4-step walkthrough with persistent milestone tracking and 1-click sandbox release testing.
- 🧠 **Product Memory Engine (`/products`)**: Define elevator pitch, target audience, pricing, and forbidden buzzwords once; context is preserved for every future release.
- 🎨 **Deterministic SVG Designer**: Real mathematical 1200x630 vector cards with blueprint grid and stored brand tokens. Zero blurry AI hallucinations or watermarks.
- 🔄 **Semantic Voice Learning Loop**: Calculates edit deltas whenever you tweak a draft, dynamically extracting persistent rules (e.g. lowercase intro, metric-first).
- 🔐 **Cryptographic GitHub HMAC SHA-256**: Timing-safe verification on incoming `X-Hub-Signature-256` webhook payloads.
- 📋 **Zero-Risk Clipboard Fallback**: 1-click copy modal with formatted media download ensures you're never blocked by expired API tokens.
- 📊 **Weekly Distribution Digest (`/digest`)**: Track approval rates, founder hours saved, and distribution analytics.
- 🔑 **Clerk Core 3 Authentication**: Production-ready auth linked with Clerk CLI.

---

## 🛠️ Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/queue
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/queue

# GitHub Webhook Security
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

# Live AI (Optional: deterministic rule-based fallback active by default)
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Run Development Server
```bash
npm run dev
```
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Release Queue**: [http://localhost:3000/queue](http://localhost:3000/queue)
- **Product Memory**: [http://localhost:3000/products](http://localhost:3000/products)
- **Weekly Digest**: [http://localhost:3000/digest](http://localhost:3000/digest)
- **Webhook Docs**: [http://localhost:3000/webhooks](http://localhost:3000/webhooks)

---

## 🧪 Verification & Pre-flight Testing

Run the automated test suites to verify end-to-end functionality before deploying:

```bash
# Test Marketer, Designer, Voice Learning, & Fallback engine
npx tsx scripts/test-pipeline.ts

# Test Timing-Safe GitHub HMAC SHA-256 Signature Verification
npx tsx scripts/test-hmac.ts

# Verify production Turbopack build
npm run build
```

---

## 🚢 Production Deployment

1. **Deploy to Vercel / Node**:
   - Push to your GitHub repository.
   - Import project on [Vercel](https://vercel.com).
   - Configure Environment Variables from `.env.local`.
2. **Setup GitHub Webhooks**:
   - Go to your repository **Settings &rarr; Webhooks &rarr; Add webhook**.
   - Payload URL: `https://your-domain.com/api/webhooks/github`
   - Content type: `application/json`
   - Secret: value matching `GITHUB_WEBHOOK_SECRET`
   - Select events: **Releases** and **Pushes (tags)**.
