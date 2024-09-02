import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ adminOnly = false }) => {
  const { auth, loading, checkAdmin } = useContext(AuthContext);

  if (loading) {
    console.log('Auth is still loading...');
    return null; 
  }
  
  if (!auth) {
    console.log('Redirecting to login because not authenticated');
    toast.error('You need to be logged in to access this page.');
    return <Navigate to="/" />;

  }

  if (adminOnly && !checkAdmin()) {
    console.log('Redirecting to game if not admin');
    return <Navigate to="/game" />;
  }

  console.log('Rendering Outlet');
  return ( <>
            <Outlet />
            <ToastContainer />
          </>
  )
};

export default PrivateRoute;