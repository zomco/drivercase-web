import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import {PageContainer} from "@ant-design/pro-components";
import {ProCard} from "@ant-design/pro-components";
const { Header, Content, Footer } = Layout;


function ProtectedLayout() {

    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }

  return (
      <Layout
          style={{
            height: '100vh',
          }}
      >
        <Header
            style={{
              backgroundColor: '#fff'
            }}
        >
          <div className="logo" />
          <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              items={[
                {
                  label: '历史记录',
                  key: 'home'
                },
                {
                  label: '查询司机',
                  key: 'search'
                },
                {
                  label: '上传事件',
                  key: 'write'
                }
              ]}
          />
        </Header>
        <Content>
          <PageContainer>
            <ProCard>
              <Outlet />
            </ProCard>
          </PageContainer>
        </Content>
      </Layout>
    );
};

export default ProtectedLayout;