import React, { useState } from 'react';
import { Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const getBase64 = (img:any, callback:any) =>{
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}



const Avatar = (props:any) =>{

  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(props.imageUrl? props.imageUrl:undefined)
  //if (props.imageUrl) setImageUrl(props.imageUrl)

  const beforeUpload = (file:any) =>{
    const isJpgOrPng = file.type === 'image/jpeg' || file.type == 'image/png';
    if (!isJpgOrPng){
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1014  < 2;
    if (!isLt2M){
      message.error("Image must smaller than 2MB!");
    }
    props.setAvatar(file);
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info:any) =>{
    //console.log('---',info)
    if (info.file.status === 'uploading'){
      setLoading(true);
      return;
    }
    if (info.file.status === 'done'){
      getBase64(info.file.originFileObj, (imageUrl:any) =>{
        //console.log(imageUrl,'=======');
        setImageUrl(imageUrl);
        setLoading(false);
      })
    }
  }

  const uploadButton = (
    <div>
      { loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
    {imageUrl ? <img src={imageUrl} alt="avatar" style={{width:'100%'}} /> :uploadButton }
    </Upload>
  )
}

export default Avatar
