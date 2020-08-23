import React, { useContext } from 'react';
import { Layout } from 'antd';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
//import styles from './style.less';
import styles from './style.scss';
//import { store } from '../../redux';


const GlobalHeader = (props:any) =>{
  //const globalState = useContext(store);
  //const { dispatch } = globalState;
  //const locale = globalState.state.locale;
  //props.setLocale(locale);


  return(
    <div className={styles.globalHeader}>
      <LeftContent />
      <RightContent />
    </div>
  )
}

export default GlobalHeader;
