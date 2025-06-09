import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [step, setStep] = useState(1);
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

  const validateStep = () => {
    if (step === 1 && (!user.name || !user.email)) {
      setErrorMessage("Please fill in all fields in this step.");
      return false;
    }
    if (step === 2 && (!user.phone || !user.dob || !user.location)) {
      setErrorMessage("Please fill in all fields in this step.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setErrorMessage("");
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://vmalombe.pythonanywhere.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        setErrorMessage(data.error || data.message || "Signup failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Signup error:", error);
    }
  };

  // Progress bar width based on step
  const getProgressWidth = () => {
    return `${(step / 3) * 100}%`;
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="card shadow-lg p-4 rounded" style={{ width: "400px", borderRadius: "15px" }}>
        <h3 className="text-center fw-bold">Create Account</h3>

        {/* Progress bar */}
        <div className="progress mb-3" style={{ height: "8px" }}>
          <div className="progress-bar" role="progressbar" style={{ width: getProgressWidth() }}></div>
        </div>

        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" name="name" value={user.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={user.email} onChange={handleChange} required />
              </div>
              <button type="button" className="btn btn-primary w-100" onClick={nextStep}>Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" name="phone" value={user.phone} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-control" name="dob" value={user.dob} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input type="text" className="form-control" name="location" value={user.location} onChange={handleChange} required />
              </div>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>Next</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" value={user.password} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required />
              </div>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
                <button type="submit" className="btn btn-success">Submit</button>
              </div>
            </>
          )}
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/login" className="fw-bold text-primary">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
