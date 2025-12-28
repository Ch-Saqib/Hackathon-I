// Physical AI Textbook - User Profile Page
import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import { useSession, signOut } from "../lib/auth-client";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { data: session, isPending, error: sessionError } = useSession();
  const user = session?.user;

  useEffect(() => {
    // Redirect to login if not authenticated (after loading completes)
    if (!isPending && !session) {
      window.location.href = "/login?return=/profile";
    }
  }, [isPending, session]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await signOut();
      window.location.href = "/";
    }
  };

  if (isPending) {
    return (
      <Layout title="Profile" description="Your profile">
        <div className={styles.profileContainer}>
          <div className={styles.loadingSpinner}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (sessionError || !user) {
    return (
      <Layout title="Profile" description="Your profile">
        <div className={styles.profileContainer}>
          <div className={styles.errorBox}>
            {sessionError?.message || "Please log in to view your profile."}
          </div>
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
                {user?.image ? (
                  <img src={user.image} alt={user.name || "User"} />
                ) : (
                  (user?.email || user?.name || "U").charAt(0).toUpperCase()
                )}
              </div>
              <div className={styles.emailSection}>
                <h1 className={styles.email}>{user?.name || user?.email}</h1>
                <p className={styles.memberSince}>
                  {user?.email}
                  {user?.createdAt && (
                    <> • Member since {new Date(user.createdAt).toLocaleDateString()}</>
                  )}
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
                {user?.softwareSkills && user.softwareSkills.length > 0 ? (
                  user.softwareSkills.map((skill) => (
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
                {user?.hardwareInventory && user.hardwareInventory.length > 0 ? (
                  user.hardwareInventory.map((hardware) => (
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
