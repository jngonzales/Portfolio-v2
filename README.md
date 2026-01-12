# JN Gonzales | Full-Stack Developer Portfolio

A **2026 Wow Factor** portfolio showcasing cutting-edge web development with immersive interactions, God Mode terminal, AI-powered hints, and modern design patterns.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)

---

## ✨ Features

### 🎮 God Mode Terminal
Press `Ctrl+K` → "Open Terminal (God Mode)" to access a full terminal emulator with:

| Command | Description |
|---------|-------------|
| `ls` | List files in current directory |
| `cd <dir>` | Change directory (projects, blog, about, skills, contact) |
| `cat <file>` | Read file contents |
| `pwd` | Print working directory |
| `goto <section>` | Navigate to portfolio section |
| `neofetch` | Display system information |
| `skills` | Show animated skill bars |
| `contact` | Display contact information |
| `matrix` | Toggle Matrix rain effect 🟢 |
| `hacktype` | 🎮 Start typing speed game! |
| `clear` | Clear terminal screen |
| `help` | Show all available commands |
| `exit` | Close terminal |

### 🤖 Context-Aware AI Assistant
Hover over project cards for 3+ seconds to see intelligent AI suggestions based on the project context.

### 📱 Dynamic Island Navigation (Mobile)
iOS-style floating navigation with:
- Real-time scroll progress indicator
- Section detection and quick navigation
- Haptic feedback on interactions
- Terminal shortcut access

### ⌨️ Command Palette (⌘K / Ctrl+K)
Quick access to:
- Navigation between sections
- Theme switching (Light/Dark/System)
- Social links
- God Mode Terminal

### 🖥️ Dev-Aesthetic Typography
Monospaced headings for that authentic developer look with animated scanline effects.

### 📝 Static Blog
Markdown-based blog with:
- Gray-matter frontmatter parsing
- Syntax highlighting
- Reading time estimation
- Static generation for performance

### 📊 GitHub Activity Chart
Visual representation of GitHub contributions with interactive tooltips.

### 🎨 3D Hero Section
Three.js powered 3D torus with metallic materials and animations.

### 🧩 Bento Grid Layout
Modern asymmetric grid showcasing skills, location, and quick stats.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git

# Navigate to project
cd portfolio

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Required for GitHub Activity (optional)
GITHUB_TOKEN=your_github_token

# Required for Admin Dashboard (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** The portfolio works without Supabase - admin pages will show a "not configured" message gracefully.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main portfolio page
│   ├── blog/                  # Blog routes
│   │   ├── page.tsx          # Blog listing
│   │   └── [slug]/page.tsx   # Individual post
│   ├── admin/                 # Admin dashboard (Supabase)
│   └── globals.css           # Global styles
├── components/
│   ├── hero.tsx              # Hero section with 3D
│   ├── hero-3d.tsx           # Three.js torus
│   ├── projects-section.tsx  # Projects grid
│   ├── bento-grid.tsx        # Skills/stats grid
│   ├── github-activity.tsx   # GitHub contributions
│   ├── command-palette.tsx   # ⌘K menu
│   ├── god-mode-terminal.tsx # Terminal emulator
│   ├── ai-hint-provider.tsx  # Context-aware AI
│   ├── dynamic-island-nav.tsx # Mobile navigation
│   └── page-wrapper.tsx      # Global UI context
├── lib/
│   ├── blog.ts               # Blog utilities
│   └── supabase.ts           # Supabase client
└── content/
    └── blog/                 # Markdown blog posts
        ├── building-my-portfolio.md
        └── future-of-web-dev.md
```

---

## 🎨 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16.1.1 (App Router, Turbopack) |
| **UI** | React 19, TypeScript, Tailwind CSS v4 |
| **3D Graphics** | Three.js, @react-three/fiber, @react-three/drei |
| **Animations** | Framer Motion, GSAP |
| **Charts** | Recharts |
| **Blog** | Gray-matter, Markdown |
| **Audio** | Howler.js, use-sound |
| **Database** | Supabase (optional) |
| **Icons** | Lucide React |

---

## 🖼️ Screenshots

### Desktop View
- Hero with 3D torus and ⌘K hint
- Bento grid with skills visualization
- Projects with architecture diagrams
- GitHub activity chart

### Mobile View
- Dynamic Island navigation
- Touch-optimized interactions
- Haptic feedback

### God Mode Terminal
- Full filesystem navigation
- ASCII art branding
- Matrix rain easter egg

---

## 📝 Adding Blog Posts

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
excerpt: "Brief description"
date: "2025-01-15"
author: "JN Gonzales"
coverImage: "/images/cover.jpg"
tags: ["tag1", "tag2"]
---

Your markdown content here...
```

---

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

---

## 📄 License

MIT License - feel free to use this as inspiration for your own portfolio!

---

## 👤 Author

**JN Gonzales**
- Email: jngonzales.dev@gmail.com
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Vercel](https://vercel.com) - Deployment platform
- [Three.js](https://threejs.org) - 3D graphics
- [Framer Motion](https://framer.com/motion) - Animations
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

<p align="center">
  <strong>Built with 💜 and lots of ☕</strong>
</p>
