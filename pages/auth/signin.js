import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "https://ticketing.dev/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await doRequest();
    console.log("handleSubmit response", response);
  };

  return (
    <div className="container">
      <h1>Signin</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Signin
        </button>
        {errors}
      </form>
    </div>
  );
};

export default SigninPage;
