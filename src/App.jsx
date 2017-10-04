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

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");

    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
      this.setState({ connected: true });
    };

    this.socket.onclose = () => {
      this.setState({ connected: false });
    }
  }

  onMessage = (message) => {
    this.setState({
      messages: this.state.messages.concat([{
        username: this.state.currentUser.name,
        content: message
      }])
    })
    this.sendMessage(message);
  }

  sendMessage(message) {
    this.socket.send(JSON.stringify({ username: this.state.currentUser.name, message }));
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty {this.state.connected ? "Connected" : "Disconnected" }</a>
        </nav>
        <MessageList messages = { this.state.messages } />
        <ChatBar currentUser={this.state.currentUser} onMessage={this.onMessage} connected={this.state.connected} />
        
      </div>
    );
  }
}
export default App;


      

                