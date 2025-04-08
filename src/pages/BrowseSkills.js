import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import { Carousel, Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { FaPhone, FaMapMarkerAlt, FaTools } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const BrowseSkills = () => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamically import Bootstrap JS
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min");
  }, []);

  // Fetch skills from API
  useEffect(() => {
    axios
      .get("https://vmalombe.pythonanywhere.com/skills")
      .then((response) => {
        console.log("Fetched skills:", response.data); // Debugging line
        setSkills(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
        setLoading(false);
      });
  }, []);

  const handleHire = () => {
    if (!isAuthenticated) {
      setShowModal(true);
    } else {
      alert("Proceeding to hire...");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-primary">🌟 Browse Top Skills</h2>

      {/* Featured Skills Carousel */}
      {!loading && skills.length > 0 && (
        <Carousel className="mb-5 shadow-lg" interval={3000} fade>
          {skills.slice(0, 5).map((skill) => (
            <Carousel.Item key={skill.id} style={{ minHeight: "300px" }}>
              <div className="p-5 text-center bg-dark text-white rounded shadow">
                <h3 className="mb-3">
                  <FaTools /> {skill.title}
                </h3>
                <p className="lead">{skill.description}</p>
                <p>
                  <FaMapMarkerAlt /> {skill.location}
                </p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* Skill Listings */}
      {loading ? (
        <Spinner animation="border" className="d-block mx-auto mt-5" />
      ) : skills.length === 0 ? (
        <p className="text-center text-muted">No skills available at the moment.</p>
      ) : (
        <Row>
          {skills.map((skill) => (
            <Col key={skill.id} md={4} className="mb-4">
              <Card className="shadow-lg border-0 h-100 hover-effect">
                <Card.Body className="text-center">
                  <Card.Title className="text-primary">{skill.title}</Card.Title>
                  <Card.Text className="text-muted">{skill.description}</Card.Text>
                  <Card.Text>
                    <FaMapMarkerAlt className="text-warning" /> {skill.location}
                  </Card.Text>
                  <Card.Text>
                    <FaPhone className="text-success" /> {skill.phone}
                  </Card.Text>
                  <Button variant="outline-primary" className="w-100 mt-2" onClick={handleHire}>
                    Hire Skill
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Authentication Modal */}
      <AuthModal show={showModal} onClose={() => setShowModal(false)} />
    </Container>
  );
};

export default BrowseSkills;
