import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

const UploadSkill = () => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(!isAuthenticated);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    phone: ""
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://vmalombe.pythonanywhere.com/upload-skill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Correct placement for session-based authentication
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Skill uploaded successfully!" });
        setFormData({ title: "", description: "", location: "", phone: "" });
      } else {
        setMessage({ type: "error", text: data.error || "An error occurred." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>Upload Your Skill</h2>
      {isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
              {message.text}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Skill Title</label>
            <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. DSTV Installation" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} placeholder="Briefly describe your skill..." required></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Nairobi, Kenya" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +254712345678" required />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      ) : (
        <p className="text-danger">You must log in to upload a skill.</p>
      )}

      {/* Show login modal if not authenticated */}
      <AuthModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default UploadSkill;
