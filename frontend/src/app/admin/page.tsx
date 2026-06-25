"use client";

import { QrCode, Sparkles, TrendingUp, BarChart3, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-1 relative overflow-hidden select-none">
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-0 right-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      {/* Header Welcome Title Area */}
      <div className="flex flex-col gap-2 relative z-10 animate-in fade-in slide-in-from-top-4 duration-300">
        {/* Floating Tag */}
        <div className="flex items-center gap-1.5 text-primary font-bold text-[10px] tracking-widest uppercase bg-primary/10 border border-primary/20 rounded-full px-3 py-1 w-fit shadow-sm shadow-primary/5">
          <Sparkles className="h-3 w-3 animate-spin duration-3000" />
          <span>Workspace Overview</span>
        </div>
        
        {/* Attractive Gradient Heading */}
        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-primary/80 pb-1">
          Dashboard
        </h1>

        {/* Styled Descriptive Text */}
        <p className="text-sm font-medium text-muted-foreground/90 max-w-xl leading-relaxed tracking-wide">
          Welcome back! Your dynamic QR routing engine is <span className="text-primary font-semibold underline underline-offset-4 decoration-primary/30">live and active</span>, parsing incoming analytical scan traffic.
        </p>
      </div>

      {/* Mini Aesthetic Analytical Highlight Cards */}
      <div className="grid gap-4 sm:grid-cols-3 animate-in fade-in slide-in-from-top-6 duration-500 delay-100">
        
        {/* Total Codes */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm shadow-xl flex items-center justify-between group hover:border-primary/30 transition-all duration-200">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 block">Total Targets</span>
            <p className="text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">12</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:bg-primary/20 transition-all duration-200">
            <QrCode className="h-5 w-5 stroke-2" />
          </div>
        </div>

        {/* Global Scans */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm shadow-xl flex items-center justify-between group hover:border-primary/30 transition-all duration-200">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 block">Accumulated Scans</span>
            <p className="text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">1,482</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:bg-primary/20 transition-all duration-200">
            <BarChart3 className="h-5 w-5 stroke-[2]" />
          </div>
        </div>

        {/* Performance Metric */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm shadow-xl flex items-center justify-between group hover:border-primary/30 transition-all duration-200">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 block">System Health</span>
            <p className="text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">99.9%</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:bg-primary/20 transition-all duration-200">
            <TrendingUp className="h-5 w-5 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Decorative Canvas Framework Placeholder Card */}
      <div className="overflow-hidden border border-border/40 rounded-2xl bg-card/10 backdrop-blur-md p-8 text-center shadow-inner relative group min-h-[200px] flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.01] to-transparent pointer-events-none" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-4 shadow-md shadow-primary/5">
          <Zap className="h-5 w-5 stroke-[2] animate-bounce" />
        </div>
        
        {/* Beautifully Crafted Hint Text */}
        <p className="text-xs font-medium text-muted-foreground/80 max-w-sm leading-relaxed tracking-wide">
          Select <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-md border border-primary/10">QR Codes</span> in the sidebar links to begin creating, exporting, and managing your custom high-fidelity tracking modules.
        </p>
      </div>
    </div>
  );
}