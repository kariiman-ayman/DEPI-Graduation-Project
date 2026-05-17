import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  if (!hasHydrated) return null;

  if (user) return <Navigate to="/" replace />;

  return children;
}
