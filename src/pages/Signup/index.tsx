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
import { message } from 'antd';
import { useRef } from 'react';
import React from "react";
import level from './level.json';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};


function Signup() {
    const formRef = useRef<ProFormInstance>();

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
                    <StepsForm<{
                        name: string;
                    }>
                        stepsProps={{
                            direction: 'vertical',
                        }}
                        formRef={formRef}
                        onFinish={async () => {
                            await waitTime(1000);
                            message.success('提交成功');
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
                                console.log(formRef.current?.getFieldsValue());
                                await waitTime(2000);
                                return true;
                            }}
                        >
                            <ProFormText
                                name="username"
                                label="用户名"
                                width="md"
                                tooltip="最长为 12 位，唯一"
                                placeholder="请输入名称"
                                // rules={[{ required: true }]}
                            />
                            <ProFormText.Password
                                name="password"
                                label="密码"
                                width="md"
                                tooltip="最长为 24 位，数字、字母和符号组合"
                                placeholder="请输入密码"
                                // rules={[{ required: true }]}
                            />
                            <ProFormText.Password
                                name="password"
                                label="确认密码"
                                width="md"
                                tooltip="最长为 24 位，数字、字母和符号组合"
                                placeholder="请输入密码"
                                // rules={[{ required: true }]}
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
                        <StepsForm.StepForm<{
                            checkbox: string;
                        }>
                            name="checkbox"
                            title="公司信息"
                            stepProps={{
                                description: '这里填入公司信息',
                            }}
                            onFinish={async () => {
                                console.log(formRef.current?.getFieldsValue());
                                return true;
                            }}
                        >
                          <ProFormText
                              name="cpName"
                              label="公司名称"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入公司名称"
                              // rules={[{ required: true }]}
                          />
                          <ProFormText
                              name="cpCode"
                              label="公司信用代码"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入公司信用代码"
                              // rules={[{ required: true }]}
                          />
                          <ProFormText
                              name="cpMobile"
                              label="法人联系电话"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入法人联系电话"
                              // rules={[{ required: true }]}
                          />
                          <ProFormCaptcha
                              // 手机号的 name，onGetCaptcha 会注入这个值
                              phoneName="cpMobile"
                              name="cpCaptcha"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: '请输入验证码',
                              //   },
                              // ]}
                              placeholder="请输入验证码"
                              // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
                              // throw new Error("获取验证码错误")
                              onGetCaptcha={async (phone) => {
                                await waitTime(1000);
                                message.success(`手机号 ${phone} 验证码发送成功!`);
                              }}
                          />
                          <ProFormCascader
                              width="md"
                              request={async () => level}
                              name="cpLocation"
                              label="所在地"
                              initialValue={['440000', '440600', '440604']}
                          />
                          <ProFormUploadDragger max={1} name="cpFiles" label="营业执照" />
                        </StepsForm.StepForm>
                        <StepsForm.StepForm<{
                            checkbox: string;
                        }>
                            name="representative"
                            title="法人信息"
                            stepProps={{
                                description: '这里填入法人信息',
                            }}
                            onFinish={async () => {
                                console.log(formRef.current?.getFieldsValue());
                                return true;
                            }}
                        >
                          <ProFormText
                              name="rpName"
                              label="法人姓名"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入法人姓名"
                              // rules={[{ required: true }]}
                          />
                          <ProFormText
                              name="rpCode"
                              label="法人身份证号码"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入法人身份证号码"
                              // rules={[{ required: true }]}
                          />
                          <ProFormText
                              name="rpMobile"
                              label="法人联系电话"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入法人联系电话"
                              // rules={[{ required: true }]}
                          />
                          <ProFormCaptcha
                              // 手机号的 name，onGetCaptcha 会注入这个值
                              phoneName="rpMobile"
                              name="rpCaptcha"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: '请输入验证码',
                              //   },
                              // ]}
                              placeholder="请输入验证码"
                              // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
                              // throw new Error("获取验证码错误")
                              onGetCaptcha={async (phone) => {
                                await waitTime(1000);
                                message.success(`手机号 ${phone} 验证码发送成功!`);
                              }}
                          />
                          <ProFormUploadDragger max={2} name="rpFiles" label="身份证" />
                        </StepsForm.StepForm>
                        <StepsForm.StepForm<{
                          checkbox: string;
                        }>
                            name="operator"
                            title="操作人信息"
                            stepProps={{
                              description: '这里填入操作人信息',
                            }}
                            onFinish={async () => {
                              console.log(formRef.current?.getFieldsValue());
                              return true;
                            }}
                        >
                          <ProFormText
                              name="opName"
                              label="操作人姓名"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入法人姓名"
                              // rules={[{ required: true }]}
                          />
                          <ProFormText
                              name="opCode"
                              label="操作人身份证号码"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入法人身份证号码"
                              // rules={[{ required: true }]}
                          />
                          <ProFormText
                              name="opMobile"
                              label="操作人联系电话"
                              width="md"
                              tooltip="最长为 12 位，唯一"
                              placeholder="请输入法人联系电话"
                              // rules={[{ required: true }]}
                          />
                          <ProFormCaptcha
                              // 手机号的 name，onGetCaptcha 会注入这个值
                              phoneName="opMobile"
                              name="opCaptcha"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: '请输入验证码',
                              //   },
                              // ]}
                              placeholder="请输入验证码"
                              // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
                              // throw new Error("获取验证码错误")
                              onGetCaptcha={async (phone) => {
                                await waitTime(1000);
                                message.success(`手机号 ${phone} 验证码发送成功!`);
                              }}
                          />
                          <ProFormUploadDragger max={2} name="opFiles" label="身份证" />
                        </StepsForm.StepForm>
                    </StepsForm>
                </ProCard>
        </div>
    );
}

export default Signup;