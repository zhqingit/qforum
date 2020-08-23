import React, { useState } from 'react';
import { Card, Button, Menu, Dropdown } from 'antd';
import Forum from './forums';
import { CaretDownOutlined } from '@ant-design/icons';
import SectionModal from './sectionModal';
import ForumModal from './forumModal';
//import styles from './styles.scss';



const Section = (props:any) =>{
  const [showSection, setShowSection] = useState(false);
  const [sectionAct, setSectionAct] = useState(null);
  const [showForum, setShowForum] = useState(false);
  const [forumAct, setForumAct] = useState(null);

  const manSection = (event,data) =>{
    setSectionAct(event['key']);
    //console.log(data,'-----------',event, event.target, event['key'], props.name)
    setShowSection(true);
  }

  const manForum = (event,data) =>{
    setForumAct(event['key']);
    //console.log(data,'-----------',event, event.target, event['key'], props.name)
    setShowForum(true);
  }

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

  const cardStyles = {
    header: {
      height:'3px',
      fontSize:'15px',
      fontWeight:'500',
      border:'0',
    },
  }


  return(
    <div style={{paddingTop:'3px'}}>
      <Card title={props.name}
          extra={props.issuper ? ext():null}
          headStyle={cardStyles.header}
          //bodyStyle={styles.sectionBody}
          bordered={false}
          size='small'
      >
      {
        props.forums.map((forum:any,index:number) => {
          return(
            <Forum key={forum.id} name={forum.name} forum={forum} issuper={props.issuper} sectionId={props.id} > </Forum>
          )
        })
      }
    </Card>

    <SectionModal visible={showSection}
                  setVisible={setShowSection}
                  action={sectionAct}
                  name={props.name}
                  description={props.description}
                  id={props.id}
    />
    <ForumModal visible={showForum}
                  setVisible={setShowForum}
                  action={forumAct}
                  name={null}
                  description={null}
                  id={null}
                  sectionId={props.id}
    />

    </div>
  )
}

export default Section;
