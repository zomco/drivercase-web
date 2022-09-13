import React, {useRef} from "react";
import {ProForm, ProFormInstance, ProFormText} from "@ant-design/pro-components";
import {useAuth} from "../../hooks/useAuth";
import {Button, message} from "antd";

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
            label="用户名"
            width="md"
            tooltip="可以包含字母数字、下划线_和句号.，长度为5到10位"
            placeholder="请输入名称"
            initialValue={user.username}
            disabled
            rules={[
              {required: true, whitespace: true},
              {pattern: /^(?=[a-zA-Z0-9._]{5,12}$)(?!.*[_.]{2})[^_.].*[^_.]$/, message: '请输入符合规则的用户名'}
            ]}
        />
        <ProFormText.Password
            name="oldPassword"
            label="旧密码"
            width="md"
            tooltip="至少包含数字、小写字母、大写字母和特殊符号，且无空格，长度为8到16位"
            placeholder="请输入密码"
            rules={[
              {required: true, whitespace: true},
              {
                pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                message: '请输入符合规则的密码'
              }
            ]}
        />
        <ProFormText.Password
            name="newPassword"
            label="新密码"
            width="md"
            tooltip="至少包含数字、小写字母、大写字母和特殊符号，且无空格，长度为8到16位"
            placeholder="请输入密码"
            rules={[
              {required: true, whitespace: true},
              {
                pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                message: '请输入符合规则的密码'
              }
            ]}
        />
        <ProFormText.Password
            name="repeat"
            label="确认新密码"
            width="md"
            tooltip="至少包含数字、小写字母、大写字母和特殊符号，且无空格，长度为8到16位"
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