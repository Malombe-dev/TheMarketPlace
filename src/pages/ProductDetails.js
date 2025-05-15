import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container, Row, Col, Card, Spinner,
  Button, Modal
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { isAuthenticated } = useAuth();

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;
  
    setSending(true);
    const user = JSON.parse(localStorage.getItem("user"));
  
    const payload = {
      sender_id: user?.id,
      receiver_id: product.user_id,
      
      message_text: message,
    };
    console.log("product object",product)
  
    console.log("Sending payload:", payload); // ✅ Log this
  
    try {
      await axios.post("https://vmalombe.pythonanywhere.com/message", payload);
      alert("Message sent!");
      setMessage("");
      setShowMessageModal(false);
    } catch (err) {
      console.error("Message send error:", err);
      alert("Failed to send message");
    }
  
    setSending(false);
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
          <p>{product.notes}</p>
          <h4>Price: KES {product.price}</h4>
          <p><strong>Location:</strong> {product.location}</p>
          <p><strong>Age of Item:</strong> {product.age} Years</p>

          <hr />
          <h5>Seller Information</h5>
          {isAuthenticated ? (
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
          ) : (
            <p className="text-muted">
              Please <a href="/login">log in</a> to see seller information.
            </p>
          )}

          {/* Message Seller Button */}
          {isAuthenticated && (
            <Button variant="outline-success" onClick={() => setShowMessageModal(true)} className="mt-3">
              Message Seller
            </Button>
          )}
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

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send a Message to {product.posted_by}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDetails;
