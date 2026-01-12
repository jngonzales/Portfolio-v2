"use client";

import dynamic from "next/dynamic";
import { SmoothScrollProvider } from "@/components/smooth-scroll";
import { AIChatbot } from "@/components/ai-chatbot";
import { AIHintProvider } from "@/components/ai-hint-provider";

// Dynamically import custom cursor to avoid SSR issues
const CustomCursor = dynamic(
  () => import("@/components/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Function to trigger chat via DOM event
  const handleOpenChat = () => {
    // Dispatch a custom event that AIChatbot can listen to
    window.dispatchEvent(new CustomEvent("openAIChat"));
  };
  
  return (
    <SmoothScrollProvider>
      <AIHintProvider onOpenChat={handleOpenChat}>
        <CustomCursor />
        {children}
        <AIChatbot />
      </AIHintProvider>
    </SmoothScrollProvider>
  );
}
