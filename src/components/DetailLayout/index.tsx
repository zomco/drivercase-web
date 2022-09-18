import {Outlet} from "react-router-dom";
import React from 'react';
import {PageContainer, ProCard} from "@ant-design/pro-components";


function DetailLayout() {
  return (
      <PageContainer>
        <ProCard>
          <Outlet />
        </ProCard>
      </PageContainer>
  );
}

export default DetailLayout;