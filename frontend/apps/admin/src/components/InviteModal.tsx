import { Button } from "_core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "_core/components/ui/dialog";
import { Input } from "_core/components/ui/input";
import { Label } from "_core/components/ui/label";
import { CheckCircle, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { useCreateInvitation } from "../hooks/useInvites.js";
import type { InviteRole } from "../types/invites.types.js";

const ROLE_INFO: Record<
  InviteRole,
  { label: string; desc: string; color: string; Icon: React.ElementType }
> = {
  student: {
    label: "Student",
    desc: "Access courses, grades, attendance, lectures, and payments.",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    Icon: GraduationCap,
  },
  instructor: {
    label: "Instructor",
    desc: "Manage courses, upload lectures, record grades, and track attendance.",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    Icon: Users,
  },
  admin: {
    label: "Administrator",
    desc: "Full platform access: users, courses, departments, payments, and reports.",
    color: "bg-red-50 border-red-200 text-red-700",
    Icon: ShieldCheck,
  },
};

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole | "">("");
  const [academicYear, setAcademicYear] = useState<number | "">("");
  const [initialGpa, setInitialGpa] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useCreateInvitation();

  const reset = () => {
    setEmail("");
    setRole("");
    setAcademicYear("");
    setInitialGpa("");
    setSent(false);
    setError(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(reset, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setError(null);
    try {
      const gpaNum = initialGpa !== "" ? parseFloat(initialGpa) : undefined;
      if (gpaNum !== undefined && (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4)) {
        setError("Initial GPA must be between 0.0 and 4.0");
        return;
      }
      await mutateAsync({
        email,
        role,
        ...(role === "student" && academicYear
          ? { academicYear: academicYear as number }
          : {}),
        ...(role === "student" && gpaNum !== undefined
          ? { initialGpa: gpaNum }
          : {}),
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send invitation",
      );
    }
  };

  const selectedRole = role ? ROLE_INFO[role] : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Invitation</DialogTitle>
          <DialogDescription>
            The recipient will receive an email with a personalised sign-up link
            for their role.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              Invitation sent!
            </p>
            <p className="text-sm text-gray-500">
              An email was sent to{" "}
              <span className="font-medium text-gray-700">{email}</span> with a
              sign-up link for the{" "}
              <span className="font-medium capitalize">{role}</span> portal.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={handleClose}>
                Done
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Send Another
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 py-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="inv-email">Email Address *</Label>
                <Input
                  id="inv-email"
                  type="email"
                  placeholder="user@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              {/* Role selector */}
              <div className="space-y-1.5">
                <Label>Role *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(ROLE_INFO) as InviteRole[]).map((r) => {
                    const { label, Icon, color } = ROLE_INFO[r];
                    const selected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          selected
                            ? `${color} border-current`
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Role description */}
                {selectedRole && (
                  <p className="text-xs text-gray-500 mt-1 px-1">
                    {selectedRole.desc}
                  </p>
                )}
              </div>

              {/* Academic Year + Initial GPA — only for student role */}
              {role === "student" && (
                <>
                  <div className="space-y-1.5">
                    <Label>Academic Year *</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setAcademicYear(yr)}
                          className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                            academicYear === yr
                              ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                          }`}
                        >
                          Year {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inv-gpa">
                      Initial GPA{" "}
                      <span className="text-gray-400 font-normal">
                        (optional, 0.0–4.0)
                      </span>
                    </Label>
                    <Input
                      id="inv-gpa"
                      type="number"
                      min={0}
                      max={4}
                      step={0.01}
                      placeholder="e.g. 3.50"
                      value={initialGpa}
                      onChange={(e) => setInitialGpa(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !email ||
                  !role ||
                  (role === "student" && !academicYear)
                }
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isPending ? "Sending…" : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
