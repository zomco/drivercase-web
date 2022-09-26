import React, {useEffect, useRef, useState} from "react";
import {ProDescriptions, ProDescriptionsActionType} from "@ant-design/pro-components";
import {useAuth} from "../../hooks/useAuth";
import {Button, Image, Result} from "antd";
import {UserStatus} from "../../enums";
import {useNavigate} from "react-router-dom";
import {SmileOutlined} from "@ant-design/icons";

function AdminUser() {
  const actionRef = useRef<ProDescriptionsActionType>();
  const {get, put} = useAuth();
  const [users, setUsers] = useState<AdminUserResult[]>();
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      const result = await get<AdminUserResult[]>(`/api/a/user`);
      if (result) {
        setUsers(result);
      }
    }
    fetchData().then();
  }, []);
  const navigate = useNavigate();

  return !!users && !!users[index] ? (
          <ProDescriptions
              actionRef={actionRef}
              column={1}
              title="用户信息"
              dataSource={users[index]}
              columns={[
                {
                  title: '用户名',
                  key: 'username',
                  dataIndex: 'username',
                },
                {
                  title: '公司所在地',
                  key: 'cpLocation',
                  dataIndex: 'cpLocation',
                },
                {
                  title: '公司名称',
                  key: 'cpName',
                  dataIndex: 'cpName',
                },
                {
                  title: '公司联系方式',
                  key: 'cpMobile',
                  dataIndex: 'cpMobile',
                },
                {
                  title: '公司统一社会信用代码',
                  key: 'cpCode',
                  dataIndex: 'cpCode',
                },
                {
                  title: '公司营业执照',
                  key: 'cpFiles',
                  dataIndex: 'cpFiles',
                  render: (text, record, index, action) => (
                      <Image.PreviewGroup>
                        {
                          record.cpFiles?.map((value: any) =>
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
                },
                {
                  title: '法人姓名',
                  key: 'rpName',
                  dataIndex: 'rpName',
                },
                {
                  title: '法人联系方式',
                  key: 'rpMobile',
                  dataIndex: 'rpMobile',
                },
                {
                  title: '法人人身份证号码',
                  key: 'rpCode',
                  dataIndex: 'rpCode',
                },
                {
                  title: '法人身份证',
                  key: 'rpFiles',
                  dataIndex: 'rpFiles',
                  render: (text, record, index, action) => (
                      <Image.PreviewGroup>
                        {
                          record.rpFiles?.map((value: any) =>
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
                },
                {
                  title: '操作人姓名',
                  key: 'opName',
                  dataIndex: 'opName',
                },
                {
                  title: '操作人联系方式',
                  key: 'opMobile',
                  dataIndex: 'opMobile',
                },
                {
                  title: '操作人身份证号码',
                  key: 'opCode',
                  dataIndex: 'opCode',
                },
                {
                  title: '操作人身份证',
                  key: 'opFiles',
                  dataIndex: 'opFiles',
                  render: (text, record, index, action) => (
                      <Image.PreviewGroup>
                        {
                          record.opFiles?.map((value: any) =>
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
              <Button
                  key="reject"
                  type="primary"
                  danger
                  onClick={async () => {
                    const result = await put<UserReviewParam, string>(`/api/a/user/${users[index].id}`, {status: UserStatus.INACTIVE});
                    if (result) {
                      navigate(0);
                    }
                  }}
              >
                拒绝
              </Button>
              <Button
                  key="confirm"
                  type="primary"
                  onClick={async () => {
                    const result = await put<UserReviewParam, string>(`/api/a/user/${users[index].id}`, {status: UserStatus.ACTIVE});
                    if (result) {
                      navigate(0);
                    }
                  }}
              >
                允许
              </Button>
              <Button
                  key="uncertain"
                  onClick={async () => {
                    const result = await put<UserReviewParam, string>(`/api/a/user/${users[index].id}`, {status: UserStatus.UNCERTAIN});
                    if (result) {
                      navigate(0);
                    }
                  }}
              >
                跳过
              </Button>
              <Button
                  key="previous"
                  onClick={() => setIndex(index - 1 < 0 ? 0 : index - 1)}
              >
                上一条
              </Button>
              <Button
                  key="next"
                  onClick={() => setIndex(index + 1 > users.length - 1 ? users.length - 1 : index + 1)}
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

export default AdminUser;