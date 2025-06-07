import { FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-primary text-light pt-5 pb-4">
      <div className="container">
        <div className="row">

          {/* Brand */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="fw-bold text-white">MyMarketplace</h5>
            <p className="text-light small">
              A trusted platform for connecting buyers and sellers with ease.
            </p>
          </div>

          {/* Company Links */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="fw-semibold text-white mb-3">Company</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="fw-semibold text-white mb-3">Account</h6>
            <ul className="list-unstyled">
              <li><a href="/login" className="text-light text-decoration-none">Login</a></li>
              <li><a href="/register" className="text-light text-decoration-none">Register</a></li>
              <li><a href="/profile" className="text-light text-decoration-none">Profile</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="fw-semibold text-white mb-3">Follow Us</h6>
            <div className="d-flex gap-3 fs-5">
              <a href="#" className="text-light"><FaFacebookF /></a>
              <a href="#" className="text-light"><FaTwitter /></a>
              <a href="#" className="text-light"><FaGithub /></a>
              <a href="#" className="text-light"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center pt-4 border-top border-white mt-4 text-light small">
          &copy; {new Date().getFullYear()} MyMarketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
