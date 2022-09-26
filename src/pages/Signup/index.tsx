import type {ProFormInstance} from '@ant-design/pro-components';
import {
  ProCard,
  ProFormCaptcha,
  ProFormCascader,
  ProFormCheckbox,
  ProFormText,
  ProFormUploadDragger,
  StepsForm,
} from '@ant-design/pro-components';
import {Button, message, Result} from 'antd';
import React, {useRef, useState} from 'react';
import level from './level.json';
import axios, {AxiosError} from "axios";
import {Link, useNavigate} from "react-router-dom";
import {
  COMPANY_CODE_REGEXP,
  COMPANY_NAME_REGEXP,
  MOBILE_REGEXP,
  PASSWORD_REGEXP,
  PERSON_CODE_REGEXP,
  PERSON_NAME_REGEXP,
  PHONE_NUMBER_REGEXP,
  USERNAME_REGEXP,
} from "../../utils/string";


function Signup() {
  const formRef = useRef<ProFormInstance>();
  const param: UserParam = {};
  const navigate = useNavigate();
  const [success, setSuccess] = useState<boolean>(false);

  return (
      <div style={{
        backgroundColor: 'white',
        height: 'calc(100vh - 48px)',
        width: '100vw',
        padding: '128px 24px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <ProCard>
          {
            success ?
                <Result
                    status="success"
                    title="提交注册资料成功"
                    subTitle="管理员会花一些时间审核您的资料，审核通过后可登录正常使用, 请稍候"
                    extra={[
                      <Button key="login" type="primary" onClick={() => navigate('/login')}>前往登录</Button>,
                    ]}
                /> :
                <StepsForm
                    stepsProps={{
                      direction: 'vertical',
                    }}
                    formRef={formRef}
                    formProps={{
                      validateMessages: {
                        required: '此项为必填项',
                      },
                    }}
                >
                  <StepsForm.StepForm
                      name="base"
                      title="基本信息"
                      stepProps={{
                        description: '这里填入的都是基本信息',
                      }}
                      onFinish={async () => {
                        const values = formRef.current?.getFieldsValue();
                        const {privacy, terms} = values;
                        if (!privacy || !terms) {
                          return false;
                        }
                        param.basic = {
                          username: values.username,
                          password: values.password,
                        };
                        return true;
                      }}
                  >
                    <ProFormText
                        name="username"
                        label={<div>用户名<span style={{
                          fontSize: '12px',
                          color: 'gray'
                        }}>（可以是由字母或数字或符号组成，长度为5到20位，建议使用常用的公司缩写或手机或邮箱）</span></div>}
                        width="md"
                        placeholder="请输入名称"
                        rules={[
                          {required: true, whitespace: true},
                          {
                            pattern: USERNAME_REGEXP,
                            message: '请输入符合规则的用户名'
                          },
                          {
                            validator: async (_, value) => {
                              try {
                                await axios.get(`/api/o/validate?username=${value}`);
                              } catch (e) {
                                throw new Error('用户已存在');
                              }
                            }
                          }
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        label={<div>密码<span
                            style={{fontSize: '12px', color: 'gray'}}>（至少由字母和数字组成，长度为8到16位）</span></div>}
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
                        label={<div>确认密码<span style={{fontSize: '12px', color: 'gray'}}>（与输入密码一致）</span>
                        </div>}
                        width="md"
                        placeholder="请重复输入密码"
                        rules={[
                          {required: true, whitespace: true},
                          ({getFieldValue}) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('密码不相符'));
                            },
                          }),
                        ]}
                    />
                    <div style={{
                      marginBottom: '24px'
                    }}>
                      <ProFormCheckbox
                          name="privacy"
                          noStyle
                      >
                        同意 <Link to="/privacy">隐私协议</Link>
                      </ProFormCheckbox>
                    </div>

                    <div style={{
                      marginBottom: '24px'
                    }}>
                      <ProFormCheckbox
                          name="terms"
                          noStyle
                      >
                        同意 <Link to="/terms">服务条款</Link>
                      </ProFormCheckbox>
                    </div>
                  </StepsForm.StepForm>
                  <StepsForm.StepForm
                      name="company"
                      title="公司信息"
                      stepProps={{
                        description: '这里填入公司信息',
                      }}
                      onFinish={async () => {
                        const values = formRef.current?.getFieldsValue();
                        let province = '';
                        let city = '';
                        let area = '';
                        const inode = level.find(v => v.value === values.cpLocation[0]);
                        if (inode?.children) {
                          province = inode.label;
                          // @ts-ignore
                          const jnode = inode.children.find(v => v.value === values.cpLocation[1]);
                          city = jnode.label;
                          if (jnode.children) {
                            const knode = jnode.children.find((v: any) => v.value === values.cpLocation[2]);
                            area = knode.label;
                          }
                        }

                        param.company = {
                          cpName: values.cpName,
                          cpCode: values.cpCode,
                          cpMobile: values.cpMobile,
                          cpCaptcha: values.cpCaptcha,
                          cpLocation: `${province}${city}${area}`,
                          cpFiles: values.cpFiles.map((v: any) => v.response.result)
                        }
                        console.log(values);
                        return true;
                      }}
                  >
                    <ProFormText
                        name="cpName"
                        label={<div>公司名称<span style={{fontSize: '12px', color: 'gray'}}>（公司完整名称）</span></div>}
                        width="md"
                        rules={[
                          {required: true, whitespace: true},
                          {pattern: COMPANY_NAME_REGEXP, message: '请输入有效公司名称'}]}
                    />
                    <ProFormText
                        name="cpCode"
                        label={<div>公司信用代码<span
                            style={{fontSize: '12px', color: 'gray'}}>（18位统一社会信用代码）</span></div>}
                        width="md"
                        rules={[
                          {required: true, whitespace: true},
                          {
                            pattern: COMPANY_CODE_REGEXP,
                            message: '请输入有效统一社会信用代码'
                          }]}
                    />
                    <ProFormText
                        name="cpMobile"
                        label={<div>公司联系电话<span style={{
                          fontSize: '12px',
                          color: 'gray'
                        }}>（11位手机号码，或固话号码(格式如：0757-12345678)）</span></div>}
                        width="md"
                        rules={[
                          {required: true, whitespace: true},
                          {
                            pattern: PHONE_NUMBER_REGEXP,
                            message: '请输入有效号码'
                          }]}
                    />
                    <ProFormCascader
                        width="md"
                        request={async () => level}
                        name="cpLocation"
                        label="所在地"
                        initialValue={['440000', '440600', '440604']}
                        rules={[
                          {required: true},
                        ]}
                    />
                    <ProFormUploadDragger
                        max={1}
                        accept="image/*"
                        name="cpFiles"
                        label={<div>营业执照<span
                            style={{fontSize: '12px', color: 'gray'}}>（后缀为.png，.jpg且大小不超过10MB的图片）</span>
                        </div>}
                        action="/api/o/upload"
                        fieldProps={{
                          listType: 'picture-card'
                        }}
                        rules={[
                          {required: true}
                        ]}
                    />
                  </StepsForm.StepForm>
                  <StepsForm.StepForm
                      name="representative"
                      title="法人信息"
                      stepProps={{
                        description: '这里填入法人信息',
                      }}
                      onFinish={async () => {
                        const values = formRef.current?.getFieldsValue();
                        param.representative = {
                          rpName: values.rpName,
                          rpCode: values.rpCode,
                          rpMobile: values.rpMobile,
                          rpCaptcha: values.rpCaptcha,
                          rpFiles: [values.rpFiles1[0].response.result, values.rpFiles2[0].response.result]
                        }
                        console.log(values);
                        return true;
                      }}
                  >
                    <ProFormText
                        name="rpName"
                        label={<div>法人姓名<span style={{fontSize: '12px', color: 'gray'}}>（2到6个汉字）</span></div>}
                        width="md"
                        placeholder="请输入法人姓名"
                        rules={[
                          {required: true, whitespace: true},
                          {pattern: PERSON_NAME_REGEXP, message: '请输入有效姓名'}
                        ]}
                    />
                    <ProFormText
                        name="rpCode"
                        label={<div>法人身份证号码<span
                            style={{fontSize: '12px', color: 'gray'}}>（18位身份证号码）</span></div>}
                        width="md"
                        placeholder="请输入法人身份证号码"
                        rules={[
                          {required: true, whitespace: true},
                          {
                            pattern: PERSON_CODE_REGEXP,
                            message: '请输入有效身份证号码'
                          }
                        ]}
                    />
                    <ProFormText
                        name="rpMobile"
                        label={<div>法人联系电话<span style={{fontSize: '12px', color: 'gray'}}>（11位手机号码）</span>
                        </div>}
                        width="md"
                        placeholder="请输入法人联系电话"
                        rules={[
                          {required: true, whitespace: true},
                          {
                            pattern: MOBILE_REGEXP,
                            message: '请输入有效手机号码'
                          }
                        ]}
                    />
                    <ProFormCaptcha
                        phoneName="rpMobile"
                        name="rpCaptcha"
                        rules={[
                          {required: true, whitespace: true},
                          {pattern: /^\d{6}$/, message: '请输入有效验证码'}
                        ]}
                        placeholder="请输入验证码"
                        onGetCaptcha={async (phone) => {
                          const result = await axios.post('/api/o/captcha', {type: 1, mobile: phone});
                          if (!result.data.success) {
                            throw new Error(result.data.message);
                          }
                          message.success(`手机号 ${phone} 验证码发送成功!`);
                        }}
                    />
                    <ProFormUploadDragger
                        max={1}
                        name="rpFiles1"
                        label={<div>身份证国徽面<span
                            style={{fontSize: '12px', color: 'gray'}}>（后缀为.png，.jpg且大小不超过10MB的图片）</span>
                        </div>}
                        accept="image/*"
                        action="/api/o/upload"
                        fieldProps={{
                          listType: 'picture-card'
                        }}
                        rules={[
                          {required: true}
                        ]}
                    />
                    <ProFormUploadDragger
                        max={1}
                        name="rpFiles2"
                        label={<div>身份证人像面<span
                            style={{fontSize: '12px', color: 'gray'}}>（后缀为.png，.jpg且大小不超过10MB的图片）</span>
                        </div>}
                        accept="image/*"
                        action="/api/o/upload"
                        fieldProps={{
                          listType: 'picture-card'
                        }}
                        rules={[
                          {required: true}
                        ]}
                    />
                  </StepsForm.StepForm>
                  <StepsForm.StepForm
                      name="operator"
                      title="操作人信息"
                      stepProps={{
                        description: '这里填入操作人信息',
                      }}
                      onFinish={async () => {
                        const values = formRef.current?.getFieldsValue();
                        param.operator = {
                          opName: values.opName,
                          opCode: values.opCode,
                          opMobile: values.opMobile,
                          opCaptcha: values.opCaptcha,
                          opFiles: [values.opFiles1[0].response.result, values.opFiles2[0].response.result]
                        }
                        console.log(values);
                        try {
                          const result: ResultData<String> = await axios.post('/api/o/signup', param);
                          setSuccess(true);
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
                  >
                    <ProFormText
                        name="opName"
                        label={<div>操作人姓名<span style={{fontSize: '12px', color: 'gray'}}>（2到6个汉字）</span></div>}
                        width="md"
                        placeholder="请输入操作人姓名"
                        rules={[
                          {required: true, whitespace: true},
                          {pattern: PERSON_NAME_REGEXP, message: '请输入有效姓名'}
                        ]}
                    />
                    <ProFormText
                        name="opCode"
                        label={<div>操作人身份证号码<span
                            style={{fontSize: '12px', color: 'gray'}}>（18位身份证号码）</span></div>}
                        width="md"
                        placeholder="请输入操作人身份证号码"
                        rules={[
                          {required: true, whitespace: true},
                          {
                            pattern: PERSON_CODE_REGEXP,
                            message: '请输入有效身份证号码'
                          }
                        ]}
                    />
                    <ProFormText
                        name="opMobile"
                        label={<div>操作人联系电话<span style={{fontSize: '12px', color: 'gray'}}>（11位手机号码）</span>
                        </div>}
                        width="md"
                        placeholder="请输入操作人联系电话"
                        rules={[
                          {required: true, whitespace: true},
                          {
                            pattern: MOBILE_REGEXP,
                            message: '请输入有效手机号码'
                          }
                        ]}
                    />
                    <ProFormCaptcha
                        phoneName="opMobile"
                        name="opCaptcha"
                        placeholder="请输入验证码"
                        rules={[
                          {required: true, whitespace: true},
                          {pattern: /^\d{6}$/, message: '请输入有效验证码'}
                        ]}
                        onGetCaptcha={async (phone) => {
                          const result = await axios.post('/api/o/captcha', {type: 2, mobile: phone});
                          if (!result.data.success) {
                            throw new Error(result.data.message);
                          }
                          message.success(`手机号 ${phone} 验证码发送成功!`);
                        }}
                    />
                    <ProFormUploadDragger
                        max={1}
                        name="opFiles1"
                        label={<div>身份证国徽面<span
                            style={{fontSize: '12px', color: 'gray'}}>（后缀为.png，.jpg且大小不超过10MB的图片）</span>
                        </div>}
                        accept="image/*"
                        action="/api/o/upload"
                        fieldProps={{
                          listType: 'picture-card'
                        }}
                        rules={[
                          {required: true}
                        ]}
                    />
                    <ProFormUploadDragger
                        max={1}
                        name="opFiles2"
                        label={<div>身份证人像面<span
                            style={{fontSize: '12px', color: 'gray'}}>（后缀为.png，.jpg且大小不超过10MB的图片）</span>
                        </div>}
                        accept="image/*"
                        action="/api/o/upload"
                        fieldProps={{
                          listType: 'picture-card'
                        }}
                        rules={[
                          {required: true}
                        ]}
                    />
                  </StepsForm.StepForm>
                </StepsForm>
          }
        </ProCard>
      </div>
  );
}

export default Signup;