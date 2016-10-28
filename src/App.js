import React from 'react';
import './style/app';
import BindView from './views/Register/bindView';


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        {this.props.children || 'Home' }
      </div>
    );
  }
  
}

App.contextTypes = {
  router: React.PropTypes.object,
};

export default App;
