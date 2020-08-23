import React, { useEffect } from 'react';
import apiclient from '../apollo';
import { ApolloProvider } from '@apollo/react-hooks';
import { CookiesProvider } from 'react-cookie';
import { Layout } from 'antd';
import GlobalHeader from '../components/GlobalHeader';
import { StateProvider } from '../redux';
import useMedia from './use-media';
//import { useMedia, useMediaPredicate } from 'react-media-hook';
//import { getAllLocales, getLocale, setLocale } from 'umi';
//import switchLang from '../components/Locale/switchLang';
//import _debounce from 'lodash.debounce';

import styles from './style.scss';

//import darkTheme from '@ant-design/dark-theme';

const { Header, Footer, Sider, Content } = Layout

const BasicLayout = (props:any) =>{
  const layoutWidth = useMedia( ['(min-width: 3000px)',
                            '(min-width: 1600px)',
                            '(min-width: 1200px)',
                            '(min-width: 992px)',
                            '(min-width: 768px)',
                            '(min-width: 576px)'],
                            ['50%','60%','70%','80%','90%','100%'],
                            '100%'
                             );
  //console.log(width,layoutWidth,'-------');

  return(
    <StateProvider>
      {/*<ConfigProvider antd={antd}>*/}
        <ApolloProvider client={apiclient()}>
          <CookiesProvider>
          <div className={styles.globalBody}>
            <Layout style={{width:layoutWidth, margin:'auto'}}>
              <Header>
                {/*<GlobalHeader setLocale={setLocale} />*/}
                <GlobalHeader />
              </Header>
              <Content>
                {props.children}
              </Content>
              <Footer>
              </Footer>
            </Layout>
          </div>
          </CookiesProvider>
        </ApolloProvider>
      {/*</ConfigProvider>*/}
    </StateProvider>
  )
}

export default BasicLayout
