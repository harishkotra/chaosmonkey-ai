import Link from "next/link";
import { FlaskConical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <FlaskConical className="h-5 w-5 text-primary" /> ChaosMonkey AI
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/about">About</Link>
          </Button>
          <Button asChild variant="glass" size="sm">
            <Link href="/dashboard">
              <Sparkles className="h-4 w-4" /> Launch Chaos Lab
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
