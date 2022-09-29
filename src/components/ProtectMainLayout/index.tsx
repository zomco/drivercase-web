import {Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import logo from "./logo.png";
import React, {useEffect, useState} from 'react';
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import {BankOutlined, SecurityScanOutlined, SettingFilled, UploadOutlined, DoubleRightOutlined} from '@ant-design/icons';
import {Alert} from 'antd';
import Marquee from 'react-fast-marquee';
import moment from 'moment';
import {CaseSource} from "../../enums";
import { css } from '@emotion/css';


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
                icon: <BankOutlined />
              },
              {
                path: '/search',
                name: '查询事件',
                icon: <SecurityScanOutlined />
              },
              {
                path: '/write',
                name: '上传事件',
                icon: <UploadOutlined />
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
                {cases.map(v => {
                  const count = moment().diff(moment(v.updateTime), 'days');
                  return (
                      <div style={{marginRight: '30px'}} key={v.id}>
                        {v.name}（{v.code}）与 {v.source === CaseSource.ADMIN ? v.cpLocation : v.user.cpLocation} {v.source === CaseSource.ADMIN ? v.cpName : v.user.cpName} 发生过纠纷，{count === 0 ? '本日' : `${count}日前`}在我平台等级发布成功。
                      </div>
                  );
                })}
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