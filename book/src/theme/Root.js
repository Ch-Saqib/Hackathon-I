// Physical AI Textbook - Root Component (Swizzled)
// This component wraps all pages to add the chat widget globally
import React, { useState, useEffect } from "react";
import ChatWidget from "./ChatWidget";

export default function Root({ children }) {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Function to check if chat should be shown
    const checkChatVisibility = () => {
      const token = localStorage.getItem("auth_token");
      
      // Show chat when user is authenticated (on any page)
      setShowChat(!!token);
    };

    // Check on mount
    checkChatVisibility();

    // Listen for storage changes (login/logout)
    const handleStorageChange = checkChatVisibility;
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      {children}
      {showChat && <ChatWidget />}
    </>
  );
}
