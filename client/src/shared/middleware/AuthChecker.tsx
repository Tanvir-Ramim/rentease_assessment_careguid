
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useGetMe from "../../shared/hooks/useGetMe";

const AuthChecker = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useGetMe();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default AuthChecker;