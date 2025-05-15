import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa"; // Install if not already: npm install react-icons

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get("https://vmalombe.pythonanywhere.com/messages/unread-count")
        .then(res => {
          setUnreadCount(res.data.unread_count || 0);
        })
        .catch(err => {
          console.error("Failed to fetch unread messages", err);
        });
    }
  }, [isAuthenticated]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Marketplace</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to="/browse-products" className="nav-link">Products</Link></li>
            <li className="nav-item"><Link to="/browse-skills" className="nav-link">Skills</Link></li>

            {isAuthenticated && (
              <>
                <li className="nav-item"><Link to="/upload-product" className="nav-link">Upload Product</Link></li>
                <li className="nav-item"><Link to="/upload-skill" className="nav-link">Upload Skill</Link></li>
                <li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li>

                {/* Message Icon */}
                <li className="nav-item position-relative">
                  <Link to="/messages" className="nav-link">
                    <FaEnvelope size={20} />
                    {unreadCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>

                <li className="nav-item">
                  <button className="btn btn-danger ms-2" onClick={logout}>Logout</button>
                </li>
              </>
            )}

            {!isAuthenticated && (
              <>
                <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
                <li className="nav-item"><Link to="/signup" className="nav-link">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
