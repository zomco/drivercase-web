import React, {useEffect, useRef, useState} from "react";
import {ProDescriptions, ProDescriptionsActionType} from '@ant-design/pro-components';
import {useAuth} from "../../hooks/useAuth";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Image, Tag, UploadFile} from 'antd';
import {CaseVisibility, ContactStatus} from "../../enums";

function Case() {
  const actionRef = useRef<ProDescriptionsActionType>();
  const {get, post} = useAuth();
  const {id} = useParams();
  const navigate = useNavigate();

  return (
        <ProDescriptions
            actionRef={actionRef}
            column={1}
            title="事件信息"
            request={async () => {
              const caze = await get(`/api/s/case/${id}`);
              console.log(caze);
              return {
                success: !!caze,
                data: caze,
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
                title: '隐私度',
                dataIndex: 'visibility',
                valueType: 'select',
                valueEnum: {
                  PRIVATE: {text: '匿名', status: 'Default'},
                  PUBLIC: {text: '公开', status: 'Success'},
                  AUTHORIZE: {text: '可联系', status: 'Processing'},
                },
              },
              {
                title: '公司名称',
                key: 'user.cpName',
                dataIndex: ['user', 'cpName'],
              },
              {
                title: '公司地址',
                key: 'user.cpName',
                dataIndex: ['user', 'cpLocation'],
              },
              {
                title: '公司联系方式',
                key: 'user.cpName',
                dataIndex: ['user', 'cpMobile'],
              },
              {
                title: '事件描述',
                key: 'description',
                dataIndex: 'description',
              },
              {
                title: '操作',
                key: 'contact.status',
                valueType: 'option',
                dataIndex: ['contact', 'status'],
                render: (text, record, index, action) => record.visibility === CaseVisibility.AUTHORIZE ? [
                  (text === ContactStatus.UNCERTAIN ? (<Tag color="processing">等待处理</Tag>) :
                          text === ContactStatus.REJECTED ? (<Tag color="error">拒绝联系</Tag>) :
                              text === ContactStatus.CONFIRMED ? (<Tag color="success">同意联系</Tag>) :
                                  (<Button
                                      type="primary"
                                      onClick={async () => {
                                        const result = await post(`/api/s/case/${id}/contact`, {});
                                        if (result) {
                                          navigate(0);
                                        }
                                      }}
                                  >
                                    请求联系
                                  </Button>)
                  )
                ] : [],
              },
              {
                title: '附件',
                key: 'files',
                dataIndex: 'files',
                render: (text, record, index, action) => (
                    <Image.PreviewGroup>
                      {
                        record.files.map((value: any) =>
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
        />

  );
}

export default Case;