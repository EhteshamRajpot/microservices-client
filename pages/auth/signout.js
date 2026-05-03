import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const Signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => Router.push("/"),
  });
  useEffect(() => {
    void doRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only sign-out
  }, []);
  return <h1>Signing you out...</h1>;
};

export default Signout;