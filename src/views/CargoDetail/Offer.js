import React from 'react';
import { Modal, Button, InputItem, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { postRequest } from '../../utils/web';

class Offer extends React.Component {
  constructor(props) {
    super(props);

    const { cargoInfo } = this.props;
    this.state = {
      unitType: cargoInfo.unitType,
      isRequesting: false,
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOffer = this.handleOffer.bind(this);
    // 单价变化
    this.handleUnitChange = this.handleUnitChange.bind(this);
    // 总价变化
    this.handleTotalPriceChange = this.handleTotalPriceChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.httpRequest = postRequest.bind(this);
  }

  handleClose() {
    const { onClose } = this.props;
    onClose();
  }

  handleOffer() {
    const uuid = localStorage.getItem('uuid');
    if (uuid === undefined || this.state.isRequesting) {
      return;
    }
    this.setState({
      isRequesting: true,
    });
    const { unitType } = this.state;
    const { cargoInfo, form } = this.props;
    const values = form.getFieldsValue();

    const data = {
      cargoId: `${cargoInfo.cargoId}`,
      quantity: `${values.quantity}`,
      unitPrice: `${values.unitPrice}`,
      unitType: `${unitType}`,
      type: 'CARGO_APPLY',
    };
    const serviceName = 'SERVICE_CARGO';

    this.httpRequest(data, serviceName, (returnData) => {
      Toast.success(returnData.msg);
      this.props.onClose();
      this.props.onHidden();
    }, (returnData) => {
      Toast.fail(returnData.msg);
      this.setState({
        isRequesting: false,
      });
    });
  }

  handleUnitChange(val) {
    const { form } = this.props;
    const { quantity } = form.getFieldsValue();
    if (!quantity || !val) {
      return form.setFieldsValue({
        totalPrice: '',
      });
    }
    return form.setFieldsValue({
      totalPrice: quantity * Number.parseInt(val, 10),
    });
  }

  handleQuantityChange() {
    const { form } = this.props;
    return form.setFieldsValue({
      totalPrice: '',
      unitPrice: '',
    });
  }

  handleTotalPriceChange(val) {
    const { form } = this.props;
    const { quantity } = form.getFieldsValue();
    if (!quantity || !val) {
      return form.setFieldsValue({
        unitPrice: '',
      });
    }
    return form.setFieldsValue({
      unitPrice: (Number.parseInt(val, 10) / quantity).toFixed(2),
    });
  }
  render() {
    const { unitType } = this.state;
    const unitTypeStr = unitType === 1 ? '吨' : '方';
    const { visible, cargoInfo } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Modal
        visible={visible}
        className="cargo-offer-modal"
        style={{
          width: 'auto',
          height: 'auto',
        }}
        >
        <div className="cargo-offer">
          <div className="text">
            货物数量: {cargoInfo.weight}吨,<span className="divider"></span> {cargoInfo.cubic}立方
          </div>
          <div className="text">
            货主报价: {cargoInfo.unitPrice}元/{cargoInfo.unitType === 1 ? '吨' : '方'}
            <span className="divider"></span>整车{cargoInfo.totalPrice}元
          </div>
          <div className="offer">
              <div className="form-item first">
                <InputItem
                  {...getFieldProps('quantity', {
                    initialValue: '',
                    onChange: this.handleQuantityChange,
                  })}
                  type="number"
                  extra={unitTypeStr}
                  >装载数量</InputItem>
              </div>
              <div className="form-item price-wrapper">
                <InputItem
                  {...getFieldProps('unitPrice', {
                    initialValue: '',
                    onChange: this.handleUnitChange,
                  })}
                  type="number"
                  extra={`元/${unitTypeStr}`}
                  className="price1"
                  >我的报价</InputItem>
                <InputItem
                  {...getFieldProps('totalPrice', {
                    initialValue: '',
                    onChange: this.handleTotalPriceChange,
                  })}
                  type="number"
                  extra="元"
                  className="price2"
                  ></InputItem>
              </div>
            </div>
            <Button inline className="cancel-btn" onClick={this.handleClose}>取消</Button>
            <Button inline className="confirm-btn" onClick={this.handleOffer}>确定</Button>
        </div>
      </Modal>
    );
  }
}
const _Offer = createForm()(Offer);
export default _Offer;
