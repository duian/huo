import React from 'react';
import { createForm } from 'rc-form';
import { InputItem, Button, Toast, WingBlank, Modal } from 'antd-mobile';
import request from 'superagent-bluebird-promise';
import _ from 'lodash';
import './_bindView';
import url from '../../utils/url';

class BindView extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      verifyButtonState: false,
      countDown: 60,
    };

    this.sendVerify = this.sendVerify.bind(this);
    this.handleBind = this.handleBind.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }
  
  render(){
    
    const { verifyButtonState, countDown } = this.state;
    const verifyText = verifyButtonState ? `倒计时${countDown}` : '获取验证码';
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
                  clear
                  maxLength={11}
                >
                </InputItem>
                <InputItem
                  {...getFieldProps('verify')}
                  placeholder="请输入验证码"
                  className="two"
                  type="number"
                  maxLength={6}
                  labelNumber={2}
                  extra = {<Button
                    className="verify"
                    inline
                    disabled={verifyButtonState}
                    onClick={this.sendVerify}
                    >{verifyText}</Button>}
                  clear
                >  
                </InputItem>
          </div>
          <div>
            <Button inline className="bindView cancel-btn" onClick={this.handleClose}>取消</Button>
            <Button inline className="bindView confirm-btn" onClick={this.handleBind}>绑定</Button>
          </div>
        </div>
      </Modal>
    );
  }

  sendVerify() {
    this.setState({ verifyButtonState: true, countDown: 60 });
    const text = setInterval(() => this.setState({ countDown: this.state.countDown - 1 }), 1000);
    setTimeout(() => {
      this.setState({ verifyButtonState: false, countDown: 60 });
      clearInterval(text);
    }, 60000);
    const data = {
      mobile: this.props.form.getFieldProps('mobile').value,
      type: 'DRIVER_REGISTER',
    };
    const service = 'SERVICE_IDENTIFY_CODE';
    this.httpRequest(data, service, (returnData) => {
      Toast.success(returnData.msg);
    }, (returnData) => {
      Toast.fail(returnData.msg);
    });
  }

  handleClose() {
    const { onClose } = this.props;
    onClose();
  }

  handleBind() {

  }

}

BindView.contextTypes = {
  router: React.PropTypes.object,
};

const _BindView = createForm()(BindView);
export default _BindView;
