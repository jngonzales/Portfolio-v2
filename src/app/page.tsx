import { Hero } from "@/components/hero";
import { BentoGrid } from "@/components/bento";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <Hero />

        {/* Bento Grid */}
        <BentoGrid />

        {/* Projects Section */}
        <ProjectsSection />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </main>
    </PageWrapper>
  );
}
