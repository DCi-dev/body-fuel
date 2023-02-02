// @ts-check

import { env } from "./src/env/server.mjs";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /* If trying out the experimental appDir, comment the i18n config out
   * @see https://github.com/vercel/next.js/issues/41980 */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "cdn.discordapp.com",
      "lh3.googleusercontent.com",
      `${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com`,
    ],
  },
};
export default config;
