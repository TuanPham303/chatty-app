import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props){
    super(props);
  }

  handleKeyDown = (e) => {
    if(e.key === "Enter"){
      e.preventDefault();
      console.log(e.target);
      this.props.onMessage(e.target.value);
      e.target.value = '';
    }
  }

  handleUserName = (e) => {
    // console.log('keydown:',e.target.value)
    // if(e.key === 'Enter'){
    //   e.preventDefault();
    //   console.log(e.target);
    this.props.setCurrentUser(e.target.value)
    
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder='Name' onChange={this.handleUserName} value={this.props.currentUser.name} disabled={!this.props.connected} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={this.handleKeyDown} disabled={!this.props.connected} />
      </footer>
    );
  }

}
export default ChatBar;