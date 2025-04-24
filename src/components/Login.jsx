import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
      regNumber: "",
      password: "",
      color: "",
      city: "",
  });

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
          const response = await axios.post(
              "https://vmalombe.pythonanywhere.com/login",
              form,
              {
                  withCredentials: true, // Ensure cookies/session are sent
                  headers: {
                      "Content-Type": "application/json",
                  },
              }
          );

          if (response.status === 200) {
              alert("Login successful");
              localStorage.setItem("student", JSON.stringify(response.data)); // Save user info if needed
              // Redirect or update the state here
          }
      } catch (error) {
          if (error.response && error.response.status === 401) {
              alert(error.response.data.message);
          } else {
              alert("Login failed. Please check your credentials.");
          }
          console.error(error);
      }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Student Login</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" className="form-control mb-3" placeholder="Registration Number" name="regNumber" value={form.regNumber} onChange={handleChange} required />
            <input type="password" className="form-control mb-3" placeholder="Password" name="password" value={form.password} onChange={handleChange} required />
            <input type="text" className="form-control mb-3" placeholder="Favorite Color" name="color" value={form.color} onChange={handleChange} required />
            <input type="text" className="form-control mb-4" placeholder="Favorite City" name="city" value={form.city} onChange={handleChange} required />
            <button type="submit" className="btn btn-dark w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
