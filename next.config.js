const apiOrigin = (
  process.env.API_PROXY_TARGET ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://ticketing.dev"
).replace(/\/$/, "");

/** @type {import('next').NextConfig} */
module.exports = {
  allowedDevOrigins: ["ticketing.dev"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};
