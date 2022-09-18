import React, {useEffect, useRef, useState} from "react";
import type {ProFormInstance} from '@ant-design/pro-components';
import {ProForm, ProFormRadio, ProFormText, ProFormTextArea, ProFormUploadDragger} from '@ant-design/pro-components';
import {useAuth} from "../../hooks/useAuth";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Result, Upload, UploadFile} from "antd";
import {CaseStatus} from "../../enums";
import {PERSON_CODE_REGEXP, PERSON_NAME_REGEXP} from "../../utils/string";

function Write() {
  const formRef = useRef<ProFormInstance>();
  const {put, get, del} = useAuth();
  const {id} = useParams();
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await get<MediaFileResult[]>(`/api/p/case/${id}/file`);
      const fileResult = result?.map(value => ({
        uid: value.id,
        name: value.name,
        url: value.value,
        status: 'done'
      }));
      // @ts-ignore
      setFiles(fileResult);
    }
    fetchData().then();
  }, []);


  return (
      success ?
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
                  setSuccess(true);
                }
              }}
              validateMessages={{
                required: '此项为必填项',
              }}
              autoFocusFirstInput
              request={async (params, props) => {
                const result = await get(`/api/p/case/${id}`);
                result.files = [];
                return result;
              }}
          >
            <ProFormText
                name="name"
                label="司机姓名（2到6个汉字）"
                width="md"
                placeholder="请输入司机姓名"
                rules={[
                  {required: true, whitespace: true},
                  {pattern: PERSON_NAME_REGEXP, message: '请输入有效姓名'}
                ]}
            />
            <ProFormText
                name="code"
                label="司机身份证号码（18位身份证号码"
                width="md"
                placeholder="请输入司机身份证号码"
                rules={[
                  {required: true, whitespace: true},
                  {
                    pattern: PERSON_CODE_REGEXP,
                    message: '请输入有效身份证号码'
                  }
                ]}
            />
            <ProFormRadio.Group
                name="visibility"
                layout="horizontal"
                label="隐私度"
                width="md"
                options={[
                  {
                    label: '匿名发布（在其他用户搜索出该事件时，贵司仅显示为**省**市**区一企业（**为实际公司所属地）。）',
                    value: 'PRIVATE',
                  },
                  {
                    label: '可联系发布（在其他用户搜索出该事件时，贵司仅显示为**省**市**区一企业（**为实际公司所属地），但可点击“联系贵司”，贵司在同意的情况下，系统会将贵司公司名称和联系电话推送给对方，方便双方核实信息。）',
                    value: 'AUTHORIZE',
                  },
                  {
                    label: '公开发布（在其他用户搜索出该事件时，贵司显示公司名称和联系电话，方便双方核实信息。）',
                    value: 'PUBLIC',
                  },
                ]}
                rules={[
                  {required: true},
                ]}
            />
            <ProFormTextArea
                name="review"
                label={
                  formRef.current?.getFieldValue('status') === CaseStatus.TEMPLATE ?
                      '审核描述（修改事件描述，如与审核描述相同，可直接发布事件；修改其他字段，都需要重新审核）' :
                      formRef.current?.getFieldValue('status') === CaseStatus.COMMENT ?
                          '审核意见（请根据事件意见修改事件描述，然后提交重新审核）' :
                          formRef.current?.getFieldValue('status') === CaseStatus.APPROVED ?
                              '审核通过（修改任何字段，都需要重新审核）' : '等待审核（可以自由修改任何字段）'
                }
                placeholder=""
                fieldProps={{
                  showCount: true,
                  maxLength: 65535,
                  allowClear: true,
                }}
                disabled
            />
            <ProFormTextArea
                name="description"
                label="事件描述"
                placeholder="请具体描述事情经过与结果"
                fieldProps={{
                  showCount: true,
                  maxLength: 65535,
                  allowClear: true
                }}
                rules={[
                  {required: true, whitespace: true},
                ]}
            />
            <ProFormUploadDragger
                accept="image/*"
                name="files"
                label="新增附件（后缀为.png，.jpg且大小不超过10MB的图片）"
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