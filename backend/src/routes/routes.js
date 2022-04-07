const { Draw } = require("./draw");
const { Login } = require("./login");
const { Chat } = require("./chat");

function drawBroadcast(data, ws, wss, WebSocket) {
  const chatDraw = new Draw(data, ws, wss, WebSocket);
  chatDraw.sendDraw();
}

function chatBroadcast(data, ws, wss, WebSocket) {
  const chatMessage = new Chat(data, ws, wss, WebSocket);
  chatMessage.sendMessage();
}

function userLogin(_data, ws, wss, WebSocket) {
  const loginUser = new Login(_data, ws, wss, WebSocket);
  loginUser.login();
}

module.exports = { draw: drawBroadcast, chat: chatBroadcast, login: userLogin }; // path: function
