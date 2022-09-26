import React, {useRef} from "react";
import {ProForm, ProFormInstance, ProFormText} from "@ant-design/pro-components";
import {useAuth} from "../../hooks/useAuth";
import {Button, message} from "antd";
import {PASSWORD_REGEXP, USERNAME_REGEXP} from "../../utils/string";

function Setting() {
  const formRef = useRef<ProFormInstance>();
  const {user, put, logout} = useAuth();
  return (
      <ProForm
          title="修改密码"
          formRef={formRef}
          onFinish={async (values) => {
            const result = await put('/api/c/password', values);
            if (result) {
              message.success('更新成功');
            }
          }}
          submitter={{
            render: (props, doms) => {
              return [
                ...doms,
                <Button
                    key="logout"
                    type="primary"
                    danger
                    onClick={() => logout()}
                >
                  退出登录
                </Button>,
              ];
            },
          }}
          validateMessages={{
            required: '此项为必填项',
          }}
          autoFocusFirstInput
      >
        <ProFormText
            name="username"
            label={<div>用户名<span
                style={{fontSize: '12px', color: 'gray'}}>可以包含字母数字、下划线_和句号.，长度为5到10位</span></div>}
            width="md"
            placeholder="请输入名称"
            initialValue={user.username}
            disabled
            rules={[
              {required: true, whitespace: true},
              {pattern: USERNAME_REGEXP, message: '请输入符合规则的用户名'}
            ]}
        />
        <ProFormText.Password
            name="oldPassword"
            label={<div>旧密码<span style={{
              fontSize: '12px',
              color: 'gray'
            }}>（至少包含数字、小写字母、大写字母和特殊符号，且无空格，长度为8到16位）</span></div>}
            width="md"
            placeholder="请输入密码"
            rules={[
              {required: true, whitespace: true},
              {
                pattern: PASSWORD_REGEXP,
                message: '请输入符合规则的密码'
              }
            ]}
        />
        <ProFormText.Password
            name="newPassword"
            label={<div>新密码<span style={{
              fontSize: '12px',
              color: 'gray'
            }}>（至少包含数字、小写字母、大写字母和特殊符号，且无空格，长度为8到16位）</span></div>}
            width="md"
            placeholder="请输入密码"
            rules={[
              {required: true, whitespace: true},
              {
                pattern: PASSWORD_REGEXP,
                message: '请输入符合规则的密码'
              }
            ]}
        />
        <ProFormText.Password
            name="repeat"
            label={<div>确认新密码<span style={{
              fontSize: '12px',
              color: 'gray'
            }}>（至少包含数字、小写字母、大写字母和特殊符号，且无空格，长度为8到16位）</span></div>}
            width="md"
            placeholder="请重复输入密码"
            rules={[
              {required: true, whitespace: true},
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('密码不相符'));
                },
              }),
            ]}
        />
      </ProForm>
  );
}

export default Setting;