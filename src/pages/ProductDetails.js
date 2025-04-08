import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    axios
      .get(`https://vmalombe.pythonanywhere.com/product/${id}`)
      .then((response) => {
        setProduct(response.data.product);
        setRelated(response.data.related);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (!product) return <p className="text-center mt-5">Product not found.</p>;

  const openModal = (image) => {
    setSelectedImage(image);
    setModalShow(true);
  };

  return (
    <Container className="mt-4">
      <Row>
        {/* Product Images */}
        <Col md={8}>
          <Card className="shadow-sm mb-3">
            <Card.Img
              variant="top"
              src={product.front_photo}
              alt="Product"
              className="p-3 img-fluid"
              style={{ height: "450px", objectFit: "cover", cursor: "pointer" }}
              onClick={() => openModal(product.front_photo)}
            />
          </Card>
          <Row>
            {[product.back_photo, product.side_photo_1, product.side_photo_2].map((photo, index) =>
              photo ? (
                <Col key={index} md={4}>
                  <Card className="shadow-sm">
                    <Card.Img
                      variant="top"
                      src={photo}
                      className="p-2 img-fluid"
                      style={{ height: "150px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => openModal(photo)}
                    />
                  </Card>
                </Col>
              ) : null
            )}
          </Row>
        </Col>

        {/* Product Details */}
        <Col md={4}>
          <h2>{product.product_name}</h2>
          <p>{product.description}</p>
          <h4>Price: KES {product.price}</h4>
          <p><strong>Location:</strong> {product.location}</p>
          <p><strong>Age of Item:</strong> {product.age} Years</p>

         {/* Seller Information */}
          <hr />
          <h5>Seller Information</h5>
          <div className="d-flex align-items-center mb-2">
            <img
              src={product.profile_photo}
              alt={product.posted_by}
              className="rounded-circle me-2"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div>
              <p className="m-0"><strong>{product.posted_by}</strong></p>
              <p className="m-0">📞 {product.contact_phone}</p>
              <p className="m-0">✉️ {product.contact_email}</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4>Related Products</h4>
          <Row>
            {related.map((item) => (
              <Col key={item.id} md={3}>
                <Card className="shadow-sm">
                  <Card.Img
                    variant="top"
                    src={item.front_photo}
                    alt="Related Product"
                    className="p-2 img-fluid"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="text-center">
                    <h6>{item.product_name}</h6>
                    <Button variant="outline-primary" href={`/product/${item.id}`}>View</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Image Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Body className="text-center">
          <img src={selectedImage} alt="Zoomed" className="img-fluid" style={{ maxHeight: "90vh" }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProductDetails;
