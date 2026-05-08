import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { clearSession, getSession } from "_core/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";

export default function AdminProfile() {
  const navigate = useNavigate();
  const [session] = useState(() => getSession());

  useEffect(() => {
    if (!session) navigate("/login", { replace: true, state: { from: "/profile" } });
  }, [navigate, session]);

  if (!session) return null;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">Role</div>
          <div className="text-lg">{session.user.role}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="text-lg">{session.user.email}</div>
        </div>
        {session.user.name ? (
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="text-lg">{session.user.name}</div>
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              navigate("/", { replace: false });
            }}
          >
            Go to dashboard
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              clearSession();
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

