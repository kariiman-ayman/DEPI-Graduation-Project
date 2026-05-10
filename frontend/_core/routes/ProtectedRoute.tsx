import { Navigate } from "react-router";
import { useAuthStore } from "_core/store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user);

  console.log(user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
