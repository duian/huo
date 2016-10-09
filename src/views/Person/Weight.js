import React, { Component } from 'react';
import { List, InputItem, Toast, WingBlank, Button, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';
import { postRequest } from '../../utils/web';
import params from '../../utils/params';

class Weight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: params.carAxis,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.httpRequest = postRequest.bind(this);
  }

  render() {
    const { weight, cubic, carAxis } = this.props.driverInfo;
    const { getFieldProps } = this.props.form;
    return (
      <div className="page">
        <Picker
          {...getFieldProps('carAxis', {
            initialValue: [parseInt(carAxis, 10)],
          })}
          className="reg-picker"
          labelNumber={1}
          cols={1}
          extra="请选择车轴数量"
          data={this.state.data}
        >
          <List.Item className="underline">
          </List.Item>
        </Picker>
        <InputItem
          {...getFieldProps('weight', {
            initialValue: weight===0?'':weight,
          })}
          clear
          placeholder="请输入吨位"
          className="weight-input"
          type="number"
          />
        <InputItem
          {...getFieldProps('cubic', {
            initialValue: cubic===0?'':cubic,
          })}
          clear
          placeholder="请输入方量"
          className="weight-input"
          type="number"
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

 // 修改吨位放量
  handleSubmit() {
    const uuid = localStorage.getItem('uuid');
    const { form } = this.props;

    form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

      if (values.weight === '') {
        Toast.info('请填写吨位');
        return;
      }
      if (values.cubic === '') {
        Toast.info('请填写方量');
        return;
      }
      if (uuid === undefined) {
        return;
      }
      const data = {
        cubic: values.cubic.toString(),
        weight: values.weight.toString(),
        carAxis: values.carAxis.toString(),
        type: 'DRIVER_CAR_WEIGHT',
      };
      const service = 'SERVICE_DRIVER';
      this.httpRequest(data, service, () => {
        const driverInfo = JSON.parse(localStorage.getItem('driverInfo'));
        driverInfo.weight = values.weight.toString();
        driverInfo.cubic = values.cubic.toString();
        driverInfo.carAxis = values.carAxis.toString();
        localStorage.setItem('driverInfo', JSON.stringify(driverInfo));
        this.context.router.push('/person');
      }, (returnData) => {
        Toast.fail(returnData.msg);
      });
    });
  }

  componentDidMount(){
    // document.title('车辆载重');
  }
}


Weight.contextTypes = {
  router: React.PropTypes.object,
};

const _Weight = createForm()(Weight);
export default _Weight;
