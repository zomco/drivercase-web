import {Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React, {useEffect, useState} from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {SettingFilled, SmileFilled,} from '@ant-design/icons';
import {Alert} from 'antd';
import Marquee from 'react-fast-marquee';
import moment from 'moment';


function AdminMainLayout() {
  const navigate = useNavigate();
  const {user, get} = useAuth();
  const [count, setCount] = useState<AdminCountResult>({ user: '0', caze: '0' });

  useEffect(() => {
    const fetchData = async () => {
      const result = await get<AdminCountResult>(`/api/a/count`);
      if (result) {
        setCount(result);
      }
    }
    fetchData().then();
  }, []);

  console.log(!count?.user, !count?.caze);
  return (
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
                icon: <SmileFilled style={ parseInt(count.user) !== 0 ? { color: '#ff6633' } : {} } />
              },
              {
                path: '/admin/case',
                name: '事件',
                icon: <SmileFilled style={ parseInt(count.caze) !== 0 ? { color: '#ff6633' } : {} } />
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
  );
}

export default AdminMainLayout;