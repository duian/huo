import React, { Component } from 'react';
import { InputItem, WingBlank, Toast, Button, Popup, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import params from '../../utils/params';
import { postRequest } from '../../utils/web';
import _ from 'lodash';

class CarNumber extends Component {
  constructor(props) {
    super(props);
    const { carNum } = this.props.driverInfo;
    let tag;
    if (carNum !== '') {
      tag = carNum ? carNum.slice(0, 1) : '川';
    }
    const tags = params.tags.map((t) => {
      if (t.name === tag) {
        t.active = 'active';
      }
      return t;
    });
    this.state = {
      tag,
      tags,
    };
    this.showTags = this.showTags.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelectTag = this.handleSelectTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.httpRequest = postRequest.bind(this);
  }

  handleToggle(selectTag, index) {
    if (selectTag.active) return null;
    const { tags } = this.state;
    const _tags = tags.map(tag => {
      tag.active = null;
      return tag;
    })
    .map(tag => {
      if (tag.name === selectTag.name) {
        tag.active = 'active';
      }
      return tag;
    });
    const $buttons = [].slice.call(document.querySelectorAll('.flex-button-container button'));
    $buttons.forEach((button) => {
      button.classList.remove('active');
    });
    $buttons[index].classList.add('active');
    this.setState({ tags: _tags });
    return null;
  }

  handleSelectTag() {
    const { tags } = this.state;
    const _tag = _.find(tags, (tag) => tag.active);
    this.setState({ tag: _tag.name });
    // Popup.hide();
    this.popup.hide();
  }

  showTags() {
    const { tags } = this.state;
    this.popup = Popup.newInstance();
    this.popup.show(
      <div className="edit-tag">
        <Flex wrap="wrap" className="flex-button-container">
          {tags.map((tag, index) => (<Button
            className={tag.active || ''}
            onClick={this.handleToggle.bind(this, tag, index)} key={index}>{tag.name}
          </Button>))}
        </Flex>
        <Button
          className="select-tag"
          onClick={this.handleSelectTag}>完成</Button>
      </div>
    , { animationType: 'slide-up' }
    );
  }

  componentWillReceiveProps(nextProps) {
    const { carNum } = nextProps.driverInfo;
    // console.log(nextProps.driverInfo);
    if (carNum !== '') {
      this.setState({ tag: carNum.slice(0, 1) });
    }
  }

  componentWillUnmount() {
    if (this.popup) {
      this.popup.hide();
    }
  }

  render() {
    const { tag } = this.state;
    const { carNum } = this.props.driverInfo;
    let initCarNum = '';
    if (carNum !== '') {
      initCarNum = carNum ? carNum.slice(1) : '';
    }
    const { getFieldProps } = this.props.form;
    return (
      <div className="page edit-number">
        <div className="car-number-tag-wrapper">
            <div className="car-number-tag" onClick={this.showTags}>
              {tag}<span className="caret"></span>
            </div>
        </div>
        <InputItem
          {...getFieldProps('carNum', {
            initialValue: initCarNum,
          })}
          clear
          placeholder="请输入车牌号"
          className="number-input"
          maxLength={6}
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
    const carNum = this.props.form.getFieldProps('carNum').value;
    const { tag } = this.state;
    const _carNum = `${tag}${carNum}`;
    if (carNum === '') {
      Toast.info('请填写车牌号');
      return;
    }
    if (uuid === undefined) {
      Toast.info('请登陆');
      return;
    }
    const data = {
      carNum: _carNum,
      type: 'DRIVER_CAR_NUM',
    };
    const service = 'SERVICE_DRIVER';

    this.httpRequest(data, service, () => {
      const driverInfo = JSON.parse(localStorage.getItem('driverInfo'));
      driverInfo.carNum = _carNum;
      localStorage.setItem('driverInfo', JSON.stringify(driverInfo));
      this.context.router.push('/person');
    }, (returnData) => {
      Toast.fail(returnData.msg);
    });
  }

  componentDidMount() {
    document.title = '车牌号';
  }
}
CarNumber.contextTypes = {
  router: React.PropTypes.object,
};
const _CarNumber = createForm()(CarNumber);
export default _CarNumber;
