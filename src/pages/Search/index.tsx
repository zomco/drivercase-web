import React from "react";
import {ProList} from '@ant-design/pro-components';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import {Tag} from 'antd';
import {ContactStatus} from "../../enums";

function Search() {
  const navigate = useNavigate();
  const {get} = useAuth();

  return (
      <ProList
          search={{}}
          rowKey="name"
          headerTitle="结果"
          request={async () => {
            const result = await get('/api/s/case');
            return {
              success: !!result,
              data: result
            };
          }}
          pagination={{
            pageSize: 5,
          }}
          showActions="hover"
          metas={{
            title: {
              dataIndex: 'name',
              title: '司机姓名',
              render: (text, row) => <a href={`/case/${row.id}`} target="_blank">{text}</a>
            },
            description: {
              dataIndex: 'description',
              title: '事件描述',
              search: false,
            },
            content: {
              render: (text, row) => {
                const contact = row.contact;
                if (!contact) {
                  return <div></div>
                }
                return (
                    <div>
                      {
                        contact.status === ContactStatus.UNCERTAIN ?
                            <Tag color="processing">等待处理</Tag> :
                            contact.status === ContactStatus.REJECTED ?
                                <Tag color="error">拒绝联系</Tag> :
                                contact.status === ContactStatus.CONFIRMED ?
                                    <Tag color="success">确认联系</Tag> : <Tag color="warning">未知</Tag>
                      }

                    </div>
                )

              },
              search: false
            },
            subTitle: {
              dataIndex: 'code',
              title: '司机身份证',
            }
          }}
      />
  )
}

export default Search;