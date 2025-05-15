import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Container, Spinner } from "react-bootstrap";

const MessagesPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get user from context first
    let currentUser = user;
  
    if (!currentUser) {
      // If no user from context, try localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          setLoading(false);
          return;
        }
      }
    }
  
    console.log("User in useEffect:", currentUser);
  
    if (!currentUser || !currentUser.id) {
      console.error("User not authenticated or user ID missing");
      setLoading(false);
      return;
    }
  
    axios
        .get(`https://vmalombe.pythonanywhere.com/messages/received/${currentUser.id}`)
        .then((response) => {
            console.log("Messages API response:", response.data);
            setMessages(response.data.messages);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error loading messages:", error);
            setLoading(false);
        });

  }, [user]);
  

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-4">
      <h3>My Messages</h3>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <Card
            key={msg.id}
            className="mb-3 p-3"
            onClick={() => navigate(`/message-thread/${msg.sender_id}`)}
            style={{ cursor: "pointer" }}
          >
            <strong>{msg.sender_name}</strong> — {msg.message_text}
            <span className="text-muted float-end">
              {new Date(msg.created_at).toLocaleString()}
            </span>
          </Card>
        ))
      )}
    </Container>
  );
};

export default MessagesPage;
