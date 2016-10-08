import React, { Component } from 'react';
import { Icon, List, Toast } from 'antd-mobile';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import request from 'superagent-bluebird-promise';
import url from '../../utils/url';
import { postRequest } from '../../utils/web';
import './_person';

class Person extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [
        // { url: 'https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png', id: '111' },
      ],
      driverInfo: {},
      certifyImg: '',
    };

    this.cloneChildren = this.cloneChildren.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.getImage = this.getImage.bind(this);
    this.renderPaper = this.renderPaper.bind(this);
    this.httpRequest = postRequest.bind(this);

    this.modifyDriverInfo = this.modifyDriverInfo.bind(this);
    this.modifyCertifyImg = this.modifyCertifyImg.bind(this);
  }


  modifyDriverInfo(e) {
    const { driverInfo } = this.state;
    if (driverInfo.driverStatus === 10) {
      e.preventDefault();
      Toast.info('您已认证，不能编辑信息', 0.8);
      return false;
    }
    return true;
  }
  
  modifyCertifyImg(e) {
    const { driverInfo } = this.state;
    if (driverInfo.certifyStatus === 10) {
      e.preventDefault();
      Toast.info('车辆信息已认证，不能编辑信息', 0.8);
      return false;
    }
    return true;
  }

  cloneChildren() {
    const path = this.props.location.pathname;
    const { driverInfo } = this.state;
    if (this.props.children) {
      return React.cloneElement(this.props.children, { key: path, driverInfo });
    }
    return null;
  }

  // 获取司机信息
  prepareData() {
    const uuid = localStorage.getItem('uuid');
    if (uuid === undefined) {
      return;
    }
    const data = {
      type: 'DRIVER_INFO',
    };
    const service = 'SERVICE_DRIVER';
    this.httpRequest(data, service, (returnData) => {
      if (returnData.result.imageName) {
        this.getImage(returnData.result.imageName);
      }

      this.setState({
        driverInfo: returnData.result,
      });
        // localStorage.setItem('driverInfo', JSON.stringify(returnData.result));
    }, (returnData) => {
      console.log('err', returnData);
    });
  }

  getImage(path) {
    const uuid = localStorage.getItem('uuid');
    const data = {
      data: {
        path,
        type: 'IMG_DOWN',
      },
      service: 'SERVICE_IMG',
      uuid,
      timestamp: '',
      signatures: '',
    };
    request.post(url.webapp)
    .withCredentials()
    .on('request', function req() {
      this.xhr.responseType = 'blob';
    })
    .send(data)
    .then((res) => {
      const img = window.URL.createObjectURL(res.xhr.response);
      this.setState({
        certifyImg: img,
      });
    });
  }

  componentWillReceiveProps() {
    const { driverInfo } = this.state;
    const _driverInfo = JSON.parse(localStorage.getItem('driverInfo'));
    this.setState({
      driverInfo: Object.assign(driverInfo, _driverInfo),
    });
  }

  componentDidMount() {
    this.prepareData();
    localStorage.setItem('driverInfo', JSON.stringify({}));
  }

  renderPaper() {
    const { driverInfo, certifyImg } = this.state;
    if (driverInfo.certifyStatus === 0) {
      return (
        <div className="car-img">
          <p>未上传证件</p>
        </div>
      );
    } else if (driverInfo.certifyStatus === 1 || driverInfo.certifyStatus === 2) {
      return (
        <div className="car-img">
          <p>已上传证件</p>
          <img src={certifyImg}/>
          <p className="small">行驶证与驾驶证合照</p>
        </div>
      );
    } else if (driverInfo.certifyStatus === 10) {
      return (
        <div className="car-img">
          <p>车辆证件已认证</p>
          <img src={certifyImg}/>
          <p className="small">行驶证与驾驶证合照</p>
        </div>
      );
    }
    return null;
  }

  render() {
    const { driverInfo } = this.state;
    const carDesc = `${driverInfo.carTypeStr}/${driverInfo.carLengthStr}`;
    const weightDesc = `${driverInfo.weight}吨/${driverInfo.cubic}方/${driverInfo.carAxis}轴`;
    return (
      <div className="person">
        <div className="panel">
          <div className="panel-media">
            <div className="person-logo">
            </div>
          </div>
          <div className="panel-text">
            <h4 className="panel-text-title">
              <span>{driverInfo.name}</span>
              <Icon type="mobile"/>
              <span>{driverInfo.mobile}</span>
            </h4>
            <p className="panel-text-desc">
              <span>{driverInfo.driverStatusStr}</span>
              <span>幸运豆: {driverInfo.luckyBean}</span>
            </p>
            <div></div>
          </div>
        </div>
        <List>
          <List.Body>
            <Link to="/person/name" onClick={this.modifyDriverInfo}>
              <List.Item
                arrow="horizontal"
                extra={driverInfo.name}
              >姓名</List.Item>
            </Link>
            <Link to="/person/car-img" onClick={this.modifyCertifyImg}>
              {
                this.renderPaper()
              }
            </Link>
            <Link to="/person/car-number" onClick={this.modifyDriverInfo}>
              <List.Item
                arrow="horizontal"
                extra={driverInfo.carNum}
              >车牌号</List.Item>
            </Link>
            <Link to="/person/car-info" onClick={this.modifyDriverInfo}>
              <List.Item
                arrow="horizontal"
                extra= {carDesc}
              >车型车长</List.Item>
            </Link>
            <Link to="/person/car-weight" onClick={this.modifyDriverInfo}>
              <List.Item
              arrow="horizontal"
              extra={weightDesc}
            >吨位/方量/轴数</List.Item>
            </Link>
            <Link to="/person/car-tag" onClick={this.modifyDriverInfo}>
              <List.Item
              arrow="horizontal"
              extra={driverInfo.carTools}
              >附属物</List.Item>
            </Link>
          </List.Body>
        </List>
        <ReactCSSTransitionGroup transitionName="pageSlider"
          transitionEnterTimeout={600} transitionLeaveTimeout={600}>
          {this.cloneChildren()}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Person;
