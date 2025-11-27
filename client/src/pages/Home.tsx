import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";
import { DotGridBackground } from "@/components/DotGridBackground";
import { Marquee } from "@/components/ui/marquee";
import { APP_TITLE } from "@/const";
import { LogoIcon } from "@/components/LogoIcon";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { user, loading } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      setLocation("/dashboard");
    }
  }, [user, loading, setLocation]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground lowercase">loading...</div>
      </div>
    );
  }

  // Show redirecting state for authenticated users
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground lowercase">redirecting...</div>
      </div>
    );
  }

  const founderTypes = [
    "technical",
    "business",
    "design",
    "marketing",
    "product",
    "sales",
    "growth",
    "engineering",
  ];

  return (
    <>
      <DotGridBackground />

      <div className="min-h-screen flex flex-col">
        {/* Header - Mobile first */}
        <header className="px-4 py-4 sm:px-6 sm:py-6">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-sm font-semibold lowercase sm:text-base">
                {APP_TITLE.toLowerCase()}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setAuthDialogOpen(true)}
              className="lowercase text-sm sm:text-base h-9 px-3 sm:h-10 sm:px-4"
            >
              sign in
            </Button>
          </div>
        </header>

        {/* Hero Section - Mobile first */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <div className="w-full max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Headline - starts at mobile size, grows on larger screens */}
            <h1 className="text-3xl font-bold tracking-tight lowercase sm:text-4xl md:text-5xl lg:text-6xl">
              find your co-founder. build something great.
            </h1>

            {/* Subheadline - mobile first */}
            <p className="text-base text-muted-foreground max-w-2xl mx-auto lowercase sm:text-lg md:text-xl">
              connect with founders in hamburg who share your vision. no fluff,
              just real people building real things.
            </p>

            {/* Marquee - mobile optimized */}
            <div className="relative py-6 sm:py-8 -mx-4 sm:mx-0">
              {/* Left gradient fade */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none sm:w-20" />
              {/* Right gradient fade */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none sm:w-20" />
              <Marquee pauseOnHover className="[--duration:20s]">
                {founderTypes.map((type, idx) => (
                  <div
                    key={idx}
                    className="mx-2 px-4 py-2 bg-muted rounded-full text-xs font-medium lowercase sm:mx-4 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {type}
                  </div>
                ))}
              </Marquee>
            </div>

            {/* CTA Button - mobile first with proper touch target */}
            <Button
              size="lg"
              onClick={() => setAuthDialogOpen(true)}
              className="lowercase text-base px-6 py-6 sm:px-8 sm:text-lg w-full sm:w-auto"
            >
              get started
            </Button>
          </div>
        </main>

        {/* Footer - mobile first */}
        <footer className="px-4 py-4 border-t sm:px-6 sm:py-6">
          <div className="container flex items-center justify-center gap-4 text-sm text-muted-foreground sm:gap-6">
            <Link
              href="/privacy"
              className="hover:text-foreground lowercase transition-colors"
            >
              privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground lowercase transition-colors"
            >
              terms
            </Link>
          </div>
        </footer>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
