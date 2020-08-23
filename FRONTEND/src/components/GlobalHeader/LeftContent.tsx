import React from 'react';
import { HomeFilled, QuestionCircleFilled } from '@ant-design/icons' ;
import { BsFillPeopleFill } from "react-icons/bs";
import { Space, Row, Col } from 'antd';
import { Link } from 'umi';
import { setIntl } from '../Locale';
import styles from './style.scss'

const LeftContent = () =>{
  return(
      <Space className={styles.leftContent}>
        <div >
          <Link to='/'>
            <HomeFilled /><span> {setIntl('HEADER_HOME')} </span>
          </Link>
        </div>

        <div>
          <QuestionCircleFilled /><span> {setIntl('HEADER_HOTSPOT')} </span>
        </div>

        <div>
          <BsFillPeopleFill /> <span>{setIntl('HEADER_USER')} </span>
        </div>
    </Space>
  )
}

export default LeftContent;
