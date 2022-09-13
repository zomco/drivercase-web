import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {SettingFilled, SmileFilled,} from '@ant-design/icons';


function ProtectedLayout() {
  const navigate = useNavigate();
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
                  path: '/',
                  name: '我的事件',
                  icon: <SmileFilled />
                },
                {
                  path: '/search',
                  name: '查询事件',
                  icon: <SmileFilled />
                },
                {
                  path: '/write',
                  name: '上传事件',
                  icon: <SmileFilled />
                },
                {
                  path: '/setting',
                  name: '设置',
                  hideInMenu: true
                }
              ]
            }}
            actionsRender={(props) => {
              return [
                <SettingFilled key="QuestionCircleFilled" onClick={() => navigate('/setting')} />,
              ];
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

export default ProtectedLayout;