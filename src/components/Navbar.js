import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaBoxOpen, FaPlusCircle, FaUser, FaLightbulb, FaTools, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated && userId) {
        try {
          const res = await axios.get(
            `https://vmalombe.pythonanywhere.com/message/unread-count/${userId}`
          );
          setUnreadCount(res.data.unread_count || 0);
        } catch (err) {
          console.error("Failed to fetch unread messages", err);
        }
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, userId]);

  return (
    <nav className="navbar navbar-expand bg-primary px-2">
      <div className="container-fluid justify-content-between">
                <Link className="navbar-brand d-flex align-items-center text-white fw-bold fs-4" to="/">
            <img
              src="/images/logo.jpg" // Replace with your logo path or URL
              alt="Logo"
              width="30"
              height="30"
              className="me-2"
            />
            Marketplace
          </Link>


        <div className="d-flex flex-wrap gap-2">
          {/* Always visible links as icons */}
          <Link to="/" className="nav-link text-white px-2 d-flex flex-column align-items-center">
            <FaBoxOpen size={20} />
            <span className="d-none d-sm-inline">Home</span>
          </Link>

          <Link to="/browse-products" className="nav-link text-white px-2 d-flex flex-column align-items-center">
            <FaBoxOpen size={20} />
            <span className="d-none d-sm-inline">Products</span>
          </Link>

          <Link to="/browse-skills" className="nav-link text-white px-2 d-flex flex-column align-items-center">
            <FaTools size={20} />
            <span className="d-none d-sm-inline">Skills</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/upload-product" className="nav-link text-white px-2 d-flex flex-column align-items-center">
                <FaPlusCircle size={20} />
                <span className="d-none d-sm-inline">Upload Product</span>
              </Link>

              <Link to="/upload-skill" className="nav-link text-white px-2 d-flex flex-column align-items-center">
                <FaLightbulb size={20} />
                <span className="d-none d-sm-inline">Upload Skill</span>
              </Link>

              <Link to="/profile" className="nav-link text-white px-2 d-flex flex-column align-items-center">
                <FaUser size={20} />
                <span className="d-none d-sm-inline">Profile</span>
              </Link>

              <Link to="/messages" className="nav-link text-white px-2 d-flex flex-column align-items-center position-relative">
                <FaEnvelope size={20} />
                <span className="d-none d-sm-inline">Messages</span>
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>

              <button
                className="btn btn-sm btn-danger d-flex align-items-center px-2"
                onClick={logout}
              >
                <FaSignOutAlt className="me-1" />
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link text-white px-2 d-flex flex-column align-items-center">
                <FaSignInAlt size={20} />
                <span className="d-none d-sm-inline">Login</span>
              </Link>

              <Link to="/signup" className="nav-link text-white px-2 d-flex flex-column align-items-center">
                <FaUserPlus size={20} />
                <span className="d-none d-sm-inline">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
