---
title: "Building a Modern Portfolio with Next.js 15"
slug: "modern-portfolio-nextjs-15"
date: "2025-12-20"
excerpt: "A deep dive into building this portfolio with Next.js 15, React 19, and the latest web development practices."
coverImage: ""
published: true
tags: ["nextjs", "react", "portfolio", "webdev"]
---

# Building a Modern Portfolio with Next.js 15

When I decided to rebuild my portfolio from scratch, I wanted to use the latest and greatest technologies. Here's what I learned along the way.

## The Tech Stack

- **Next.js 15** - With the new App Router and React Server Components
- **React 19** - Taking advantage of the latest React features
- **Tailwind CSS v4** - The new alpha with CSS-first configuration
- **Framer Motion** - For smooth animations
- **shadcn/ui** - Beautiful, accessible components

## Key Features

### 1. Bento Grid Layout

The bento grid layout has become a popular design pattern in 2024/2025. It provides a clean, modern way to showcase different types of content.

### 2. 3D Interactive Elements

Using Three.js with React Three Fiber, I added an interactive 3D orb to the hero section that responds to mouse movement.

### 3. AI-Powered Chatbot

Integrated with OpenRouter API and Google's Gemini 2.0 Flash model, visitors can ask questions about my skills and experience.

### 4. Easter Eggs

Because every good portfolio needs some fun hidden features:

- **Matrix Mode** - Type `matrix` in the terminal
- **Konami Code** - ↑↑↓↓←→←→BA for a special surprise

## Performance Optimization

- Server Components for reduced client-side JavaScript
- Image optimization with next/image
- Font optimization with next/font
- Static generation where possible

## Lessons Learned

1. **Start with the design** - Having a clear vision saves time
2. **Mobile-first** - Always design for mobile first
3. **Accessibility matters** - Use semantic HTML and ARIA labels
4. **Performance is UX** - Slow sites lose visitors

---

*Check out the source code on [GitHub](https://github.com/jngonzales/portfolio)!*
