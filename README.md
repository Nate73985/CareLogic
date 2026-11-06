# CareLogic Health

Next.js App Router + TypeScript + Tailwind CSS, Lucide icons, and reduced-motion-aware Framer Motion. All twelve requested pages are included. Source repository: https://github.com/Nate73985/CareLogic (public). GitHub Pages deployment is configured; see `GITHUB_PAGES.md`.

## Run locally

Requires Node.js 20.9+ and pnpm 10+ (or npm).

```powershell
cd C:\Users\natha\Desktop\CareLogic\CareLogicHealth
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Open http://127.0.0.1:3000. Without external credentials forms return an honest unavailable state; they never simulate success. In this desktop session pnpm is bundled at `C:\Users\natha\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd`. Invoke that full path with PowerShell `&` if pnpm is absent from PATH. Installation in restricted Windows environments can use `--store-dir .pnpm-store --config.package-import-method=copy --config.node-linker=hoisted`.

```powershell
pnpm typecheck
pnpm build
pnpm start
```

## Structure

- `src/config/site.ts`: confirmed business identity and pending phone/address/service area.
- `src/config/media.ts`: every image, logo, poster, video, and caption path.
- `src/config/services.ts`: six services with distinct descriptions and support details.
- `src/components/`: shared responsive navigation, photos, video dialog, service cards, form UI.
- `src/app/api/`: server-only contact and career submissions.
- `src/lib/submissions.ts`: validation, size limits, rate limiting, upload and email orchestration.
- `MEDIA_REPLACEMENT_GUIDE.md`: exact media substitutions.
- `DEPLOYMENT.md`: serverless deployment and live delivery verification.

## Forms and privacy

Use `.env.local` for secrets, never commit it. The Contact Us page displays direct email/phone details and an address-based Google Maps embed; it has no email-sending form. Its former POST endpoint returns 410. Career applications go to the configured company inbox using Resend. Careers uploads enter a private Supabase bucket and notifications include a one-hour signed URL; resumes are never public project assets or email attachments. Upstash enforces five requests per form/IP per hour. Origin checks, honeypot, bounded body reading, Zod validation, extension/MIME/signature checks, and upload cleanup are implemented. Infrastructure failures fail closed. Provider acceptance is not proof of inbox delivery.

For production, follow the trusted proxy, upload size, retention, and security notes in `DEPLOYMENT.md`. File signature checks are defense in depth and not malware scanning. Do not submit real applicant information during setup. The privacy policy is a draft and explicitly marked for review.

The original requested age, driving-license and car-ownership questions were omitted as not established job requirements. Review role relevance with the client before adding them. No automatic eligibility decision is performed.

## Media and content

Stock photographs are visibly labeled illustrative; they do not represent actual CareLogic clients or staff. A local branded fallback prevents broken-image layouts if a CDN request fails. Only the homepage hero has priority loading. Text wordmark and video-coming-soon state remain complete without client assets. Remote images are served by the Unsplash CDN and should be replaced with approved local images before launch where possible.

Contact details remain hidden until verified. The map appears only when the address is configured. No fabricated reviews or unsupported credentials are included. The discontinued service has migration redirects only. Legacy redirects explicitly use HTTP 301. Confirm additional historical URLs from an export before adding mappings.

## Verification

Build and type checking should pass before deployment. Inspect navigation at 390, 768 and 1440 pixels; test all service links, FAQ details, the mobile menu, the skip link, and video dialog keyboard behavior. Follow `DEPLOYMENT.md` for provider delivery tests. Live delivery cannot be certified without configured credentials and inbox verification.




