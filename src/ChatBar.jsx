import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props){
    super(props);
  }

  handleKeyDown = (e) => {
    if(e.key === "Enter"){
      e.preventDefault();
      console.log(this.props.currentUser.name);
      this.props.onMessage(e.target.value);
      e.target.value = '';
    }
  }

  handleUserName = (e) => {
    this.props.setCurrentUser(e.target.value);
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder='Name' onBlur={this.handleUserName} disabled={!this.props.connected} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={this.handleKeyDown} disabled={!this.props.connected} />
      </footer>
    );
  }

}
export default ChatBar;