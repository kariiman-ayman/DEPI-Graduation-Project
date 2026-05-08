import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import { clearSession, getSession } from "_core/auth/session";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import { Avatar, AvatarFallback } from "_core/components/ui/avatar";
import { Badge } from "_core/components/ui/badge";
import { Separator } from "_core/components/ui/separator";

export default function StudentProfile() {
  const navigate = useNavigate();
  const [session] = useState({
    token: "dev-token",
    user: {
      email: "dev@local",
      role: "student" as const,
      name: "Dev Student",
    },
  });
  const env = (import.meta as any).env ?? {};
  const devBypass = env.DEV && env.VITE_DISABLE_AUTH !== "false";
  const effectiveSession =
    session ??
    (devBypass
      ? {
          token: "dev-token",
          user: {
            email: "dev@local",
            role: "student" as const,
            name: "Dev Student",
          },
        }
      : null);

  useEffect(() => {
    if (!effectiveSession)
      navigate("/login", { replace: true, state: { from: "/profile" } });
  }, [navigate, effectiveSession]);

  if (!effectiveSession) return null;

  const name = effectiveSession.user.name ?? "Student";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

  return (
    <div className="w-full max-w-3xl">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-12">
                <AvatarFallback className="bg-indigo-600 text-white">
                  {initials || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="truncate">{name}</CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Student</Badge>
                  {effectiveSession.token === "dev-token" ? (
                    <Badge variant="outline">Dev session</Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/", { replace: false });
                }}
              >
                Back to dashboard
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // clearSession();
                  navigate("/login", { replace: true });
                }}
              >
                Logout
              </Button>
            </div>
          </div>
          <Separator />
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-white p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Email
              </div>
              <div className="mt-1 break-words text-base">
                {effectiveSession.user.email}
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Role
              </div>
              <div className="mt-1 text-base capitalize">
                {effectiveSession.user.role}
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4 sm:col-span-2">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Display name
              </div>
              <div className="mt-1 text-base">{name}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
