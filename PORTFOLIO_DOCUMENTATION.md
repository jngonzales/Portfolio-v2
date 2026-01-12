# JN Gonzales Portfolio - Comprehensive Project Documentation

## 📋 Overview

A modern, animated developer portfolio built with Next.js 16, featuring 3D graphics, AI chatbot (powered by Gemini via OpenRouter), interactive terminal easter egg, and a full blog system with admin panel.

**Target Audience:** Recruiters, potential clients, fellow developers  
**Goal:** Showcase full-stack development skills with a "wow factor" experience

---

## 🛠 Tech Stack

### Core Framework

- **Next.js 16.1.1** - Latest App Router with Turbopack
- **React 19.2.3** - With React Compiler for optimized performance
- **TypeScript** - Full type safety throughout

### Styling & UI

- **Tailwind CSS v4** - Latest CSS-first configuration
- **Framer Motion** - Advanced animations and transitions
- **shadcn/ui** - Radix-based accessible components
- **lucide-react** - Consistent icon library
- **tw-animate-css** - Tailwind animation utilities

### 3D Graphics

- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Three.js** - 3D graphics library

### Backend & Database

- **Supabase** - PostgreSQL database + Auth + RLS (optional)
- **OpenRouter** - AI chatbot via Gemini 2.0 Flash (free tier)

### Libraries

- **cmdk** - Command palette (⌘K)
- **lenis** - Smooth scrolling
- **react-markdown** - Blog post rendering
- **remark-gfm** - GitHub Flavored Markdown
- **recharts** - GitHub activity charts
- **@radix-ui/react-label** - Accessible form labels

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main homepage
│   ├── layout.tsx            # Root layout with providers
│   ├── globals.css           # Global styles + Tailwind
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # AI chatbot API (OpenRouter)
│   ├── login/
│   │   └── page.tsx          # Admin login page
│   ├── blog/
│   │   ├── page.tsx          # Blog listing (graceful fallback)
│   │   └── [slug]/page.tsx   # Individual blog post
│   └── admin/
│       ├── page.tsx          # Admin dashboard
│       ├── new/page.tsx      # Create new post
│       └── edit/[id]/page.tsx # Edit existing post
├── middleware.ts             # Route protection for /admin
├── components/
│   ├── hero.tsx              # Hero section with aurora background
│   ├── hero-3d.tsx           # Interactive 3D sphere scene
│   ├── ai-chatbot.tsx        # Floating AI chat (Gemini-powered)
│   ├── command-palette.tsx   # ⌘K navigation palette + Matrix toggle
│   ├── custom-cursor.tsx     # Custom animated cursor
│   ├── smooth-scroll.tsx     # Lenis smooth scrolling
│   ├── loader.tsx            # CLI boot sequence animation
│   ├── page-wrapper.tsx      # UI context (Matrix, Harvard modes)
│   ├── matrix-rain.tsx       # Canvas-based Matrix effect
│   ├── projects-section.tsx  # Projects grid with architecture diagrams
│   ├── contact-section.tsx   # Contact form (Supabase or mailto fallback)
│   ├── guestbook.tsx         # Real-time guestbook with Supabase
│   ├── footer.tsx            # Footer with links
│   ├── client-providers.tsx  # Client-side providers wrapper
│   ├── theme-provider.tsx    # next-themes provider
│   ├── github-activity.tsx   # GitHub contribution chart (recharts)
│   ├── magnetic-button.tsx   # Magnetic hover button effect
│   ├── bento/
│   │   ├── bento-grid.tsx       # About section grid layout
│   │   ├── about-card.tsx       # Personal info + interactive timeline
│   │   ├── tech-stack-card.tsx  # Triple-row animated marquee
│   │   ├── certificates-card.tsx # Holographic Harvard showcase
│   │   ├── github-card.tsx      # Contribution grid + stats
│   │   └── terminal-card.tsx    # Interactive terminal (matrix cmd)
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── ...
├── data/
│   ├── projects.json         # Project data
│   └── certificates.json     # Certificate data
├── hooks/
│   ├── use-is-touch-device.ts # Mobile/touch detection
│   ├── use-konami.ts          # Konami code easter egg detector
│   └── use-sound.ts           # Audio feedback system
├── lib/
│   ├── utils.ts              # Utility functions (cn)
│   ├── github.ts             # GitHub API (with mock fallback)
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       └── server.ts         # Server Supabase client
└── types/
    └── blog.ts               # Blog post types

