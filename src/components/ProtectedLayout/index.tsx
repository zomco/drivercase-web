import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
    SmileFilled,
} from '@ant-design/icons';


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
            title=""
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
                }
              ]
            }}
            menuItemRender={(item, dom) => (
                <div
                    onClick={() => {
                      navigate(item.path || '/');
                    }}
                >
                  {dom}
                </div>
            )}
            avatarProps={{
              src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
              size: 'small',
              title: <div onClick={() => navigate('/setting')}>{user.username}</div>,
            }}
        >
          <PageContainer>
            <ProCard>
              <Outlet />
            </ProCard>
          </PageContainer>
        </ProLayout>
      </div>
  );
};

export default ProtectedLayout;