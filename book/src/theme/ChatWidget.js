// Physical AI Textbook - Chat Widget Component (Ask the Professor)
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import styles from "./ChatWidget.module.css";

// Chat icon SVG
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// Send icon SVG
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

// Close icon
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

// New Chat icon
const NewChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load user profile on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(API_ENDPOINTS.profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile({
        software_skills: response.data.software_skills || [],
        hardware_inventory: response.data.hardware_inventory || [],
      });
    } catch (err) {
      console.log("User not authenticated for personalization");
    }
  };

  const getCurrentPageContext = () => {
    // Get current page URL for context-aware responses
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return null;
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.chat, {
        message,
        page_context: getCurrentPageContext(),
        user_profile: userProfile,
      });

      // Add assistant message with sources
      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Add error message
      const errorMessage = {
        role: "error",
        content:
          err.response?.data?.detail ||
          "Sorry, I couldn't process your question. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (msg, index) => {
    if (msg.role === "user") {
      return (
        <div
          key={index}
          className={`${styles.message} ${styles.messageUser}`}
        >
          {msg.content}
        </div>
      );
    }

    if (msg.role === "error") {
      return (
        <div
          key={index}
          className={`${styles.message} ${styles.messageError}`}
        >
          {msg.content}
        </div>
      );
    }

    // Assistant message
    return (
      <div
        key={index}
        className={`${styles.message} ${styles.messageAssistant}`}
      >
        {msg.content}
        {msg.sources && msg.sources.length > 0 && (
          <div className={styles.sources}>
            <strong>Sources:</strong>
            {msg.sources.slice(0, 3).map((source, i) => {
              // Build the correct link path using module info
              const modulePath = source.module || '';
              const fileName = source.source ? source.source.replace(".mdx", "") : '';
              const href = modulePath && fileName 
                ? `/docs/${modulePath}/${fileName}` 
                : (fileName ? `/docs/${fileName}` : '#');
              return (
                <a
                  key={i}
                  href={href}
                  className={styles.sourceLink}
                >
                  {source.title} ({source.module})
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Ask the Professor"}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <div className={styles.professorIcon}>🎓</div>
              <h3>Ask the Professor</h3>
            </div>
            <div className={styles.headerActions}>
              {messages.length > 0 && (
                <button
                  className={styles.newChatButton}
                  onClick={() => setMessages([])}
                  aria-label="New chat"
                  title="Start new chat"
                >
                  <NewChatIcon />
                </button>
              )}
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.welcomeMessage}>
                <h4>Welcome! I'm your AI Professor.</h4>
                <p>
                  Ask me anything about ROS 2, digital twins, physics
                  simulation, or other topics covered in this textbook.
                </p>
                {userProfile && (
                  <p style={{ marginTop: "8px", fontSize: "12px" }}>
                    ✨ Your responses will be personalized based on your profile.
                  </p>
                )}
              </div>
            ) : (
              <>
                {messages.map((msg, index) => renderMessage(msg, index))}
                {isLoading && (
                  <div className={styles.loadingDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input or Login Prompt */}
          {isAuthenticated ? (
            <div className={styles.inputContainer}>
              <input
                ref={inputRef}
                type="text"
                className={styles.messageInput}
                placeholder="Ask about ROS 2, digital twins..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
          ) : (
            <div className={`${styles.inputContainer} ${styles.loginPrompt}`}>
              <p className={styles.loginPromptText}>
                Please log in to chat with the Professor
              </p>
              <div className={styles.loginButtonGroup}>
                <a href="/login" className={styles.loginButton}>
                  Log In
                </a>
                <a href="/signup" className={styles.signupButton}>
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
