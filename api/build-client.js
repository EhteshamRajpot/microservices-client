import axios from "axios";
import https from "https";

export const buildClient = ({ req }) => {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    return axios.create({ baseURL: "/" });
  }

  const isInKubernetes = Boolean(process.env.KUBERNETES_SERVICE_HOST);
  const headers = req?.headers ?? {};

  if (isInKubernetes) {
    // When SSR runs in-cluster, call the auth service directly.
    return axios.create({
      baseURL: "http://auth-srv:3000",
      headers,
    });
  }

  // When SSR runs locally (npm run dev), use the public dev domain.
  // Many local setups use a self-signed cert; relax TLS only in non-production.
  return axios.create({
    baseURL: "https://ticketing.dev",
    headers: { ...headers, Host: "ticketing.dev" },
    ...(process.env.NODE_ENV !== "production"
      ? { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
      : {}),
  });
};