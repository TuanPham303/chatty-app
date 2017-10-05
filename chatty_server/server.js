const express = require('express');
const SocketServer = require('ws');
const uuid = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer.Server({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
function broadcast(data){
  wss.clients.forEach( client => {
    if (client.readyState === SocketServer.OPEN){
      client.send(JSON.stringify(data));
    }
  })
}

function handleMessage(message){
  message = JSON.parse(message);
  if(message.type === 'postMessage'){
    message.id = uuid();
    message.type = "incomingMessage";
  }
  if(message.type === 'postNotification' && message.username !== ''){
    message.type = "incomingNotification";
    message.id = uuid();
  }
  
  broadcast(message);
}

function handleConnection(ws){
  console.log('Client connected')
  ws.on('message', handleMessage);
  const onlineUser = wss._server._connections;
  wss.clients.forEach( client => {
    if (client.readyState === SocketServer.OPEN){
      client.send(JSON.stringify(onlineUser));
    }
  })
  ws.on('close', () => {
    wss.clients.forEach( client => {
      if (client.readyState === SocketServer.OPEN){
        client.send(JSON.stringify(onlineUser));
      }
    })
    console.log('Client disconnected')
  });
}

wss.on('connection', handleConnection);
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.



