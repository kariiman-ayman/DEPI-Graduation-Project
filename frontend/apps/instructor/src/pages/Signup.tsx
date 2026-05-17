import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Input } from "_core/components/ui/input";
import { Label } from "_core/components/ui/label";
import { Button } from "_core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import {
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock,
  User,
  BookOpen,
} from "lucide-react";
import { SignupInstructor, validateInvite } from "../api/auth.js";

type Phase = "loading" | "invalid" | "form" | "success";

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [phase, setPhase] = useState<Phase>("loading");
  const [inviteEmail, setInviteEmail] = useState("");
  const [validateError, setValidateError] = useState("");

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setValidateError("No invitation token found in this link.");
      setPhase("invalid");
      return;
    }
    validateInvite(token)
      .then((data) => {
        setInviteEmail(data.email);
        setPhase("form");
      })
      .catch((err) => {
        setValidateError(
          err instanceof Error ? err.message : "Invalid invitation",
        );
        setPhase("invalid");
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await SignupInstructor({
        token,
        name,
        password,
        title: title || undefined,
        specialization: specialization || undefined,
      });
      setPhase("success");
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create account",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header band */}
        <div className="bg-purple-600 px-8 py-7 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7 text-white" />
          </div>
          <p className="text-white font-bold text-xl">Instructor Portal</p>
          <p className="text-purple-200 text-sm mt-1">
            Smart Campus — Complete your registration
          </p>
        </div>

        <div className="px-8 py-7">
          {/* Loading */}
          {phase === "loading" && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Validating your invitation…
              </p>
            </div>
          )}

          {/* Invalid */}
          {phase === "invalid" && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Invalid Invitation
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {validateError}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Please contact your administrator for a new invitation link.
              </p>
            </div>
          )}

          {/* Success */}
          {phase === "success" && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Created!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome to Smart Campus,{" "}
                <span className="font-medium">
                  {title ? `${title} ${name}` : name}
                </span>
                ! Redirecting you to login…
              </p>
            </div>
          )}

          {/* Form */}
          {phase === "form" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Invited as */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900 rounded-lg px-4 py-3">
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-0.5">
                  Invited as
                </p>
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  {inviteEmail}
                </p>
              </div>

              {/* Title + Full name */}
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <div className="flex gap-2">
                  <Select value={title} onValueChange={setTitle}>
                    <SelectTrigger className="w-24 shrink-0">
                      <SelectValue placeholder="Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                      <SelectItem value="Prof.">Prof.</SelectItem>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className="pl-9"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div className="space-y-1.5">
                <Label htmlFor="specialization">
                  Specialization{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="specialization"
                    type="text"
                    placeholder="e.g. Computer Science, Mathematics"
                    className="pl-9"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-9 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create Instructor Account"
                )}
              </Button>

              <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Sign in
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
