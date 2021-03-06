import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import NavBar from './NavBar.jsx'

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
              color: data.color,
              imgURL: data.imgURL
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
    const imgEnding = ['.jpg', '.png', '.gif'];
    let imgURL = '';
    const mesArray = message.split(' ');
    mesArray.forEach((mess) => {
      if(imgEnding.indexOf(mess.slice(-4)) !== -1 ){
        imgURL = mess;
        mesArray.splice(mesArray.indexOf(mess), 1);
      }
    })
    const messToSend = {
      content: mesArray.join(' '),
      imgURL: imgURL
    }
    console.log(messToSend);
    this.sendMessage(messToSend);
  }

  sendMessage = (message) => {
    this.socket.send(JSON.stringify({ 
      type: "postMessage",
      username: this.state.currentUser.name, 
      content: message.content,
      color: this.state.currentUser.color,
      imgURL: message.imgURL
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
        content: `Anonymous joined the room and changed their name to ${currentUserName}`,
        color: this.state.currentUser.color
      }))
    }
    
    
  }

  render() {
    return (
      <div>
        <NavBar  
          connected={this.state.connected}
          onlineUser={this.state.onlineUser}
        />
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


      

                