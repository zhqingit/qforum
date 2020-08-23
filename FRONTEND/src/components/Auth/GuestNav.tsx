import React, { useState, useContext } from 'react';
import { Dropdown, Menu, Button } from 'antd';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { store } from '../../redux';
import { setIntl } from '../Locale';



const GuestNav = (props:any) =>{
  const [showRegister, setShowRegister] = useState(false);

  const globalState = useContext(store);
  const { dispatch } = globalState;
  const showLogin = globalState.state.showLoginModal;

  const setShowLogin = (state) =>{
      dispatch({type:'showLoginModal',payload:state});
  }

  /*
  const style = {
    border:0,
    fontSize:'20px'
  }
  */
  return(
    <>
    <Button style={{backgroundColor:'#001529',color:'white'}} onClick ={() => setShowRegister(true)}> {setIntl('REGISTER')}</Button>
    <Button style={{backgroundColor:'#001529',color:'white'}}  onClick ={() => setShowLogin(true)}>{setIntl('LOGIN')}</Button>

    <LoginModal visible={showLogin} setVisible={setShowLogin} setLoginSwitch={props.setLoginSwitch} />
    <RegisterModal visible={showRegister} setVisible={setShowRegister} />
    </>
  )
}

export default GuestNav;
