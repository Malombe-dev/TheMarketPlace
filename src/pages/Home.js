import React from "react";

const Home = () => {
  return (
    <div 
      className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
      style={{
        background: "linear-gradient(to right, #4A90E2, #50BFA5)",
        color: "#fff",
        padding: "2rem",
      }}
    >
      <div 
        className="p-4 shadow-lg rounded"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          maxWidth: "500px",
        }}
      >
        <h1 className="display-4 fw-bold">Welcome to Marketplace</h1>
        <p className="lead">
          Buy, sell, and showcase your skills with ease.
        </p>
        <a href="/browse-products" className="btn btn-light btn-lg mt-3 fw-bold shadow-sm">
          Browse Products
        </a>
      </div>
    </div>
  );
};

export default Home;
