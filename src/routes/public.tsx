// src/components/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const PublicRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
