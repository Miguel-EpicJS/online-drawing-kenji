const { Draw } = require("./draw");
const { Login } = require("./login");
const { Chat } = require("./chat");
const { Logout } = require("./logout");

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

function userLogout(data, ws, wss, WebSocket) {
  const logoutUser = new Logout(data, ws, wss, WebSocket);
  logoutUser.logout();
}

module.exports = { draw: drawBroadcast, chat: chatBroadcast, login: userLogin, logout: userLogout }; // path: function
