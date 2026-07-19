import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile-time checking of every <Link href>. Cheap insurance on a site
  // whose routes are generated from config/products.ts.
  typedRoutes: true,

  images: {
    // TODO: replace with the real blob-storage host once media is uploaded,
    // then fill in the URLs in src/config/media.ts.
    //
    // Next 16 note: a redirect from an allowed host is followed WITHOUT
    // re-validating these patterns, so keep `pathname` tight if the storage
    // account is shared.
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "<account>.public.blob.vercel-storage.com",
      //   pathname: "/**",
      // },
    ],

    // Next 16 requires qualities to be declared explicitly; anything not
    // listed is coerced, and direct API hits with an unlisted value 400.
    qualities: [75, 90],

    formats: ["image/avif", "image/webp"],
  },

  // Note: `next build` no longer runs ESLint (the `eslint` config key was
  // removed in Next 16 along with `next lint`). Linting runs via `npm run lint`
  // and should be wired into CI separately.
};

export default nextConfig;
