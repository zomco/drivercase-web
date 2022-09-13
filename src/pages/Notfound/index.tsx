import React from "react";
import {Button, Result} from 'antd';
import {useNavigate} from "react-router-dom";

function Notfound() {
  const navigate = useNavigate();
  return <div style={{
    display: 'flex',
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。."
        extra={<Button type="primary" onClick={() => navigate('/')}>返回</Button>}
    />
  </div>;
}

export default Notfound;