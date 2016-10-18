import React from 'react';
import './style/app';
import BindView from './views/Register/bindView';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bindViewVisiable:true,
    };
    this.renderBindView = this.renderBindView.bind(this);
    this.handleBindClose = this.handleBindClose.bind(this);
    console.log(this);
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
    console.log(this);
    this.setState({
      bindViewVisiable:false,
    });
  }

  renderBindView(){

    return(
      <BindView
        onSuccess = {this.handleHiddenBtn}
        onClose = {this.handleBindClose}
      />
    );
  }

}

App.contextTypes = {
  router: React.PropTypes.object,
};

export default App;
