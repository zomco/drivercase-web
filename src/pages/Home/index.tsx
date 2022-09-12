import React from "react";
import {useAuth} from "../../hooks/useAuth";
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Link} from "react-router-dom";

const columns: ProColumns<CaseResult>[] = [
    {
        title: '司机姓名',
        dataIndex: 'name',
        valueType: 'text',
        render: (text, record, index, action) => <Link to={`/case/${record.id}`}>{text}</Link>,
    },
    {
        title: '身份证',
        dataIndex: 'code',
        align: 'right',
        valueType: 'text',
    },
    {
        title: '描述',
        dataIndex: 'description',
        ellipsis: true,
        valueType: 'textarea',
    },
    {
        title: '隐私度',
        dataIndex: 'visibility',
        filters: true,
        onFilter: true,
        valueType: 'select',
        valueEnum: {
            PRIVATE: { text: '匿名', status: 'Default' },
            PUBLIC: { text: '公开', status: 'Success' },
            AUTHORIZE: { text: '联系', status: 'Processing' },
        },
    },
    {
        title: '状态',
        dataIndex: 'status',
        filters: true,
        onFilter: true,
        valueType: 'select',
        valueEnum: {
            WAITING: { text: '等待审核', status: 'Processing' },
            COMMENT: { text: '审核意见', status: 'Error' },
            TEMPLATE: { text: '审核描述', status: 'Default' },
            APPROVED: { text: '审核通过', status: 'Success' },
        },
    },
    {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render: (text, record, index, action) => [
            <Link key="edit" to={`/edit/${record.id}`}>修改</Link>,
        ],
    },
];

function Home() {
    const { get } = useAuth();

    return (
        <ProTable
            request={async (params, sort, filter) => {
                const result = await get('/api/p/case');
                console.log(result);
                return {
                    data: result,
                    success: true,
                }
            }}
            rowKey="id"
            pagination={{
                showQuickJumper: true,
            }}
            columns={columns}
            search={false}
            dateFormatter="string"
            headerTitle="历史记录"
        />
    )
}

export default Home;