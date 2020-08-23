import React, { useState } from 'react';

import { Modal, Form, Input,  Tooltip, Checkbox, message} from 'antd';
import Avatar from '../Avatar';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import { UPDATESETTING, USERPROFILE } from '../../apollo/typedefs/user';

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
  message.success("Update successfully!")
}

const SettingModal = (props:any) => {
  //setting form
  const [formSetting] = Form.useForm();
  //setting modal visible
  const setVisible = props.setVisible;
  //setting error
  const [showError, setShowError] = useState(false);
  //upload avatar
  const [avatar, setAvatar] = useState(null);


  //register
  const [settingAct, { called: settingCalled, loading: settingLoading, data: settingData }] = useMutation(UPDATESETTING,{
      refetchQueries:[{query:USERPROFILE}],
      onCompleted(data){
        if (data && !data.updateSetting.fail){
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
     await formSetting.validateFields()
      .then(async (values) => {
        //console.log(pubkey.pubkey,'===+++++');
        if (avatar) values["avatar"] = avatar
        settingAct({variables:values});
      })
      .catch(errorInfo =>{
        console.log("failed",errorInfo)
      });
  }


  return(
    <Modal title="Setting"
           visible={props.visible}
           onCancel={onCancel}
           onOk={onOk}
    >
      {/* print register error message*/}
      { (showError ) ? <div style={{display:'flex', justifyContent:'center', color:'red'}}> Error: {settingData.updateSetting.message} </div> : null }

      <Form {...formItemLayout} form={formSetting} name="settingForm">

        <Form.Item
          name="nickname"
          label={
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: false, message: 'Please input your nickname!', whitespace: true }]}
          >
          <Input placeholder={props.userProfile.nickname}/>
        </Form.Item>

        <Form.Item
          name="avatar"
          label="avatar"
          >
          <Avatar setAvatar={setAvatar} imageUrl={props.imagUrl} />
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

export default SettingModal;
