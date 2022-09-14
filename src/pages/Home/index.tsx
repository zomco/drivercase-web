import React, {useEffect, useState} from "react";
import {useAuth} from "../../hooks/useAuth";
import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {CaseStatus, ContactStatus} from "../../enums";
import {Button, Modal} from "antd";

const columns: ProColumns<CaseResult>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
    render: (text, record, index, action) => (record.status === CaseStatus.APPROVED ?
        <a href={`/case/${record.id}`} target="_blank">{text}</a> : text),
  },
  {
    title: '身份证',
    dataIndex: 'code',
    valueType: 'text'
  },
  {
    title: '描述',
    dataIndex: 'description',
    valueType: 'text',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      WAITING: {text: '等待审核', status: 'Processing'},
      COMMENT: {text: '审核意见', status: 'Error'},
      TEMPLATE: {text: '审核描述', status: 'Default'},
      APPROVED: {text: '审核通过', status: 'Success'},
    },
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    render: (text, record, index, action) => [
      <a key="edit" href={`/edit/${record.id}`} target="_blank">修改</a>,
    ],
  },
];

function Home() {
  const {get, put} = useAuth();
  const [contacts, setContacts] = useState<ContactResult[]>([]);
  const contact = contacts[0];
  useEffect(() => {
    const fetchData = async () => {
      const result = await get<ContactResult[]>(`/api/p/case/contact`);
      if (result) {
        setContacts(result);
      }
    }
    fetchData().then();
  }, []);

  return (
      <>
        <ProTable
            request={async ({current, pageSize, ...fields}, sort, filter) => {
              console.log(current, pageSize, fields, sort, filter);
              const padding = !!Object.keys(fields).length ? `&${Object.keys(fields).map(key => `${key}=${fields[key]}`).join('&')}`: '';
              const result = await get(`/api/p/case?page=${current ? current - 1 : 0}&size=${pageSize}${padding}`);
              if (!!result) {
                return {
                  success: true,
                  data: result.content,
                  total: result.totalElements
                };
              } else {
                return {
                  success: false,
                };
              }
            }}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
            }}
            columns={columns}
            search={false}
            dateFormatter="string"
            headerTitle="我的事件"
        />
        {
          !!contact ?
              <Modal
                  title="请求获得联系方式"
                  open
                  footer={[
                    <Button
                        key="wait"
                        onClick={async () => {
                          const result = await put(`/api/p/case/${contact.caze?.id}/contact/${contact.id}`, {status: ContactStatus.UNCERTAIN});
                          if (result) {
                            contacts.shift();
                            setContacts([...contacts]);
                          }
                        }}
                    >待定</Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={async () => {
                          const result = await put(`/api/p/case/${contact.caze?.id}/contact/${contact.id}`, {status: ContactStatus.CONFIRMED});
                          if (result) {
                            contacts.shift();
                            setContacts([...contacts]);
                          }
                        }}
                    >确认</Button>,
                    <Button
                        key="reject"
                        type="primary"
                        danger
                        onClick={async () => {
                          const result = await put(`/api/p/case/${contact.caze?.id}/contact/${contact.id}`, {status: ContactStatus.REJECTED});
                          if (result) {
                            contacts.shift();
                            setContacts([...contacts]);
                          }
                        }}
                    >拒绝</Button>,
                  ]}
              >
                <p><span style={{fontWeight: "bold"}}>{contact.user?.cpName}</span> 请求获得您在事件 <a
                    style={{fontWeight: "bold"}} href={`/case/${contact.caze?.id}`}>{contact.caze?.name}</a> 中留下的联系方式
                </p>
              </Modal> :
              <div></div>
        }
      </>)

}

export default Home;