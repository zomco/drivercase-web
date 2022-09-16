import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React, {useEffect, useState} from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {SettingFilled, SmileFilled,} from '@ant-design/icons';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';


function ProtectedLayout() {
  const navigate = useNavigate();
  const {user, get} = useAuth();
  const [caze, setCaze] = useState<CaseResult>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await get<CaseResult[]>(`/api/c/case`);
      if (!!result?.length) {
        setCaze(result[0]);
      }
    }
    fetchData().then();
  }, []);

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
        {!!caze ? <Alert
            message={
              <Marquee pauseOnHover gradient={false}>
                {`${caze.user.cpLocation} ${caze.user.cpName} 与 ${caze.name}（${caze.code}）发生 ${caze.description}，已登记发布。`}
              </Marquee>
            }
            banner
            type="info"
        /> : null}
        <PageContainer>
          <ProCard>
            <Outlet />
          </ProCard>
        </PageContainer>
      </ProLayout>
  );
}

export default ProtectedLayout;