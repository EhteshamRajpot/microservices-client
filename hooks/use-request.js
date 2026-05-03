import axios from "axios";
import { useState } from "react";

const axiosConfig = { withCredentials: true };

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response =
        method === "get"
          ? await axios.get(url, axiosConfig)
          : await axios[method](url, body, axiosConfig);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const messages = Array.isArray(apiErrors)
        ? apiErrors
        : [{ message: err.response?.data?.message ?? err.message ?? "Request failed" }];
      setErrors(
        <div className="alert alert-danger">
          {messages.map((e, i) => (
            <div key={i}>{e.message}</div>
          ))}
        </div>
      );
    }
  };

  return { doRequest, errors };
};
