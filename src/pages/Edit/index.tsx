import React, {useEffect, useRef, useState} from "react";
import type {ProFormInstance} from '@ant-design/pro-components';
import {ProForm, ProFormRadio, ProFormText, ProFormTextArea, ProFormUploadDragger} from '@ant-design/pro-components';
import {useAuth} from "../../hooks/useAuth";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Result, Upload, UploadFile} from "antd";
import {CaseStatus} from "../../enums";

function Write() {
  const formRef = useRef<ProFormInstance>();
  const {put, get, del} = useAuth();
  const {id} = useParams();
  const [updated, setUpdated] = useState<boolean>(false);
  const navigate = useNavigate();
  const status = formRef?.current?.getFieldValue('status');
  const [files, setFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await get<MediaFileResult[]>(`/api/p/case/${id}/file`);
      const fileResult = result?.map(value => ({
        uid: value.id,
        name: value.name,
        url: `/api/file/3/${value.name}`,
        crossOrigin: 'use-credentials',
        status: 'done'
      }));
      // @ts-ignore
      setFiles(fileResult);
    }
    fetchData().then();
  }, []);


  return (
          updated ?
              <Result
                  status="success"
                  title="修改事件信息成功"
                  subTitle="管理员会花一些时间审核事件信息，请稍候"
                  extra={[
                    <Button key="home" type="primary" onClick={() => navigate('/')}>查看我的事件</Button>,
                  ]}
              /> :
              <ProForm
                  title="修改事件"
                  formRef={formRef}
                  onFinish={async (values) => {
                    const param = {
                      ...values,
                      files: values.files ? values.files.map((v: any) => v.response.result) : []
                    }
                    const result = await put<CaseCreateParam, CaseResult>(`/api/p/case/${id}`, param);
                    if (result) {
                      setUpdated(true);
                    }
                  }}
                  validateMessages={{
                    required: '此项为必填项',
                  }}
                  autoFocusFirstInput
                  request={async (params, props) => {
                    console.log(params, props);
                    return await get(`/api/p/case/${id}`);
                  }}
              >
                <ProFormText
                    name="name"
                    label="司机姓名"
                    width="md"
                    tooltip="法人姓名"
                    placeholder="请输入法人姓名"
                    rules={[
                      {required: true, whitespace: true},
                      {pattern: /^[\u4E00-\u9FA5]{2,4}$/, message: '请输入有效姓名'}
                    ]}
                />
                <ProFormText
                    name="code"
                    label="司机身份证号码"
                    width="md"
                    tooltip="18位身份证号码"
                    placeholder="请输入法人身份证号码"
                    rules={[
                      {required: true, whitespace: true},
                      {
                        pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                        message: '请输入有效身份证号码'
                      }
                    ]}
                />
                {
                  status === CaseStatus.TEMPLATE ?
                      <ProFormTextArea
                          name="review"
                          label="修改后的事件描述"
                          width="md"
                          tooltip="确保事件描述与此一致，不修改其他事件信息，提交后事件可以直接发布"
                          placeholder=""
                          disabled
                      /> :
                      status === CaseStatus.TEMPLATE ?
                          <ProFormTextArea
                              name="review"
                              label="修改意见"
                              width="md"
                              tooltip="根据修改意见修改事件描述"
                              placeholder=""
                              disabled
                          /> : <div></div>
                }
                <ProFormTextArea
                    name="description"
                    label="事件描述"
                    width="md"
                    tooltip="具体描述事件发生的事件地点等细节"
                    placeholder="请输入事件描述"
                    rules={[
                      {required: true, whitespace: true},
                    ]}
                />
                <ProFormRadio.Group
                    name="visibility"
                    layout="vertical"
                    label="隐私度"
                    width="md"
                    tooltip="隐私度"
                    options={[
                      {
                        label: '匿名发布',
                        value: 'PRIVATE',
                      },
                      {
                        label: '可联系发布',
                        value: 'AUTHORIZE',
                      },
                      {
                        label: '公开发布',
                        value: 'PUBLIC',
                      },
                    ]}
                    rules={[
                      {required: true},
                    ]}
                />
                <ProFormUploadDragger
                    accept="image/*"
                    name="files"
                    label="新增附件"
                    action="/api/upload"
                    fieldProps={{
                      listType: 'picture-card'
                    }}
                />
                <div style={{
                  marginBottom: '40px'
                }}>
                  <Upload
                      fileList={files}
                      onChange={({file, fileList}) => {
                        setFiles([...fileList]);
                      }}
                      listType="picture"
                      onRemove={async (file) => {
                        const result = await del<string>(`/api/p/case/${id}/file/${file.uid}`);
                        return !!result;
                      }}
                  />
                </div>
              </ProForm>
  );
}

export default Write;