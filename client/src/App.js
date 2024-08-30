import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Authentication/Login";
import Register from "./Authentication/Registration";
import ForgotPass from "./Authentication/ForgotPass";
import ResetPass from "./Authentication/ResetPass";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPass/>} />
          <Route path="/reset-password/:token" element={<ResetPass />} />



        </Routes>
      </Router>
    </div>
  );
}

export default App;

