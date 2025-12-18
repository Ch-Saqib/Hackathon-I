// Physical AI Textbook - Signup Page (Apple-inspired Design)
import React, { useState } from "react";
import Layout from "@theme/Layout";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import styles from "./auth.module.css";

// Software background options
const SOFTWARE_OPTIONS = [
  { value: "Python", label: "Python", icon: "🐍" },
  { value: "C++", label: "C++", icon: "⚙️" },
  { value: "JavaScript", label: "JavaScript", icon: "🟨" },
  { value: "ROS2", label: "ROS 2", icon: "🤖" },
  { value: "None", label: "None / Beginner", icon: "📚" },
];

// Hardware background options
const HARDWARE_OPTIONS = [
  { value: "Jetson", label: "NVIDIA Jetson", icon: "🎮" },
  { value: "Arduino", label: "Arduino", icon: "🔌" },
  { value: "RaspberryPi", label: "Raspberry Pi", icon: "🍓" },
  { value: "RTX", label: "NVIDIA RTX GPU", icon: "💻" },
  { value: "None", label: "None / Beginner", icon: "📱" },
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [softwareSkills, setSoftwareSkills] = useState([]);
  const [hardwareInventory, setHardwareInventory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});

  const handleSoftwareChange = (value) => {
    setSoftwareSkills((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
    );
  };

  const handleHardwareChange = (value) => {
    setHardwareInventory((prev) =>
      prev.includes(value)
        ? prev.filter((h) => h !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.signup, {
        email,
        password,
        software_skills: softwareSkills.filter((s) => s !== "None"),
        hardware_inventory: hardwareInventory.filter((h) => h !== "None"),
      });

      // Store token and email
      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user_email", email);

      // Redirect to home or previous page
      const returnUrl = new URLSearchParams(window.location.search).get("return") || "/";
      window.location.href = returnUrl;
    } catch (err) {
      setError(
        err.response?.data?.detail || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign Up" description="Create your Physical AI Textbook account">
      <div className={styles.authContainer}>
        <div className={styles.authBoxWide}>
          {/* Header */}
          <div className={styles.authHeader}>
            <h1 className={styles.title}>Join the Community</h1>
            <p className={styles.subtitle}>Create your account and start learning Physical AI & Robotics</p>
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
                Password (8+ characters)
              </label>
              <div className={`${styles.inputWrapper} ${focused.password ? styles.focused : ""}`}>
                <span className={styles.icon}>🔒</span>
                <input
                  id="password"
                  type="password"
                  className={styles.input}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused({ ...focused, password: true })}
                  onBlur={() => setFocused({ ...focused, password: false })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <div className={`${styles.inputWrapper} ${focused.confirmPassword ? styles.focused : ""}`}>
                <span className={styles.icon}>🔐</span>
                <input
                  id="confirmPassword"
                  type="password"
                  className={styles.input}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused({ ...focused, confirmPassword: true })}
                  onBlur={() => setFocused({ ...focused, confirmPassword: false })}
                  required
                />
              </div>
            </div>

            {/* Software Background */}
            <div className={styles.skillsSection}>
              <label className={styles.skillLabel}>
                📝 Your Software Background
              </label>
              <p className={styles.skillHint}>Select all that apply (helps personalize your learning)</p>
              <div className={styles.skillsGrid}>
                {SOFTWARE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`${styles.skillOption} ${softwareSkills.includes(option.value) ? styles.selected : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={softwareSkills.includes(option.value)}
                      onChange={() => handleSoftwareChange(option.value)}
                      className={styles.skillCheckbox}
                    />
                    <span className={styles.skillIcon}>{option.icon}</span>
                    <span className={styles.skillText}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hardware Background */}
            <div className={styles.skillsSection}>
              <label className={styles.skillLabel}>
                ⚡ Your Hardware Access
              </label>
              <p className={styles.skillHint}>Select all that you have access to</p>
              <div className={styles.skillsGrid}>
                {HARDWARE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`${styles.skillOption} ${hardwareInventory.includes(option.value) ? styles.selected : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={hardwareInventory.includes(option.value)}
                      onChange={() => handleHardwareChange(option.value)}
                      className={styles.skillCheckbox}
                    />
                    <span className={styles.skillIcon}>{option.icon}</span>
                    <span className={styles.skillText}>{option.label}</span>
                  </label>
                ))}
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
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
              Already have an account?{" "}
              <a href="/login" className={styles.link}>
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
