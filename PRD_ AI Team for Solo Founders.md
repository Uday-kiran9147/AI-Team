# PRD: AI Team for Solo Founders (working title)

## 1. Problem

A solo founder who codes also has to market, design, support users, and run ops. Development gets done; everything else slips. Existing AI tools are blank slates: the founder re-explains the product every time, and the output still needs manual work to ship.

## 2. Goal

Give a developer-founder the output of a small non-dev team. The founder writes code; the product handles distribution, assets, user feedback, and reporting, and asks for approval only on the final output.

**Success metric:** hours saved per week per founder (target: 5+), and share of AI drafts approved with no or light edits (target: 70%+ by week 4).

## 3. Target User

Solo or two-person founders who build in code, run one or more live products, and have no marketing, design, or support help. Early adopter: the builder himself, using it on his own products.

## 4. Scope (MVP)

### In scope

1. **Product memory:** connect a GitHub repo and a short brief (audience, tone, pricing, brand colors/fonts). Supports multiple products per account.
2. **Marketer agent:** detects a release or meaningful merged PRs, then drafts a launch post, short thread, and changelog entry in the founder's voice.
3. **Designer agent:** generates a matching image (OG card or social graphic) from brand tokens and templates.
4. **Approval inbox:** one queue of ready items. Approve, edit, or reject each in a tap. Edits are stored to improve future drafts.
5. **Publishing:** post to X and LinkedIn on approval, with a copy-and-paste fallback if an API fails.
6. **Weekly digest:** what shipped, what was posted, and how it performed.

### Out of scope (v2+)

- Support agent (email, reviews, DMs into replies and tickets)
- Growth agent (finding communities, outreach drafts)
- Ops agent (costs, revenue, renewals)
- Auto-approve for trusted categories
- Team accounts

## 5. Key User Flow

1. Founder connects repo and fills the brief (about 10 minutes).
2. Founder merges a release.
3. Product drafts post + image and sends a notification (Telegram or email).
4. Founder opens the inbox, tweaks one line, approves.
5. Post goes live; results appear in the weekly digest.

## 6. Functional Requirements

| # | Requirement |
| --- | --- |
| F1 | GitHub webhook triggers a draft on release or a tagged merge |
| F2 | Drafts use product memory plus a voice profile built from past approved/edited posts |
| F3 | Image generation uses stored brand tokens, never free-form styling |
| F4 | Nothing is published without explicit approval |
| F5 | Every edit is logged and fed back into the voice profile |
| F6 | Basic performance tracking per post (impressions, clicks) |

## 7. Non-Functional Requirements

- Draft ready within 2 minutes of a release
- Tokens for social accounts stored encrypted
- Graceful failure: if a platform API is down, the item stays in the inbox with copy-ready text

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Output sounds generic or AI-written | Voice profile from edits is the core feature; show before/after examples during onboarding |
| Founder doesn't trust automation | Approval required for everything in MVP |
| Social API limits or cost changes | Copy-paste fallback; keep platform layer swappable |
| Too many agents too early | Ship Marketer + Designer only, add others after usage proves demand |

## 9. Milestones

- **Week 1:** repo connection, product memory, brief form
- **Week 2:** draft generation pipeline (post + changelog)
- **Week 3:** image generation, approval inbox
- **Week 4:** publishing, digest, use it on own products daily

## 10. Validation Plan

Run on the founder's own products for 30 days. Track hours saved, approval rate, and post performance versus the previous month. If results are strong, invite 10 solo founders from the build-in-public community.

## 11. Open Questions

- Which interface will actually be opened daily: web app or Telegram bot?
- Pricing: flat monthly per product, or per founder?
- Which image style works best: templates only, or AI-generated visuals?