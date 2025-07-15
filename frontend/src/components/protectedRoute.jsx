import React from "react";
import { Navigate } from "react-router-dom";
import FormContext from "../contexts/formContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = React.useContext(FormContext);
  if (isLoggedIn === undefined) {
    throw new Error("ProtectedRoute must be used within a FormContextProvider");
  }
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
