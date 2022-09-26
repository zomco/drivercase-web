import React, {useRef, useState} from "react";
import type {ProFormInstance} from '@ant-design/pro-components';
import {ProForm, ProFormRadio, ProFormText, ProFormTextArea, ProFormUploadDragger,} from '@ant-design/pro-components';
import {useAuth} from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {Button, Result} from "antd";
import {PERSON_CODE_REGEXP, PERSON_NAME_REGEXP} from "../../utils/string";

function Write() {
  const formRef = useRef<ProFormInstance>();
  const {post} = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState<string | undefined>(undefined);

  return (
      !!id ?
          <Result
              status="success"
              title="提交事件信息成功"
              subTitle="管理员会花一些时间审核事件信息，审核期间可修改，请稍候"
              extra={[
                <Button key="edit" type="primary" onClick={() => navigate(`/edit/${id}`)}>前往修改</Button>,
                <Button key="home" type="primary" onClick={() => navigate('/')}>查看我的事件</Button>,
              ]}
          /> :
          <ProForm
              title="上传事件"
              formRef={formRef}
              onFinish={async (values) => {
                const param = {
                  ...values,
                  files: values.files ? values.files.map((v: any) => v.response.result) : [],
                }
                const result = await post<CaseCreateParam, string>('/api/p/case', param);
                setId(result);
              }}
              validateMessages={{
                required: '此项为必填项',
              }}
              autoFocusFirstInput
          >
            <ProFormText
                name="name"
                label={<div>司机姓名<span style={{fontSize: '12px', color: 'gray'}}>（2到6个汉字）</span></div>}
                width="md"
                placeholder="请输入法人姓名"
                rules={[
                  {required: true, whitespace: true},
                  {pattern: PERSON_NAME_REGEXP, message: '请输入有效姓名'}
                ]}
            />
            <ProFormText
                name="code"
                label={<div>司机身份证号码<span style={{fontSize: '12px', color: 'gray'}}>（18位身份证号码）</span></div>}
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
            <ProFormRadio.Group
                name="visibility"
                layout="horizontal"
                label="隐私度"
                width="md"
                options={[
                  {
                    label: <span>匿名发布<span style={{
                      fontSize: '12px',
                      color: 'gray'
                    }}>（在其他用户搜索出该事件时，贵司仅显示为**省**市**区一企业（**为实际公司所属地）。）</span></span>,
                    value: 'PRIVATE',
                  },
                  {
                    label: <span>可联系发布<span style={{
                      fontSize: '12px',
                      color: 'gray'
                    }}>（在其他用户搜索出该事件时，贵司仅显示为**省**市**区一企业（**为实际公司所属地），但可点击“联系贵司”，贵司在同意的情况下，系统会将贵司公司名称和联系电话推送给对方，方便双方核实信息。）</span></span>,
                    value: 'AUTHORIZE',
                  },
                  {
                    label: <span>公开发布<span style={{
                      fontSize: '12px',
                      color: 'gray'
                    }}>（在其他用户搜索出该事件时，贵司显示公司名称和联系电话，方便双方核实信息。）</span></span>,
                    value: 'PUBLIC',
                  },
                ]}
                rules={[
                  {required: true},
                ]}
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
                accept="image/png,image/jpeg"
                name="files"
                label={<div>事件附件<span
                    style={{fontSize: '12px', color: 'gray'}}>（后缀为.png，.jpg且大小不超过10MB的图片）</span></div>}
                action="/api/o/upload"
                fieldProps={{
                  listType: 'picture-card'
                }}
            />
          </ProForm>
  );
}

export default Write;