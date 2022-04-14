import "./style.css";
import { Paint } from "./src/scripts/paint";
import { CanvasControl } from "./src/scripts/canvas";
import { nameInput, renderedLogin, wss as ws } from "./src/scripts/home";
import { findUser } from "./src/utils/find-user";

const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const context = canvas.getContext("2d");
const text = document.querySelector(".show-answer");
const sendBtn = document.querySelector(".answer-button");
const messageBox = document.querySelector(".answer-input");
const playersList = document.getElementById("players-list");
const startBtn = document.getElementById("start");

// User Mock
let listPlayers = [];

const paint = new Paint();
const board = new CanvasControl(canvas);

ws.onmessage = (ms) => {
  const submitedData = JSON.parse(ms.data);

  if(submitedData.action === "get-first"){
    document.getElementById(submitedData.msg.text.id).classList.add("playing")
  }

  if (submitedData.action === "entry") {
    listPlayers = submitedData.chatList;

    playersList.innerHTML = "";

    listPlayers.map(
      (player) =>
        (playersList.innerHTML += `<p id="${player.id}">${player.name}</p>`)
    );
  }

  if (submitedData.path === "/chat") {
    show(submitedData.msg.text);
  }

  if (submitedData.path === "/draw") {
    board.setStrokeStyle(submitedData.drawing.color);
    board.setLineWidth(submitedData.drawing.lineWidth);
    board.setLineCap("round");

    board.simpleDraw(submitedData.drawing.x, submitedData.drawing.y);

    if (submitedData.drawing.action === "clear") {
      board.clearContext();
    }

    paint.activeCursor(); /* 
        board.setLineTO(submitedData.drawing.x, submitedData.drawing.y);    */
  }

  if (submitedData.path === "/login") {

    function setMessageName(text) {
      const inputMsg = document.getElementById("message");
      inputMsg.innerHTML = text;
      setTimeout(() => {
        inputMsg.innerHTML = "";
      }, 2000);
    }

    if (submitedData.msg.text === "invalid name") {
      submitedData.ok = false;
      setMessageName("O nome de usuário já existe, insira outro.");
    }

    if (submitedData.ok) {
      localStorage.setItem("username", nameInput.value);
      listPlayers = submitedData.chatList;

      playersList.innerHTML = "";

      listPlayers.map(
        (player) =>
          (playersList.innerHTML += `<p id="${player.id}">${player.name}</p>`)
      );
      renderedLogin();

      board.loadBase64(submitedData.msg.base64);
    } 
  }
};

/* DRAW */
toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    board.clearContext();

    const userId = findUser(listPlayers);
    
    ws.send(
      JSON.stringify({
        path: "draw",
        action: "clear",
        base64: generateBase64(),
        lineWidth: paint.getLineWidth(),
        x: 0,
        y: 0,
        color: paint.getColor(),
        id: userId,
        channel: "general",
      })
    );

    paint.disabledCursor();
  }
});

toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    paint.setColor(e.target.value);
    board.setStrokeStyle(target.value);
    paint.disabledCursor();
  }

  if (e.target.id === "lineWidth") {
    paint.setWidth(e.target.value);
    paint.disabledCursor();
  }
});

const draw = (e) => {
  if (!paint.getState()) {
    return;
  }

  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const userId = findUser(listPlayers);

  paint.setBeforeCursor();
  paint.setMoveCursor(x, y);

  ws.send(
    JSON.stringify({
      path: "draw",
      action: "drawing",
      base64: generateBase64(),
      lineWidth: paint.getLineWidth(),
      x: paint.getPos().x,
      y: paint.getPos().y,
      color: paint.getColor(),
      channel: "general",
      user: userId,
    })
  );
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
    showMessage("No websocket connection :(")
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

function generateBase64() {
  return board.generateBase64();
}

startBtn.onclick = ()=> {
  const user = findUser(listPlayers);

  ws.send(
    JSON.stringify({
      path: "control_game",
      text: user,
      action: "start",
      channel: "general",
      id: user
    })
  );
}
