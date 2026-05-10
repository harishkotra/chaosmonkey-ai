"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { terminalLogLines } from "@/lib/data/mock-data";

export function LandingHero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
          AI Regression Platform · Powered by Passmark
        </span>
        <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Break AI Apps. <br /> Before Users Do.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          ChaosMonkey AI intentionally breaks workflows while Passmark automatically detects failures using AI-powered testing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Launch Chaos Lab <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="glass">
            <Link href="/testing">
              <Play className="h-4 w-4" /> View Test Demo
            </Link>
          </Button>
        </div>
      </motion.div>

      <Card className="relative overflow-hidden p-5">
        <div className="absolute inset-0 opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black)]">
          <div className="mx-10 h-[300%] w-px animate-scan bg-primary/50" />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <p className="terminal-text text-xs text-slate-400">live-chaos.log</p>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><Zap className="h-3.5 w-3.5" />streaming</span>
        </div>
        <div className="space-y-2 terminal-text text-xs text-slate-300">
          {terminalLogLines.map((line) => (
            <p key={line} className="rounded bg-black/40 px-2 py-1">{line}</p>
          ))}
        </div>
      </Card>
    </section>
  );
}
