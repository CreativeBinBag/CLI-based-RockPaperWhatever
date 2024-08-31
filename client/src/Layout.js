import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Admin-only/Topbar';
const Layout = () => {
 
  return (
    <div className="app">
      <main className="content">
        <Topbar/>
        <Outlet /> {/* Render the nested routes here */}

      </main>
    </div>
  );
};

export default Layout;