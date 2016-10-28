import React from 'react';
import { Button } from 'antd-mobile';
import { postRequest } from '../../utils/web';

class OfferSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      needUpload: false,
    }
    this.handleBack = this.handleBack.bind(this);
    this.handleGo = this.handleGo.bind(this);
    this.httpRequest = postRequest.bind(this);
    this.requestForDriverImgStatus = this.requestForDriverImgStatus.bind(this);

  }

  handleGo() {
    this.context.router.push('/person/upload');
  }

  handleBack(){
    const orderId = sessionStorage.getItem('orderId');
    this.context.router.push(`/my-cargo/${orderId}`);
  }

  render() {
    const { actualFee } = this.props.params;
    const { needUpload } = this.state;
    return (
      <div className="page offer-success">
        <div className="mycargo-offer">
          <div className="text">
            实际支付：
            <span className="price">¥ {actualFee}</span>
            <span className="divider"></span>
            信息费
          </div>
          <div className="divideLine"></div>
          { needUpload ? this.renderUploadBtn():this.renderBackBtn() }
        </div>
      </div>
      );
  }

  renderUploadBtn(){
    return (
        <div>
          <div className="nextStep">支付成功！还差最后一步~</div>
          <Button inline className="confirm-btn" onClick={this.handleGo}>立即上传证件</Button>
        </div>
    );
  }

  renderBackBtn(){
    return (
          <Button inline className="confirm-btn" onClick={this.handleBack}>支付完成</Button>
        );
  }

  componentDidMount(){
    this.requestForDriverImgStatus();
  }

  requestForDriverImgStatus(){

    const data = {
      type: 'DRIVER_IMG_STATUS',
    };
    const service = 'SERVICE_DRIVER';
    this.httpRequest(data,service,(returnData)=>{
      // 请求成功
      const imgStatus = returnData.result;
      this.setState({
        needUpload: !imgStatus,
      });
    },(returnData)=>{
      // 请求失败
      Toast.info(returnData.msg);
    });
  }

}

OfferSuccess.contextTypes = {
  router: React.PropTypes.object,
};

export default OfferSuccess;
