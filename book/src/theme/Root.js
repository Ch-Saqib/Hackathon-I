// Physical AI Textbook - Root Component (Swizzled)
// This component wraps all pages to add the chat widget globally
import React from "react";
import ChatWidget from "./ChatWidget";

export default function Root({ children }) {
  // Always render ChatWidget - it handles auth check internally with useSession()
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
