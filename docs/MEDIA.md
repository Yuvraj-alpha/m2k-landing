# Media Guide

Every image and video URL on the site lives in one file:
[src/config/media.ts](../src/config/media.ts). Components import from there,
never from a literal URL. This guide is how you fill it in.

**Status: all 12 assets are empty strings.** The site renders designed
placeholders instead of broken images, so it stays deployable — but this is the
biggest remaining pre-launch task.

---

## The pipeline

```
source file  →  compress  →  upload to blob storage  →  paste URL into media.ts
                                                     →  allow host in next.config.ts
```

Nothing else changes. No component edits, no imports to update.

### Why not just put them in `public/`?

You could, and for a site this size it would work. Two reasons not to:

- The raw source is ~635MB of phone photos and video. Anything in `public/` is
  committed to git and shipped in the deployment. Blob storage keeps the repo
  small and the deploys fast.
- Blob URLs can be swapped without a redeploy.

If you do decide on `public/`, use root-relative paths (`/media/hero.webp`) in
`media.ts` and skip the `remotePatterns` step entirely — `next/image` does not
validate local paths.

---

## Step 1 — Find the sources

Source files live **outside** this repo, in the parent directory, so the raw
footage never enters the build:

```
../kamm di photos/          the usable shoot
../WEBSITE SAMPLES/ONE/     assets from the legacy static site
../faltu photos/            excluded entirely, per the folder name
```

Findings from auditing those folders — do not rediscover these:

- `IMG20260711182143.jpg` and `IMG20260711182143(1).jpg` are **byte-identical**.
  Same for the three copies of `VID20260711182117.mp4`. Upload one of each.
- Photos are 5–9MB straight off a phone. They must be resized before upload.
- Videos are 17–49MB. They must be compressed before upload.
- `MACHINE CLOSEUP.jpg` is only 51KB and slightly soft. Usable as a
  low-opacity texture, too low-resolution for a full-bleed product hero. Worth
  a reshoot.
- `logo_image.png` is a raster of the full horizontal lockup. It will look soft
  in the glass header — **vectorise it to SVG before launch.**

## Step 2 — Compress

Targets: **max 2400px wide, WebP or AVIF, under ~300KB** for stills.
**~4MB, 1080p, H.264 MP4** for the hero loop.

With ImageMagick + `cwebp`:

```bash
# Resize and convert one photo
magick "IMG20260711181901.jpg" -resize 2400x\> -quality 82 plant-wide.webp
```

With `sharp-cli` (no system deps beyond npm):

```bash
npx sharp-cli --input "IMG20260711181901.jpg" --output ./out \
  resize 2400 --withoutEnlargement -- avif --quality 60
```

Video, with ffmpeg:

```bash
ffmpeg -i "VID20260713103311.mp4" \
  -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow \
  -an \                          # muted loop — drop the audio track entirely
  -movflags +faststart \         # lets playback start before the file finishes
  hero-line.mp4

# Poster frame, pulled from the video itself if factory_main.jpg won't do
ffmpeg -i hero-line.mp4 -ss 00:00:02 -frames:v 1 hero-poster.webp
```

`-an` matters: the hero plays muted and looped, so shipping an audio track is
pure wasted bytes. `+faststart` matters on mobile connections.

## Step 3 — Upload

**Vercel Blob** (recommended if hosting on Vercel):

```bash
npm i -D @vercel/blob    # not currently a dependency
npx vercel blob put ./hero-line.mp4 --rw-token $BLOB_READ_WRITE_TOKEN
```

It prints a public URL of the form
`https://<account>.public.blob.vercel-storage.com/hero-line-<hash>.mp4`.

Any static host works — Cloudflare R2, S3 + CloudFront, even a `/media` folder
on existing hosting. The only requirement is a stable public HTTPS URL.

## Step 4 — Paste the URLs

Open [src/config/media.ts](../src/config/media.ts) and fill in each `src`. Each
entry already carries a `SOURCE:` comment naming the file it expects.

Two fields you must keep honest:

- **`alt`** — already written for every asset, and it is a real accessibility
  surface. If you swap in a different photo than the one the `SOURCE:` comment
  names, rewrite the alt text to describe what is actually in the frame.
- **`width` / `height`** — the *intrinsic* pixel dimensions of the file you
  uploaded. These reserve layout space and prevent cumulative layout shift. If
  you resize to 2400px wide, update `width` to 2400 and scale `height` to
  match. Wrong numbers here mean a visibly jumping page on slow connections.

## Step 5 — Allow the host

[next.config.ts](../next.config.ts) ships with `images.remotePatterns` empty
and commented out. Until you fill it in, `next/image` rejects every remote URL
at runtime.

```ts
remotePatterns: [
  {
    protocol: "https",
    hostname: "<account>.public.blob.vercel-storage.com",
    pathname: "/**",
  },
],
```

Keep `pathname` tight if the storage account is shared with anything else — in
Next 16, a redirect from an allowed host is followed **without** re-validating
these patterns.

---

## The asset inventory

| Key in `media.ts` | Source file | Used on | Target |
|---|---|---|---|
| `brand.logoFull` | `WEBSITE SAMPLES/ONE/logo_image.png` | Header, footer | **SVG**, not raster |
| `brand.logoMark` | crop the roundel from the above | Icons, compact header | SVG, square |
| `hero.video` | `kamm di photos/VID20260713103311.mp4` | Home hero | ~4MB MP4, muted, 1080p |
| `hero.poster` | `WEBSITE SAMPLES/ONE/factory_main.jpg` | Hero fallback | 1920×1080 WebP |
| `products["machine-grade-stretch-film"]` | `kamm di photos/MACHINE CLOSEUP.jpg` | Product card + page | ⚠️ low-res, consider reshoot |
| `products["silage-film"]` | `kamm di photos/SILAGE FILM APPLICATION.jpg` | Product card + page | Strongest image in the set — lead with it |
| `products["manual-grade-stretch-film"]` | `kamm di photos/MANUAL GRADE.jpg` | Product card + page | 1600×1200 |
| `products["coloured-stretch-film"]` | `WEBSITE SAMPLES/ONE/coloured_film.jpg` | Product card + page | 1600×1200 |
| `facility.plantWide` | `kamm di photos/IMG20260711181901.jpg` | About, Quality | 2400×1800 |
| `facility.extrusionLine` | `kamm di photos/IMG20260711181904.jpg` | About, Quality | 2400×1800 |
| `facility.windingStation` | `kamm di photos/IMG20260711182139.jpg` | About, Quality | 2400×1800 |
| `facility.finishedRolls` | `kamm di photos/IMG20260711182143.jpg` | About, Quality | 2400×1800 — ignore the `(1)` duplicate |

---

## How the placeholder behaves

[MediaFrame](../src/components/common/media-frame.tsx) checks `hasMedia(asset)`
and renders a designed glass surface when `src` is empty — same lighting logic
as the page backdrop, so placeholders sit in the composition rather than
looking like errors.

This is why you can fill the manifest in incrementally. Upload the silage photo
today and the rest next week; nothing breaks in between.

`getProductMedia(slug)` returns an empty-but-valid asset for an unknown slug
rather than throwing, so adding a product to `products.ts` can never crash a
page just because its photo has not been uploaded yet.

---

## Adding a new asset

1. Add the entry to the right group in `media.ts`, with a `SOURCE:` comment,
   real `alt`, and intrinsic dimensions.
2. Import it where you need it and pass it to `<MediaFrame>`.
3. If it is a product photo, the key **must** match the product's `slug` in
   [products.ts](../src/config/products.ts), or `getProductMedia` will silently
   return the empty fallback.
