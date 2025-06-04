import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Spinner, Image } from "react-bootstrap";
import {
  FaTrash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaKey,
  FaLock,
  FaCamera,
  FaTimes,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [photoMenu, setPhotoMenu] = useState(false);
  const [togglingPostId, setTogglingPostId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Attempting to fetch profile after refresh...");
  
    axios
      .get("https://vmalombe.pythonanywhere.com/profile", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Profile response received:", response.data);
        setUser(
          response.data.user
            ? {
                ...response.data.user,
                posts: response.data.posts,
                skills: response.data.skills,
              }
            : {}
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error fetching profile:", error);
  
        if (error.response) {
          console.log("Error status:", error.response.status);
          console.log("Error data:", error.response.data);
        }
  
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/");
        } else {
          alert("Something went wrong while loading your profile.");
        }
      });
  }, [navigate]);
  

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_photo", file);

    try {
      const response = await axios.post(
        "https://vmalombe.pythonanywhere.com/upload-profile-photo",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        alert("Profile photo updated successfully!");
        setUser((prevUser) => ({
          ...prevUser,
          profile_photo: response.data.profile_photo,
        }));
      }
    } catch (error) {
      alert("Failed to update profile photo.");
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm("Are you sure you want to delete your profile photo?"))
      return;

    try {
      const response = await axios.delete(
        "https://vmalombe.pythonanywhere.com/delete-photo",
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Profile photo deleted successfully!");
        setUser((prevUser) => ({ ...prevUser, profile_photo: null }));
      }
    } catch (error) {
      alert("Failed to delete profile photo.");
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await axios.delete(
        `https://vmalombe.pythonanywhere.com/delete-post/${postId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Post deleted successfully!");
        setUser((prevUser) => ({
          ...prevUser,
          posts: prevUser.posts.filter((post) => post.id !== postId),
        }));
      }
    } catch (error) {
      alert("Failed to delete post. Please try again.");
    }
  };

  const toggleHideContact = async (postId, currentHideStatus) => {
    setTogglingPostId(postId);
    try {
      const response = await axios.post(
        `https://vmalombe.pythonanywhere.com/toggle-hide-contact/${postId}`,
        { hide: !currentHideStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser((prevUser) => {
          const updatedPosts = prevUser.posts.map((post) =>
            post.id === postId
              ? { ...post, hide_contact: !currentHideStatus }
              : post
          );
          return { ...prevUser, posts: updatedPosts };
        });
      }
    } catch (error) {
      alert("Failed to toggle contact visibility.");
    } finally {
      setTogglingPostId(null);
    }
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (!user)
    return <p className="text-danger text-center">Error loading profile.</p>;

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-lg bg-light">
        {/* Profile Header */}
        <div className="row align-items-center position-relative">
          <div className="col-md-3 text-center position-relative">
            <div
              onClick={() => setPhotoMenu(!photoMenu)}
              style={{ cursor: "pointer", display: "inline-block" }}
            >
              {user.profile_photo ? (
                <Image
                  src={
                    user.profile_photo.startsWith("http")
                      ? `${user.profile_photo}?timestamp=${Date.now()}`
                      : `https://vmalombe.pythonanywhere.com${user.profile_photo}?timestamp=${Date.now()}`
                  }
                  alt="Profile"
                  roundedCircle
                  width={120}
                  height={120}
                  className="border border-primary shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/120?text=No+Image";
                  }}
                />
              ) : (
                <div
                  className="bg-secondary text-white d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 120, height: 120 }}
                >
                  <FaUser size={50} />
                </div>
              )}
            </div>
            {photoMenu && (
              <div
                className="position-absolute bg-white shadow rounded p-2 text-center"
                style={{
                  top: "130%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              >
                <Button
                  variant="link"
                  className="text-dark"
                  onClick={() => document.getElementById("upload-photo").click()}
                >
                  <FaCamera /> Change Photo
                </Button>
                <input
                  type="file"
                  id="upload-photo"
                  accept="image/*"
                  className="d-none"
                  onChange={handlePhotoUpload}
                />

                {user.profile_photo && (
                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={handleDeletePhoto}
                  >
                    <FaTrash /> Delete Photo
                  </Button>
                )}
                <Button
                  variant="link"
                  className="text-muted"
                  onClick={() => setPhotoMenu(false)}
                >
                  <FaTimes /> Close
                </Button>
              </div>
            )}
          </div>

          <div className="col-md-9">
            <h2 className="text-primary">
              <FaUser /> {user.name}
            </h2>
            <p className="text-muted">
              <FaEnvelope /> {user.email}
            </p>
          </div>
        </div>

        <hr />

        <div className="p-3 rounded bg-white shadow-sm">
          <p>
            <FaPhone className="text-success" /> <strong>Phone:</strong>{" "}
            {user.phone || "N/A"}
          </p>
          <p>
            <FaKey className="text-danger" /> <strong>Date of Birth:</strong>{" "}
            {user.dob || "N/A"}
          </p>
          <p>
            <FaMapMarkerAlt className="text-warning" /> <strong>Location:</strong>{" "}
            {user.location || "N/A"}
          </p>
        </div>

        <hr />

        <h4 className="text-secondary">
          <FaLock /> Change Password
        </h4>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="dark" className="w-100">
            Change Password
          </Button>
          {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
        </Form>

        <hr />

        <h4 className="text-primary">📦 My Posts</h4>
        {user.posts?.length > 0 ? (
          <div className="row">
            {user.posts.map((post) => (
              <div key={post.id} className="col-md-4 mb-3">
                <Card className="shadow-sm border-0">
                  <Card.Img
                    variant="top"
                    src={post.front_photo}
                    alt={post.product_name}
                    className="rounded-top"
                  />
                  <Card.Body>
                    <Card.Title>{post.product_name}</Card.Title>
                    <Card.Text>
                      <strong>Category:</strong> {post.category}
                    </Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> Ksh {post.price}
                    </Card.Text>
                    <Card.Text>
                      <strong>Location:</strong> {post.location}
                    </Card.Text>
                    <Card.Text>
                      <strong>Phone:</strong> {user.phone}
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deletePost(post.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                      <Button
                        variant={post.hide_contact ? "secondary" : "warning"}
                        size="sm"
                        onClick={() =>
                          toggleHideContact(post.id, post.hide_contact)
                        }
                        disabled={togglingPostId === post.id}
                      >
                        {togglingPostId === post.id
                          ? "Updating..."
                          : post.hide_contact
                          ? "Show Contact"
                          : "Hide Contact"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No posts available.</p>
        )}

        <hr />

        <h4 className="text-secondary">🔧 My Skills</h4>
        {user.skills?.length > 0 ? (
          <div className="row">
            {user.skills.map((skill) => (
              <div key={skill.id} className="col-md-4 mb-3">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <Card.Title>{skill.title}</Card.Title>
                    <Card.Text>
                      <strong>Description:</strong> {skill.description}
                    </Card.Text>
                    <Card.Text>
                      <strong>Location:</strong> {skill.location}
                    </Card.Text>
                    <Card.Text>
                      <strong>Phone:</strong> {skill.phone}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No skills uploaded yet.</p>
        )}
      </Card>
    </div>
  );
};

export default Profile;
