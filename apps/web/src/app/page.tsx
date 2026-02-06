"use client";


import {
  FileSpreadsheet,
  ArrowRight,
  Github,
  GitPullRequest
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConvertDialog } from "@/components/convert-dialog";
import { useState } from "react";

export default function LandingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
          </div>
          <span>PrepExport</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/devlpr-nitish/PreExport"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 font-medium"
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto -mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
          <GitPullRequest className="w-3 h-3" /> Open Source & Community Driven
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 text-foreground leading-tight">
          Export DSA Sheets <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Anywhere.</span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          The open-source tool to convert Striver, Love Babbar, and other DSA latest updated sheets into
          <strong> Excel</strong>, <strong> Markdown</strong>, or <strong> Notion</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Get Excel Sheet <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="https://github.com/devlpr-nitish/PreExport"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-muted/50 text-foreground rounded-xl font-bold text-lg hover:bg-muted transition-all border border-border flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" /> Contribute
          </a>
        </div>

        <ConvertDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />

        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder for logos or just text */}
          <div className="text-sm font-semibold text-muted-foreground">Supported Formats:</div>
          <div className="text-sm font-bold text-foreground">Excel .xlsx</div>
          <div className="text-sm font-bold text-foreground">Markdown .md</div>
          <div className="text-sm font-bold text-foreground">Notion .csv</div>
          <div className="text-sm font-bold text-foreground">Google Docs</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm shrink-0">
        <p>Built for the community. released under MIT License.</p>
      </footer>
    </div>
  );
}
