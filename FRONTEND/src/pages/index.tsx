import React, { useContext } from 'react';
import styles from './style.less';
import App from './app';

export default (props:any) => {

  return(
    <div className={styles.page}>
      <App />
    </div>  
  );
}
