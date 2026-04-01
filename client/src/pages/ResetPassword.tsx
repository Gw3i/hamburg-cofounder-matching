import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { updatePassword } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  /**
   * Listen for the PASSWORD_RECOVERY event that Supabase fires
   * when the user arrives via the reset link. This confirms we
   * have a valid recovery session before showing the form.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check if we already have a session (page refresh after recovery)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("password updated successfully");
      setLocation("/");
    } catch (error: any) {
      toast.error(error.message || "failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground lowercase">
          verifying reset link...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="lowercase text-lg sm:text-xl">
            set new password
          </CardTitle>
          <p className="text-sm text-muted-foreground lowercase">
            enter your new password below
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="new-password" className="lowercase text-sm">
                new password
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="lowercase placeholder:lowercase h-10 text-sm sm:h-11 sm:text-base"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirm-password" className="lowercase text-sm">
                confirm password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="lowercase placeholder:lowercase h-10 text-sm sm:h-11 sm:text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full lowercase h-10 text-sm sm:h-11 sm:text-base"
              disabled={loading}
            >
              {loading ? "updating..." : "update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
