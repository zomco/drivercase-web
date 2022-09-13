import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import React from 'react';
import {PageContainer, ProCard} from "@ant-design/pro-components";


function ProtectedPageLayout() {
  const {user} = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
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

export default ProtectedPageLayout;