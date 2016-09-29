import React, { Component } from 'react';
import { ListView } from 'antd-mobile';
import { Link } from 'react-router';
import { postRequest } from '../../utils/web';
import './_cargo';

const NUM_ROWS = 20;
class Cargo extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      currPage: 1,
      cargoList: [],
      dataSource: ds,
      isLoading: false,
    };

    this.requestForCargo = this.requestForCargo.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.httpRequest = postRequest.bind(this);
  }

  onEndReached() {
    const { currPage, totalPage, isLoading } = this.state;

    if (currPage >= totalPage || isLoading) {
      // 当页数大于等于总页数或者数据正在加载
      return;
    }
    this.setState({ isLoading: true });
    this.requestForCargo(this.state.currPage + 1);
  }

  componentDidMount() {
    this.requestForCargo(this.state.currPage);
  }

  requestForCargo(page) {
    const uuid = localStorage.getItem('uuid');
    if (uuid === undefined) {
      return;
    }
    const data = {
      currPage: page.toString(),
      type: 'CARGO_LIST_COMMEN',
    };
    const serviceName = 'SERVICE_CARGO';
    this.httpRequest(data, serviceName, (returnData) => {
      this.setState({
        currPage: returnData.result.currPage,
        totalPage: returnData.result.totalPage,
        cargoList: [...this.state.cargoList, ...returnData.result.objectArray],
        dataSource: this.state.dataSource
        .cloneWithRows([...this.state.cargoList, ...returnData.result.objectArray]),
        isLoading: false,
      });
    }, (returnData) => {
      console.log('err', returnData);
    });
  }

  render() {
    const { cargoList, currPage } = this.state;
    let index = cargoList.length;
    let row;
    if (index <= 0) {
      row = () => <div></div>;
    } else {
      row = (rowData, sectionID, rowID) => {
        // if (index === 0) {
        //   return null;
        // }
        const cargoIndex = cargoList.length - (index--) + (NUM_ROWS * (currPage - 1));
        const obj = cargoList[cargoIndex];
        return (
          <Link to={`/cargo/${obj.cargoId}`}>
            <div key={rowID}
              style={{
                backgroundColor: 'white',
              }}
            />
            <div className="panel">
                <div className="panel-info">
                  <div>{obj.sendTimeStr}</div>
                  <div>{obj.startCityStr}→{obj.arrivalCityStr}</div>
                </div>
                <div style={{ display: 'inline-block' }}>
                  <p>
                    {obj.cargoName}
                    <span className="span-divider"></span>
                    {obj.weight}吨/{obj.cubic}立方
                  </p>
                  <p>
                    {obj.carTypeStr}
                    <span className="span-divider"></span>
                    {obj.carLengthStr}
                  </p>
                </div>
                <div className="trapezoid">{obj.statusStr}</div>
            </div>
          </Link>
        );
      };
    }

    return (<div className="cargo">
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={() => <span>header</span>}
        renderFooter={() => <div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? '加载中...' : '加载完毕'}
        </div>}
        renderRow={row}
        pageSize={4}
        scrollRenderAheadDistance={500}
        scrollEventThrottle={20}
        useBodyScroll
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
      <a className="help" href="tel:4006685495">联系客服</a>
    </div>);
  }
}

export default Cargo;
