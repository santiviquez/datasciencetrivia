import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * script-src needs 'unsafe-inline' because Next streams the RSC payload through
 * inline <script> tags. The alternative — a per-request nonce set from
 * middleware — would force all 135 pages to render dynamically and give up the
 * fully static build, which is a bad trade here: this site has no user input,
 * no query params it reflects, no auth, no cookies and no database, so there is
 * no injection path for inline script to be the vector for. The remaining
 * directives still do real work: they stop external script/style/frame loads,
 * block plugins and base-tag hijacking, and forbid framing the site at all.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "connect-src 'self' https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
