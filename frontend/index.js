import "./style.css";
import { Paint } from "./src/scripts/paint";
import { CanvasControl } from "./src/scripts/canvas";
import { nameInput, renderedLogin, wss as ws } from "./src/scripts/home";

const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const context = canvas.getContext("2d");
const text = document.querySelector(".show-answer");
const sendBtn = document.querySelector(".answer-button");
const messageBox = document.querySelector(".answer-input");
const playersList = document.getElementById("players-list");

// User Mock
const user = "Player 1";
let listPlayers = [];

const paint = new Paint();
const board = new CanvasControl(canvas);

/* WS */
// const ws = new WebSocket("wss://localhost:5050");

console.log(ws);

ws.onmessage = (ms) => {
  const submitedData = JSON.parse(ms.data);
  /* console.log(submitedData) */

  if (submitedData.action === "entry") {
    listPlayers = submitedData.chatList;
    // const newPlayer = listPlayers[listPlayers.length - 1];
    playersList.innerHTML = "";

    listPlayers.map(
      (player) => (playersList.innerHTML += `<p id="${player.id}">${player.name}</p>`)
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
    console.log(submitedData.drawing.x);
    console.log(submitedData.drawing.y);

    paint.activeCursor(); /* 
        board.setLineTO(submitedData.drawing.x, submitedData.drawing.y);    */
  }

  if (submitedData.path === "/login") {
    console.log(submitedData.msg);

    function setMessageName(text) {
      const inputMsg = document.getElementById("message");
      inputMsg.innerHTML = text;
      setTimeout(() => {
        inputMsg.innerHTML = "";
      }, 2000);
      console.log(text);
    }

    if (submitedData.msg.text === "invalid name") {
      submitedData.ok = false;
      setMessageName("O nome de usuário já existe, insira outro.");
    }

    if (submitedData.ok) {
      //Ok: player must be redirected to another page if name is unique in the game room
      localStorage.setItem("username", nameInput.value);
      console.log(submitedData);
      listPlayers = submitedData.chatList;
      playersList.innerHTML = "";

      listPlayers.map(
        (player) =>
          (playersList.innerHTML += `<p id="${player.id}">${player.name}</p>`)
      );
      // window.location.href = "index.html";
      renderedLogin();

      board.loadBase64(submitedData.msg.base64);
    } else if (!submitedData.ok) {
      //repeated name: player must choose another name
      console.log(submitedData.msg.text);
    } else {
      //other possibility: feedback to player
      console.log(
        "Ocorreu um problema na aplicação. Tente novamente mais tarde"
      );
    }
  }
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
        base64: generateBase64(),
        lineWidth: paint.getLineWidth(),
        x: 0,
        y: 0,
        color: paint.getColor(),
        user,
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

  console.log(`${user} está desenhando`);

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
      user,
      channel: "general",
    })
  );
  /* 
    board.setLineWidth(paint.lineWidth);
    board.setLineCap("round");

    board.setLineTO(paint.pos.x, paint.pos.y); */
  /* context.stroke(); */
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

function generateBase64() {
  return board.generateBase64();
}
