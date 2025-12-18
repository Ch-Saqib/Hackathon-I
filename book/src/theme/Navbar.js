// Physical AI Textbook - Navbar Component with Profile Dropdown
import React, { useState, useEffect, useRef } from "react";

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{ display: 'block' }}>
    <circle cx="12" cy="8" r="4" />
    <path d="M 12 14 C 8 14 5 16 5 20 L 19 20 C 19 16 16 14 12 14 Z" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// Profile Dropdown Component
function ProfileDropdown({ userEmail, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', marginRight: '16px' }}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        title={userEmail}
        aria-label="User profile menu"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: '#0071e3',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-out',
          fontWeight: '600',
          fontSize: '14px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#0052cc')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#0071e3')}
      >
        <ProfileIcon />
      </button>

      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            background: 'white',
            border: '1px solid #e5e5ea',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            minWidth: '200px',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5ea' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#6f6f77', fontWeight: '500', wordBreak: 'break-all' }}>
              {userEmail}
            </p>
          </div>
          <a
            href="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              color: '#1d1d1d',
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'left',
            }}
            onClick={() => setIsDropdownOpen(false)}
          >
            <span>👤</span>
            <span>My Profile</span>
          </a>
          <a
            href="/docs/module-01-ros2/architecture"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              color: '#1d1d1d',
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'left',
            }}
            onClick={() => setIsDropdownOpen(false)}
          >
            <span>📚</span>
            <span>Start Learning</span>
          </a>
          <div style={{ height: '1px', background: '#e5e5ea', margin: '4px 0' }}></div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              color: '#1d1d1d',
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
            onClick={handleLogoutClick}
          >
            <LogoutIcon />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Auth button styles
const authButtonBaseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  marginLeft: '8px',
};

const loginButtonStyle = {
  ...authButtonBaseStyle,
  background: 'transparent',
  color: 'var(--ifm-color-primary)',
  border: '1px solid var(--ifm-color-primary)',
};

const signupButtonStyle = {
  ...authButtonBaseStyle,
  background: 'var(--ifm-color-primary)',
  color: '#fff',
  border: '1px solid var(--ifm-color-primary)',
};

// Wrapper component for Navbar
function NavbarWrapper(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  // Check authentication status on mount and when storage changes
  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const email = localStorage.getItem("user_email");
      const isAuth = !!token;
      setIsAuthenticated(isAuth);
      setUserEmail(email || "");
    };

    checkAuth();

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    // Also listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_email");
    setIsAuthenticated(false);
    setUserEmail("");
    window.location.href = "/";
  };

  // Import the original Navbar from Docusaurus
  const Navbar = require("@theme-original/Navbar").default;

  return (
    <div style={{ position: 'relative' }}>
      <Navbar {...props} />
      {/* Inject auth buttons into navbar */}
      {mounted && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '140px',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1000,
          }}
        >
          {isAuthenticated ? (
            <ProfileDropdown userEmail={userEmail} onLogout={handleLogout} />
          ) : (
            <>
              <a
                href="/login"
                style={loginButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--ifm-color-primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--ifm-color-primary)';
                }}
              >
                Log In
              </a>
              <a
                href="/signup"
                style={signupButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default NavbarWrapper;
