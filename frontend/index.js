import "./style.css";
import { Paint } from "./src/scripts/paint";
import { CanvasControl } from "./src/scripts/canvas";
import { wss as ws } from "./src/scripts/home";
class WS {
  constructor() {
    this.ws = new WebSocket("wss://localhost:5050");
    this.username = "";
    this.channel = "";
    this.idUser = "";
    this.messages = [];
  }

  setUsername(_username) {
    this.username = _username;
  }

  setChannel(_channel) {
    this.channel = _channel;
  }

  setUserId(_id) {
    this.idUser = _id;
  }

  sendMessage(_message) {}

  getMessage() {}
}

const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const context = canvas.getContext("2d");
const text = document.querySelector(".show-answer");
const sendBtn = document.querySelector(".answer-button");
const messageBox = document.querySelector(".answer-input");

// User Mock
const user = "Player 1";

const paint = new Paint();
const board = new CanvasControl(canvas);

/* WS */
// const ws = new WebSocket("wss://localhost:5050");

ws.onmessage = (ms) => {
  const submitedData = JSON.parse(ms.data);

  if (submitedData.path === "/chat") {
    return show(submitedData.msg.text);
  }

  if (submitedData.drawing.action === "clear") {
    return board.clearContext();
  }

  board.strokeStyle(submitedData.drawing.color);
  board.setLineWidth(submitedData.drawing.lineWidth);
  board.setLineCap("round");

  paint.activeCursor();
  board.setLineTO(submitedData.drawing.x, submitedData.drawing.y);
};

/* DRAW */
toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    console.log("clear");
    board.clearContext();

    ws.send(
      JSON.stringify({
        path: "draw",
        action: "clear",
        lineWidth: paint.getLineWidth(),
        x: 0,
        y: 0,
        color: paint.getColor(),
        user,
        channel: "general",
      })
    );
  }
});

toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    paint.setColor(e.target.value);
    board.setStrokeStyle(target.value);
  }

  if (e.target.id === "lineWidth") {
    paint.setWidth(e.target.value);
  }
});

const draw = (e) => {
  if (!paint.getState()) {
    return;
  }

  console.log(`${user} está desenhando`);

  paint.setBeforeCursor();
  paint.setMoveCursor(e.clientX - board.getCanvasOffsetX(), e.clientY);

  ws.send(
    JSON.stringify({
      path: "draw",
      action: "drawing",
      lineWidth: paint.getLineWidth(),
      x: paint.getPos().x,
      y: paint.getPos().y,
      color: paint.getColor(),
      user,
      channel: "general",
    })
  );

  board.setLineWidth(paint.lineWidth);
  board.setLineCap("round");

  context.lineTo(paint.pos.x, paint.pos.y);
  context.stroke();
};

canvas.addEventListener("mousedown", (e) => {
  paint.activeCursor();
  paint.setBeforeCursor();
});

canvas.addEventListener("mouseup", (e) => {
  paint.disabledCursor();
  context.stroke();
  context.beginPath();
});

canvas.addEventListener("mousemove", draw);

function showMessage(message) {
  text.innerHTML += `<p id="my">Eu: ${message}<p/>`;
  text.scrollTop = text.scrollHeight;
  messageBox.value = "";
}

function show(message) {
  text.innerHTML += `<p id="you">Jogador: ${message}<p/>`;
  text.scrollTop = text.scrollHeight;
  messageBox.value = "";
}

sendBtn.onclick = function () {
  if (!ws) {
    showMessage("No websocket connection :("); // tentar conectar novamente.
    return;
  }
  let userObj = {
    nick: "",
    message: messageBox.value,
  };

  let user = `${userObj.message}`;

  ws.send(
    JSON.stringify({
      path: "chat",
      text: user,
      action: "chat",
      channel: "general",
    })
  );
  showMessage(messageBox.value);
};
