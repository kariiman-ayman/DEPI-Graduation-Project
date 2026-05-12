import { Alert, AlertDescription } from "_core/components/ui/alert";
import { Button } from "_core/components/ui/button";
import { Input } from "_core/components/ui/input";
import { Label } from "_core/components/ui/label";
import { useAuthStore } from "_core/store/authStore";
import { useState } from "react";
import "./Login.css";
import { AlertCircle, Eye, EyeClosed, Lock, Mail } from "lucide-react";

export default function LoginPage({ useLogin }: { useLogin: any }) {
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  const { mutateAsync, isPending } = useLogin();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const user = await mutateAsync({ email, password });
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="login-root">
      <div className="bg-grid" aria-hidden="true" />

      <div className="login-card">
        <div className="brand">
          <img src="/logo.svg" alt="Logo" />
        </div>

        <div className="card-header">
          <h1 className="card-title">Sign in</h1>
          <p className="card-subtitle">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={onSubmit} className="login-form" noValidate>
          {/* Email */}
          <div
            className={`field-group ${focused === "email" ? "is-focused" : ""}`}
          >
            <Label htmlFor="email" className="field-label">
              Email address
            </Label>
            <div className="input-wrap">
              <Mail className="field-icon" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="name@company.com"
                autoComplete="email"
                required
                className="field-input"
              />
            </div>
          </div>

          {/* Password */}
          <div
            className={`field-group ${focused === "password" ? "is-focused" : ""}`}
          >
            <div className="label-row">
              <Label htmlFor="password" className="field-label">
                Password
              </Label>
              {/* <button type="button" className="forgot-link">
                Forgot password?
              </button> */}
            </div>
            <div className="input-wrap">
              <Lock className="field-icon" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="field-input"
              />
              <button
                type="button"
                className="toggle-vis"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
          </div>

          {error ? (
            <Alert variant="destructive" className="error-alert">
              <AlertCircle className="error-icon" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            className="submit-btn"
            type="submit"
            disabled={isPending || !email || !password}
          >
            {isPending ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
