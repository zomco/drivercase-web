import React, {useEffect, useState} from "react";
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormRadio, ProFormUploadDragger, ProFormUploadButton
} from '@ant-design/pro-components';
import { useRef } from 'react';
import {useAuth} from "../../hooks/useAuth";
import {useParams} from "react-router-dom";
import {UploadFile, Upload, Button} from "antd";

function Write() {
    const formRef = useRef<ProFormInstance>();
    const { put, get } = useAuth();
    const { id } = useParams();
    const [files, setFiles] = useState<UploadFile[]>([]);
    useEffect (() => {
      const fetchData = async () => {
        const result = await get<string[]>(`/api/p/case/${id}/file`);
        const fileResult = result?.map(value => ({
          name: value,
          url: `/api/file/4/${value}`,
          crossOrigin: 'use-credentials',
          status: 'done'
        }));

        // @ts-ignore
        setFiles(fileResult);
      }
      fetchData().then();
    }, []);

    return (
        <ProForm
            title="上传事件"
            formRef={formRef}
            submitter={{
              render: (props, doms) => {
                return [
                  ...doms,
                  <Button type="primary" danger>
                    删除
                  </Button>,
                ];
              },
            }}
            onFinish={async (values) => {
              console.log(values);
              const param = {
                name: values.name,
                code: values.code,
                description: values.description,
                visibility: values.visibility,
                files: values.files ? values.files.map((v: any) => v.response.result) : []
              }

              const result = await put(`/api/p/case/${id}`, param);
              console.log(result)
            }}
            validateMessages={{
              required: '此项为必填项',
            }}
            autoFocusFirstInput
            request={async () => {
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
                    { required: true, whitespace: true },
                    { pattern: /^[\u4E00-\u9FA5]{2,4}$/, message: '请输入有效姓名' }
                ]}
            />
            <ProFormText
                name="code"
                label="司机身份证号码"
                width="md"
                tooltip="18位身份证号码"
                placeholder="请输入法人身份证号码"
                rules={[
                    { required: true, whitespace: true },
                    { pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入有效身份证号码' }
                ]}
            />
            <ProFormTextArea
                name="description"
                label="事件描述"
                width="md"
                tooltip="具体描述事件发生的事件地点等细节"
                placeholder="请输入事件描述"
                rules={[
                    { required: true, whitespace: true },
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
                  { required: true },
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
                  listType="picture"
              />
            </div>

        </ProForm>
    );
}

export default Write;