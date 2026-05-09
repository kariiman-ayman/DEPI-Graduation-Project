import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { loginWithEmailPassword } from "_core/auth/api";
import { setSession } from "_core/auth/session";
import type { UserRole } from "_core/auth/types";
import { Card, CardContent, CardHeader, CardTitle } from "_core/components/ui/card";
import { Input } from "_core/components/ui/input";
import { Button } from "_core/components/ui/button";
import { Label } from "_core/components/ui/label";
import { Alert, AlertDescription } from "_core/components/ui/alert";

function appUrlForRole(role: UserRole): string | null {
  const env = (import.meta as any).env ?? {};
  const admin = env.VITE_ADMIN_APP_URL as string | undefined;
  const student = env.VITE_STUDENT_APP_URL as string | undefined;
  const instructor = env.VITE_INSTRUCTOR_APP_URL as string | undefined;
  if (role === "admin") return admin ?? null;
  if (role === "student") return student ?? null;
  return instructor ?? null;
}

export default function InstructorLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const st = location.state as { from?: string } | null;
    return st?.from ?? "/profile";
  }, [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const session = await loginWithEmailPassword({ email, password });
      setSession(session);

      if (session.user.role !== "instructor") {
        const target = appUrlForRole(session.user.role);
        if (target) {
          const url = new URL(target);
          url.pathname = "/profile";
          window.location.assign(url.toString());
          return;
        }
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Instructor Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

