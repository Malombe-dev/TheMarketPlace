import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Carousel, Card, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://vmalombe.pythonanywhere.com/products")
      .then((response) => {
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data.products) {
          setProducts(response.data.products);
        } else {
          console.error("Unexpected API response format:", response.data);
        }

        console.log("Final Product List:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Available Products</h2>
      <div className="row">
        {products.length === 0 ? (
          <p className="text-center">No products available</p>
        ) : (
          products.map((product) => (
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
                  <p className="text-muted mb-1">
                    <strong>Posted by:</strong> {product.posted_by || "Unknown"}
                  </p>
                  <Button variant="primary" onClick={() => navigate(`/product/${product.id}`)}>
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
