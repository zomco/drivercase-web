import React, {useRef} from "react";
import {ProDescriptions, ProDescriptionsActionType} from '@ant-design/pro-components';
import {useAuth} from "../../hooks/useAuth";
import {useNavigate, useParams} from "react-router-dom";
import {Image} from 'antd';

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
          request={async (params) => {
            console.log(params);
            const caze = await get(`/api/s/case/${id}`);
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
              title: '事件描述',
              key: 'description',
              dataIndex: 'description',
            },
            {
              title: '附件',
              key: 'files',
              dataIndex: 'files',
              render: (text, record, index, action) => (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    {
                      !!record.files && record.files.map((value: any) =>
                          <Image
                              width="30%"
                              src={value.value}
                              key={value.id}
                              alt={value.name}
                          />
                      )
                    }
                  </div>
              ),
            }
          ]}
      />
  );
}

export default Case;