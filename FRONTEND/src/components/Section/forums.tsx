import React, { useState } from 'react';
import { Card, Row, Col, Dropdown, Menu, Avatar } from 'antd';
import { HomeUrl } from '../../apollo';
import { Link } from 'umi';
import Moment from 'react-moment';
import { CaretDownOutlined,AliwangwangFilled,BulbFilled,EditFilled,WechatFilled } from '@ant-design/icons';
import { BsFillCollectionFill } from "react-icons/bs";
import ForumModal from './forumModal';
import styles from './styles.scss';


const Forum = (props:any) =>{
  const [showForum, setShowForum] = useState(false);
  const [forumAct, setForumAct] = useState(null);

  const manForum = (event,data) =>{
    setForumAct(event['key']);
    //console.log(data,'-----------',event, event.target, event['key'], props.name)
    setShowForum(true);
  }

  const menu = (
    <Menu >
      <Menu.Item key="modify" onClick={(e)=>manForum(e)}>
        Modify
      </Menu.Item>
      {
        props.forum.status=='hide'?
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
    body: {
      fontSize:'14px',
      paddingTop:'3px',
      paddingBottom:'3px',
    }
  }

  return(
    <>
    <Card
      extra={props.issuper ? ext():null}
      //headStyle={styles.header}
      bodyStyle={cardStyles.body}
      size='small'
    >
      <Row>
        <Col span={8}>
            <Row style={{fontWeight:'800'}}>
              <Link to={'/forum/'+props.forum.name} className={styles.link}>
                {props.forum.name}
              </Link>
            </Row>
            <Row>
              {props.forum.description}
            </Row>
        </Col>

        <Col span={6}>
          <Row>
            <Col>
              <EditFilled />
            </Col>
            <Col style={{paddingLeft:'5px'}}>
                {props.forum.nThread} threads
            </Col>
          </Row>
          <Row align='middle'>
            <Col>
            <WechatFilled />
            </Col>
            <Col style={{paddingLeft:'5px'}}>
              {props.forum.nPost} posts
            </Col>
          </Row>
        </Col>

        <Col span={10}>
          <Row align="middle">
              {/*<span><Avatar src= {HomeUrl+"/media/"+props.forum.last_avatar?props.forum.last_avatar:null} alt="avatar" /></span>*/}
            <Col style={{paddingRight:'5px'}}>
              { props.forum.last_avatar?
                <span><Avatar src= {HomeUrl+"/media/"+props.forum.last_avatar} alt="avatar" /></span>:
                null
              }
            </Col>
            <Col>
              <Row style={{fontWeight:'500',fontSize:'12px'}}>
                <Link to={'/thread/'+props.forum.thread_id} className={styles.link}>
                  {props.forum.thread?props.forum.thread:null}
                </Link>
              </Row>
              <Row style={{fontSize:'11px'}}>
                <Link to={{pathname:'/thread/'+props.forum.thread_id,hash:'#'+props.forum.last_post_id}}  className={styles.link}>
                  {props.forum.thread_last_activity?<Moment toNow>{props.forum.thread_last_activity}</Moment>:null}
                </Link>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

    </Card>

    <ForumModal visible={showForum}
                  setVisible={setShowForum}
                  action={forumAct}
                  name={props.forum.name}
                  description={props.forum.description}
                  id={props.forum.id}
                  sectionId={props.sectionId}
    />
    </>
  )
}

export default Forum;
