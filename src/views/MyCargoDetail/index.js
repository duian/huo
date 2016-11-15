import React from 'react';
import { Link } from 'react-router';
import Offer from './Offer';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { WingBlank, Table, Button, Toast } from 'antd-mobile';
import './_mycargoDetail';
import { postRequest } from '../../utils/web';
import mapIcon from './map-icon.png';
import request from 'superagent-bluebird-promise';
import url from '../../utils/url';
import BindView from './../Register/BindView';


const columns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '名字', dataIndex: 'name', key: 'name' },
];


class CargoDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // 提示信息
      messageVisible: false,
      // 详情
      offerVisible: false,
      cargoInfo: {},
      projectInfo: {},
      loadAddressInfo: {},
      unloadAddressInfo: {},
      payInfo: {},
      distance: null,
      payBtnVisible: true,
      bindVisible: false,
      preparedData: false,
    };

    this.cloneChildren = this.cloneChildren.bind(this);

    this.renderSyncNotice = this.renderSyncNotice.bind(this);
    this.handleOfferOpen = this.handleOfferOpen.bind(this);
    this.handleOfferClose = this.handleOfferClose.bind(this);
    this.cancelPay = this.cancelPay.bind(this);
    // 支付按钮
    this.renderBtn = this.renderBtn.bind(this);
    // 地址
    this.renderAddress = this.renderAddress.bind(this);
    // status 小于99提示
    this.renderDesc = this.renderDesc.bind(this);
    // 获取支付信息
    this.getPayInfo = this.getPayInfo.bind(this);
    // 提交支付信息
    this.postPayInfo = this.postPayInfo.bind(this);
    this.httpRequest = postRequest.bind(this);

    this.handleBindClose = this.handleBindClose.bind(this);
    this.handleBindOpen = this.handleBindOpen(this);
    this.renderBindView = this.renderBindView.bind(this);
    this.paySuccSyncNotify = this.paySuccSyncNotify.bind(this);

  }

  cloneChildren() {
    const path = this.props.location.pathname;
    const { cargoInfo } = this.state;
    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        key: path,
        cargoInfo,
        // onSubmit: this.postPayInfo,
      });
    }
    return null;
  }

  // 报价弹出层
  handleOfferOpen() {
    this.setState({
      offerVisible: true,
    });
  }

  handleOfferClose() {
    this.setState({
      offerVisible: false,
    });
  }

  componentDidMount() {
    this.prepareData();
    this.updateData = setInterval(() => {
      this.prepareData();
    }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.updateData); 
  }
  
  // 获取货源信息
  prepareData() {
    // const uuid = localStorage.getItem('uuid');
    const data = {
      orderId: `${this.props.params.id}`,
      type: 'ORDER_DETAIL',
    };
    const service = 'SERVICE_ORDER';
    this.httpRequest(data, service, (returnData) => {
      const { arrivalCityStr, startCityStr } = returnData.result;
      const startRequest = request.get(url.mapToPOI)
      .query({
        key: url.mapKey,
        address: startCityStr,
      });
      const arrivalRequest = request.get(url.mapToPOI)
      .query({
        key: url.mapKey,
        address: arrivalCityStr,
      });
      Promise.all([startRequest, arrivalRequest])
      .then(res => {
        const start = res[0].body;
        const arrive = res[1].body;
        const origins = start.geocodes[0].location;
        const destination = arrive.geocodes[0].location;
        return { origins, destination };
      })
      .then(_data => {
        request.get(url.distance)
        .query({
          key: url.mapKey,
          origins: _data.origins,
          destination: _data.destination,
        })
        .then(res => {
          let distance = res.body.results[0].distance;
          distance = Math.round((distance / 1000));
          this.setState({ distance });
        });
      });
      // 订单支付通知收到后不显示支付按钮
      const notifyNotice = returnData.result.notifyNotice == 1?false:true;
      this.setState({
        cargoInfo: returnData.result,
        projectInfo: returnData.result.projectInfo,
        loadAddressInfo: returnData.result.loadAddressInfo,
        unloadAddressInfo: returnData.result.unloadAddressInfo,
        payBtnVisible:notifyNotice,
      });
    }, (returnData) => {
      console.log(returnData.errorCode);
        if (returnData.errorCode == '4100' && !this.state.preparedData){
          this.setState({
            bindVisible: true,
            preparedData: true,
          });
        }
    });
  }

  // 注册提示弹出层
  handleBindOpen() {
    this.setState({
      bindVisible: true,
    });
  }

  handleBindClose(){
    this.setState({
      bindVisible:false,
    });
  }

  renderBindView(){
    return(
      <BindView
        onSuccess = {this.handleBindClose}
        onClose = {this.handleBindClose}
      />
    );
  }

  // 获取支付信息
  getPayInfo() {
    const uuid = localStorage.getItem('uuid');

    // 未绑定，弹出绑定页面
    if (uuid === undefined || uuid === null) {
      return this.setState({ bindVisible: true });
    }

    const { id } = this.props.params;
    const data = {
      orderId: id,
      type: 'ORDER_PAYINFO',
    };
    const service = 'SERVICE_PAY';
    this.httpRequest(data, service, (returnData) => {
      this.setState({ payInfo: returnData.result });
      this.handleOfferOpen();
    }, (returnData) => {
      Toast.info(returnData.msg);
    });
  }


  // 取消支付
  cancelPay() {
    const { orderNum } = this.state.cargoInfo;
    const data = {
      orderNum,
      type: 'ORDER_PAY_CANCEL',
    };
    const service = 'SERVICE_PAY';
    this.httpRequest(data, service);
  }

  paySuccSyncNotify(payMsg){
    const data = {
      orderId: `${this.props.params.id}`,
      payMsg: payMsg ,
      type: 'ORDER_PAY_SYNC_NOTIFY' ,
    };
    const service = 'SERVICE_PAY';
    this.httpRequest(data, service,(returnData)=>{
      // success
      if(payMsg == "get_brand_wcpay_request：ok"){
        this.setState({
          payBtnVisible: false,
        });
      }
    },(returnData)=>{
      // fail -- 支付通知失败
      
    });
  }

   // 确认支付
  postPayInfo() {
    // this.handleOfferClose();
    // const {cargoInfo} = this.state;
    // cargoInfo.statusStr = '运输中';
    // this.setState({
    //   cargoInfo,
    //   payBtnVisible: false,
    // });
    // this.context.router.push('/person/upload');
    // return;

    const { orderNum } = this.state.cargoInfo;
    const data = {
      orderNum,
      url: location.href,
      type: 'ORDER_PAY_POST',
    };
    const service = 'SERVICE_PAY';

    this.httpRequest(data, service, (returnData) => {
      const {
        appId,
        nonceStr,
        timeStamp,
        signatures,
        packageName,
        signType,
        paySign,
      } = returnData.result;
      wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        // 必填，公众号的唯一标识
        appId,
        // 必填，生成签名的时间戳
        timestamp: timeStamp,
        // 必填，生成签名的随机串
        nonceStr,
        // 必填，签名，见附录1
        signatures,
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: [
          'checkJsApi',
          'chooseWXPay',
        ],
      });
      wx.ready(() => {
        wx.chooseWXPay({
          timestamp:timeStamp,
          nonceStr,
          package: packageName,
          signType,
          paySign,
          success: (res) => {
            this.paySuccSyncNotify(res.err_msg);
            if (res.err_msg === "get_brand_wcpay_request：ok") {
              // 支付成功
              this.handleOfferClose();
              this.context.router.push('/person/upload');
            }else {
              // 支付失败或者取消支付
            }
          },
          cancel: (res)=>{
            // 支付取消
            this.cancelPay();
          }
        });
      });

      wx.error((err) => {
        console.log('res', err);
      });

      wx.checkJsApi({
        jsApiList: ['chooseWXPay'],
        success: () => null,
      });
    }, (returnData)=>{

    });
  }

  renderBtn() {
    return <Button className="apply-for" onClick={this.getPayInfo}>支付</Button>;
  }
  
  renderSyncNotice(){
    return(
      <p className="mycargo-desc">处理中，系统正在确认交易</p>
    );
  }

  renderAddress() {
    const {
      loadAddressInfo,
      unloadAddressInfo,
    } = this.state;
    return (
      <div className="mycargo-content">
        <div className="title-wrapper">
          <i className="icon icon-info"></i>
          <h4 className="title">装卸货信息</h4>
        </div>
        <div className="people-info">
          <div className="people-info-item">
            <div className="load-address">装货地址: {loadAddressInfo.address}</div>
            <a href={`tel:${loadAddressInfo.linkMobile}`} className="people-contact">联系人电话</a>
          </div>
          <div className="people-info-item">
            <div className="unload-address">卸货地址: {unloadAddressInfo.address}</div>
            <a href={`tel:${unloadAddressInfo.linkMobile}`} className="people-contact">联系人电话</a>
          </div>
          <Link className="map-icon" to={`/my-cargo/${this.props.params.id}/map`}>
            <img src={mapIcon}/>
          </Link>
        </div>
      </div>
    );
  }

  renderDesc() {
    return <p className="mycargo-desc">处理中，请注意接听400客服电话</p>;
  }
  render() {
    document.title = '我的货运-订单详情';
    const {
      offerVisible,
      cargoInfo,
      projectInfo,
      payInfo,
      distance,
      payBtnVisible,
      bindVisible,
    } = this.state;
    let visible = false;
    if (parseInt(cargoInfo.status, 10) === 99 && payBtnVisible){
       visible = true;
    }

    const simpleProjectInfo = [{
      title: '司机人数',
      name: projectInfo.driverNum || 1,
      key: '1',
    }, {
      title: '防护环境',
      name: projectInfo.protect || '无',
      key: '2',
    }, {
      title: '车辆环境',
      name: projectInfo.envRqmt || '无要求',
      key: '3',
    }, {
      title: '装卸要求',
      name: projectInfo.loadRqmt || '厂家负责卸货',
      key: '4',
    }, {
      title: '配载要求',
      name: projectInfo.allocRqmt || '不可配载',
      key: '5',
    }];

    const detailProjectInfo = [{
      title: '司机人数',
      name: projectInfo.driverNum || '',
      key: '1',
    }, {
      title: '防护环境',
      name: projectInfo.protect || '',
      key: '2',
    }, {
      title: '车辆环境',
      name: projectInfo.envRqmt || '',
      key: '3',
    }, {
      title: '装卸要求',
      name: projectInfo.envRqmt || '',
      key: '4',
    }, {
      title: '配载要求',
      name: projectInfo.allocRqmt || '',
      key: '5',
    }, {
      title: '装货方式',
      name: projectInfo.loadType || '',
      key: '6',
    }, {
      title: '司机自带工具',
      name: projectInfo.carTools || '',
      key: '7',
    }, {
      title: '到场时间要求',
      name: projectInfo.arrivalTimeRqmt || '',
      key: '8',
    }, {
      title: '装载时长',
      name: projectInfo.loadTime || '',
      key: '9',
    }, {
      title: '卸载时长',
      name: projectInfo.unloadTime || '',
      key: '10',
    }, {
      title: '装卸货费用',
      name: projectInfo.loadCast || '',
      key: '11',
    }];

    let data;
    if (cargoInfo.status > 99) {
      data = detailProjectInfo;
    } else {
      data = simpleProjectInfo;
    }
    return (
      <div className="mycargo-detail">
        <div className="order">订单编号：{cargoInfo.orderNum}</div>
        <div className="info">
          <div className="info-place">
            {cargoInfo.startCityStr} → {cargoInfo.arrivalCityStr}
            <span className="span-divider"></span>
            {cargoInfo.sendTimeStr}
          </div>
          <div>
            <div className="info-item">
              货物名称： {cargoInfo.cargoName}
            </div>
            <div className="info-item">
              吨位方量： {cargoInfo.weight}吨/{cargoInfo.cubic}平方
            </div>
            <div className="info-item">
              车辆需求： {cargoInfo.carTypeStr}
              <span className="span-divider"></span>
              {cargoInfo.carLengthStr}
            </div>
            <div className="info-item">总里程数： {distance ? `${distance}公里` : '计算失败'}</div>
          </div>
          <div className="trapezoid">{cargoInfo.statusStr}</div>
        </div>
        <div className="block mycargo-content">
          <div className="title-wrapper">
            <i className="icon icon-project"></i>
            <h4 className="title">项目信息</h4>
          </div>
          <WingBlank>
            <Table
              direction="horizon"
              columns={columns}
              dataSource={data}
            />
            <Offer
              onSubmit={this.postPayInfo}
              visible={offerVisible}
              onClose={this.handleOfferClose}
              payInfo={payInfo}
            />
          </WingBlank>
        </div>
        { bindVisible == true ? this.renderBindView() : null }
        { parseInt(cargoInfo.status, 10) > 99 ? this.renderAddress() : null }
        { visible ? this.renderBtn() : null }
        { (parseInt(cargoInfo.status, 10) === 99 && !payBtnVisible) ? this.renderSyncNotice() : null }
        { parseInt(cargoInfo.status, 10) < 99 ? this.renderDesc() : null }
        <ReactCSSTransitionGroup transitionName="pageSlider"
          transitionEnterTimeout={600} transitionLeaveTimeout={600}>
          {this.cloneChildren()}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

CargoDetail.contextTypes = {
  router: React.PropTypes.object,
};

export default CargoDetail;
