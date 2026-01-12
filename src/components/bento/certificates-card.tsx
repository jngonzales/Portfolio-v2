"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, ExternalLink, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import certificatesData from "@/data/certificates.json";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  year: string;
  file: string;
  color: string;
  description: string;
}

const allCertificates: Certificate[] = certificatesData.certificates;
const harvardCerts = allCertificates.filter(cert => cert.issuer === "Harvard");
const otherCertificates = allCertificates.filter(cert => cert.issuer !== "Harvard");

export function CertificatesCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  // Holographic shimmer position
  const shimmerX = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "200%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isTouchDevice) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      id="certificates"
      ref={cardRef}
      className="group col-span-1 md:col-span-2 h-full relative overflow-hidden rounded-3xl border border-rose-500/30 bg-linear-to-br from-[#1a0a0f] via-[#0f0f1a] to-[#0a0f1a]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={isTouchDevice ? undefined : { scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={isTouchDevice ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 60%, transparent 80%)`,
          transform: `translateX(${shimmerX})`,
        }}
      />
      
      {/* Background pattern - subtle Harvard seal silhouette */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_20%,rgba(225,29,72,0.3),transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-48 h-48 opacity-[0.03]">
        <Shield className="w-full h-full text-rose-500" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        {/* Header */}
        <div>
          {/* Verified badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/50 text-rose-400 text-xs font-bold mb-6">
            <CheckCircle2 className="w-3 h-3" />
            VERIFIED CREDENTIALS
          </div>
          
          {/* Main title */}
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            CS50: Computer Science
          </h3>
          <p className="text-rose-300/80 text-lg font-medium">Harvard University</p>
        </div>

        {/* Middle section - Certificate highlights */}
        <div className="space-y-4 my-6">
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            Mastery in C, Python, SQL, and Algorithms. Completed intensive coursework covering memory management, data structures, and full-stack web development.
          </p>
          
          {/* Harvard certs list */}
          <div className="flex flex-wrap gap-2">
            {harvardCerts.map((cert) => (
              <span 
                key={cert.id}
                className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs border border-rose-500/20"
              >
                {cert.title}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Diploma button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-rose-600 hover:bg-rose-700 text-white border-none shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-shadow"
              >
                <Award className="w-4 h-4 mr-2" />
                View Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>CS50x: Introduction to Computer Science</DialogTitle>
                <DialogDescription>Harvard University - Verified Certificate</DialogDescription>
              </DialogHeader>
              <div className="flex-1 bg-muted rounded-lg">
                <iframe
                  src={harvardCerts[0]?.file || "/certificates/CS50x.pdf"}
                  className="w-full h-full min-h-[60vh] rounded-lg"
                  title="CS50x Certificate"
                />
              </div>
            </DialogContent>
          </Dialog>
          
          {/* View All button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200">
                <ExternalLink className="w-4 h-4 mr-2" />
                All {allCertificates.length} Certificates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-lenis-prevent>
              <DialogHeader>
                <DialogTitle>All Certificates</DialogTitle>
                <DialogDescription>Complete list of certifications and achievements</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 mt-4">
                {/* Harvard certs first */}
                <h4 className="text-sm font-semibold text-rose-400 mt-2">Harvard University</h4>
                {harvardCerts.map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-linear-to-r from-rose-500/20 to-rose-600/10 hover:from-rose-500/30 hover:to-rose-600/20 transition-colors flex justify-between items-center border border-rose-500/20"
                  >
                    <div>
                      <h4 className="font-medium text-white">{cert.title}</h4>
                      <p className="text-sm text-rose-300/80">{cert.issuer} • {cert.year}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-rose-400" />
                  </a>
                ))}
                
                {/* Other certs */}
                <h4 className="text-sm font-semibold text-muted-foreground mt-4">Other Certifications</h4>
                {otherCertificates.map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 rounded-xl bg-linear-to-r ${cert.color} hover:scale-[1.02] transition-transform flex justify-between items-center`}
                  >
                    <div>
                      <h4 className="font-medium">{cert.title}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-rose-500/20 to-transparent rounded-bl-[100px]" />
    </motion.div>
  );
}
