import Draw from "./draw.js";
import Login from "./login.js";
import Chat from "./chat.js";

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

export default { draw: drawBroadcast, chat: chatBroadcast, login: userLogin }; // path: function
