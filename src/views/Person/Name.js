import React, { Component } from 'react';
import { InputItem, WingBlank, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { postRequest } from '../../utils/web';

class Name extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.httpRequest = postRequest.bind(this);
  }

  render() {
    const { name } = this.props.driverInfo;
    const { getFieldProps } = this.props.form;
    return (
      <div className="page edit-name">
        <InputItem
          {...getFieldProps('name', {
            initialValue: name,
          })}
          clear
          placeholder="请输入姓名"
          className="name-input"
        />
        <WingBlank>
          <Button
            className="submit-btn"
            type="warning"
            onClick={this.handleSubmit}>
            确定
          </Button>
        </WingBlank>
      </div>
    );
  }

  handleSubmit() {
    const uuid = localStorage.getItem('uuid');
    const name = this.props.form.getFieldProps('name').value;
    if (name === undefined) {
      Toast.fail('请填写姓名');
      return;
    }
    if (uuid === undefined) {
      return;
    }
    const data = {
      name,
      type: 'DRIVER_NAME',
    };
    const service = 'SERVICE_DRIVER';

    this.httpRequest(data, service, () => {
      const driverInfo = JSON.parse(localStorage.getItem('driverInfo'));
      driverInfo.name = name;
      localStorage.setItem('driverInfo', JSON.stringify(driverInfo));
      this.context.router.push('/person');
    }, (returnData) => {
      console.log('err', returnData);
    });
  }
}

Name.contextTypes = {
  router: React.PropTypes.object,
};

const _Name = createForm()(Name);
export default _Name;
