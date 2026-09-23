# Deployment & Environment Checklist

## 1. Environment Variables (.env.local)

```
# Database
MONGODB_URI=

# NextAuth
NEXTAUTH_SECRET=          # generate via: openssl rand -base64 32
NEXTAUTH_URL=             # e.g. https://youragency.com

# Email (Resend)
RESEND_API_KEY=
ADMIN_NOTIFY_EMAIL=

# Media
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=

# WhatsApp Business API (optional)
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_ID=
```

## 2. Hosting Setup

| Service | Purpose | Notes |
|---|---|---|
| **Vercel** | Frontend (Next.js) | Auto handles SSR/ISR, connect GitHub repo for CI/CD |
| **MongoDB Atlas** | Database | Free M0 tier fine to start; enable IP allowlist for Vercel |
| **Cloudinary** | Media/images | Free tier sufficient initially |
| **Resend** | Transactional email | Verify sending domain (SPF/DKIM) for deliverability |
| **Cloudflare (optional)** | DNS + CDN | If domain not managed via Vercel directly |

## 3. Pre-Launch Checklist

- [ ] Create initial `AdminUser` (owner) via seed script — do not expose a public signup route
- [ ] Set `NEXTAUTH_SECRET` — never reuse dev secret in production
- [ ] Enable MongoDB Atlas automated backups
- [ ] Set up custom domain + SSL (auto via Vercel)
- [ ] Add `robots.txt` and `sitemap.xml` (Next.js supports dynamic sitemap generation)
- [ ] Verify Open Graph tags render correctly (test via WhatsApp/Facebook link preview)
- [ ] Set up Google Search Console + submit sitemap
- [ ] Set up Google Analytics / Plausible for traffic tracking
- [ ] Test booking flow end-to-end (form → DB → email to admin + customer)
- [ ] Rate-limit test on booking/review endpoints
- [ ] Mobile responsiveness pass (majority of tourist traffic is mobile)
- [ ] Lighthouse audit (aim 90+ on Performance/SEO/Accessibility)
- [ ] Set up error monitoring (Sentry free tier)
- [ ] Client training/handoff session on admin panel

## 4. Post-Launch

- [ ] Monitor booking inquiry response time (client should reply fast — affects conversion)
- [ ] Review Search Console weekly for indexing issues
- [ ] Periodic MongoDB backup verification
