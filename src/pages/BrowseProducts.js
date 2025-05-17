import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Carousel, Card, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    axios
      .get("https://vmalombe.pythonanywhere.com/products")
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];

        setProducts(data);
        setDisplayedProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    axios
      .get("https://vmalombe.pythonanywhere.com/categories")
      .then((res) => {
        setCategories(["All", ...res.data]);
        console.log("Selected:", selectedCategory);
        products.forEach(p => console.log("Product:", p.category));

      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    console.log("Selected:", category); // ✅ Confirm selected
  
    const filtered = category === "All"
      ? products
      : products.filter((product) => {
          const match = product.category?.trim().toLowerCase() === category.trim().toLowerCase();
          if (!match) {
            console.log(
              `❌ No match: product.category = "${product.category}" vs selected = "${category}"`
            );
          } else {
            console.log(
              `✅ Match: product.category = "${product.category}"`
            );
          }
          return match;
        });
  
    console.log("Filtered products:", filtered);
    setDisplayedProducts(filtered);
  };
  

  // Handle search
  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.product_name.toLowerCase().includes(searchText.toLowerCase())
    );
  
    const categoryFiltered = selectedCategory === "All"
      ? filtered
      : filtered.filter((product) =>
          product.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
        );
  
    setDisplayedProducts(categoryFiltered);
  };
  

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Available Products</h2>

              {/* 🔍 Search and Filter */}
              <div className="row align-items-center mb-4">
          {/* Search Input */}
            <div className="col-md-8 mb-2 mb-md-0">
              <InputGroup>
                <Form.Control
                  placeholder="Search products..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button variant="outline-primary" onClick={handleSearch}>
                  Search
                </Button>
              </InputGroup>
            </div>

            {/* Category Filter */}
            <div className="col-md-4">
              <Form.Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>



      {/* Product Grid */}
      <div className="row">
      {displayedProducts.length === 0 ? (
  <p className="text-center">No products found</p>
) : (
  displayedProducts.map((product) => (
    <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <Card className="shadow-sm border-0 rounded" style={{ width: "100%", maxWidth: "260px", minHeight: "360px" }}>
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
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            View
          </Button>
        </Card.Body>
      </Card>
    </div>
  ))
)}

      </div>
    </div>
  );
};

export default BrowseProducts;
