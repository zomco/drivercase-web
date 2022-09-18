import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import React from 'react';


function ProtectLayout() {
  const {user} = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.cpName === '管理员') {
    return <Navigate to="/admin/user" />;
  }

  return (
      <div style={{height: '100vh'}}>
        <Outlet />
      </div>
  );
}

export default ProtectLayout;