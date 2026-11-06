# GitHub Pages deployment

The repository includes `.github/workflows/pages.yml`. Once Pages is enabled with GitHub Actions as the source, every push to `main` builds and deploys the website at:

https://nate73985.github.io/CareLogic/

The owner approved making the repository public for free GitHub Pages hosting. Pages is configured to deploy from GitHub Actions.

## Build locally

```powershell
node scripts/build-pages.mjs
```

The builder copies source to the ignored `.pages-build/` directory, excludes server endpoints, and exports the final static site to ignored `out/`. It does not change the server application's source or read `.env.local` into the static build. Build configuration sets the `/CareLogic` base path and GitHub Pages canonical URL. Public media paths receive the same base path automatically from the central media configuration.

## Static hosting differences

- Contact details, phone links, Google Maps, all service pages, FAQ accordions, and the video dialog remain available.
- The careers page links to the contact page instead of rendering a server-dependent application form. No applicant information is collected by this static site.
- Existing backend code stays in the source repository for future serverless hosting, but no API handlers or credentials are included in the exported site.
- GitHub Pages does not run Next.js image optimization. Local images are served as static assets; remote photos retain CDN sizing.
- Pages does not support the custom response headers or HTTP 301 rules from the server build. Legacy URLs receive static HTML navigation fallbacks with a canonical link and a visible destination link instead.
- The normal `pnpm dev` and `pnpm build` still support the original server deployment. The Pages workflow explicitly invokes `scripts/build-pages.mjs`.
- Do not upload `.env.local`, resumes, private data, or credentials to Pages. The workflow requires no external service secrets; it uses GitHub's scoped deployment token.

No custom domain or DNS configuration is required for the github.io address.

