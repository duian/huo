import React from 'react';
import { Toast, Button, ActivityIndicator } from 'antd-mobile';
import url from '../../utils/url';
import request from 'superagent-bluebird-promise';
import Dropzone from 'react-dropzone';
import png from './upload-demo.jpg';
import demo from './default.png';


class Img extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      animating: false,
    };
    
    this.openDrop = this.openDrop.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.uploadDriverCertiy = this.uploadDriverCertiy.bind(this);
  }

  openDrop() {
    this.dropzone.open();
  }

  onDrop(files) {
    this.setState({ files });
  }

  handleUpload() {
    const { files } = this.state;
    if (files[0] === undefined) {
      Toast.info('请选择证件照片');
      return;
    }
    this.setState({ animating: true });
    console.log(files[0]);
    const cavEle = document.createElement('canvas');
    const canvas = cavEle.getContext('2d');
    const img = new Image();
    img.src = files[0].preview;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e)=>{
      img.src = e.target.result;
        // 等比缩放
        cavEle.height = img.height/4;
        cavEle.width = img.width/4;
        canvas.drawImage(img,0,0,cavEle.width,cavEle.height);
        const pressesImg = cavEle.toDataURL('image/jpeg',1);

        const byteString = atob(pressesImg.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        const mimeString = pressesImg.split(',')[0].split(':')[1].split(';')[0];
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const bb = new Blob([ab],{type:mimeString});
        const file = new File([bb],'file.jpg',{type:'image/jpeg',lastModified:Date.now()});
        console.log(file);
        this.uploadDriverCertiy(file);
    };
    reader.onerror = ()=>{
        this.setState({ animating: false });
    };
  }

  uploadDriverCertiy(imageFile){
    const uuid = localStorage.getItem('uuid');
    const data = {
      data: {
        type: 'IMG_UP',
      },
      service: 'SERVICE_IMG',
      uuid,
      timestamp: '',
      signatures: '',
    };
    request.post(url.webapp)
    .withCredentials()
    .field('file', imageFile)
    .field('json', JSON.stringify(data))
    .then(res => {
      const returnData = JSON.parse(res.text);
      if (returnData.success) {
        this.updateDriverCerityfy(returnData.result);
      } else {
        Toast.fail(returnData.msg);
      }
      this.setState({ animating: false });
    });

  }

  updateDriverCerityfy(imagePath) {
    const uuid = localStorage.getItem('uuid');
    const data = {
      data: {
        path: imagePath,
        type: 'DRIVER_CERTIFY',
      },
      service: 'SERVICE_DRIVER',
      uuid,
      timestamp: '',
      signatures: '',
    };

    request.post(url.webapp)
    .withCredentials()
    .send(data)
    .then(res => {
      const resultData = JSON.parse(res.text);
      if (resultData.success) {
        const driverInfo = JSON.parse(localStorage.getItem('driverInfo'));
        driverInfo.imageName = imagePath;
        Toast.success(resultData.msg);
        localStorage.setItem('driverInfo', JSON.stringify(driverInfo));
        this.context.router.push('/person');
      } else {
        Toast.fail(resultData.msg);
      }
    });
  }

  renderImg() {
    const certifyImg = this.props.certifyImg;
    const { files } = this.state;
    if (files.length) {
      return (
        files.map((file, index) => <img className="upload-img" key={index} src={file.preview} />)
      );
    }
    return (
      <img className="upload-img default" src={certifyImg || demo}/>
    );
  }

  render() {
    return (
      <div className="page edit-img">
        <div className="cargo-upload">
          <div className="text">请上传您的行驶证和驾驶证合照(如下图示例)</div>
          <img src={png} className="upload-demo"/>
          <Button inline onClick={this.openDrop} className="upload-btn">上传</Button>
          <Dropzone
            ref={(c) => (this.dropzone = c)}
            onDrop={this.onDrop}
            multiple={false}
            className="dropzone"
            >
            <div className="upload-img-wrapper">
              {this.renderImg()}
            </div>
          </Dropzone>
          <Button inline onClick={this.handleUpload} className="submit-btn">提交</Button>
          <ActivityIndicator
            toast
            text="正在上传证件"
            animating={this.state.animating}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.title = '证件信息';
  }
}

Img.contextTypes = {
  router: React.PropTypes.object,
};

export default Img;
