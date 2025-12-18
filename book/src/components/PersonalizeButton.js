// Physical AI Textbook - Personalize Button Component
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

const styles = {
  container: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #1e3a5f 0%, #1a365d 100%)",
    border: "1px solid #00d4ff",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "14px",
  },
  containerHover: {
    boxShadow: "0 4px 12px rgba(0, 212, 255, 0.3)",
  },
  icon: {
    fontSize: "16px",
  },
  text: {
    color: "white",
  },
  badge: {
    background: "#00d4ff",
    color: "#1a1a1a",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  loginPrompt: {
    marginTop: "8px",
    padding: "12px",
    background: "var(--ifm-color-emphasis-100, #222)",
    borderRadius: "8px",
    fontSize: "13px",
  },
  loginLink: {
    color: "#00d4ff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default function PersonalizeButton({ onPersonalize }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await axios.get(API_ENDPOINTS.profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(true);
      setUserProfile(response.data);
    } catch (err) {
      setIsAuthenticated(false);
      localStorage.removeItem("auth_token");
    }
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // Trigger personalization
    if (onPersonalize && userProfile) {
      onPersonalize({
        software_skills: userProfile.software_skills || [],
        hardware_inventory: userProfile.hardware_inventory || [],
      });
    }
  };

  const getPersonalizationLabel = () => {
    if (!userProfile) return "";

    const items = [
      ...(userProfile.software_skills || []),
      ...(userProfile.hardware_inventory || []),
    ];

    if (items.length === 0) return "No preferences set";
    if (items.length <= 2) return items.join(", ");
    return `${items.slice(0, 2).join(", ")} +${items.length - 2}`;
  };

  return (
    <div>
      <button
        style={{
          ...styles.container,
          ...(isHovered ? styles.containerHover : {}),
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Personalize content based on your profile"
      >
        <span style={styles.icon}>
          {isAuthenticated ? "✨" : "🔐"}
        </span>
        <span style={styles.text}>
          {isAuthenticated ? "Personalize" : "Login to Personalize"}
        </span>
        {isAuthenticated && userProfile && (
          <span style={styles.badge}>{getPersonalizationLabel()}</span>
        )}
      </button>

      {showLoginPrompt && !isAuthenticated && (
        <div style={styles.loginPrompt}>
          <p style={{ margin: 0 }}>
            <strong>Personalized learning awaits!</strong>
          </p>
          <p style={{ margin: "4px 0 0 0" }}>
            <a
              href={`/signup?return=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.pathname : "/"
              )}`}
              style={styles.loginLink}
            >
              Sign up
            </a>
            {" or "}
            <a
              href={`/login?return=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.pathname : "/"
              )}`}
              style={styles.loginLink}
            >
              log in
            </a>
            {" to get content tailored to your background."}
          </p>
        </div>
      )}
    </div>
  );
}
