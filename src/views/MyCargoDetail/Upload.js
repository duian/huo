import React from 'react';
import { Toast, Button, ActivityIndicator, Modal } from 'antd-mobile';
import request from 'superagent-bluebird-promise';
import Dropzone from 'react-dropzone';
import png from '../Person/upload-demo.jpg';
import demo from '../Person/default.png';
import url from '../../utils/url';
import './_mycargoDetail';


class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      animating: false,
      noticeVisible: false,
    };
    
    this.openDrop = this.openDrop.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleGo = this.handleGo.bind(this);
    this.handleBack = this.handleBack.bind(this);
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
    if (files[0] === undefined) {
      Toast.info('请选择证件照片');
      return;
    }
    this.setState({ animating: true });
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
    .field('file', files[0])
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
        this.setState({
          noticeVisible: true,
        });
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
          <Modal
              transparent
              visible={this.state.noticeVisible}
              className="upload"
              style={{
                width: 'auto',
                height: 'auto',
              }}
              footer={[{ text: '返回', onPress: this.handleBack },{ text: '立即完善', onPress: this.handleGo }]}
              >
              <div >上传成功</div>
              <div >完善信息可以获赠10个幸运豆哦~！</div>
          </Modal>
        </div>
      </div>
    );
  }

  handleBack(){
    const orderId = sessionStorage.getItem('orderId');
    this.context.router.push(`/my-cargo/${orderId}`);
  }

  handleGo(){
    this.context.router.push('/person');
  }

  componentDidMount() {
    document.title = '证件信息';
  }
}

Upload.contextTypes = {
  router: React.PropTypes.object,
};

export default Upload;
