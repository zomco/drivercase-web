import type { ProFormInstance } from '@ant-design/pro-components';
import {
    ProCard,
    ProForm,
    ProFormCheckbox,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormText,
    ProFormTextArea,
    StepsForm,
    ProFormUploadDragger,
    ProFormCascader,
    ProFormCaptcha,
} from '@ant-design/pro-components';
import {Form, message } from 'antd';
import { useRef } from 'react';
import React from "react";
import level from './level.json';
import axios, {AxiosError} from "axios";


function Signup() {
    const formRef = useRef<ProFormInstance>();
    const param: UserParam = {};

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
                    <StepsForm
                        stepsProps={{
                            direction: 'vertical',
                        }}
                        formRef={formRef}
                        onFinish={async () => {
                          try {
                            const result = await axios.post('/api/signup', param);
                            console.log(result)
                            message.success('提交成功');
                          } catch (e) {
                            const err = e as AxiosError<ResultMessage>;
                            message.error(err.message);
                            console.log(err);
                          }
                        }}
                        formProps={{
                            validateMessages: {
                                required: '此项为必填项',
                            },
                        }}
                    >
                        <StepsForm.StepForm<{
                            username: string;
                        }>
                            name="base"
                            title="基本信息"
                            stepProps={{
                                description: '这里填入的都是基本信息',
                            }}
                            onFinish={async () => {
                              const values = formRef.current?.getFieldsValue();
                              param.basic = {
                                username: values.username,
                                password: values.password,
                              };
                                return true;
                            }}
                        >
                            <ProFormText
                                name="username"
                                label="用户名"
                                width="md"
                                tooltip="可以包含字母数字、下划线_和句号.，长度为5到10位"
                                placeholder="请输入名称"
                                rules={[
                                    { required: true, whitespace: true },
                                  { pattern: /^(?=[a-zA-Z0-9._]{5,10}$)(?!.*[_.]{2})[^_.].*[^_.]$/, message: '请输入符合规则的用户名' }
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                label="密码"
                                width="md"
                                tooltip="至少包含数字、小写字母、大写字母和特殊符号，且无空格，长度为8到16位"
                                placeholder="请输入密码"
                                rules={[
                                    { required: true, whitespace: true },
                                  { pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/, message: '请输入符合规则的密码'}
                                ]}
                            />
                            <ProFormText.Password
                                name="repeat"
                                label="确认密码"
                                width="md"
                                tooltip="至少包含数字、小写字母、大写字母和特殊符号，且无空格，长度为8到16位"
                                placeholder="请重复输入密码"
                                rules={[
                                    { required: true, whitespace: true },
                                    ({ getFieldValue }) => ({
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
                                同意 <a href="/privacy">隐私协议</a>
                              </ProFormCheckbox>
                            </div>

                            <div style={{
                              marginBottom: '24px'
                            }}>
                              <ProFormCheckbox
                                  name="terms"
                                  noStyle
                              >
                                同意 <a href="/terms">服务条款</a>
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
                              label="公司名称"
                              width="md"
                              tooltip="公司名称"
                              placeholder="请输入公司名称"
                              rules={[
                                  { required: true, whitespace: true },
                                { pattern: /^[\u4e00-\u9fa5（）\da-zA-Z&]{2,50}$/gi, message: '请输入有效公司名称' }]}
                          />
                          <ProFormText
                              name="cpCode"
                              label="公司信用代码"
                              width="md"
                              tooltip="18位信用代码"
                              placeholder="请输入公司信用代码"
                              rules={[
                                  { required: true, whitespace: true },
                                { pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/, message: '请输入有效统一社会信用代码'}]}
                          />
                          <ProFormText
                              name="cpMobile"
                              label="公司联系电话"
                              width="md"
                              tooltip="11位电话号码"
                              placeholder="请输入公司联系电话"
                              rules={[
                                  { required: true, whitespace: true },
                                { pattern: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$/, message: '请输入有效手机号码' }]}
                          />
                          <ProFormCaptcha
                              phoneName="cpMobile"
                              name="cpCaptcha"
                              rules={[
                                { required: true, whitespace: true },
                                { pattern: /^\d{6}$/, message: '请输入有效验证码' }
                              ]}
                              placeholder="请输入验证码"
                              onGetCaptcha={async (phone) => {
                                const result = await axios.post('/api/captcha', { type: 0, mobile: phone });
                                if (!result.data.success) {
                                  throw new Error(result.data.message);
                                }
                                message.success(`手机号 ${phone} 验证码发送成功!`);
                              }}
                          />
                          <ProFormCascader
                              width="md"
                              request={async () => level}
                              name="cpLocation"
                              label="所在地"
                              initialValue={['440000', '440600', '440604']}
                              rules={[
                                { required: true },
                              ]}
                          />
                          <ProFormUploadDragger
                              max={1}
                              accept="image/*"
                              name="cpFiles"
                              label="营业执照"
                              action="/api/upload"
                              fieldProps={{
                                listType: 'picture-card'
                              }}
                              rules={[
                                { required: true }
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
                                rpFiles: values.rpFiles.map((v: any) => v.response.result)
                              }
                                console.log(values);
                                return true;
                            }}
                        >
                          <ProFormText
                              name="rpName"
                              label="法人姓名"
                              width="md"
                              tooltip="法人姓名"
                              placeholder="请输入法人姓名"
                              rules={[
                                  { required: true, whitespace: true },
                                { pattern: /^[\u4E00-\u9FA5]{2,4}$/, message: '请输入有效姓名' }
                              ]}
                          />
                          <ProFormText
                              name="rpCode"
                              label="法人身份证号码"
                              width="md"
                              tooltip="18位身份证号码"
                              placeholder="请输入法人身份证号码"
                              rules={[
                                  { required: true, whitespace: true },
                                { pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入有效身份证号码' }
                              ]}
                          />
                          <ProFormText
                              name="rpMobile"
                              label="法人联系电话"
                              width="md"
                              tooltip="11位电话号码"
                              placeholder="请输入法人联系电话"
                              rules={[
                                  { required: true, whitespace: true },
                                { pattern: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$/, message: '请输入有效手机号码' }
                              ]}
                          />
                          <ProFormCaptcha
                              phoneName="rpMobile"
                              name="rpCaptcha"
                              rules={[
                                { required: true, whitespace: true },
                                { pattern: /^\d{6}$/, message: '请输入有效验证码' }
                              ]}
                              placeholder="请输入验证码"
                              onGetCaptcha={async (phone) => {
                                const result = await axios.post('/api/captcha', { type: 1, mobile: phone });
                                if (!result.data.success) {
                                  throw new Error(result.data.message);
                                }
                                message.success(`手机号 ${phone} 验证码发送成功!`);
                              }}
                          />
                          <ProFormUploadDragger
                              max={2}
                              name="rpFiles"
                              label="身份证正反面"
                              accept="image/*"
                              action="/api/upload"
                              fieldProps={{
                                listType: 'picture-card'
                              }}
                              rules={[
                                { required: true }
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
                                opFiles: values.opFiles.map((v: any) => v.response.result)
                              }
                              console.log(values);
                              return true
                            }}
                        >
                          <ProFormText
                              name="opName"
                              label="操作人姓名"
                              width="md"
                              tooltip="操作人姓名"
                              placeholder="请输入操作人姓名"
                              rules={[
                                { required: true, whitespace: true },
                                { pattern: /^[\u4E00-\u9FA5]{2,4}$/, message: '请输入有效姓名' }
                              ]}
                          />
                          <ProFormText
                              name="opCode"
                              label="操作人身份证号码"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入操作人身份证号码"
                              rules={[
                                { required: true, whitespace: true },
                                { pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入有效身份证号码' }
                              ]}
                          />
                          <ProFormText
                              name="opMobile"
                              label="操作人联系电话"
                              width="md"
                              tooltip="11位电话号码"
                              placeholder="请输入操作人联系电话"
                              rules={[
                                { required: true, whitespace: true },
                                { pattern: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$/, message: '请输入有效手机号码' }
                              ]}
                          />
                          <ProFormCaptcha
                              phoneName="opMobile"
                              name="opCaptcha"
                              placeholder="请输入验证码"
                              rules={[
                                { required: true, whitespace: true },
                                { pattern: /^\d{6}$/, message: '请输入有效验证码' }
                              ]}
                              onGetCaptcha={async (phone) => {
                                const result = await axios.post('/api/captcha', { type: 2, mobile: phone });
                                if (!result.data.success) {
                                  throw new Error(result.data.message);
                                }
                                message.success(`手机号 ${phone} 验证码发送成功!`);
                              }}
                          />
                          <ProFormUploadDragger
                              max={2}
                              name="opFiles"
                              label="身份证正反面"
                              accept="image/*"
                              action="/api/upload"
                              fieldProps={{
                                listType: 'picture-card'
                              }}
                              rules={[
                                { required: true }
                              ]}
                          />
                        </StepsForm.StepForm>
                    </StepsForm>
                </ProCard>
        </div>
    );
}

export default Signup;