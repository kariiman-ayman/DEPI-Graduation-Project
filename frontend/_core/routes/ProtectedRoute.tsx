import { Navigate } from "react-router";
import { useAuthStore } from "_core/store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  if (!hasHydrated) return null; // ← wait for localStorage to be read

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
