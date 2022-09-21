import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {SmileFilled,} from '@ant-design/icons';


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