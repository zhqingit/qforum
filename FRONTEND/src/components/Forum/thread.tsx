import React, { useState } from 'react';
import { Card, Row, Col, Dropdown, Menu, Avatar } from 'antd';
import { CaretDownOutlined,AliwangwangFilled,BulbFilled,EditFilled,WechatFilled,UserOutlined } from '@ant-design/icons';
import { HomeUrl } from '../../apollo';
import { Link } from 'umi';
import Moment from 'react-moment';
import styles from './styles.scss';


const Thread = (props:any) =>{
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

  const cardStyles = {
    header: {
      height:'2px',
      fontSize:'16px',
      fontWeight:'800',
      paddingTop:'0',
      paddingBottom:'0',
    },
    body: {
      fontSize:'14px',
      fontWeight:'500',
      paddingTop:'5px',
      paddingBottom:'5px',
    }
  }

  //var created_at = new Date(props.created_at).toLocaleString()
  //console.log(created_at,'00000000000')
  //create_at.toString()
  return(
    <>
    <Card
      bodyStyle={cardStyles.body}
      size='small'
    >
      <Row align="middle">
        <Col span={12}>
          <Row align="middle">
          <Col>
            <span><Avatar src= {HomeUrl+"/media/"+props.avatar} alt="avatar" /></span>
          </Col>
          <Col style={{paddingLeft:'5px'}}>
            <Row style={{fontWeight:'800'}}>
              <Link to={'/thread/'+props.id} className={styles.link}>
                {props.title}
              </Link>
            </Row>
            <Row style={{fontSize:'12px', color:'grey'}}>
              <span>
                <UserOutlined /> {props.creator}
                --
                <Moment toNow>{props.created_at}</Moment>
              </span>
            </Row>
          </Col>
          </Row>
        </Col>

        <Col span={4} style={{fontSize:'12px'}}>
          <Row>
            <Col span={12} style={{textAlign: 'right'}}> reply : </Col>
            <Col span={12}>&nbsp;{props.replies}</Col>
          </Row>
          <Row>
            <Col span={12} style={{textAlign: 'right'}}> view : </Col>
            <Col span={12}>&nbsp;{props.nView} </Col>
          </Row>
        </Col>

        <Col span={4} style={{fontSize:'12px'}}>
        </Col>
        <Col span={4} style={{fontSize:'12px'}}>
          <Row align="middle" justify="space-between">
            <Row align="middle">
              <Col style={{paddingRight:'5px'}}>
                <span><Avatar src= {HomeUrl+"/media/"+props.last_avatar} alt="avatar" /></span>
              </Col>
              <Col>
                <Row>
                  <span>
                    <UserOutlined /> {props.last_user}
                  </span>
                  </Row>
                  <Row>
                    <Link to={{pathname:'/thread/'+props.id,hash:'#'+props.last_reply_id}} style={{fontSize:'10px'}} className={styles.link}>
                      <Moment toNow>{props.last_reply_at}</Moment>
                    </Link>
                  </Row>
              </Col>
            </Row>
            {props.issuper ? ext():null}
          </Row>
        </Col>
      </Row>

    </Card>

    </>
  )
}

export default Thread;
