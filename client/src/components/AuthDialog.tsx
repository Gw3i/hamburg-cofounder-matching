import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useState } from "react";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const { signInWithEmail, signUpWithEmail } = useSupabaseAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        toast.success("signed in successfully");
        onOpenChange(false);
        setEmail("");
        setPassword("");
      } else {
        await signUpWithEmail(email, password);
        // Show email confirmation message instead of closing dialog
        setConfirmedEmail(email);
        setShowEmailConfirmation(true);
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowEmailConfirmation(false);
    setConfirmedEmail("");
    setEmail("");
    setPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={newOpen => {
        if (!newOpen) {
          // Reset state when dialog closes
          setShowEmailConfirmation(false);
          setConfirmedEmail("");
          setEmail("");
          setPassword("");
        }
        onOpenChange(newOpen);
      }}
    >
      {/* Mobile-first: full width on mobile with padding, max-width on desktop */}
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto sm:w-full">
        {showEmailConfirmation ? (
          // Email confirmation success message
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="lowercase text-lg sm:text-xl">
                check your email
              </DialogTitle>
              <DialogDescription className="lowercase text-sm sm:text-base">
                we've sent a confirmation link to:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-center font-medium text-base sm:text-lg">
                {confirmedEmail}
              </p>

              <p className="text-center text-sm text-muted-foreground lowercase">
                please click the link in the email to verify your account and
                complete registration.
              </p>

              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full lowercase h-10 text-sm sm:h-11 sm:text-base"
              >
                close
              </Button>
            </div>
          </>
        ) : (
          // Sign in / Sign up form
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="lowercase text-lg sm:text-xl">
                {mode === "signin" ? "sign in" : "create account"}
              </DialogTitle>
              <DialogDescription className="lowercase text-sm sm:text-base">
                {mode === "signin"
                  ? "sign in to find your co-founder"
                  : "create an account to get started"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEmailAuth} className="space-y-3 sm:space-y-4">
              {/* Email Input - Mobile optimized */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="lowercase text-sm">
                  email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="lowercase placeholder:lowercase h-10 text-sm sm:h-11 sm:text-base"
                />
              </div>

              {/* Password Input - Mobile optimized */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="lowercase text-sm">
                  password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="lowercase placeholder:lowercase h-10 text-sm sm:h-11 sm:text-base"
                />
              </div>

              {/* Submit Button - Proper touch target */}
              <Button
                type="submit"
                className="w-full lowercase h-10 text-sm sm:h-11 sm:text-base"
                disabled={loading}
              >
                {loading
                  ? "loading..."
                  : mode === "signin"
                    ? "sign in"
                    : "sign up"}
              </Button>
            </form>

            {/* Toggle Mode Link - Mobile optimized touch target */}
            <div className="text-center text-sm pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setShowEmailConfirmation(false);
                  setConfirmedEmail("");
                }}
                className="text-muted-foreground hover:text-foreground lowercase underline-offset-4 hover:underline py-2 px-1 min-h-[44px] inline-flex items-center"
                disabled={loading}
              >
                {mode === "signin"
                  ? "don't have an account? sign up"
                  : "already have an account? sign in"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
