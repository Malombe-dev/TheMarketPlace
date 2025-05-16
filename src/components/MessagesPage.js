import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Card,
  Spinner,
  Modal,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { io } from "socket.io-client";

const MessagesPage = () => {
  const { user } = useAuth();
  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("https://vmalombe.pythonanywhere.com");

    socketRef.current.on("new_message", (data) => {
      if (data.receiver_id === userId || data.sender_id === userId) {
        fetchThreads();
        if (
          selectedUser &&
          (data.sender_id === selectedUser.id ||
            data.receiver_id === selectedUser.id)
        ) {
          fetchConversation(selectedUser.id);
        }
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedUser]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://vmalombe.pythonanywhere.com/messages/threads/${userId}`
      );
      setThreads(response.data.threads);
    } catch (error) {
      console.error("Error loading threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (otherUserId) => {
    setModalLoading(true);
    try {
      const response = await axios.get(
        `https://vmalombe.pythonanywhere.com/messages/conversation/${userId}/${otherUserId}`
      );

      const messages = response.data.messages;
      setConversationHistory(messages);

      const unreadMessages = messages.filter(
        (msg) => msg.receiver_id === userId && msg.is_read === 0
      );

      unreadMessages.forEach((msg) => {
        axios
          .post(
            `https://vmalombe.pythonanywhere.com/messages/mark-read/${msg.id}`,
            { user_id: userId }
          )
          .catch((err) =>
            console.error("Failed to mark message as read", err)
          );
      });
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
      setConversationHistory([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenConversation = async (otherUserId, otherUserName) => {
    setSelectedUser({
      id: otherUserId,
      name: otherUserName || `User ${otherUserId}`,
    });
    setReplyText("");
    setShowModal(true);
    await fetchConversation(otherUserId);
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;

    setSending(true);
    try {
      await axios.post("https://vmalombe.pythonanywhere.com/messages/send", {
        sender_id: userId,
        receiver_id: selectedUser.id,
        message_text: replyText,
      });
      setReplyText("");
      setSuccessMessage("Message sent successfully!");
      await fetchConversation(selectedUser.id);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(
        `https://vmalombe.pythonanywhere.com/messages/delete/${messageId}`
      );
      setConversationHistory((prev) =>
        prev.filter((msg) => msg.id !== messageId)
      );
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message");
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [userId]);

  if (loading) return <Spinner className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-4">
      <h3>My Messages</h3>
      {threads.length === 0 ? (
        <p>No message threads found.</p>
      ) : (
        threads.map((msg) => {
          const isSender = msg.sender_id === userId;
          const otherUserId = isSender ? msg.receiver_id : msg.sender_id;
          const otherUserName = isSender
            ? msg.receiver_name
            : msg.sender_name;
          const hasUnread =
            msg.receiver_id === userId && msg.is_read === 0;

          return (
            <Card key={msg.id} className="mb-3 p-3">
              <div>
                <strong>Conversation with:</strong>{" "}
                {otherUserName || `User ${otherUserId}`}{" "}
                {hasUnread && <Badge bg="danger">New</Badge>}
                <p className="mb-1">{msg.message_text}</p>
                <small className="text-muted">
                  {new Date(msg.created_at).toLocaleString()}
                </small>
              </div>
              <div className="d-flex justify-content-end mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleOpenConversation(otherUserId, otherUserName)
                  }
                >
                  View & Reply
                </Button>
              </div>
            </Card>
          );
        })
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            Conversation with {selectedUser?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {conversationHistory.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  conversationHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded mb-2 ${
                        msg.sender_id === userId
                          ? "bg-light text-end"
                          : "bg-secondary text-white"
                      }`}
                    >
                      <div>
                        <strong>{msg.sender_name}:</strong>
                      </div>
                      <div>{msg.message_text}</div>
                      <small className="text-muted d-block">
                        {new Date(msg.created_at).toLocaleString()}
                      </small>
                      {msg.sender_id === userId && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="mt-1"
                          onClick={() => handleDelete(msg.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {successMessage && (
                <div className="alert alert-success mt-3 py-2 px-3">
                  {successMessage}
                </div>
              )}

              <Form.Group controlId="replyText" className="mt-3">
                <Form.Label>Your Reply</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={sendReply} disabled={sending}>
            {sending ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MessagesPage;
