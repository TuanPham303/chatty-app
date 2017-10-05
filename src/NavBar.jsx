import React, {Component} from 'react';

class NavBar extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty {this.props.connected ? "Connected" : "Disconnected" } --  {this.props.onlineUser} online</a>
      </nav>
    )
  }
}
export default NavBar;