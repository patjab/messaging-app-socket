// 07:07:00 - 07:26:00

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({port: 9090})

let clients = []

wss.on('connection', (connection) => {

  clients.push(connection)
  broadcast({username: "admin", message: "A USER HAS JOINED THE ROOM"})

  connection.on('message', (message) => {
    const data = JSON.parse(message)
    broadcast(data)
  })

})

cleanUp()

function sendTo(connection, message) {
  connection.send(JSON.stringify(message))
}

function broadcast(message) {
  clients.forEach(client => sendTo(client, message))
}

function cleanUp() {
  setInterval(() => {
    let oldClientSize = clients.length
    setTimeout(() => {
      clients = clients.filter(client => client.readyState !== client.CLOSED)
      if (oldClientSize > clients.length) {
        broadcast({username: "admin", message: "A USER HAS LEFT THE ROOM"})
      }
    }, 500)
  }, 3000)
}
