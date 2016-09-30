import React from 'react';
import { Router, IndexRoute, Route, hashHistory } from 'react-router';
import App from './App';
import Login from './views/Login';
import Register from './views/Register';
import Person from './views/Person';
import EditName from './views/Person/Name';
import EditImg from './views/Person/Img';
import EditNumber from './views/Person/CarNumber';
import EditInfo from './views/Person/CarInfo';
import EditWeight from './views/Person/Weight';
import EditTag from './views/Person/Tag';
import Cargo from './views/Cargo';
import CargoDetail from './views/CargoDetail';
import MyCargo from './views/MyCargo';
import MyCargoDetail from './views/MyCargoDetail';
import MyCargoSuccess from './views/MyCargoDetail/OfferSuccess';
import MyCargoMap from './views/MyCargoDetail/Map';


function redirectToLogin(nextState, replace) {
  if (localStorage.getItem('uuid') === null) {
    replace(`/login?from=${nextState.location.pathname.substring(1)}`);
  }
}

function redirectToCargo(nextState, replace) {
  if (localStorage.getItem('uuid') !== null) {
    replace('/cargo');
  } else {
    if (nextState.location.search.indexOf('?from=') === -1) {
      replace(`${nextState.location.pathname}?from=cargo`);
    }
  }
}

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const re = new RegExp('[&,?]code=([^//&]*)', 'i');
    const weChatCodeArr = re.exec(location.href);
    let weChatCode;
    if (weChatCodeArr !== null) {
      weChatCode = weChatCodeArr[1];
      localStorage.setItem('weChatCode', weChatCode);
    }
    return (
      <Router history={hashHistory}>
        <Route path="login" component={Login} onEnter={redirectToCargo}/>
        <Route path="register" component={Register} onEnter={redirectToCargo}/>
        <Route path="/" component={App}>
          <IndexRoute component={Cargo}/>
          <Route path="person" component={Person} onEnter={redirectToLogin}>
            <Route path="name" component={EditName}/>
            <Route path="car-number" component={EditNumber}/>
            <Route path="car-info" component={EditInfo}/>
            <Route path="car-weight" component={EditWeight}/>
            <Route path="car-tag" component={EditTag}/>
            <Route path="car-img" component={EditImg}/>
          </Route>
          <Route path="cargo" component={Cargo}/>
          <Route path="cargo/:id" component={CargoDetail}/>
          <Route path="my-cargo" component={MyCargo} onEnter={redirectToLogin}/>
          <Route path="my-cargo/:id" component={MyCargoDetail} onEnter={redirectToLogin}>
            <Route path="success" component={MyCargoSuccess}/>
            <Route path="map" component={MyCargoMap}/>
          </Route>
        </Route>
      </Router>
    );
  }
}

export default Routes;
