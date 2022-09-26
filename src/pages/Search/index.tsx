import React from "react";
import {ProList} from '@ant-design/pro-components';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import {Button, message} from 'antd';
import {CaseSource, CaseVisibility, ContactStatus} from "../../enums";
import {PERSON_CODE_REGEXP, PERSON_NAME_REGEXP} from "../../utils/string";

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
    return PERSON_NAME_REGEXP.test(fields['name']) && PERSON_CODE_REGEXP.test(fields['code']);
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
    return !(code2Length < 8 || code1Length + code2Length !== codeLength);

  }
}

function Search() {
  const {get, post} = useAuth();
  const navigate = useNavigate();

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
            const padding = !!Object.keys(fields).length ? `&${Object.keys(fields).map(key => `${key}=${fields[key]}`).join('&')}` : '';
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
              render: (text, row) => {
                console.log(row.source);
                if (row.source === CaseSource.ADMIN) {
                  return `据 ${row.cpLocation} ${row.cpName} 描述所知，${row.name}，${row.code}，${row.description}。`
                }

                let padding = `对方公司 ${row.user.cpMobile}`;
                if (row.contact) {
                  switch (row.contact.status) {
                    case ContactStatus.UNCERTAIN:
                      padding = '等待对方公司回应';
                      break;
                    case ContactStatus.CONFIRMED:
                      padding = `对方公司 ${row.user.cpMobile}`;
                      break;
                    case ContactStatus.REJECTED:
                      padding = '等待对方公司回应';
                      break;
                  }
                }
                return `据 ${row.user.cpLocation} ${row.user.cpName} 描述所知，${row.name}，${row.code}，${row.description}。${padding}`
              }
            },
            actions: {
              render: (text, row) => {
                return [
                  row.visibility === CaseVisibility.AUTHORIZE && !row.contact ?
                      <Button
                          key="contact"
                          type="primary"
                          onClick={async () => {
                            const result = await post(`/api/s/case/${row.id}/contact`, {});
                            if (result) {
                              navigate(0);
                            }
                          }}
                      >获取该公司联系方式</Button> : null,
                  !!row.files.length ? <a key="detail" href={`/case/${row.id}`} target="_blank">附件</a> : null,
                ]
              }
            },
            code: {
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