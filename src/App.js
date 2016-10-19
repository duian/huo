import React from 'react';
import './style/app';
import BindView from './views/Register/bindView';


class App extends React.Component {
  constructor(props) {
    super(props);

    const uuid = localStorage.getItem('uuid');
    const bindViewVisiable = uuid == null;
    this.state = {
      bindViewVisiable,
    };
    this.renderBindView = this.renderBindView.bind(this);
    this.handleBindClose = this.handleBindClose.bind(this);
  }
  
  render() {
    const { bindViewVisiable } = this.state;
    return (
      <div>
        {this.props.children || 'Home' }
        {bindViewVisiable == true ? this.renderBindView() : null }
      </div>
    );
  }
  
  handleBindClose(){
    this.setState({
      bindViewVisiable:false,
    });
  }

  renderBindView(){

    return(
      <BindView
        onSuccess = {this.handleBindClose}
        onClose = {this.handleBindClose}
      />
    );
  }

}

App.contextTypes = {
  router: React.PropTypes.object,
};

export default App;
