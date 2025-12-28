// Physical AI Textbook - Navbar Component with Profile Dropdown (Better Auth)
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "../lib/auth-client";

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
function ProfileDropdown({ user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userEmail = user?.email || "";
  const userName = user?.name || userEmail.split("@")[0];

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
            <p style={{ margin: 0, fontSize: '14px', color: '#1d1d1d', fontWeight: '600' }}>
              {userName}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6f6f77', wordBreak: 'break-all' }}>
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
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isAuthenticated = !!session?.user;
  const user = session?.user;

  useEffect(() => {
    setMounted(true);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 996);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Inject auth buttons into mobile sidebar when it opens
  useEffect(() => {
    if (!mounted || !isMobile || isPending) return;

    // Store reference to logout handler for cleanup
    let currentLogoutBtn = null;
    const logoutHandler = async () => {
      await signOut();
      window.location.href = "/";
    };

    const injectMobileAuthButtons = () => {
      // Target the menu inside the sidebar panel, not the flex container
      const sidebarMenu = document.querySelector('.navbar-sidebar .menu');
      if (!sidebarMenu) return;
      
      // Remove existing auth buttons first
      const existing = document.querySelector('.mobile-auth-buttons');
      if (existing) {
        // Clean up old event listener if it exists
        if (currentLogoutBtn) {
          currentLogoutBtn.removeEventListener('click', logoutHandler);
          currentLogoutBtn = null;
        }
        existing.remove();
      }

      const authContainer = document.createElement('div');
      authContainer.className = 'mobile-auth-buttons';
      authContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        border-top: 1px solid var(--ifm-color-emphasis-300, #333);
        margin-top: 20px;
      `;
      
      if (isAuthenticated && user) {
        const userName = user.name || user.email?.split("@")[0] || "User";
        authContainer.innerHTML = `
          <div style="padding: 8px 0; color: var(--ifm-color-emphasis-600); font-size: 13px;">
            <strong>${userName}</strong><br/>
            <span style="font-size: 12px; word-break: break-all;">${user.email || ""}</span>
          </div>
          <a href="/profile" style="
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: var(--ifm-color-emphasis-200, #2a2a2a);
            color: var(--ifm-font-color-base);
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
          ">
            👤 My Profile
          </a>
          <button id="mobile-logout-btn" style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            background: transparent;
            color: #ff6b6b;
            border: 1px solid #ff6b6b;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            font-family: inherit;
          ">
            Log Out
          </button>
        `;
      } else {
        authContainer.innerHTML = `
          <a href="/login" style="
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px 16px;
            background: transparent;
            color: var(--ifm-color-primary);
            border: 1px solid var(--ifm-color-primary);
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
          ">
            Log In
          </a>
          <a href="/signup" style="
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px 16px;
            background: var(--ifm-color-primary);
            color: #fff;
            border: 1px solid var(--ifm-color-primary);
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
          ">
            Sign Up
          </a>
        `;
      }
      
      sidebarMenu.appendChild(authContainer);

      // Add logout handler if authenticated with proper cleanup
      if (isAuthenticated) {
        currentLogoutBtn = document.getElementById('mobile-logout-btn');
        if (currentLogoutBtn) {
          currentLogoutBtn.addEventListener('click', logoutHandler);
        }
      }
    };

    // OPTIMIZED: Watch only the navbar element, not entire document.body
    // This significantly reduces memory usage and DOM observation overhead
    const navbarElement = document.querySelector('.navbar');
    if (!navbarElement) return;

    const observer = new MutationObserver((mutations) => {
      // Check if sidebar is now visible
      const sidebarMenu = document.querySelector('.navbar-sidebar .menu');
      if (sidebarMenu && !document.querySelector('.mobile-auth-buttons')) {
        injectMobileAuthButtons();
      }
    });

    // Only observe navbar, not the entire page
    observer.observe(navbarElement, { 
      childList: true,
      subtree: true, // Still need subtree for navbar children
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => {
      // Clean up observer
      observer.disconnect();
      // Clean up event listener
      if (currentLogoutBtn) {
        currentLogoutBtn.removeEventListener('click', logoutHandler);
      }
    };
  }, [mounted, isMobile, isAuthenticated, user, isPending]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  // Import the original Navbar from Docusaurus
  const Navbar = require("@theme-original/Navbar").default;

  return (
    <div style={{ position: 'relative' }}>
      <Navbar {...props} />
      {/* Inject auth buttons into navbar - hide on mobile and while loading */}
      {mounted && !isMobile && !isPending && (
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
            <ProfileDropdown user={user} onLogout={handleLogout} />
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
