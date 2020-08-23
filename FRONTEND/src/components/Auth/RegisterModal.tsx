import React, { useState } from 'react';

import { Modal, Form, Input,  Tooltip, Checkbox, message} from 'antd';
import Avatar from '../Avatar';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import apiclient from '../../apollo';
import { PUBKEY, REGISTER } from '../../apollo/typedefs/auth';
import { encryptSet } from '../../auth';
import { setIntl } from '../Locale';

{/*
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';
  */}


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
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
      offset: 6,
    },
  },
};
// register successful
const success = () =>{
  message.success("Register successfully, please login in!")
}

const RegisterModal = (props:any) => {
  //register form
  const [formRegister] = Form.useForm();
  //register modal visible
  const setVisible = props.setVisible;
  //register error
  const [showError, setShowError] = useState(false);
  //upload avatar
  const [avatar, setAvatar] = useState(null);


  //register
  const [registerAct, { called: registerCalled, loading: registerLoading, data: registerData }] = useMutation(REGISTER,{
      onCompleted(data){
        if (data && !data.register.fail){
          setVisible(false);
          success();
        }
        else setShowError(true);
        //else setShowError(false);
      }
  });

  /*
  // query the key
  const [qpubKey, { called: pubkeyCalled, loading: pubkeyLoading, data: pubkeyData }] = useLazyQuery(PUBKEY,{
    onCompleted(data){
      if (data.pubkey) setGotPubKey(true); //already had PubKey
    }
  })
  */


  const onCancel = () =>{
    setVisible(false);
  }


  const onOk = async () =>{
    //formRegister.submit();
    setShowError(false);
     await formRegister.validateFields()
      .then(async (values) => {
        const {data:pubkey} = await apiclient().query({query:PUBKEY}) // get pubkey
        //console.log(pubkey.pubkey,'===+++++');
        if (pubkey.pubkey){
          let encodedVars = ["email","password"]
          values = encryptSet(pubkey.pubkey,values,encodedVars)
          if (avatar) values["avatar"] = avatar
          values["encodedVars"] = encodedVars
          console.log(values)
          registerAct({variables:values});
        }
      })
      .catch(errorInfo =>{
        console.log("failed",errorInfo)
      });
  }


  return(
    <Modal title= {setIntl('REGISTER')}
           visible={props.visible}
           onCancel={onCancel}
           onOk={onOk}
    >
      {/* print register error message*/}
      { (showError ) ? <div style={{display:'flex', justifyContent:'center', color:'red'}}> Error: {registerData.register.message} </div> : null }

      <Form {...formItemLayout} form={formRegister} name="registerForm">

        <Form.Item name="email" label= {setIntl('EMAIL')}
          rules={[{type:'email', required: true, message: 'The input is not valid E-mail'},
            { required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>


        <Form.Item name="password" label= {setIntl('PASSWORD')}
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="confirm" label= {setIntl('CONFIRM_PASSWORD')}
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: setIntl('CONFIRM_PASSWORD_MESSAGE') },
            ({ getFieldValue }) => ({
              validator(rule,value){
                if (!value || getFieldValue('password') === value){
                  return Promise.resolve();
                }
                return Promise.reject(setIntl('PASSWORD_NOT_CONSISTENT'));
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="nickname"
          label={
            <span>
               {setIntl('NICKNAME')}&nbsp;
              <Tooltip title={setIntl('NICKNAME_ANNO')}>
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: false, message: setIntl('NICKNAME_MESSAGE'), whitespace: true }]}
          >
          <Input />
        </Form.Item>

        <Form.Item
          name="avatar"
          label={setIntl('AVATAR')}
          >
          <Avatar setAvatar={setAvatar} />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>

        {/*
        <GoogleReCaptchaProvider reCaptchaKey="6Lc9IakZAAAAAFL1CQ3EbDpZM182ql2mIK4Axf36">
            <GoogleReCaptcha onVerify={token => console.log(token,'0000000000')} />
          </GoogleReCaptchaProvider>,
        */}

      </Form>
    </Modal>
  )
}

export default RegisterModal;
