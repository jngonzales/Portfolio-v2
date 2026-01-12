"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/page-wrapper";
import {
  Download,
  Moon,
  Sun,
  Home,
  User,
  Briefcase,
  Award,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Search,
  BookOpen,
  Code2,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const { toggleMatrixMode, matrixMode, toggleGodMode } = useUI();

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg hover:bg-card transition-colors"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground hidden sm:inline">Search...</span>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] w-full max-w-lg"
        aria-describedby={undefined}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[-1]"
          onClick={() => setOpen(false)}
        />

        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          <Command.Input
            placeholder="Type a command or search..."
            className="w-full px-4 py-4 text-base bg-transparent border-b border-border outline-none placeholder:text-muted-foreground"
          />

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              <Command.Item
                value="home"
                onSelect={() => runCommand(() => router.push("/"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Home className="h-4 w-4" />
                Home
              </Command.Item>
              <Command.Item
                value="about"
                onSelect={() => runCommand(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <User className="h-4 w-4" />
                About
              </Command.Item>
              <Command.Item
                value="projects"
                onSelect={() => runCommand(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Briefcase className="h-4 w-4" />
                Projects
              </Command.Item>
              <Command.Item
                value="certificates"
                onSelect={() => runCommand(() => document.getElementById("certificates")?.scrollIntoView({ behavior: "smooth" }))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Award className="h-4 w-4" />
                Certificates
              </Command.Item>
              <Command.Item
                value="contact"
                onSelect={() => runCommand(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Command.Item>
              <Command.Item
                value="blog"
                onSelect={() => runCommand(() => router.push("/blog"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <BookOpen className="h-4 w-4" />
                Blog
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-border my-2" />

            <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              <Command.Item
                value="download resume"
                onSelect={() => runCommand(() => window.open("/resume.pdf", "_blank"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </Command.Item>
              <Command.Item
                value="toggle theme dark light"
                onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                Toggle Theme
              </Command.Item>
              <Command.Item
                value="matrix mode"
                onSelect={() => runCommand(() => toggleMatrixMode())}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Code2 className="h-4 w-4" />
                {matrixMode ? "Disable Matrix Mode" : "Enable Matrix Mode 🔴"}
              </Command.Item>
              <Command.Item
                value="god mode terminal"
                onSelect={() => runCommand(() => toggleGodMode())}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Code2 className="h-4 w-4 text-green-500" />
                Open God Mode Terminal 💻
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-border my-2" />

            <Command.Group heading="Links" className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              <Command.Item
                value="github"
                onSelect={() => runCommand(() => window.open("https://github.com/jn-gonzales", "_blank"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Github className="h-4 w-4" />
                GitHub
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </Command.Item>
              <Command.Item
                value="linkedin"
                onSelect={() => runCommand(() => window.open("https://linkedin.com/in/jn-gonzales", "_blank"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
