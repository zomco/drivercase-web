import React from "react";
import {useAuth} from "../../hooks/useAuth";
import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Link, useParams} from "react-router-dom";
import {CaseStatus} from "../../enums";
import {Button} from "antd";

const columns: ProColumns<CaseResult>[] = [
  {
    title: '司机姓名',
    dataIndex: 'name',
    valueType: 'text',
    render: (text, record, index, action) => (record.status === CaseStatus.APPROVED ?
        <Link to={`/case/${record.id}`}>{text}</Link> : text),
  },
  {
    title: '描述',
    dataIndex: 'description',
    ellipsis: true,
    valueType: 'textarea',
  },
  {
    title: '状态',
    dataIndex: 'status',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      UNCERTAIN: {text: '等待确认', status: 'Processing'},
      CONFIRMED: {text: '确认联系', status: 'Error'},
      REJECTED: {text: '拒绝联系', status: 'Default'},
    },
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    render: (text, record, index, action) => [
        <Button type="primary">确认</Button>,
        <Button type="primary" danger>拒绝</Button>,
    ],
  },
];

function Read() {
  const {get, put} = useAuth();
  const {id} = useParams();

  return (
      <ProTable
          request={async (params, sort, filter) => {
            const result = await get(`/api/p/case/${id}/contact`);
            console.log(result);
            return {
              data: result,
              success: !!result,
            }
          }}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
          }}
          columns={columns}
          search={false}
          dateFormatter="string"
          headerTitle="事件联系"
      />
  )
}

export default Read;