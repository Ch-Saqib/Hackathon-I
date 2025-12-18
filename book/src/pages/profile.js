// Physical AI Textbook - User Profile Page
import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(API_ENDPOINTS.profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      setEditFormData(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else {
        setError("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("auth_token");
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <Layout title="Profile" description="Your profile">
        <div className={styles.profileContainer}>
          <div className={styles.loadingSpinner}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error && !user) {
    return (
      <Layout title="Profile" description="Your profile">
        <div className={styles.profileContainer}>
          <div className={styles.errorBox}>{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile" description="Your user profile">
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          {/* Header */}
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatarSection}>
              <div className={styles.avatar}>
                {user?.email
                  ? user.email.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className={styles.emailSection}>
                <h1 className={styles.email}>{user?.email}</h1>
                <p className={styles.memberSince}>
                  Member since {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.profileContent}>
            {/* Software Skills */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>📝 Software Background</h2>
              </div>
              <div className={styles.skillsDisplay}>
                {user?.software_skills && user.software_skills.length > 0 ? (
                  user.software_skills.map((skill) => (
                    <span key={skill} className={styles.skillBadge}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className={styles.noSkills}>No software skills recorded</p>
                )}
              </div>
            </div>

            {/* Hardware Inventory */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>⚡ Hardware Access</h2>
              </div>
              <div className={styles.skillsDisplay}>
                {user?.hardware_inventory && user.hardware_inventory.length > 0 ? (
                  user.hardware_inventory.map((hardware) => (
                    <span key={hardware} className={styles.hardwareBadge}>
                      {hardware}
                    </span>
                  ))
                ) : (
                  <p className={styles.noSkills}>No hardware recorded</p>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>📊 Activity</h2>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>0</div>
                  <div className={styles.statLabel}>Modules Completed</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>0</div>
                  <div className={styles.statLabel}>Assessments Passed</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>0</div>
                  <div className={styles.statLabel}>Chat Messages</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.section}>
              <div className={styles.actionsGrid}>
                <button className={styles.secondaryButton} onClick={handleLogout}>
                  🚪 Log Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.quickLinks}>
          <h3 className={styles.quickLinksTitle}>Quick Links</h3>
          <div className={styles.quickLinksGrid}>
            <a href="/docs/module-01-ros2/architecture" className={styles.quickLink}>
              <span className={styles.linkIcon}>📚</span>
              <span>Module 1: ROS 2</span>
            </a>
            <a href="/docs/module-02-digital-twin/physics-simulation" className={styles.quickLink}>
              <span className={styles.linkIcon}>🔬</span>
              <span>Module 2: Digital Twin</span>
            </a>
            <a href="/" className={styles.quickLink}>
              <span className={styles.linkIcon}>🏠</span>
              <span>Home</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
