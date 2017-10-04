import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: {
        name: ""
      },
      messages: []
    };
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");

    this.socket.addEventListener('message', message => {
      this.setState({
        messages: this.state.messages.concat([{
          username: this.state.currentUser.name,
          content: JSON.parse(message.data).content,
          id: JSON.parse(message.data).id
        }])
      })
    })

    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
      this.setState({ connected: true });
    };

    this.socket.onclose = () => {
      this.setState({ connected: false });
    }
  }

  onMessage = (message) => {
    this.sendMessage(message);
  }

  sendMessage(message) {
    this.socket.send(JSON.stringify({ 
      username: this.state.currentUser.name, 
      content: message
    }));
  }

  setCurrentUser = (currentUserName) => {
    this.setState({
      currentUser: {
        name: currentUserName
      }
    })
  }

  render() {
    console.log(this.state.currentUser.name);
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty {this.state.connected ? "Connected" : "Disconnected" }</a>
        </nav>
        <MessageList messages = { this.state.messages } />
        <ChatBar currentUser={this.state.currentUser} onMessage={this.onMessage} connected={this.state.connected} setCurrentUser={this.setCurrentUser} />        
      </div>
    );
  }
}
export default App;


      

                