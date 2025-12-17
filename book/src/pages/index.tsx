import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// T019: Hero section with "The Partnership of People, Agents, and Robots" tagline
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        {/* T020: Course goal text */}
        <p className={styles.courseGoal}>
          Bridging the gap between the digital brain and the physical body
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/module-01-ros2/architecture">
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}

// T021: Hardware requirements warning section
function HardwareWarning() {
  return (
    <section className={styles.hardwareWarning}>
      <div className="container">
        <div className={styles.warningBox}>
          <h3>Hardware Requirements</h3>
          <p>
            <strong>For Full Experience (NVIDIA Isaac Sim):</strong> NVIDIA RTX 4070 Ti or better GPU required.
          </p>
          <p>
            <strong>For Core Content (Gazebo):</strong> Any modern GPU with 4GB+ VRAM, or integrated graphics for basic simulation.
          </p>
          <p className={styles.warningNote}>
            Module content is accessible without specialized hardware. Simulation exercises may require GPU resources.
          </p>
        </div>
      </div>
    </section>
  );
}

// T022: Module navigation cards
function ModuleCards() {
  return (
    <section className={styles.modules}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--6', styles.moduleCard)}>
            <div className={styles.card}>
              <h2>Module 1: ROS 2</h2>
              <h3>The Robotic Nervous System</h3>
              <p>
                Learn how ROS 2 serves as the communication backbone for humanoid robots,
                enabling nodes, topics, and services to work together like a nervous system.
              </p>
              <ul>
                <li>ROS 2 Architecture & Node Graphs</li>
                <li>Python Agents with rclpy</li>
                <li>URDF Body Definition</li>
              </ul>
              <Link
                className="button button--primary button--lg"
                to="/docs/module-01-ros2/architecture">
                Start Module 1
              </Link>
            </div>
          </div>
          <div className={clsx('col col--6', styles.moduleCard)}>
            <div className={styles.card}>
              <h2>Module 2: Digital Twin</h2>
              <h3>Simulation & Testing</h3>
              <p>
                Explore digital twin technology using Gazebo and Unity to simulate
                humanoid robots before deploying to physical hardware.
              </p>
              <ul>
                <li>Physics Simulation with Gazebo</li>
                <li>High-Fidelity Rendering</li>
                <li>Sensor Simulation (LiDAR, IMU)</li>
              </ul>
              <Link
                className="button button--primary button--lg"
                to="/docs/module-02-digital-twin/physics-simulation">
                Start Module 2
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// T024: Chatbot integration placeholder
// TODO: Future RAG chatbot integration point
// The chatbot component would be added here to provide AI-assisted learning
// Integration with course content for context-aware responses

// T036: Personalization placeholder
// TODO: Future user preference storage location
// User progress tracking, bookmarks, and personalized recommendations
// would be integrated at this level

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="The Partnership of People, Agents, and Robots - Learn ROS 2 and Digital Twin simulation for humanoid robotics">
      <HomepageHeader />
      <main>
        <HardwareWarning />
        <ModuleCards />
      </main>
    </Layout>
  );
}
