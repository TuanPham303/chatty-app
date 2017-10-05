import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: {
        name: "",
        color: ""
      },
      messages: [],
      onlineUser: '',
    };
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");

    this.socket.addEventListener('message', message => {
      const data = JSON.parse(message.data);
      switch(data.type){
        case 'incomingMessage':
          this.setState({
            messages: this.state.messages.concat([{
              username: data.username,
              content: data.content,
              id: data.id,
              color: data.color
            }])
          })
        break;
        case 'incomingNotification':
          this.setState({
            messages: this.state.messages.concat([{
              username: data.content,
              id: data.id,
              color: data.color
            }])
          })
        break;
        case 'onlineUserCount':
          this.setState({
            onlineUser: data.count
          })
        break;
        case 'userNameColor':
          this.setState({
            currentUser: {
              name: this.state.currentUser.name,
              color: data.color
            }
          })
        break;
      }
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

  sendMessage = (message) => {
    this.socket.send(JSON.stringify({ 
      type: "postMessage",
      username: this.state.currentUser.name, 
      content: message,
      color: this.state.currentUser.color
    }));
  }

  setCurrentUser = (currentUserName) => {
    this.setState({
      currentUser: {
        name: currentUserName,
        color: this.state.currentUser.color
      }
    })
    if(this.state.currentUser.name !== ''){
      this.socket.send(JSON.stringify({
        type: "postNotification",
        content: `${this.state.currentUser.name} has changed their name to ${currentUserName}`,
        color: this.state.currentUser.color
      }))
    } else {
      this.socket.send(JSON.stringify({
        type: "postNotification",
        content: `Anonymous has joined the room and changed their name to ${currentUserName}`,
        color: this.state.currentUser.color
      }))
    }
    
    
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty {this.state.connected ? "Connected" : "Disconnected" } --  {this.state.onlineUser} online</a>
        </nav>
        <MessageList 
          messages={this.state.messages} 
          currentUser={this.state.currentUser} 
        />
        <ChatBar 
          color={this.state.currentUser.color}
          currentUser={this.state.currentUser} 
          onMessage={this.onMessage} 
          connected={this.state.connected} 
          setCurrentUser={this.setCurrentUser} 
        />        
      </div>
    );
  }
}
export default App;


      

                