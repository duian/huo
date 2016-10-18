import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { List, InputItem, Button, Toast, WingBlank } from 'antd-mobile';
import './style/app';
import url from './utils/url';
import request from 'superagent-bluebird-promise';
import '../../Register/_register';
import _ from 'lodash';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      bindVisiable:true,
    };

    this.bindViewRender = this.bindViewRender.bind(this);
  }
  
  render() {
    const { bindVisiable } = this.state;
    return (
      <div>
        {this.props.children || 'Home' }
        <div>
            { bindVisiable == true?this.bindViewRender():null }
        </div>
      </div>
    );
  }

  bindViewRender(){
    return(
      <div>
        <List>
          <List.Body>
            <InputItem
                {...getFieldProps('mobile')}
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
          </List.Body>
        </List>
      </div>
    );
  }

}

App.contextTypes = {
  router: React.PropTypes.object,
};

const _App = createForm()(App);
export default _App;
