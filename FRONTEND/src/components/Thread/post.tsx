import React, { useState } from 'react';
import { Card, Row, Col, Dropdown, Menu, Avatar, Divider } from 'antd';
import { CaretDownOutlined,AliwangwangFilled,BulbFilled,EditFilled,WechatFilled } from '@ant-design/icons';
import { BsFillPeopleFill } from "react-icons/bs";
import { HomeUrl } from '../../apollo';
import Moment from 'react-moment';
import { html } from 'htm/preact';
import 'braft-editor/dist/output.css';
import styles from './styles.scss';

const Post = (props:any) =>{
  /*
  const [showForum, setShowForum] = useState(false);
  const [forumAct, setForumAct] = useState(null);
  */

  const manForum = (event,data) =>{
    pass
    //setForumAct(event['key']);
    //console.log(data,'-----------',event, event.target, event['key'], props.name)
    //setShowForum(true);
  }

  const menu = (
    <Menu >
      <Menu.Item key="modify" onClick={(e)=>manForum(e)}>
        Modify
      </Menu.Item>
      {
        true?
        <Menu.Item key="hide" onClick={(e)=>manForum(e)}>
          Hide
        </Menu.Item>:
        <Menu.Item key="active" onClick={(e)=>manForum(e)}>
          Active
        </Menu.Item>
      }
      <Menu.Item key="delete" onClick={(e)=>manForum(e)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const ext = () =>{
    return(
      <Dropdown overlay={menu} trigger={['click']}>
        <CaretDownOutlined />
      </Dropdown>
    )
  }


  return(
    <>
    <Card
      size='small'
      id={props.id}
    >
      <Row>
        <Col span={2} className={styles.creator} >
          <Row justify="center">
            <span><Avatar size={50} src= {HomeUrl+"/media/"+props.avatar} alt="avatar" /></span>
          </Row>
          <Row justify="center">
              <span>
                {props.creator}
              </span>
          </Row>
        </Col>

        <Col span={22} className={styles.content}>
          <Row justify='space-between' style={{color:'grey'}}>
            <div>published at: <Moment format="DD MM YYYY hh:mm:ss">{props.created_at}</Moment></div>
            <div> {props.issuper ? ext():null}</div>
          </Row>
          <Row>
            <div className="braft-output-content" dangerouslySetInnerHTML={{__html: props.content}}></div>
          </Row>

        </Col>
      </Row>

    </Card>

    </>
  )
}

export default Post;
