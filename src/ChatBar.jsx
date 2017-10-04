import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props){
    super(props);
  }

  handleKeyDown = (e) => {
    if(e.key === "Enter"){
      e.preventDefault();
      this.props.onMessage(e.target.value);
      e.target.value = '';
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder={ this.props.currentUser.name } />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={this.handleKeyDown} />
      </footer>
    );
  }

}
export default ChatBar;