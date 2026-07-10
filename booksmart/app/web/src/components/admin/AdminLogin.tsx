import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { LogIn, Loader2, Mail } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please fill in all fields", undefined, "error");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast("Login failed", error.message, "error");
      return;
    }
    navigate("/admin");
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast("Please enter your email", undefined, "error");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) {
      toast("Failed to send magic link", error.message, "error");
      return;
    }
    setMagicLinkSent(true);
    toast("Magic link sent!", "Check your email for the login link.", "success");
  };

  if (magicLinkSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Mail className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-500">
              We've sent a magic link to <strong>{email}</strong>. Click the link to sign in.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => { setMagicLinkSent(false); setMode("password"); }}
            >
              Back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">BookSmart Admin</CardTitle>
          <CardDescription>Sign in to manage your business</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
            className="space-y-4"
          >
            <Input
              label="Email"
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {mode === "password" && (
              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {mode === "password" ? "Sign In" : "Send Magic Link"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "password" ? "magic" : "password")}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {mode === "password" ? "Sign in with magic link" : "Sign in with password"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
