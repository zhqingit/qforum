
import React, { useState, useContext } from 'react';
import { Card, Button, Menu, Dropdown, Form, Input, message } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { getLocale } from 'umi';
import { store } from '../../redux';
import { CaretDownOutlined } from '@ant-design/icons';
import styles from './styles.less';

const maxFileSize = 120000; //100 kb

const RichEditor = (props:any) =>{
  const [form] = Form.useForm();

  const handelOk = () =>{
    const values = form.getFieldsValue();
    props.handelOk(values, editorInstance);
  }

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const customUpload = props => {
    const { file, success, error } = props;
    toBase64(file)
      .then(res => {
        successs({url:res});
      })
      .catch(err => {
        message.warn(" File upload failed");
        error(err.message);
      });
  };

  const validateFn = file => {
    let fileSizeError = "File Should be less than 100 kb";

    if (file.size > maxFileSize) {
      message.warn(fileSizeError);
      return false;
    }
  };

  const globalState = useContext(store);
  const { dispatch } = globalState;
  const locState = globalState.state.locale;

  const locale = () =>{
    switch(locState){
      case 'zh-CN':{
        return 'zh'
      }
      case 'zh-TW':{
        return 'zh-hant'
      }
      case 'en-US':{
        return 'en'
      }
    }
  }

  //const editorInstance = React.createRef();
  let editorInstance;

  return(
    <Form form={form} size='small'>
    {
      props.istitle?
      <Form.Item name="title">
        <Input placeholder="title" />
      </Form.Item>:
      null
    }
      <Form.Item name="content">
        <BraftEditor
          id="editor"
          className="my-editor"
          placeholder="content"
          //contentStyle={{height: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'}}
          contentStyle={{height: 210}}
          //media={{ uploadFn: customUpload, validateFn: validateFn }}
          //media={{ validateFn: validateFn }}
          ref={instance => editorInstance = instance}
          language={locale()}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" onClick={()=>handelOk()}>submit</Button>
      </Form.Item>
    </Form>
  )

}

export default RichEditor;
