import React, { Component } from 'react';
import { Link } from 'react-router';
import { createForm } from 'rc-form';
import _ from 'lodash';
import { Icon, List, InputItem, Button, Toast, WingBlank, Picker } from 'antd-mobile';
import './_register';
import { postRequest } from '../../utils/web';
import params from '../../utils/params';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: params.carType,
      verifyButtonState: false,
      countDown: 60,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendVerify = _.throttle(this.sendVerify.bind(this), 60000);
    this.httpRequest = postRequest.bind(this);
  }

  handleSubmit() {
    
   const carProp = this.props.form.getFieldProps('car').value;
   const weChatCode = localStorage.getItem('weChatCode');
   let fromto = this.props.location.search.substring(6);

    if(weChatCode == null){
      Toast.info('请在微信中浏览器中打开',1);
      return;
    }

    const data = {
        mobile: this.props.form.getFieldProps('username').value.toString(),
        code: this.props.form.getFieldProps('verify').value.toString(),
        carLength: carProp[0].toString(),
        carType: carProp[1].toString(),
        type: 'DRIVER_REGISTER',
        weChatCode,
      };
     const service = 'SERVICE_REGISTER';

     this.httpRequest(data,service,(returnData)=>{
        localStorage.setItem('uuid', returnData.result.uuid);
        this.context.router.push(fromto);
     },(returnData)=>{
         Toast.fail(returnData.msg);
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
    const  service = 'SERVICE_IDENTIFY_CODE';
    this.httpRequest(data,service,(returnData)=>{
       Toast.success(returnData.msg);
    },(returnData)=>{
        Toast.fail(returnData.msg);
    });
  }
  render() {
    const { verifyButtonState, countDown } = this.state;
    const { getFieldProps } = this.props.form;
    const verifyText = verifyButtonState ? `倒计时${countDown}` : '获取验证码';
    return (
      <div className="login">
        <div className="login-bg">
          <h3 className="logo">货管家</h3>
            <div className="login-menu">
              <Link to="register" activeClassName="active">注册</Link>
              <Link to="login" activeClassName="active">登录</Link>
            </div>
        </div>
        <div className="login-body">
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
                <Icon type="mobile"/>
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
                <Icon type="link"/>
              </InputItem>
              <Picker
                {...getFieldProps('car')}
                className="reg-picker"
                labelNumber={2}
                cols={2}
                extra="请选择车长车型"
                data={this.state.data}
                >
                <List.Item>
                  <Icon type="setting"/>
                </List.Item>
              </Picker>
              <WingBlank>
                <Button
                  className="login-submit"
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
const _Login = createForm()(Login);
export default _Login;
