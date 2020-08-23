import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { SECTIONS } from '../apollo/typedefs/forum';
import { ISSUPER } from '../apollo/typedefs/user';
import { LogSwitchAct } from '../auth';
import Section from '../components/Section';
//import styles from './index.less';
import SectionModal from '../components/Section/sectionModal';
import { Button } from 'antd';
import { store } from '../redux';

const App = () => {
  const { loading, error, data:sections } = useQuery(SECTIONS);
  const globalState = useContext(store);
  const issuper = globalState.state.isSuper;


  const [showSection, setShowSection] = useState(false);
  const [sectionAct, setSectionAct] = useState(null);

  const addsec = () =>{
    setSectionAct('add');
    setShowSection(true);
  }
  //console.log(forums,'===============')

  return (
    <div >
      {
        issuper ?
        <div style={{paddingTop:'3px'}}>
          <Button type='primary' shape='round' onClick={()=>addsec()}>add new section</Button>
        </div>:
        null
      }
      {
        (sections && sections.sections) ?
          sections.sections.map((section:any,index:number) => {
            return(
              <Section key={section.id}
                       id={section.id}
                       name={section.name}
                       description={section.description}
                       status={section.status}
                       forums={section.forums}
                       issuper={issuper}
               />
            )
          }):
          null

      }
      {/*<SectionModal visible={showSection} setVisible={setShowSection} action={"add"}/> */}
      <SectionModal visible={showSection}
                  setVisible={setShowSection}
                  action={sectionAct}
                  name={null}
                  description={null}
                  id={null}
      />
    </div>
  );
}
export default App;
