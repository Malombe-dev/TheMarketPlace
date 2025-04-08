import React from "react";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Authentication Required</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>You must log in or create an account to continue.</p>
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary" onClick={() => navigate("/login")}>Log In</button>
              <button className="btn btn-secondary" onClick={() => navigate("/signup")}>Create Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
