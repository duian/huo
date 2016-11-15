import React from 'react';
import { createForm } from 'rc-form';
import { InputItem, Button, Toast, WingBlank, Modal } from 'antd-mobile';
import _ from 'lodash';
import edit from './edit.png';
import './_bindView';
import { postRequest } from '../../utils/web';

class BindView extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      verifyButtonState: false,
      countDown: 60,
    };

    // this.sendVerify = this.sendVerify.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleBindCancel = this.handleBindCancel.bind(this);
    this.handleBindSucc = this.handleBindSucc.bind(this);
    this.httpRequest = postRequest.bind(this);
    this.handleBind = this.handleBind.bind(this);
    
  }
  
  render(){
    const { verifyButtonState, countDown } = this.state;
    const verifyText = verifyButtonState ? `${countDown}秒` : '验证码';
    const { getFieldProps } = this.props.form;
    const visible = true;
    return(
      <Modal
        visible= {visible}
        className = "bindView bind-modal"
        style={{
          width: 'auto',
          height: 'auto',
        }}
      >
        <div className = "bindView bind-bg">
          <div>
            为了更好的获取货源信息，现在绑定手机号
          </div>
          <div className = "bindView bind-input">
              <InputItem
                  {...getFieldProps('mobile')}
                  placeholder="请输入手机号"
                  className="one"
                  labelNumber={2}
                  type="number"
                  maxLength={11}
                  extra={<img src={edit} 
                    className="bindView edit"
                  />}
                  clear
                >
                </InputItem>
          </div>
          <div>
            <Button inline className="bindView cancel-btn" onClick={this.handleCancel}>取消</Button>
            <Button inline className="bindView confirm-btn" onClick={this.handleBind}>绑定</Button>
          </div>
        </div>
      </Modal>
    );
  }

  // 取消绑定
  handleCancel() {
    this.handleBindCancel();
  }

  // 用户绑定
  handleBind() {
    const mobile = this.props.form.getFieldProps('mobile').value;
    const openId = localStorage.getItem('openId');
    if (mobile === undefined || mobile == ''){
      Toast.info('请填写手机号码')
      return;
    }

    if (openId == null){
      Toast.info('请在微信浏览器打开');
      return;
    }

    const data = {
      mobile: `${mobile}`,
      openId,
      type: 'DRIVER_BINDING',
    };
    const service = 'SERVICE_REGISTER';
    this.httpRequest(data,service,(returnData)=>{
      // 请求成功
      localStorage.setItem('uuid',returnData.result.uuid);
      this.handleBindSucc(returnData.msg);
    },(returnData)=>{
      // 请求失败
      Toast.info(returnData.msg);
    });
  }

  handleBindCancel(){
    const { onClose } = this.props;
    onClose();
  }
  
  handleBindSucc(msg){
    const { onSuccess } = this.props;
    Toast.info(msg,1.5);
    onSuccess();
  }

}

BindView.contextTypes = {
  router: React.PropTypes.object,
};

const _BindView = createForm()(BindView);
export default _BindView;
