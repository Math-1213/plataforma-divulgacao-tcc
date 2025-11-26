import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateRoute({ children }) {
  const user = Cookies.get("user"); // se existir → logado

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
