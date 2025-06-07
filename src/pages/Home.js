import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [recentUserProducts, setRecentUserProducts] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setRecentUserProducts([]);
      setLocalProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get("https://vmalombe.pythonanywhere.com/homepage-data", {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setRecentUserProducts(data.recent_user_products || []);
        setLocalProducts(data.local_products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching homepage data:", error);
        setRecentUserProducts([]);
        setLocalProducts([]);
        setLoading(false);
      });
  }, [isAuthenticated]);

  const ProductCard = ({ product }) => (
    <Card className="shadow-sm border-0 rounded m-2" style={{ width: "260px", minHeight: "360px" }}>
      <Carousel>
        {[product.front_photo, product.back_photo, product.side_photo_1, product.side_photo_2].map(
          (photo, index) =>
            photo && (
              <Carousel.Item key={index}>
                <img
                  src={`${photo}?timestamp=${new Date().getTime()}`}
                  alt={product.product_name}
                  className="d-block w-100"
                  style={{ height: "180px", objectFit: "cover", borderRadius: "10px" }}
                />
              </Carousel.Item>
            )
        )}
      </Carousel>
      <Card.Body className="text-center p-2">
        <h6 className="mb-1 fw-bold">{product.product_name}</h6>
        <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>{product.category}</p>
        <p className="mb-1" style={{ fontSize: "0.85rem" }}>{product.location}</p>
        <p className="text-muted mb-2" style={{ fontSize: "0.75rem" }}>
          <strong>By:</strong> {product.posted_by || "Unknown"}
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate(`/product/${product.id}`)}>
          View
        </Button>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <div className="container mt-4">
      {isAuthenticated ? (
        <>
          {recentUserProducts.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-3">Your Recent Posts</h3>
              <div className="d-flex flex-wrap justify-content-center">
                {recentUserProducts.map((p, i) => (
                  <ProductCard key={i} product={p} />
                ))}
              </div>
            </div>
          )}

          {localProducts.length > 0 && (
            <div>
              <h3 className="mb-3">Popular Near You</h3>
              <div className="d-flex flex-wrap justify-content-center">
                {localProducts.map((p, i) => (
                  <ProductCard key={i} product={p} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="p-5 bg-light border rounded shadow text-center" style={{ maxWidth: "600px" }}>
            <h3 className="fw-bold mb-3 text-primary">Welcome to MyMarketplace!</h3>
            <p className="text-muted mb-4">
              Please <strong>log in</strong> or <strong>create an account</strong> to see products near you, post your own listings, and connect with others.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="primary" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button variant="outline-primary" onClick={() => navigate("/signup")}>
                Register
              </Button>
              <Button variant="secondary" onClick={() => navigate("/browse-products")}>
                Browse All Products
              </Button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
