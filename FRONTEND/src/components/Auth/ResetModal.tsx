import React, { useState } from 'react';

import { Modal, Form, Input,  message} from 'antd';
import Avatar from '../Avatar';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import { RESETPASSWORD } from '../../apollo/typedefs/auth';
import { encryptSet, usePubKey } from '../../auth';

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
  message.success("Reset successfully!")
}

const ResetModal = (props:any) => {
  //reset form
  const [formReset] = Form.useForm();
  //reset modal visible
  const setVisible = props.setVisible;
  //reset error
  const [showError, setShowError] = useState(false);
  //get pubkey
  const [pubkey] = usePubKey();


  //reset
  const [resetAct, { called: resetCalled, loading: resetLoading, data: resetData }] = useMutation(RESETPASSWORD,{
      onCompleted(data){
        console.log(data,'--------')
        if (data && !data.resetPassword.fail){
          setVisible(false);
          success();
        }
        else setShowError(true);
        //else setShowError(false);
      }
  });


  const onCancel = () =>{
    setVisible(false);
  }


  const onOk = async () =>{
    //formRegister.submit();
    setShowError(false);
     await formReset.validateFields()
      .then(async (values) => {
          let encodedVars = ["opassword","password"]
          values = encryptSet(pubkey,values,encodedVars)
          values["encodedVars"] = encodedVars
          console.log(values)
          resetAct({variables:values});
        }
      )
      .catch(errorInfo =>{
        console.log("failed",errorInfo)
      });
  }


  return(
    <Modal title="Reset Password"
           visible={props.visible}
           onCancel={onCancel}
           onOk={onOk}
    >
      {/* print register error message*/}
      { (showError ) ? <div style={{display:'flex', justifyContent:'center', color:'red'}}> Error: {resetData.resetPassword.message} </div> : null }

      <Form {...formItemLayout} form={formReset} name="resetForm">


        <Form.Item name="opassword" label="Old Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="password" label="New Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="confirm" label="Confirm New Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(rule,value){
                if (!value || getFieldValue('password') === value){
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match');
              }
            })
          ]}
        >
          <Input.Password />
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

export default ResetModal;
