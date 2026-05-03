import axios from "axios";
import https from "https";

function firstHeader(value) {
  if (value == null) return "";
  const s = Array.isArray(value) ? value[0] : value;
  return typeof s === "string" ? s.split(",")[0].trim() : "";
}

/**
 * Base URL for Next.js server-side requests (getInitialProps).
 *
 * Prefer `SSR_USE_FORWARDED_ORIGIN=true` in Kubernetes: use the same host the browser used
 * (`x-forwarded-host`), so you do not depend on `ingress-nginx-controller.<ns>.svc.cluster.local`
 * DNS (often wrong namespace → ENOTFOUND).
 *
 * Override order when env set:
 * - SSR_USE_FORWARDED_ORIGIN + forwarded headers (first)
 * - SERVER_SIDE_API_URL
 * - INTERNAL_INGRESS_URL (must match your cluster’s ingress Service DNS)
 */
function getServerSideBaseURL(req) {
  const forwardedHost = firstHeader(req?.headers?.["x-forwarded-host"]);
  const forwardedProto =
    firstHeader(req?.headers?.["x-forwarded-proto"]) || "https";

  if (
    process.env["SSR_USE_FORWARDED_ORIGIN"] === "true" &&
    forwardedHost.length > 0
  ) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  if (process.env.SERVER_SIDE_API_URL) {
    return process.env.SERVER_SIDE_API_URL;
  }
  if (process.env.INTERNAL_INGRESS_URL) {
    return process.env.INTERNAL_INGRESS_URL;
  }
  if (process.env.RUNNING_IN_DOCKER === "true") {
    return process.env.DOCKER_INGRESS_URL ?? "http://ingress-srv";
  }
  return "https://ticketing.dev";
}

/** Ingress routes API by Host: ticketing.dev */
function needsTicketingDevHostHeader(baseURL) {
  const u = baseURL.toLowerCase();
  if (u.includes("ticketing.dev")) return true;
  if (u.includes("ingress-nginx-controller")) return true;
  if (u.includes(".svc.cluster.local")) return true;
  if (u.includes("ingress-srv")) return true;
  return false;
}

export const buildClient = ({ req }) => {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    // Match hooks/use-request.js: same-origin `/api/...` only.
    // On localhost, next.config.js rewrites `/api/*` to the real gateway so cookies
    // stay first-party. Calling https://ticketing.dev from localhost skips session cookies.
    return axios.create({ baseURL: "", withCredentials: true });
  }

  const baseURL = getServerSideBaseURL(req);

  const omit = new Set(["host", "connection", "content-length"]);
  const raw = req?.headers ?? {};
  const incoming = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!omit.has(String(k).toLowerCase())) incoming[k] = v;
  }

  const fwdHost = firstHeader(raw["x-forwarded-host"]);
  const headers = needsTicketingDevHostHeader(baseURL)
    ? { ...incoming, Host: fwdHost || "ticketing.dev" }
    : incoming;

  const config = {
    baseURL,
    headers,
  };

  if (
    baseURL.startsWith("https") &&
    process.env.NODE_ENV !== "production"
  ) {
    config.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  }

  return axios.create(config);
};
