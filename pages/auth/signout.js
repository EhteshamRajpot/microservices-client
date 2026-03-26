import {useEffect} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const Signout = () => {
  const { doRequest } = useRequest({
    url: "https://ticketing.dev/api/users/signout",
    method: "post",
    onSuccess: () => Router.push("/"),
  });
  useEffect(() => {
    const doSignout = async () => {
      await doRequest();
      Router.push("/");
    };
    doSignout();
  }, []);
  return <h1>Signing you out...</h1>;
};

export default Signout;