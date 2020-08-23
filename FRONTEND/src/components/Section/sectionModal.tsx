import React, { useState } from 'react';

import apiclient from '../../apollo';
import { Modal, Form, Input,  Tooltip, Checkbox, message} from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { SECTIONACT, SECTIONS } from '../../apollo/typedefs/forum';

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
  message.success("Section adding successfully!")
}

const SectionModal = (props:any) => {
  //register form
  const [formSectionAct] = Form.useForm();
  //register modal visible
  const setVisible = props.setVisible;
  //register error
  const [showError, setShowError] = useState(false);


  //register
  const [sectionAct, { called: sectionActCalled, loading: sectionActLoading, data: sectionActData }] = useMutation(SECTIONACT,{
      refetchQueries:[{query:SECTIONS}],
      onCompleted(data){
        //console.log(data,'------------+=======');
        if (data && !data.sectionAct.fail){
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
     await formSectionAct.validateFields()
      .then(async (values) => {
          values['action'] = props.action;
          console.log(values)
          sectionAct({variables:values});
      })
      .catch(errorInfo =>{
        console.log("failed",errorInfo)
      });
  }

  const disabled = (props.action=='add' || props.action=='modify' )? false:true

  return(
    <Modal
           destroyOnClose={true}
           title={props.action+" section"}
           visible={props.visible}
           onCancel={onCancel}
           onOk={onOk}
    >
      {/* print register error message*/}
      { (showError ) ? <div style={{display:'flex', justifyContent:'center', color:'red'}}> Error: {sectionActData.sectionAct.message} </div> : null }

      <Form {...formItemLayout} form={formSectionAct}  name="SectionActForm">

        <Form.Item name="id" label="id" hidden={true}
            initialValue={props.id}
        >
          <Input defaultValue={props.id} disabled={true} />
        </Form.Item>

        <Form.Item name="name" label="name"
          rules={[{ required: true, message: 'Please input the name!' }]}
           initialValue={props.name}
        >
          <Input defaultValue={props.name} disabled={disabled} />
        </Form.Item>

        <Form.Item name="description" label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
           initialValue={props.description}
        >
          <Input defaultValue={props.description} disabled={disabled} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SectionModal;
