import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Authentication/Login";
import Register from "./Authentication/Registration";
import ForgotPass from "./Authentication/ForgotPass";
import ResetPass from "./Authentication/ResetPass";
import PrivateRoute from "./PrivateRoute";
import ManageUsers from "./Admin-only/ManageUsers";
import Layout from "./Layout";
import GameTerminal from "./GameTerminal/GameTerminal";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPass/>} />
          <Route path="/reset-password/:token" element={<ResetPass />} />
        
            {/* Admin-only protected routes with sidebar/topbar */}
        <Route element={<PrivateRoute adminOnly={true} />}>
        <Route element={<Layout />}>
          <Route path="/manage-users" element={<ManageUsers />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/game" element={<GameTerminal />} />
      </Route>



        </Routes>
      </Router>
    </div>
  );
}

export default App;

