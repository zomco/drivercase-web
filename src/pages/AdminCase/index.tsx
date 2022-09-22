import React, {useEffect, useRef, useState} from "react";
import {ModalForm, ProDescriptions, ProDescriptionsActionType, ProFormTextArea} from "@ant-design/pro-components";
import {Button, Form, Image, Result} from "antd";
import {useAuth} from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {CaseStatus} from "../../enums";
import {SmileOutlined} from "@ant-design/icons";

function AdminCase() {
  const actionRef = useRef<ProDescriptionsActionType>();
  const {get, put} = useAuth();
  const [cases, setCases] = useState<AdminCaseResult[]>();
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      const result = await get<AdminCaseResult[]>(`/api/a/case`);
      if (result) {
        setCases(result);
      }
    }
    fetchData().then();
  }, []);
  const navigate = useNavigate();

  return !!cases && !!cases[index] ?
      (<ProDescriptions
          actionRef={actionRef}
          column={1}
          title="事件信息"
          dataSource={cases[index]}
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
                              src={value.value}
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
        <ProDescriptions.Item label="文本" valueType="option">
          <ModalForm<{ review: string; }>
              trigger={<Button>修改意见</Button>}
              title="修改意见"
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
              }}
              submitTimeout={2000}
              onFinish={async ({review}) => {
                const result = await put<CaseReviewParam, string>(`/api/a/case/${cases[index].id}`, {
                  status: CaseStatus.COMMENT,
                  review
                });
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
                  defaultValue: cases[index].review,
                }}
            />
          </ModalForm>
          <ModalForm<{ review: string; }>
              trigger={<Button>修改描述</Button>}
              title="修改描述"
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
              }}
              submitTimeout={2000}
              onFinish={async ({review}) => {
                const result = await put<CaseReviewParam, string>(`/api/a/case/${cases[index].id}`, {
                  status: CaseStatus.TEMPLATE,
                  review
                });
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
                  defaultValue: cases[0].review,
                }}
            />
          </ModalForm>
          <Button
              key="confirm"
              type="primary"
              onClick={async () => {
                const result = await put<CaseReviewParam, string>(`/api/a/case/${cases[index].id}`, {
                  status: CaseStatus.APPROVED,
                  review: ''
                });
                if (result) {
                  navigate(0);
                }
              }}
          >
            通过
          </Button>
          <Button
              key="previous"
              onClick={ () => setIndex(index - 1 < 0 ? 0 : index - 1)}
          >
            上一条
          </Button>
          <Button
              key="next"
              onClick={() => setIndex(index + 1 > cases.length - 1 ? cases.length - 1 : index + 1)}

          >
            下一条
          </Button>
        </ProDescriptions.Item>
      </ProDescriptions>) :
      <Result
          icon={<SmileOutlined />}
          title="所有审核已处理!"
      />;
}

export default AdminCase;