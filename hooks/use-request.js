import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          {err.response.data.errors.map((err) => (
            <div key={err.message}>{err.message}</div>
          ))}
        </div>
      );
    }
  };
  return { doRequest, errors };
};
