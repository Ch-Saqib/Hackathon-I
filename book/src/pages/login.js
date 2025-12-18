// Physical AI Textbook - Login Page (Apple-inspired Design)
import React, { useState } from "react";
import Layout from "@theme/Layout";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import styles from "./auth.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.login, {
        email,
        password,
      });

      // Store token and email
      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user_email", email);

      // Redirect to previous page or home
      const returnUrl = new URLSearchParams(window.location.search).get("return") || "/";
      window.location.href = returnUrl;
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Log In" description="Log in to your Physical AI Textbook account">
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          {/* Header */}
          <div className={styles.authHeader}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Continue your AI & Robotics journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorAlert}>
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={`${styles.inputWrapper} ${focused.email ? styles.focused : ""}`}>
                <span className={styles.icon}>✉️</span>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused({ ...focused, email: true })}
                  onBlur={() => setFocused({ ...focused, email: false })}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={`${styles.inputWrapper} ${focused.password ? styles.focused : ""}`}>
                <span className={styles.icon}>🔒</span>
                <input
                  id="password"
                  type="password"
                  className={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused({ ...focused, password: true })}
                  onBlur={() => setFocused({ ...focused, password: false })}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span>or</span>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <p className={styles.footerText}>
              Don't have an account?{" "}
              <a href="/signup" className={styles.link}>
                Sign up free
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
