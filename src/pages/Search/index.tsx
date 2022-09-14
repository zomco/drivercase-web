import React from "react";
import {ProList} from '@ant-design/pro-components';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import {message, Tag} from 'antd';
import {ContactStatus} from "../../enums";

const validateDriver = (fields: any) => {
  if (!fields['name'] && !fields['code']) {
    // console.log('普通搜索');
    return true;
  }
  if (!fields['name'] || !fields['code']) {
    // console.log('名字和身份证必须同时出现');
    return false;
  }

  if (!fields['fuzzy']) {
    // console.log('精准搜索');
    return /^[\u4E00-\u9FA5]{2,4}$/.test(fields['name']) &&
        /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(fields['code']);
  } else {
    // console.log('模糊搜索');
    // 匹配名字
    const nameLength = fields['name'].length;
    if (nameLength < 2 && nameLength > 4) {
      // console.log('名字长度不符合');
      return false;
    }
    let name1Length = 0;
    let name2Length = 0;
    fields['name'].split('').map((s: string) => {
      // console.log(`name: ${s}`);
      if (s === "*") {
        name1Length++;
      } else if (/[\u4E00-\u9FA5]/.test(s)) {
        name2Length++;
      }
    })
    // console.log('name matching:', name1Length, name2Length);
    if (name2Length < 1 || name1Length + name2Length !== nameLength) {
      // console.log('名字组成不符合');
      return false;
    }

    // 匹配身份证
    const codeLength = fields['code'].length;
    if (codeLength !== 18) {
      // console.log('身份证长度不符合');
      return false;
    }
    let code1Length = 0;
    let code2Length = 0;
    fields['code'].split('').map((s: string) => {
      // console.log(`code: ${s}`);
      if (s === "*") {
        code1Length++;
      } else if (/\d/.test(s)) {
        code2Length++;
      }
    });
    // console.log('code matching:', code1Length, code2Length);
    if (code2Length < 8 || code1Length + code2Length !== codeLength) {
      // console.log('身份证组成不符合');
      return false;
    }
    return true;
  }
}

function Search() {
  const {get} = useAuth();

  return (
      <ProList
          search={{}}
          rowKey="name"
          headerTitle="结果"
          request={async ({current, pageSize, ...fields}, sort, filter) => {
            console.log(current, pageSize, fields, sort, filter);
            if (!validateDriver(fields)) {
             message.error("请输入符合规则的搜索参数");
             return {
               success: false
             }
            }
            const padding = !!Object.keys(fields).length ? `&${Object.keys(fields).map(key => `${key}=${fields[key]}`).join('&')}`: '';
            const result = await get(`/api/s/case?page=${current ? current - 1 : 0}&size=${pageSize}${padding}`);
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
          pagination={{
            pageSize: 20,
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
            },
            fuzzy: {
              valueType: 'checkbox',
              valueEnum: {
                open: {
                  text: '模糊搜索',
                },
              }
            }
          }}
      />
  )
}

export default Search;