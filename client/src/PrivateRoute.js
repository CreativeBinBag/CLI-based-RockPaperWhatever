import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
const PrivateRoute = ({ adminOnly = false }) => {
  const { auth, loading, checkAdmin } = useContext(AuthContext);

  if (loading) {
    console.log('Auth is still loading...');
    return null; 
  }

  console.log('Auth:', auth);
  console.log('Admin check:', checkAdmin());
  
  if (!auth) {
    console.log('Redirecting to login because not authenticated');
    return <Navigate to="/login" />;
  }

  if (adminOnly && !checkAdmin()) {
    console.log('Redirecting to home because not admin');
    return <Navigate to="/" />;
  }

  console.log('Rendering Outlet');
  return <Outlet />;
};

export default PrivateRoute;