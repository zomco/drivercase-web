import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import React from 'react';


function AdminLayout() {
  const {user} = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.cpName !== '管理员') {
    return <Navigate to="/" />;
  }

  return (
      <div
          style={{
            height: '100vh',
          }}
      >
        <Outlet />
      </div>
  );
}

export default AdminLayout;