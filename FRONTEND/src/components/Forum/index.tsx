import React, { useState, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, Button, Menu, Dropdown, message,Breadcrumb, Row, Col, PageHeader } from 'antd';
import RichEditor from '../RichEditor';
import { Link } from 'umi';
import { CaretDownOutlined } from '@ant-design/icons';
import { THREADACT, THREADS } from '../../apollo/typedefs/thread';
import { isSuper } from '../../auth';
import Thread from './thread';
import { store } from '../../redux';
import styles from './styles.scss';


const MAX_CONTENT = 2000 //200k

const Forum = (props:any) =>{
  //console.log(props.match.params.name,'============')
  const globalState = useContext(store);
  //console.log(globalState,'=========---------------');
  const { dispatch } = globalState;

  //dispatch({ type: 'login'});
  //console.log(globalState.state.isAuth,'===========+++++++++++++++++');

  const [showEditor, setShowEditor] = useState(false);
  const [threadContent, setThreadContent] = useState(null);

  const [issuper] = isSuper();

  const { loading:threadsLoading, error:threadsError, data: threadsData } = useQuery(THREADS, {variables:{'forumName':props.match.params.name}})
  const [addNewThread, { loading: addNewThreadLoading, data: addNewThreadData}] = useMutation(THREADACT,
    {
      refetchQueries:[{query:THREADS, variables:{'forumName':props.match.params.name}}],
      onCompleted(data){
        //console.log(data,'-----------');
        if (data && !data.threadAct.fail){
          message.success("New Thread Created!");
          setShowEditor(false);
        }
        else message.warning(data.threadAct.message);
      }
    });

  const handelAdd = (values, editor) =>{
    //console.log(values.content.toHTML(),'==========')
    const subData ={
      'forumName':props.match.params.name,
      'action':'new',
      'content':values.content.toHTML(),
      //'content':values.content.toRAW(),
      'title':values['title'],
    };
    //console.log(subData.content.length);

    (subData.content.length / 1000 <= MAX_CONTENT) ?
    addNewThread({variables:subData}) && editor.clearEditorContent() :
    message.warning("File Should be less than 200 kb");
  }

  const handelOk = () =>{
    if (!globalState.state.isAuth){
      dispatch({type:'showLoginModal',payload:true});
    }else{
      setShowEditor(!showEditor);
    }
  }


  //console.log(threadsData,'==========',props.match.params.name)

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


  return(
    <div>
      <div>
      <Breadcrumb className={styles.breadLink}>
        <Breadcrumb.Item>
          <Link to={'/'}>
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
            <Link to={'/forum/'+props.match.params.name}>
              {props.match.params.name}
            </Link>
          </Breadcrumb.Item>
      </Breadcrumb>
      </div>
      <Row align="middle">
        <Col span={4}>
          <div className={styles.newThreadButton}>
            <Button shape='round' type="primary" onClick={()=>handelOk()}>new thread</Button>
          </div>
        </Col>
        <Col span={20}>
          <div className={styles.forumHeader}>
            {props.match.params.name}
          </div>
        </Col>
      </Row>

      {
        showEditor?
        <Row style={{padding:'10px'}}>
          <div className={styles.newEditor}>
            <RichEditor setContent={setThreadContent} handelOk={handelAdd} istitle={true} />
          </div>
        </Row>:
        null
      }

      <div style={{paddingTop:'5px'}}>
        <Card title={props.name}
            extra={props.issuper ? ext():null}
            className='section'
            bordered={false}
            size='small'
        >
        {
          threadsData && threadsData.threads?
            threadsData.threads.map((thread:any,index:number) => {
              return(
                <Thread key={thread.id}
                        id={thread.id}
                        creator={thread.creator}
                        issuper={props.issuper}
                        title={thread.title}
                        avatar={thread.avatar}
                        created_at={thread.created_at}
                        last_activity={thread.last_activity}
                        replies={thread.replies}
                        nView={thread.nView}
                        last_user={thread.last_user}
                        last_avatar={thread.last_avatar}
                        last_reply_at={thread.last_reply_at}
                        last_reply_id={thread.last_reply_id}
                        issuper={issuper}
                />
              )
            }):
            null
        }
        </Card>


      </div>
    </div>
  )
}

export default Forum;
