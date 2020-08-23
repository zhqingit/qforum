import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Modal, Form, Input, Checkbox } from 'antd';
import apiclient from '../../apollo';
import { PUBKEY, LOGIN, ISAUTHENTICATED} from '../../apollo/typedefs/auth';
import { USERPROFILE } from '../../apollo/typedefs/user';
import { encryptSet } from '../../auth';
import useAuthToken, { useRefreshToken, usePubKey, useLogin, LoginNotify } from '../../auth';
import { store } from '../../redux';
import { setIntl } from '../Locale';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 5,
    },
  },
};

const LoginModal = (props:any) => {
  const [formLogin] = Form.useForm();
  const setVisible = props.setVisible
  const [authToken, setAuthToken] = useAuthToken();
  const [refreshToken, setRefreshToken] = useRefreshToken();
  const [_, setPubKey] = usePubKey();
  const [setIsLogin] = useLogin();

  const globalState = useContext(store);
  //console.log(globalState,'=========---------------');
  const { dispatch } = globalState;
  //console.log(globalState.state.isAuth,'===========+++++++++++++++++');

  //login error
  const [showError, setShowError] = useState(false);

  //login
  const [loginAct, { called: loginCalled, loading: loginLoading, data: loginData }] = useMutation(LOGIN,{
      /*
      update(cache, {data:loginData}){
        if (loginData && !loginData.login.fail){
          //const { auth } = cache.readQuery({query: ISAUTHENTICATED});
          //const { auth } = cache.readQuery({query: ISSUPER});
          //console.log(auth ,'++++');
          //cache.writeData({data:{'isAuthenticated':{'isAuth':true,'__typename':'AuthPayload'}}});
          //data.isAuth = true
          //cache.writeQuery({
          apiclient().writeQuery({
            query:ISAUTHENTICATED,
            data:{'isAuthenticated':{'isAuth':true,'__typename':'AuthPayload','needUpdate':null}},
          });
        }
      },
      */
      //awaitRefetchQueries:true,
      //refetchQueries:[{query:ISAUTHENTICATED}],
      onCompleted(data){
        if (data && !data.login.fail){
          //console.log('---------------',data.login)
          setAuthToken(data.login.authToken);
          setRefreshToken(data.login.refreshToken);
          setPubKey(data.login.key);
          //setIsLogin(true);
          setVisible(false);
          //props.setLoginSwitch(true);
          //LoginNotify();
          dispatch({ type: 'login', payload:true});
          //console.log(data.login,'==================')
        } else setShowError(true);
        //else setShowError(false);
      },
  });

  const onCancel = () =>{
    setVisible(false);
  }

  const onOk = async () =>{
     setShowError(false);
     await formLogin.validateFields()
      .then(async (values) => {
        const {data:pubkey} = await apiclient().query({query:PUBKEY}) // get pubkey
        //console.log(pubkey.pubkey,'===+++++');
        if (pubkey.pubkey){
          let encodedVars = ["email","password"];
          values = encryptSet(pubkey.pubkey, values, encodedVars)
          values["encodedVars"] = encodedVars
          //console.log(values,'==================')
          loginAct({variables:values});
        }
      })
      .catch(errorInfo =>{
        console.log("failed",errorInfo)
      });
    //setVisible(false);
  }
  return(
    <Modal title={setIntl('LOGIN_TITLE')}
           visible={props.visible}
           onCancel={onCancel}
           onOk={onOk}
    >
      {/* print register error message*/}
      { (showError ) ? <div style={{display:'flex', justifyContent:'center', color:'red'}}> Error: {loginData.login.message} </div> : null }
      <Form {...formItemLayout} form={formLogin} name="loginForm">

        <Form.Item name="email" label="email"
          rules={[{type:'email', message: 'The input is not valid E-mail'},
            { required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="password" label="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          {...tailFormItemLayout}
        >
          <Checkbox>
            Rememeber me
          </Checkbox>
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default LoginModal;
