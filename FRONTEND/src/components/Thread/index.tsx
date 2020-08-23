import React, { useState, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, Button, Menu, Dropdown, message, Col, Row, Breadcrumb, Pagination  } from 'antd';
import { Link } from 'umi';
import RichEditor from '../RichEditor';
import { CaretDownOutlined } from '@ant-design/icons';
import {  THREAD } from '../../apollo/typedefs/thread';
import { POSTACT } from '../../apollo/typedefs/post';
import { isSuper } from '../../auth';
import  Post  from './post';
import { store } from '../../redux';
import styles from './styles.scss';



const MAX_CONTENT = 2000 //200k

const Thread = (props:any) =>{
  //console.log(props.match.params.name,'============')

  const [showEditor, setShowEditor] = useState(false);
  const [postContent, setPostContent] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const globalState = useContext(store);
  const { dispatch } = globalState;
  const isAuth = globalState.state.isAuth;

  const [issuper] = isSuper();

  const { loading:threadLoading, error:threadError, data: threadData, refetch: treadReFetch } = useQuery(THREAD, {
      fetchPolicy:'network-only',
      variables:{
          'threadId':parseInt(props.match.params.id),
          'currentPage':currentPage,
          'pageSize':pageSize,
        }
    });
  const [addPost, { loading: addPostLoading, data: addPostData}] = useMutation(POSTACT,
    {
      refetchQueries:[{
        query:THREAD,
        variables:{
          'threadId':parseInt(props.match.params.id),
          'currentPage':currentPage,
          'pageSize':pageSize,
        }
      }],
      onCompleted(data){
        //console.log(data,'-----------');
        if (data && !data.postAct.fail){
          message.success("Post is submitted!");
          setShowEditor(false);
        }
        else message.warning(data.postAct.message);
      }
    });

  const handelAdd = (values, editor) =>{
    //console.log(values.content.toHTML(),'==========')
    if (isAuth){
      const subData ={
        'threadId':parseInt(props.match.params.id),
        'action':'add',
        'content':values.content.toHTML(),
        //'content':values.content.toRAW(),
      };
      //console.log(values.content,'==================');

      (subData.content.length / 1000 <= MAX_CONTENT) ?
      addPost({variables:subData}) && editor.clearEditorContent() :
      message.warning("File Should be less than 200 kb");
    } else{
      dispatch({type:'showLoginModal',payload:true});
    }

  }

  const onShowSizeChange = (current, pageSize) =>{
    console.log(current,pageSize,'------');
    setPageSize(pageSize);
  }

  const onChangePage = (page, pageSize) =>{
    console.log(page,pageSize,'++++++++++');
    setCurrentPage(page);
    treadReFetch({
        'threadId':parseInt(props.match.params.id),
        'currentPage':currentPage,
        'pageSize':pageSize,
    })
  }


  //console.log(threadsData,'==========')

  const menu = (
    <Menu >
      <Menu.Item key="modify" onClick={(e)=>manSection(e)}>
        Modify
      </Menu.Item>
      {
        props.status=='hide'?
        <Menu.Item key="hide" onClick={(e)=>manSection(e)}>
          Hide
        </Menu.Item>:
        <Menu.Item key="active" onClick={(e)=>manSection(e)}>
          Active
        </Menu.Item>
      }
      <Menu.Item key="delete" onClick={(e)=>manSection(e)}>
        Delete
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="add" onClick={(e)=>manForum(e)}>
        add new forum
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

  /*
  const styles = {
    header: {
      height:'3px',
      fontSize:'16px',
      fontWeight:'800',
      //color:'rgba(0,0,0,.45)',
      border:'0',
      opcity:'1',
    },
    body: {
      fontSize:'16px',
      fontWeight:'500',
      opcity:'1',
    },
    card:{
      paddingTop:'5px',
    }
  }
  */
  return(
    <div >
    <Breadcrumb className={styles.breadLink}>
      <Breadcrumb.Item>
        <Link to={'/'}>
          Home
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{threadData && threadData.thread?
          <Link to={'/forum/'+threadData.thread.forumName}>
            {threadData.thread.forumName}
          </Link>:
        null
        }</Breadcrumb.Item>
    </Breadcrumb>

      {
        threadData && threadData.thread ?
        <div style={{paddingTop:'5px'}}>
          <Card
            size='small'
          >
            <Row>
              <Col span={4}>
              placeholder
              </Col>
              <Col span={20} className={styles.threadTitle}>
                {threadData.thread.title}
              </Col>
            </Row>
          </Card>
        </div>:
        null
      }

      {
          threadData && threadData.thread?
            threadData.thread.posts.map((post:any,index:number) => {
              return(
                <Post key={post.id}
                      id={post.id}
                        creator={post.creator}
                        avatar={post.avatar}
                        created_at={post.created_at}
                        last_activity={post.last_activity}
                        content={post.content}
                        issuper={issuper}
                />
              )
            })
            :
            null
        }
        {
          threadData && threadData.thread?
            <Pagination
              total={threadData.thread.nPost}
              showSizeChanger
              showQuickJumper
              pageSize = {pageSize}
              onShowSizeChange={onShowSizeChange}
              onChange={onChangePage}
              pageSizeOptions={[5,10,20,50,100]}
              showTotal={total => `Total ${total} items`}
              style={{paddingBottom:'3px',paddingTop:'3px'}}
            />:
            null
        }
        <Card>
          <div className={styles.editor}>
            <RichEditor handelOk={handelAdd} istitle={false} />
          </div>
        </Card>
    </div>
  )
}

export default Thread;
