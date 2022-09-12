import {LockOutlined, MobileOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginFormPage, ProFormCaptcha, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {Button, Divider, message, Tabs} from 'antd';
import {useState} from 'react';
import logo from './logo.png';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useAuth} from "../../hooks/useAuth";

type LoginType = 'phone' | 'account';

function Login() {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const {login} = useAuth();
  return (
      <div style={{backgroundColor: 'white', height: 'calc(100vh - 48px)'}}>
        <LoginFormPage
            backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
            logo={logo}
            title="行者平台"
            subTitle="货车司机打分评价平台"
            onFinish={async (values: LoginParam) => {
              try {
                const response: AxiosResponse<ResultData<LoginResult>, LoginParam> = await axios.post('/api/login', values);
                await login(response.data.result);
                return true;
              } catch (e) {
                const err = e as AxiosError<ResultData<LoginResult>, LoginParam>;
                const data: ResultData<LoginResult> | undefined = err.response?.data;
                if (data) {
                  message.error(data.message);
                } else {
                  message.error(err.message);
                }
              }
            }}
            actions={
              <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
              >
                <Divider plain>
                          <span style={{color: '#CCC', fontWeight: 'normal', fontSize: 14}}>
                            或者
                          </span>
                </Divider>
                <Button
                    style={{gap: '24px'}}
                    size="large"
                    type="default"
                    href="/signup"
                    block
                >
                  注册
                </Button>
              </div>
            }
        >
          <Tabs
              centered
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
              items={[
                {label: '账号密码登录', key: 'account'},
                // { label: '手机号登录', key: 'phone' },
              ]}
          />
          {loginType === 'account' && (
              <>
                <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'用户名'}
                    rules={[
                      {required: true, whitespace: true},
                      {
                        pattern: /^(?=[a-zA-Z0-9._]{5,10}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                        message: '请输入符合规则的用户名'
                      }
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'密码'}
                    rules={[
                      {required: true, whitespace: true},
                      {
                        pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                        message: '请输入符合规则的密码'
                      }
                    ]}
                />
              </>
          )}
          {loginType === 'phone' && (
              <>
                <ProFormText
                    fieldProps={{
                      size: 'large',
                      prefix: <MobileOutlined className={'prefixIcon'} />,
                    }}
                    name="mobile"
                    placeholder={'手机号'}
                    rules={[
                      {
                        required: true,
                        message: '请输入手机号！',
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误！',
                      },
                    ]}
                />
                <ProFormCaptcha
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    captchaProps={{
                      size: 'large',
                    }}
                    placeholder={'请输入验证码'}
                    captchaTextRender={(timing, count) => {
                      if (timing) {
                        return `${count} ${'获取验证码'}`;
                      }
                      return '获取验证码';
                    }}
                    name="captcha"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                    ]}
                    onGetCaptcha={async () => {
                      message.success('获取验证码成功！验证码为：1234');
                    }}
                />
              </>
          )}
          <div
              style={{
                marginBlockEnd: 24,
              }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
                style={{
                  float: 'right',
                }}
            >
              忘记密码
            </a>
          </div>
        </LoginFormPage>
      </div>
  );
}

export default Login;