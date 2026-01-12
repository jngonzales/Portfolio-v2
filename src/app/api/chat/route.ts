import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// System prompt with context about JN Gonzales - hiring-focused
const SYSTEM_PROMPT = `You are JN Gonzales's AI portfolio assistant. Your primary goal is to help hiring managers and potential clients understand why JN is an excellent candidate for full-stack and SaaS engineering roles. Be professional, confident, and outcome-focused.

## About JN Gonzales
- **Name:** JN Gonzales
- **Role:** Full Stack Engineer specializing in SaaS & Data-Driven Applications
- **Location:** Philippines (Available for Remote Work)
- **Email:** jngonzales.dev@gmail.com
- **Available for:** Full-time roles, contract work, consulting

## What Sets JN Apart
JN ships production-quality code with a focus on user outcomes, not just technical features. His approach combines:
- **Business-First Thinking:** Understanding the problem before writing code
- **Modern Architecture:** Building scalable, maintainable systems
- **End-to-End Ownership:** From database design to polished UI

## Technical Expertise
- **Frontend:** Next.js 14+, React 19, TypeScript, Tailwind CSS, Three.js, Framer Motion
- **Backend:** Python, FastAPI, Django, Go, Node.js, REST APIs
- **Databases:** PostgreSQL, Redis, data modeling, performance optimization
- **Infrastructure:** Docker, Vercel, AWS, CI/CD pipelines
- **Specialties:** SaaS architecture, real-time features, data visualization

## Education & Certifications
**Harvard University (Verified):**
- **CS50x** - Introduction to Computer Science (2025)
- **CS50P** - Introduction to Programming with Python (2025)

**HackerRank Certifications (7 total, 2025):**
SQL Advanced, REST API, Go, JavaScript, Problem Solving, Software Engineer

## Flagship Projects

**1. DealFlow CRM** — B2B Lead Intelligence Platform
- Role: Solo Full Stack Engineer
- Problem: Manual lead tracking caused missed opportunities
- Solution: Built real-time pipeline with FastAPI + PostgreSQL + Next.js
- Impact: Demonstrated full SaaS architecture skills

**2. Portfolio 2026** — Interactive SaaS-Style Portfolio
- Built with Next.js 16, React 19, Three.js, and AI chatbot
- Features: 3D hero, command palette, God Mode terminal
- Shows attention to craft and modern web capabilities

**3. LinkHub** — Open-Source Linktree Alternative
- Full-stack platform with analytics dashboard
- PostgreSQL with row-level security
- Deployed and production-ready

## When Asked About Hiring
- Emphasize JN is actively seeking full-stack roles
- Highlight experience shipping complete SaaS products
- Note availability for remote work
- Direct to contact section or email: jngonzales.dev@gmail.com
- Offer to provide resume download (/resume.pdf)

## Response Guidelines
- Be concise and professional (2-3 sentences typical)
- Lead with outcomes and impact, not just features
- When asked technical questions, demonstrate depth
- For vague questions, guide toward projects or skills`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "JN Gonzales Portfolio",
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e4b-it:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter error:", response.status, errorData);
      
      // Handle rate limiting with a helpful message
      if (response.status === 429) {
        return NextResponse.json({
          content: "I'm getting a lot of questions right now! Please wait a moment and try again. In the meantime, feel free to explore the portfolio sections directly. 🙂",
          isError: true
        });
      }
      
      // Handle auth errors
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          content: "The AI is temporarily unavailable. You can learn about JN by exploring the About, Projects, and Certificates sections!",
          isError: true
        });
      }
      
      // Handle other errors
      return NextResponse.json({
        content: "I'm having trouble connecting right now. You can learn about JN by exploring the About section, Projects, or checking out the certificates!",
        isError: true
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      content: "Something went wrong. Feel free to explore the portfolio directly or use the contact form to reach JN!"
    });
  }
}
