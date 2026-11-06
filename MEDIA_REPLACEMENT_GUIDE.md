# Replacing CareLogic media

All media paths live in `src/config/media.ts`. No page layout changes are required. Keep this file as the single source of truth; `site.ts` derives its media aliases from it.

## Images

1. Place an authorized JPG, WebP, AVIF, or PNG in `public/images/`.
2. Update the corresponding `src` in the table below to `/images/your-filename.webp` (do not include `/public`).
3. Write meaningful alt text. Set `stock: false` only after verifying the image is authorized company photography. This removes its stock label.
4. Optionally use `position: '50% 35%'` to adjust the crop without changing layout.
5. Run the build and inspect desktop and mobile crops. The shared Photo component keeps a stable aspect ratio, crops with object-fit, and uses the local fallback if a source fails. Local assets use Next.js image optimization; remote stock assets use the source CDN's width/quality parameters. Images below the hero are lazy loaded.

| Configuration key | Placement | Suggested file | Recommended source dimensions |
|---|---|---|---|
| `hero` | Homepage hero | `care-at-home.webp` | 1600 × 1800, subject centered |
| `about` | Mission and About | `carelogic-about.webp` | 1600 × 1200 |
| `services['skilled-nursing-care']` | Card, listing, detail | `skilled-nursing.webp` | 1600 × 1200 |
| `services['home-health-care']` | Card, listing, detail | `home-health.webp` | 1600 × 1200 |
| `services['occupational-therapy']` | Card, listing, detail | `occupational-therapy.webp` | 1600 × 1200 |
| `services['adult-foster-care']` | Card, listing, detail | `adult-foster-care.webp` | 1600 × 1200 |
| `services['physical-therapy']` | Card, listing, detail | `physical-therapy.webp` | 1600 × 1200 |
| `services['staffing-solution']` | Card, listing, detail | `healthcare-staffing.webp` | 1600 × 1200 |
| `video.poster` | Homepage thumbnail and player poster | `video-placeholder.jpg` | 1920 × 1080 |
| `fallback` | Automatically shown after an image load error | Existing `media-fallback.svg` | Keep as provided or replace with branded artwork |

Aim for image files under 400 KB where practical. Do not stretch images or add text into photography. Stock imagery is illustrative and must never be described as photographs of CareLogic staff or patients. The footer disclosure should be revised only once stock images have all been replaced.

## Original company logo

The temporary teal/navy text wordmark appears while `media.logo.src` is empty. It includes “Compassion in Every Touch.” Place the authorized original at `public/images/carelogic-logo.png`, then set `logo.src` to `/images/carelogic-logo.png`. Set `logo.width` and `logo.height` to the image's actual aspect ratio, and revise its alt text if necessary. The shared header/footer logo automatically switches to the image and preserves its proportions. A transparent image is preferred. Remove the temporary-wordmark footer disclosure when the authentic logo is active.

## Homepage MP4

1. Place the final authorized H.264/AAC MP4 at `public/videos/carelogic-introduction.mp4`.
2. Set `media.video.src` to `/videos/carelogic-introduction.mp4`. Keep it empty until the file exists; empty means a friendly coming-soon dialog.
3. Replace `video.poster` as above. Put WebVTT captions in `public/videos/carelogic-introduction.en.vtt` and set `video.captions` to `/videos/carelogic-introduction.en.vtt`.
4. The thumbnail label automatically switches from “Coming soon” when a video path is configured.
5. Check opening, controls, captions, Escape, backdrop close, keyboard focus return, and narrow screens. No video is mounted until the visitor clicks. The player uses `preload="none"`, no autoplay, and is unmounted when closed. Playback load failures switch to the friendly coming-soon state.

Use a reasonably compressed 1080p MP4. Very large video files should use a client-approved streaming/CDN plan with corresponding CSP adjustments rather than increasing the initial homepage payload.

## Initial photo sources and rights

Initial images use the regular Unsplash image CDN. Their photo IDs are recorded directly in the configuration; the license is https://unsplash.com/license. No Judah images or CareLogic legacy photographs were copied. Confirm subject/model releases and appropriateness for healthcare marketing before public launch; a stock license alone does not establish endorsement by identifiable subjects. Replace any unsuitable image. Local fallback artwork was created for this project.

