import React, { useContext } from 'react';
import { Menu, Dropdown } from 'antd';
import { DribbbleOutlined } from '@ant-design/icons' ;
import { store } from '../../redux';
import { setLocale, getLocale, useIntl } from 'umi';

export const setIntl = (id:any) =>{
  const intl = useIntl();
  return(
    intl.formatMessage({id:id})
  )
};





//console.log(getLocale(),'=============---');

const Locale = () =>{
  const globalState = useContext(store);
  const { dispatch } = globalState;
  
  const changeLocale = (value:any) =>{
    setLocale(value,false);
    dispatch({type:'LOCALE',payload:value});
  }
  //dispatch({type:'LOCALE',payload:getLocale()});

  const menu = (
    <Menu>
      <Menu.Item key='en' onClick={()=>changeLocale('en-US')} >
        Englisth
      </Menu.Item>
      <Menu.Item key='zh_CN' onClick={()=>changeLocale('zh-CN')}>
        简体中文
      </Menu.Item>
      <Menu.Item key='zh_TW' onClick={()=>changeLocale('zh-TW')}>
        繁體中文
      </Menu.Item>
    </Menu>
  );

  return(
    <Dropdown overlay={menu}>
      <span><DribbbleOutlined /></span>
    </Dropdown>
  )

}

export default Locale;
