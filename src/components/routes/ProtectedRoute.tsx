import React, { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRoute {
  children: React.ReactNode;
}
const ProtectedRoute: FC<ProtectedRoute> = ({ children }) => {
  const { user } = useAuth();
  return <>{user ? children : <Navigate to={"/login"} />}</>;
};

export default ProtectedRoute;
