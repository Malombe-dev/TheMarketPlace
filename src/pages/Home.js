import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [recentUserProducts, setRecentUserProducts] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    axios.get("https://vmalombe.pythonanywhere.com/homepage-data", {
      withCredentials: true, // Include cookies (session ID)
    })
      .then(response => {
        setRecentUserProducts(response.data.recent_user_products);
        setLocalProducts(response.data.local_products);
      })
      .catch(error => {
        console.error("Error fetching homepage data:", error);
      });
  }, []);

  const ProductCard = ({ product }) => (
    <div className="card m-2 shadow-sm" style={{ width: "12rem" }}>
      <img 
        src={product.front_photo} 
        className="card-img-top" 
        alt={product.product_name} 
        style={{ height: "120px", objectFit: "cover" }}
      />
      <div className="card-body p-2">
        <h6 className="card-title">{product.product_name}</h6>
      </div>
    </div>
  );

  return (
    <div 
      className="d-flex flex-column align-items-center text-center"
      style={{
        background: "linear-gradient(to right, #4A90E2, #50BFA5)",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div 
        className="p-4 mb-4 shadow-lg rounded"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          maxWidth: "500px",
        }}
      >
        <h1 className="display-4 fw-bold">Welcome to Marketplace</h1>
        <p className="lead">Buy, sell, and showcase your skills with ease.</p>
        <a href="/browse-products" className="btn btn-light btn-lg mt-3 fw-bold shadow-sm">
          Browse Products
        </a>
      </div>

      {recentUserProducts.length > 0 && (
        <div className="w-100 px-4">
          <h3 className="text-white mb-3">Your Recent Posts</h3>
          <div className="d-flex flex-wrap justify-content-center">
            {recentUserProducts.map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        </div>
      )}

      {localProducts.length > 0 && (
        <div className="w-100 px-4 mt-5">
          <h3 className="text-white mb-3">Popular Near You</h3>
          <div className="d-flex flex-wrap justify-content-center">
            {localProducts.map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
