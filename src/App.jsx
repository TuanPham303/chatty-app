import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: {
        name: "Bob"
      },
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    };
  }

  onMessage = (message) => {
    this.setState({
      messages: this.state.messages.concat([{
        username: this.state.currentUser.name,
        content: message
      }])
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages = { this.state.messages } />
        <ChatBar currentUser={this.state.currentUser} onMessage={this.onMessage} />
        
      </div>
    );
  }
}
export default App;


      

                