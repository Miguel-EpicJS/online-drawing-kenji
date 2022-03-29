//------------- HTTPS ----------------

// Simple http server for test ws, need to be changed

const http = require("http");
const WebSocket = require("ws");
const wsServer = require("./src");


const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(index);
});
server.on("error", (err) => console.error(err));

const wss = new WebSocket.Server({server, path: "/"});

wsServer(wss, WebSocket);

module.exports = { server, wss }