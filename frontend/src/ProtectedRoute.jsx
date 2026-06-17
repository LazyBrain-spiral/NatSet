import { Navigate } from "react-router-dom";
import React from 'react'

function ProtectedRoute({children,allowedRole}) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute
