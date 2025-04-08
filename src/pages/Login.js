import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth(); // Use login function from AuthContext

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://vmalombe.pythonanywhere.com/login",
        credentials,
        {
          withCredentials: true, // ✅ Sends cookies/session with request
          headers: {
            "Content-Type": "application/json", // ✅ Explicitly set headers
          }
        }
      );
      
   

      alert(response.data.message);/* 
 */
      if (response.data.user) {
        login(response.data.user); // Update AuthContext
        window.location.href = "/"; // Refresh page & redirect to Home
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(to right, #4A90E2, #50BFA5)" }}>
      <div className="card shadow-lg p-4 rounded" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center fw-bold mb-3">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={credentials.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={credentials.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">Log In</button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup" className="fw-bold text-primary">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
