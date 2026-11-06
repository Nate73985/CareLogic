# Deployment preparation — approval required before publishing

Recommended target: Vercel using the Next.js preset and Node.js runtime. Source is prepared for GitHub but no repository has been created, pushed, or deployed.

## Before launch

1. Obtain approval, complete `ASSET_CHECKLIST.md`, and review the privacy draft.
2. Create a private GitHub repository and commit source plus `pnpm-lock.yaml`. Never commit secrets, uploads, `.next`, `node_modules`, or `.pnpm-store`.
3. Import it into Vercel with the `CareLogicHealth` project as root (or `.` if only that directory is pushed). Build `pnpm build`. Use Node 22 or later supported by the hosting provider. Do not use static export: form endpoints need a server runtime.
4. Set server-only variables from `.env.example`, with `SITE_URL` matching the exact deployed HTTPS origin. Configure production and approved preview environments independently. Protect preview deployments and avoid search indexing until launch.
5. Verify a Resend sender domain, set `MAIL_FROM`, and use a restricted server-side API key. Ensure the destination inbox exists. Configure SPF/DKIM/DMARC according to provider instructions.
6. Create Upstash Redis REST credentials. Deploy behind Vercel's trusted proxy; the rate limiter uses the platform-supplied forwarded client address. For a different host, adapt the IP source to that host's trusted proxy. Do not trust visitor-controlled forwarded headers on a directly exposed server.
7. Create a **private**, non-public Supabase Storage bucket named `resumes`, with a 4 MB bucket size limit and allowed PDF/DOC/DOCX MIME types. Do not grant anonymous read/write permissions. Store only the server service-role key in environment variables. Restrict staff access, enable operational audit records without logging application content, and rotate keys appropriately.
8. Configure a daily scheduled retention job to list private resume objects and remove those older than 30 days. Verify deletion with synthetic data. Assign an owner for that job, email retention, link reissue requests, and provider incident response. Signed URL expiry is not deletion. Enforce retention before collecting live applications.
9. Resume MIME, extension, and magic signatures are checked. Consider an isolated malware-scanning pipeline before granting staff access; do not treat signature validation as a malware guarantee. Avoid opening untrusted documents outside a protected viewer.
10. The public resume limit is 4 MB to allow multipart overhead within common serverless payload limits. The request reader independently bounds the entire multipart body at 6 MB. Confirm the selected host accepts this limit and test a file near 4 MB before launch.

## Live delivery test (synthetic information only)

1. Confirm the Contact Us page contains direct contact details and no submission form. Verify the retired contact POST endpoint returns 410. Career submission tests below must confirm Resend acceptance, delivery event, and actual receipt at `info@carelogichealth.com`; provider acceptance alone is not inbox delivery.
2. Submit synthetic resumes for PDF, DOC, DOCX. Confirm each exists only in the private bucket and the notification's signed URL retrieves it. Anonymous bucket access must fail. Verify expiry after one hour and test authorized staff retrieval/reissue procedures.
3. Reject wrong extensions, wrong MIME/signatures, oversized files, missing consent, empty fields, invalid emails, wrong Origin, and honeypot entries. Try a sixth submission in an hour and verify 429. Infrastructure failure should show an error, never a false success.
4. Temporarily invalidate delivery credentials in a protected test environment. Verify failure states and cleanup of any uploaded resume. Reconcile orphans after simulated timeouts using the retention job. A network timeout can leave delivery status uncertain; check provider records before resubmitting.
5. Check that logs, analytics, error trackers, Git history, and public URLs contain no resume contents or form values. Notifications contain personal information, so restrict mailbox access.
6. Check HTTPS, headers, metadata, canonical URLs, sitemap, robots, redirects, mobile navigation, keyboard focus, and video modal. Test real MP4 and captions when supplied.

Only after approval connect `carelogichealth.com` and change DNS. Set `SITE_URL` to that exact origin and verify the canonical host redirects. Confirm credentials in the actual production environment, then repeat synthetic delivery tests. Do not claim operational readiness until they pass.


