import React, { Component } from 'react';
import { WingBlank, Toast, Button, Picker, List } from 'antd-mobile';
import { createForm } from 'rc-form';
import params from '../../utils/params';
import { postRequest } from '../../utils/web';

const _carType = params.carType;
const _carLength = params.carLength;

class CarInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: _carType,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.httpRequest = postRequest.bind(this);
  }

  render() {
    const { carLeng, carType } = this.props.driverInfo;
    const carInfo = [carType, carLeng];
    const { getFieldProps } = this.props.form;
    return (
      <div className="page edit-info">
        <List>
          <Picker
            {...getFieldProps('car', {
              initialValue: carInfo,
            })}
            className="info-picker"
            labelNumber={2}
            cols={2}
            extra="请选择车长车型"
            data={this.state.data}
            >
            <List.Item className="underline">
            </List.Item>
          </Picker>
        </List>

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
    const car = this.props.form.getFieldProps('car').value;
    let cType = car[0];
    const cLength = car[1];
    const isOther = cType === 100;

    if (car === undefined || car.length === 0) {
      Toast.fail('请选择车长车型');
      return;
    }
    if (uuid === undefined) {
      Toast.fail('请登陆');
      return;
    }

    if (cType === 100) {
      cType = 0;
    }
    const data = {
        carType: `${cType}`,
        carLength: `${cLength}`,
        type: 'DRIVER_CAR',
    };
    const  service = 'SERVICE_DRIVER';
    this.httpRequest(data,service,(returnData)=>{
      const driverInfo = JSON.parse(localStorage.getItem('driverInfo'));
      driverInfo.carLeng = cLength;
      driverInfo.carLengthStr = _carLength.find(c => c.value === cLength).label;
      driverInfo.carType = isOther ? 100 : cType;
      driverInfo.carTypeStr = _carType.find(c => c.value === (isOther ? 100 : cType)).label;
      localStorage.setItem('driverInfo', JSON.stringify(driverInfo));

      this.context.router.push('/person');

    },(returnData)=>{
        Toast.fail(returnData.msg);

    });
  }
}

CarInfo.contextTypes = {
  router: React.PropTypes.object,
};


const _CarInfo = createForm()(CarInfo);
export default _CarInfo;
