import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React, {useEffect, useState} from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {SettingFilled, SmileFilled,} from '@ant-design/icons';
import { Alert } from 'antd';


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