public/
├── sounds/                   # Audio files (optional)
│   ├── hover.mp3
│   ├── click.mp3
│   ├── type.mp3
│   ├── powerup.mp3
│   └── success.mp3
└── projects/                 # Project screenshots (optional)
```

---

## ✨ Current Features

### 🎯 Core Features (Implemented)

1. **CLI Boot Sequence** - Terminal-style startup animation with Harvard credential verification (shows once per session)
2. **3D Interactive Hero** - Animated sphere with aurora background
3. **Command Palette (⌘K)** - Quick navigation, theme toggle, Matrix mode, actions
4. **Custom Cursor** - Animated dot+ring cursor (desktop only)
5. **Smooth Scrolling** - Lenis-powered butter-smooth scroll
6. **Dark Mode** - Default dark theme with light mode option
7. **Responsive Design** - Mobile-first, works on all devices
8. **Matrix Mode** - Toggle via Terminal (`matrix` command) or Command Palette
9. **Harvard Mode Easter Egg** - Konami Code (↑↑↓↓←→←→BA) triggers crimson theme + confetti

### 🎨 Visual Effects (Implemented)

1. **Holographic Certificate Card** - Premium Harvard credential showcase with:
   - Rose/crimson Harvard branding
   - "VERIFIED CREDENTIALS" badge
   - 3D tilt with holographic shimmer on hover
   - Larger 2-column, 2-row layout
   - Glowing shadow effects
2. **Matrix Rain Effect** - Canvas-based digital rain (green + crimson accents)
3. **3D Tilt Cards** - Parallax effect on project cards and bento cards
4. **Glare Effects** - Light reflection on card hover
5. **Aurora Gradients** - Animated gradient blobs in hero
6. **Seamless Marquee** - Infinite scrolling tech stack
7. **Stagger Animations** - Entrance animations via Framer Motion
8. **Confetti Celebration** - canvas-confetti on Harvard Mode activation

### 🧩 Bento Grid - About Section (Implemented)

1. **About Card** - Name, role, location, bio + **Interactive Timeline**
   - Scrollable journey: 2024 CS50x → DealFlow → HackerRank → 2025 Portfolio
   - Hover animations on each milestone
2. **Tech Stack Card** - 23 technologies in **triple-row animated marquee**
   - Three rows of tech icons moving in different directions
   - Vertically centered to fill card space
   - Technology count badge
   - "Core Focus" skill legend at bottom
3. **Certificates Card** - Premium holographic Harvard showcase (2x2 grid span)
4. **GitHub Card** - Visual contribution grid (GitHub-style green dots)
   - Animated contribution squares with staggered entry
   - Compact stats display (Commits, Repos, Followers)
5. **Terminal Card** - Interactive easter egg with commands (`help`, `matrix`, `about`, etc.)
6. **GitHub Activity Card** - Full-width data visualization with recharts

### 🏗 Project Architecture Diagrams (Implemented)

Each project card now has a "Blueprint" toggle button that reveals:

- Visual architecture diagram showing Frontend → Backend → Database layers
- Tech stack breakdown for each layer
- Demonstrates system design understanding

### 🎮 Easter Eggs & Interactivity

1. **Konami Code** (↑↑↓↓←→←→BA) - Activates "Harvard Mode" with crimson theme + confetti
2. **Matrix Command** - Type `matrix` in terminal or use Command Palette
3. **Terminal Commands** - `help`, `about`, `skills`, `contact`, `projects`, `matrix`, `clear`

### 📝 Blog System (Implemented)

1. **Public Blog Page** - `/blog` with "Coming Soon" fallback
2. **Individual Posts** - `/blog/[slug]` with Markdown rendering
3. **Admin Dashboard** - Protected `/admin` with email auth
4. **Post Editor** - Create/edit posts with Markdown
5. **RLS Protection** - Only admin email can write

### 💬 AI Chatbot (Implemented)

- Floating chat bubble (bottom-left)
- Powered by **Gemini 2.0 Flash** via OpenRouter
- **Emphasizes Harvard credentials** when asked about qualifications
- Context-aware about JN's skills, projects, certifications
- Graceful rate-limit handling with friendly messages

### 📱 Accessibility

- Touch device detection (disables tilt effects)
- Keyboard navigation support
- Proper heading hierarchy
- ARIA labels

---

## 👤 Personal Information (Current Data)

### Identity

- **Name:** JN Gonzales
- **Role:** Full Stack Developer
- **Location:** Cavite, Philippines
- **Work Email:** <jngonzales.dev@gmail.com> (displayed in portfolio)
- **Personal Email:** <jngonz24@gmail.com>

### Tech Stack (23 Technologies)

**Core:** Next.js, React, TypeScript, Python, Django, FastAPI, Go
**Data:** SQL, REST APIs, PostgreSQL
**Frontend:** Tailwind, Node.js
**DevOps:** Git, Docker, Supabase, Vercel, AWS
**Tools:** Linux, Figma, Postman
**Libraries:** Framer Motion, React Query, Zod, Shadcn UI

### Certificates (11 Total)

1. CS50x - Harvard (2024)
2. CS50P - Harvard (2024)
3. Software Engineer - HackerRank
4. REST API Intermediate - HackerRank
5. SQL Advanced - HackerRank
6. SQL Intermediate - HackerRank
7. Go Intermediate - HackerRank
8. Problem Solving Intermediate - HackerRank
9. JavaScript Intermediate - HackerRank
10. CSS - HackerRank
11. TryHackMe Advent of Cyber 2025

### Projects (3 Featured)

1. **LinkHub** - Link-in-bio platform (Linktree clone)
2. **DealFlow** - Real Estate Deal Management SaaS
3. **Portfolio 2026** - This portfolio site

---

## 🎯 Potential "Wow Factor" Additions

### 🔥 High Impact (Recommended)

1. **View Transitions API** - Smooth page transitions between routes
2. **Loading Screen** - Animated logo/name reveal on first load
3. **Particle Background** - Interactive particle system in hero
4. **Scroll Progress Bar** - Animated reading progress indicator
5. **Music/Sound Toggle** - Subtle UI sounds or ambient music
6. **Skills Chart** - Interactive radar/bar chart of skill levels
7. **Download Counter** - Show resume download count
8. **Live Visitor Count** - "X people viewing now" badge

### 💡 Medium Impact

1. **Project Filters** - Filter by tech stack or category
2. **Search Functionality** - Search projects and blog posts
3. **Reading Time** - Estimate for blog posts
4. **Share Buttons** - Social sharing for posts
5. **Comments System** - Blog post comments (Supabase)
6. **Newsletter** - Email subscription form
7. **Project Showcase Video** - Embedded demo videos
8. **Testimonials Section** - Client/colleague quotes

### 🧪 Experimental/Fun

1. **Konami Code Easter Egg** - Secret unlock on key combo
2. **Matrix Rain Effect** - Toggle terminal-style animation
3. **Day/Night Auto Theme** - Based on user's local time
4. **Cursor Trail** - Particle trail following cursor
5. **Interactive Globe** - Show location on 3D Earth
6. **ASCII Art Easter Egg** - In console or terminal card
7. **Gaming Mode** - Mini game hidden somewhere

---

## 🐛 Known Issues / Polish Needed

1. ~~**GitHub Card** - Currently placeholder, needs real API integration~~ ✅ Fixed with mock fallback
2. ~~**Project Images** - Using gradient placeholders, need real screenshots~~ ✅ Uses folder icon fallback
3. **Resume Link** - Points to `/resume.pdf`, needs actual file
4. ~~**AI Chatbot** - Uses rule-based, could add real OpenAI~~ ✅ Now uses Gemini via OpenRouter
5. **Blog Images** - Cover images use `<img>` not `<Image>` (lint warning)
6. **Mobile Menu** - No hamburger nav (uses command palette)
7. **SEO Metadata** - Needs proper meta tags, OG images
8. **Analytics** - No tracking set up (Vercel Analytics?)

---

## 🚀 Deployment Ready Checklist

- [ ] Add real project screenshots to `/public/projects/` (optional)
- [ ] Add actual resume PDF to `/public/resume.pdf`
- [ ] Set up Supabase project and add env vars (optional)
- [ ] Create admin user in Supabase Auth (if using blog)
- [ ] Run `supabase-setup.sql` in SQL Editor (if using blog)
- [x] Configure OpenRouter API key ✅
- [ ] Update GitHub username in `src/lib/github.ts`
- [ ] Update GitHub/LinkedIn URLs if different
- [ ] Test all certificate PDF links
- [ ] Run `npm run build` to check for errors
- [ ] Deploy to Vercel

---

## 📊 Performance Considerations

- **3D Scene** - May impact performance on low-end devices
- **Animations** - Framer Motion optimized with `viewport: { once: true }`
- **Images** - Uses Next.js Image with fallback for missing images
- **Fonts** - Using system fonts or local fonts recommended
- **Bundle Size** - Three.js is large (~600KB), consider code splitting

---

## 🔧 Environment Variables

```env
# Required for AI Chatbot
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Optional - Supabase (for Blog, Contact, Guestbook)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...your-anon-key

# Optional - GitHub (for real contribution data)
GITHUB_TOKEN=ghp_your-github-token

# Optional - Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## ✅ What Works Without Configuration

The portfolio works out of the box with graceful fallbacks:

| Feature | Status | Fallback |
|---------|--------|----------|
| Hero + 3D | ✅ Works | N/A |
| Bento Grid | ✅ Works | N/A |
| Projects | ✅ Works | Folder icons |
| GitHub Stats | ✅ Works | Mock data |
| Certificates | ✅ Works | N/A |
| Terminal Easter Egg | ✅ Works | N/A |
| AI Chatbot | ✅ Works | Rate limit message |
| Contact Form | ✅ Works | Opens mailto: |
| Blog | ✅ Works | "Coming Soon" page |
| Admin | ⚠️ Needs Supabase | Redirects to login |

---

## 🔒 Admin Authentication

When Supabase is configured:

1. **Protected Routes** - `/admin/*` requires authentication
2. **Middleware** - Checks session and email authorization
3. **Admin Email** - Only `jngonzales.dev@gmail.com` can access admin
4. **Login Page** - `/login` with email/password form

---

**Last Updated:** January 2026  
**Status:** Ready for deployment (works without external services)
