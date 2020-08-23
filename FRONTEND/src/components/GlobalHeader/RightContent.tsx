import React from 'react';
import { SearchOutlined, DribbbleOutlined, SettingOutlined } from '@ant-design/icons' ;
import { Space } from 'antd';
import UserMenu from '../Auth';
import Locale from '../Locale';
import styles from './style.less'

const LeftContent = () =>{
  return(
      <Space size='large' className={styles.rightContent}>
        <SearchOutlined />
        <Locale />

        <SettingOutlined />
          <UserMenu />
      </Space>
  )
}

export default LeftContent;
