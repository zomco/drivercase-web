import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {SmileFilled,} from '@ant-design/icons';


function AdminLayout() {
  const navigate = useNavigate();
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
        <ProLayout
            fixSiderbar
            layout="top"
            splitMenus
            logo={logo}
            title={user.cpName}
            route={{
              path: '/',
              routes: [
                {
                  path: '/admin/user',
                  name: '用户',
                  icon: <SmileFilled />
                },
                {
                  path: '/admin/case',
                  name: '事件',
                  icon: <SmileFilled />
                },
              ]
            }}
            menuItemRender={(item, dom) => <div onClick={() => navigate(item.path || '/')}>{dom}</div>}
        >
          <PageContainer>
            <ProCard>
              <Outlet />
            </ProCard>
          </PageContainer>
        </ProLayout>
      </div>
  );
}

export default AdminLayout;