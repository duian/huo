import React from 'react';
import request from 'superagent-bluebird-promise';
import url from '../../utils/url';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'LEAST_TIME',
    };

    this.handleActive = this.handleActive.bind(this);
    this.fetchPath = this.fetchPath.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  handleActive(type, e) {
    e.preventDefault();
    if (type === this.state.type) {
      return null;
    }
    this.setState({ active: type });
    return this.fetchPath(this.state.center, type);
  }

  renderMenu() {
    const { active } = this.state;
    if (active === 'LEAST_TIME') {
      return (
        <div className="map-menu">
          <a href="#" onClick={this.handleActive.bind(this, 'LEAST_TIME')} className="active">
            高速优先
          </a>
          <a href="#" onClick={this.handleActive.bind(this, 'LEAST_FEE')}>
            国道/省道
          </a>
        </div>
      );
    }
    return (
      <div className="map-menu">
        <a href="#" onClick={this.handleActive.bind(this, 'LEAST_TIME')}>高速优先</a>
        <a href="#" onClick={this.handleActive.bind(this, 'LEAST_FEE')} className="active">国道/省道</a>
      </div>
    );
  }

  fetchPath(center, policy) {
    const { cargoInfo } = this.props;
    const { startCityStr, arrivalCityStr } = cargoInfo;
    const map = new AMap.Map('container');
    map.setZoom(10);
    map.setCenter(center);
    AMap.service(['AMap.Driving'], () => {
      const driving = new AMap.Driving({
        map,
        // panel: 'container',
        policy,
      });
      driving.search([
        { city: startCityStr },
        { city: arrivalCityStr },
      ], (status, result) => {
        console.log('st', status, result);
      });
    });
  }

  componentDidMount() {
    // document.title('装卸货路线');
    const { cargoInfo } = this.props;
    if (cargoInfo) {
      // arrivalCityStr,
      const { startCityStr } = cargoInfo;
      request.get('http://restapi.amap.com/v3/geocode/geo')
      .query({
        key: url.mapKey,
        address: startCityStr,
      })
      .then((res) => {
        const data = res.body;
        const center = data.geocodes[0].location.split(',');
        this.setState({ center });
        this.fetchPath(center, 'LEAST_TIME');
        return null;
      })
      .catch(err => {
        const errInfo = err.body;
        console.log('err', errInfo);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('next', nextProps);
  }
  render() {
    return (
      <div className="page map-detail">
        <div>
          {this.renderMenu()}
          <div id="container" style={{
            witdh: '100%',
            height: '600px',
          }}></div>
        </div>
      </div>
    );
  }
}

export default Map;
