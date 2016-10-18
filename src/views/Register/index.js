import React, { Component } from 'react';
import { Link } from 'react-router';
import { createForm } from 'rc-form';
import _ from 'lodash';
import { List, InputItem, Button, Toast, WingBlank, Picker } from 'antd-mobile';
import './_register';
import { postRequest } from '../../utils/web';
import params from '../../utils/params';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: params.carType,
      verifyButtonState: false,
      countDown: 60,
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendVerify = _.throttle(this.sendVerify.bind(this), 60000);
    this.httpRequest = postRequest.bind(this);
  }

  handleSubmit() {
    
    const carProp = this.props.form.getFieldProps('car').value;
    const openId = localStorage.getItem('openId');
    const fromto = this.props.location.search.substring(6);    
    if (openId === null) {
      Toast.info('请在微信中浏览器中打开', 1);
      return;
    }
    const username = this.props.form.getFieldProps('username').value;
    const verify = this.props.form.getFieldProps('verify').value;

    if (username === undefined || username.length != 11){
      Toast.info('请正确填写手机号码');
      return;
    }
    if (verify === undefined || verify.length != 6){
      Toast.info('请正确填写验证码');
      return;
    }
    if (carProp===undefined){
      Toast.info('请选择车型车长');
      return;
    }

    const cType = carProp[0];
    const cLength = carProp[1];
    const isOtherType = cType === 100;
    const isOtherLength = cLength === 100;

    this.setState({ loading: true });
    const data = {
      mobile: username.toString(),
      code: verify.toString(),
      carLength: isOtherLength?'0':cLength.toString(),
      carType: isOtherType?'0':cType.toString(),
      type: 'DRIVER_REGISTER',
      openId,
    };
    const service = 'SERVICE_REGISTER';
    this.httpRequest(data, service, (returnData) => {
      localStorage.setItem('uuid', returnData.result.uuid);
      this.setState({ loading: false });
      this.context.router.push(fromto);
    }, (returnData) => {
      Toast.fail(returnData.msg);
      this.setState({ loading: false });

    });
  }

  sendVerify() {
    this.setState({ verifyButtonState: true, countDown: 60 });
    const text = setInterval(() => this.setState({ countDown: this.state.countDown - 1 }), 1000);
    setTimeout(() => {
      this.setState({ verifyButtonState: false, countDown: 60 });
      clearInterval(text);
    }, 60000);
    const data = {
      mobile: this.props.form.getFieldProps('username').value,
      type: 'DRIVER_REGISTER',
    };
    const service = 'SERVICE_IDENTIFY_CODE';
    this.httpRequest(data, service, (returnData) => {
      Toast.success(returnData.msg);
    }, (returnData) => {
      Toast.fail(returnData.msg);
    });
  }
  componentDidMount(){
    document.title = '注册';
  }

  render() {
    const { verifyButtonState, countDown, loading } = this.state;
    const { getFieldProps } = this.props.form;
    const verifyText = verifyButtonState ? `倒计时${countDown}` : '获取验证码';
    return (
      <div className="register">
        <div className="register-bg">
          <h3 className="logo">货管家</h3>
            <div className="register-menu">
              <Link to="register" activeClassName="active">注册</Link>
              <Link to="login" activeClassName="active">登录</Link>
            </div>
        </div>
        <div className="register-body">
          <List>
            <List.Body>
              <InputItem
                {...getFieldProps('username')}
                className="form-mobile"
                placeholder="请输入手机号"
                labelNumber={2}
                type="number"
                clear
                maxLength={11}
              >
                <span className="icon icon-mobile"/>
              </InputItem>
              <InputItem
                {...getFieldProps('verify')}
                className="form-verify"
                placeholder="请输入验证码"
                type="number"
                maxLength={6}
                labelNumber={2}
                extra = {<Button
                  className="verify"
                  size="small"
                  inline
                  disabled={verifyButtonState}
                  onClick={this.sendVerify}
                  >{verifyText}</Button>}
                clear
              >
                <span className="icon icon-verify"/>
              </InputItem>
              <Picker
                {...getFieldProps('car')}
                className="reg-picker"
                labelNumber={2}
                cols={2}
                extra="请选择车型车长"
                data={this.state.data}
                >
                <List.Item className="car">
                  <span className="icon icon-car"/>
                </List.Item>
              </Picker>
              <WingBlank>
                <Button
                  loading={loading}
                  className="register-submit"
                  type="warning"
                  onClick={this.handleSubmit}>
                  确定
                </Button>
              </WingBlank>
            </List.Body>
          </List>
        </div>
      </div>
    );
  }
}

Register.contextTypes = {
  router: React.PropTypes.object,
};
const _Register = createForm()(Register);
export default _Register;
