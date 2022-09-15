import React, {useRef, useState} from "react";
import {ProDescriptions, ProDescriptionsActionType, ProFormTextArea} from "@ant-design/pro-components";
import {Button, Image, Form} from "antd";
import {useAuth} from "../../hooks/useAuth";
import {useNavigate, useParams} from "react-router-dom";
import {CaseStatus, UserStatus} from "../../enums";
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

function AdminCase() {
  const actionRef = useRef<ProDescriptionsActionType>();
  const {get, put} = useAuth();
  const [caze, setCaze] = useState<AdminCaseResult>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  return (
      <ProDescriptions
          actionRef={actionRef}
          column={1}
          title="事件信息"
          request={async (params) => {
            console.log(params);
            const results = await get<AdminCaseResult[]>(`/api/a/case`);
            setCaze(results?.[0]);
            return {
              success: !!results,
              data: results?.[0],
            };
          }}
          columns={[
            {
              title: '司机姓名',
              key: 'name',
              dataIndex: 'name',
            },
            {
              title: '司机身份证号码',
              key: 'code',
              dataIndex: 'code',
            },
            {
              title: '事件描述',
              key: 'description',
              dataIndex: 'description',
            },
            {
              title: '附件',
              key: 'files',
              dataIndex: 'files',
              render: (text, record, index, action) => (
                  <Image.PreviewGroup>
                    {
                      record.files?.map((value: any) =>
                          <Image
                              width="25vw"
                              src={`/api/file/3/${value.name}`}
                              key={value.id}
                              alt={value.name}
                          />
                      )
                    }
                  </Image.PreviewGroup>
              ),
            }
          ]}
      >
        {!!caze ?
            <ProDescriptions.Item label="文本" valueType="option">
              <ModalForm<{ review: string; }>
                  trigger={<Button type="primary">修改意见</Button>}
                  title="修改意见"
                  autoFocusFirstInput
                  modalProps={{
                    destroyOnClose: true,
                    onCancel: () => console.log('run'),
                  }}
                  submitTimeout={2000}
                  onFinish={async ({ review }) => {
                    const result = await put<CaseReviewParam, string>(`/api/a/case/${caze?.id}`, {status: CaseStatus.COMMENT, review });
                    if (result) {
                      navigate(0);
                    }
                    return true;
                  }}
              >
                <ProFormTextArea
                    name="review"
                    label="填写修改意见，告诉用户需要修改的地方"
                    fieldProps={{
                      showCount: true,
                      maxLength: 65535,
                      allowClear: true,
                      defaultValue: caze?.review,
                    }}
                />
              </ModalForm>
              <ModalForm<{ review: string; }>
                  trigger={<Button type="primary">修改描述</Button>}
                  title="修改描述"
                  autoFocusFirstInput
                  modalProps={{
                    destroyOnClose: true,
                    onCancel: () => console.log('run'),
                  }}
                  submitTimeout={2000}
                  onFinish={async ({ review }) => {
                    const result = await put<CaseReviewParam, string>(`/api/a/case/${caze?.id}`, {status: CaseStatus.TEMPLATE, review });
                    if (result) {
                      navigate(0);
                    }
                    return true;
                  }}
              >
                <ProFormTextArea
                    name="review"
                    label="填写修改描述，提供用户修改的范本"
                    fieldProps={{
                      showCount: true,
                      maxLength: 65535,
                      allowClear: true,
                      defaultValue: caze?.review,
                    }}
                />
              </ModalForm>
              <Button
                  key="confirm"
                  type="primary"
                  onClick={async () => {
                    const result = await put<CaseReviewParam, string>(`/api/a/case/${caze?.id}`, {status: CaseStatus.APPROVED, review: ''});
                    if (result) {
                      navigate(0);
                    }
                  }}
              >
                通过
              </Button>
            </ProDescriptions.Item>: null}
      </ProDescriptions>
  );
}

export default AdminCase;