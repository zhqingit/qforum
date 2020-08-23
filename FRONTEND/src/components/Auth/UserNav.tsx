import React, { useState, useContext } from 'react';
import { Menu, Dropdown, Divider, Avatar } from 'antd'
import { LoadingOutlined } from '@ant-design/icons' ;
import { useQuery } from '@apollo/react-hooks';
import { USERPROFILE, ISSUPER } from '../../apollo/typedefs/user';
import { HomeUrl, clear_cache } from '../../apollo';
import useAuthToken, { useRefreshToken, useLogin, LogoutNotify } from '../../auth';
import ResetModal from '../Auth/ResetModal'
import SettingModal from '../User/SettingModal'
import { store } from '../../redux';


const UserNav = (props:any) =>{
  const { loading, error, data } = useQuery(USERPROFILE,{fetchPolicy:"network-only"});
  const [authToken, setAuthToken, removeAuthToken] = useAuthToken();
  const [refreshToken, setRefreshToken, removeRefreshToken] = useRefreshToken();
  //const [setIsLogin] = useLogin();

  const [showReset, setShowReset] = useState(false)
  const [showSetting, setShowSetting] = useState(false)

  const globalState = useContext(store);
  const { dispatch } = globalState;


  const logout = () => {
      removeRefreshToken();
      removeAuthToken();
      dispatch({type:'login',payload:false});
      dispatch({type:'isSuper',payload:false});
      //setIsLogin(false);
      //props.setLoginSwitch(false);
      clear_cache(USERPROFILE, 'userProfile');
      clear_cache(ISSUPER, 'isSuper');
      //LogoutNotify();
  }

  const menu = (
    <Menu>
      <Menu.Item key='reset' onClick={()=>setShowReset(true)} >
        Reset password
      </Menu.Item>
      <Menu.Item key='setting' onClick={()=>setShowSetting(true)}>
        Setting
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='logout' onClick={()=>logout()}>
        Logout
      </Menu.Item>
    </Menu>
  );


  if (loading || !data || !data.userProfile) return <LoadingOutlined/>
  return(
    <>
    <Dropdown overlay={menu} className="ant-dropdown-link">
    <span><Avatar src= {HomeUrl+"/media/"+data.userProfile.avatar} alt="avatar" />{data.userProfile.nickname}</span>
    </Dropdown>

    <ResetModal visible={showReset} setVisible={setShowReset} />
    <SettingModal visible={showSetting} setVisible={setShowSetting} userProfile={data.userProfile} imagUrl={HomeUrl+"/media/"+data.userProfile.avatar} />
    </>
  )
}

export default UserNav;
