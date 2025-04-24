import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 Make sure you're using react-router-dom v6+

function Register() {
  const [form, setForm] = useState({
    name: "",
    regNumber: "",
    course: "",
    password: "",
    confirmPassword: "",
    color: "",
    city: "",
  });

  const navigate = useNavigate(); // ✅ Initialize navigate for redirection

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://vmalombe.pythonanywhere.com/register",
        {
          name: form.name,
          regNumber: form.regNumber,
          course: form.course,
          password: form.password,
          color: form.color,
          city: form.city,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login"); // ✅ Redirect to login page
      }
    } catch (error) {
      console.error(error);
      alert("Error registering student.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Student Registration</h3>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Registration Number"
                  name="regNumber"
                  value={form.regNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Course"
                name="course"
                value={form.course}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h5 className="mb-3">Security Questions</h5>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="What's your favorite color?"
                name="color"
                value={form.color}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="What's your favorite city?"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
