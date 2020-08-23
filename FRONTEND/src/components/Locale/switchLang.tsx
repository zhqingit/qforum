
import React, { useState } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import zhTW from 'antd/es/locale/zh_TW';

const switchLang = () =>{

  const [loc, setLocale] = useState('en');
  //const locale1 = 'zhCN';
  var locale = null;
  switch(loc){
    case 'en':{
      locale = enUS;
      break;
    }
    case 'zhCN':{
      locale = zhCN;
      break;
    }
    case 'zhTW':{
      locale = zhTW;
      break;
    }
    default:{
      locale = enUS;
    }
  }
  return([locale, setLocale]);
}

export default switchLang;
