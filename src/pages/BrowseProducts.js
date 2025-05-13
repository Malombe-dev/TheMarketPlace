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
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const filtered = category === "All"
      ? products
      : products.filter((product) => product.category === category);

    setDisplayedProducts(filtered);
  };

  // Handle search
  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.product_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const categoryFiltered = selectedCategory === "All"
      ? filtered
      : filtered.filter((product) => product.category === selectedCategory);

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
            <div key={product.id} className="col-md-4 mb-4">
              <Card className="shadow-lg border-0 rounded">
                <Carousel>
                  {[product.front_photo, product.back_photo, product.side_photo_1, product.side_photo_2].map(
                    (photo, index) =>
                      photo && (
                        <Carousel.Item key={index}>
                          <img
                            src={`${photo}?timestamp=${new Date().getTime()}`}
                            alt={product.product_name}
                            className="d-block w-100"
                            style={{ height: "250px", objectFit: "cover", borderRadius: "10px" }}
                          />
                        </Carousel.Item>
                      )
                  )}
                </Carousel>

                <Card.Body className="text-center">
                  <h5 className="mb-2">{product.product_name}</h5>
                  <h6 className="text-muted mb-1">{product.category}</h6>
                  <p className="mb-1">{product.location}</p>
                  <p className="text-muted mb-1">
                    <strong>Posted by:</strong> {product.posted_by || "Unknown"}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    View Details
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
