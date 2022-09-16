import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import React from 'react';
import {PageContainer, ProCard} from "@ant-design/pro-components";


function DetailLayout() {
  const {user} = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.cpName === '管理员') {
    return <Navigate to="/admin/user" />;
  }

  return (
      <div
          style={{
            height: '100vh',
          }}
      >
        <PageContainer>
          <ProCard>
            <Outlet />
          </ProCard>
        </PageContainer>
      </div>
  );
}

export default DetailLayout;