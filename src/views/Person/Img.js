import React from 'react';
import { Toast, Button } from 'antd-mobile';
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
    };
    
    this.openDrop = this.openDrop.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  openDrop() {
    this.dropzone.open();
  }

  onDrop(files) {
    this.setState({ files });
  }

  handleUpload() {
    const uuid = localStorage.getItem('uuid');
    const { files } = this.state;
    const data = {
      data: {
        type: 'IMG_UP',
      },
      service: 'SERVICE_IMG',
      uuid,
      timestamp: '',
      signatures: '',
    };
    // const { onClose } = this.props;
    Toast.success('上传');
    request.post(url.webapp)
    .withCredentials()
    .field('file', files[0])
    .field('json', JSON.stringify(data))
    // .send(data)
    .then(res => {
      const returnData = JSON.parse(res.text);
      if (returnData.success) {
        this.updateDriverCerityfy(returnData.result);
      } else {
        Toast.fail(returnData.msg);
      }
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
        driverInfo.imagePath = imagePath;
        localStorage.setItem('driverInfo', JSON.stringify(driverInfo));
        this.context.router.push('/person');
      } else {
        Toast.fail(resultData.msg);
      }
    });
  }

  renderImg() {
    const { files } = this.state;
    if (files.length) {
      return (
        files.map((file, index) => <img className="upload-img" key={index} src={file.preview} />)
      );
    }
    return (
      <img className="upload-img default" src={demo}/>
    );
  }

  render() {
    return (
      <div className="page edit-img">
        <div className="cargo-upload">
          <div className="text">请上传您的行驶证和驾驶证合照</div>
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
        </div>
      </div>
    );
  }
}

export default Img;
