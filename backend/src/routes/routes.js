const { Draw } = require("./draw");
const { Login } = require("./login");
const { Chat } = require("./chat");
const { Logout } = require("./logout");
const { Game } = require("./game-control");
const { actualPlayer } = require("../__mock__/data-mock");

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

function controlGame(data, ws, wss, WebSocket) {
  const gameControl = new Game(data, ws, wss, WebSocket);

  if (data.action === "start") {
    gameControl.getFirstPlayer();
  }

  if (data.action === "get-next") {
    gameControl.getNextToPlay(data.id);
  }

  if (data.action === "add-score") {
    gameControl.setScore({ id: data.id });
  }

  if (data.action === "get-winner") {
    gameControl.getWinner();
  }
}

module.exports = {
  draw: drawBroadcast,
  chat: chatBroadcast,
  login: userLogin,
  logout: userLogout,
  control_game: controlGame,
}; // path: function
