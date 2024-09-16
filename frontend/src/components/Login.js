import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useApiCall } from "../services/api";

const Login = (props) => {
  const { apiCall } = useApiCall();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password should be at least 8 characters long";
      valid = false;
    } else if (formData.password.length > 20) {
      newErrors.password = "Password should not exceed 20 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await apiCall('post', '/api/auth/login', formData, false);
        const data = await response;
        localStorage.setItem("token", data?.token);
        toast.success(data?.message || "Logged in successfully");
        setTimeout(() => {
            props.setIsAuthenticated(true);
            navigate("/users");
        }, 1000);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div>
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>
        <button type="submit" className="btn btn-success submit-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
