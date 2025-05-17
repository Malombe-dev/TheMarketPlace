import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://vmalombe.pythonanywhere.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          location: user.location,
          password: user.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        // backend might send { error: "..."} or { message: "..." }
        setErrorMessage(data.error || data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #4A90E2, #50BFA5)" }}
    >
      <div
        className="card shadow-lg p-4 rounded"
        style={{
          width: "400px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "15px",
        }}
      >
        <h3 className="text-center fw-bold">Create Account</h3>

        {errorMessage && (
          <p className="text-danger text-center">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={handleChange}
              value={user.name}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
              value={user.email}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              onChange={handleChange}
              value={user.phone}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              onChange={handleChange}
              value={user.dob}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              onChange={handleChange}
              value={user.location}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={handleChange}
              value={user.password}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              onChange={handleChange}
              value={user.confirmPassword}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold shadow-sm"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold text-primary">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
