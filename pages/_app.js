import "bootstrap/dist/css/bootstrap.css";
import { buildClient } from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  let currentUser = null;
  try {
    const { data } = await client.get("/api/users/currentUser");
    currentUser = data?.currentUser ?? null;
  } catch {
    // SSR cannot reach API (wrong SERVER_SIDE_API_URL, DNS, ingress, etc.) — avoid hard 500.
  }
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      currentUser
    );
  }
  return { pageProps, currentUser };
};

export default AppComponent;
