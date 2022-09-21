import {Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React, {useEffect, useState} from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {SettingFilled, SmileFilled,} from '@ant-design/icons';
import {Alert} from 'antd';
import Marquee from 'react-fast-marquee';
import moment from 'moment';


function ProtectedMainLayout() {
  const navigate = useNavigate();
  const {user, get} = useAuth();
  const [cases, setCases] = useState<CaseResult[]>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await get<CaseResult[]>(`/api/c/case`);
      if (result) {
        setCases(result);
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
        {!!cases ? <Alert
            message={
              <Marquee pauseOnHover gradient={false}>
                {cases.map(v => `${v.name}（${v.code}）与 ${v.user.cpLocation} ${v.user.cpName} 发生过纠纷，${moment().diff(moment(v.updateTime), 'days')} 日前在我平台等级发布成功。`).join(' ')}
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

export default ProtectedMainLayout;