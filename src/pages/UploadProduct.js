import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";

const UploadProduct = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState({ front: null, back: null, side1: null, side2: null });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("")

  const categories = [
    "Electronics",
    "Phones & Accessories",
    "Household Items",
    "Furniture",
    "Clothing & Fashion",
    "Vehicles & Parts",
    "Sports & Outdoors",
    "Books & Stationery",
    "Kids & Toys",
    "Beauty & Personal Care",
    "Food & Groceries",
    "Farming & Agriculture",
    "Services & Skills"
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/AuthModal"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleImageChange = (e, position) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [position]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading("Please wait as we uplaod Your product...")
    

    if (!isAuthenticated || !user) {
      setError("You must be logged in to upload a product.");
      return;
    }

    if (!productName || !category || !description || !price || !location || !age) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!images.front || !images.back || !images.side1 || !images.side2) {
      setError("Please upload all four required images.");
      return;
    }
    setLoading("")
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("product_name", productName);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("age", age);
      formData.append("notes", notes);
      formData.append("image_front", images.front);
      formData.append("image_back", images.back);
      formData.append("image_side1", images.side1);
      formData.append("image_side2", images.side2);


    try {
      const response = await axios.post(
        "https://vmalombe.pythonanywhere.com/upload_product",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // ✅ SEND SESSION COOKIE
        }
      );

      if (response.status === 201) {
        setSuccess("Product uploaded successfully!");
        setError("");
        // Optional: Reset form after success
        setProductName("");
        setCategory("");
        setDescription("");
        setPrice("");
        setLocation("");
        setAge("");
        setNotes("");
        setImages({ front: null, back: null, side1: null, side2: null });
      } else {
        setError("Failed to upload product. Please try again.");
      }
    } catch (err) {
      setError("Error uploading product. Please check your network or session.");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg">
        <h2 className="text-center text-primary fw-bold">Upload Your Product</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {loading && <Alert variant="success">{loading}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Product Name</Form.Label>
            <Form.Control type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Price (KES)</Form.Label>
            <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Location</Form.Label>
            <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Age of Item</Form.Label>
            <Form.Control type="text" value={age} onChange={(e) => setAge(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Additional Notes</Form.Label>
            <Form.Control as="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Form.Group>

          {/* Image Upload Section */}
          <h5 className="text-secondary">Upload Product Images</h5>
          <Form.Group className="mb-3">
            <Form.Label>Front Photo</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => handleImageChange(e, "front")} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Back Photo</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => handleImageChange(e, "back")} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Side Photo 1</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => handleImageChange(e, "side1")} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Side Photo 2</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => handleImageChange(e, "side2")} required />
          </Form.Group>

          {/* Preview Uploaded Images */}
          <div className="d-flex flex-wrap gap-2 mt-3">
            {Object.entries(images).map(([key, file]) =>
              file ? <img key={key} src={URL.createObjectURL(file)} alt={key} width={100} height={100} className="border rounded shadow-sm" /> : null
            )}
          </div>

          <Button variant="primary" type="submit" className="mt-4 w-100 fw-bold">Upload Product</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default UploadProduct;
