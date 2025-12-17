import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'The Partnership of People, Agents, and Robots',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  // For Vercel deployment, this should be your Vercel URL (or custom domain),
  // but it can be left as-is without affecting CSS loading.
  url: 'https://saqib-squad.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served.
  // On Vercel, the site is typically served from the root, so use '/'.
  // If you ever host it under a subpath (e.g. '/book/'), update this to that path.
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'saqib-squad', // GitHub org/user name.
  projectName: 'Hackathon-I', // Repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Enable Mermaid for architecture diagrams (Constitution Principle IV)
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove edit links for now
          editUrl: undefined,
        },
        blog: false, // Disable blog for textbook
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Social card for Physical AI textbook
    image: 'img/docusaurus-social-card.jpg',

    // Dark mode as default (Constitution requirement)
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    // Mermaid configuration for diagrams
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },

    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'module01Sidebar',
          position: 'left',
          label: 'Module 1: ROS 2',
        },
        {
          type: 'docSidebar',
          sidebarId: 'module02Sidebar',
          position: 'left',
          label: 'Module 2: Digital Twin',
        },
        {
          href: 'https://github.com/saqib-squad/Hackathon-I',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Modules',
          items: [
            {
              label: 'Module 1: ROS 2 - The Robotic Nervous System',
              to: '/docs/module-01-ros2/architecture',
            },
            {
              label: 'Module 2: Digital Twin',
              to: '/docs/module-02-digital-twin/physics-simulation',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'ROS 2 Documentation',
              href: 'https://docs.ros.org/en/humble/',
            },
            {
              label: 'Gazebo Sim',
              href: 'https://gazebosim.org/',
            },
            {
              label: 'NVIDIA Isaac Sim',
              href: 'https://developer.nvidia.com/isaac-sim',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/saqib-squad/Hackathon-I',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Physical AI & Humanoid Robotics. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'python', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
