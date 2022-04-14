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

    // seção que vai fazer as verificações de login,bloquear nome repetido e permitir o login caso o nome esteja ok
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
          (playersList.innerHTML += `<p class='players-list' id="${player.id}">${player.name}</p>`)
      );
      renderedLogin();

      board.loadBase64(submitedData.msg.base64);
    } 
  }
  
  // condição que vai listar os nomes dos jogadores ativos no bloco de jogadores quando o jogador entrar
  if (submitedData.action === "entry") {
    listPlayers = submitedData.chatList;

    playersList.innerHTML = "";

    listPlayers.map(
      (player) =>
        (playersList.innerHTML += `<p class='players-list' id="${player.id}">${player.name}</p>`)
    );
  }

  
// função que vai executar o iniciar do jogo ao clicar no botão iniciar
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


  // condição que vai pegar o jogador da vez e adicionar a classe playing pra adicionar a cor verde de identificação
  if(submitedData.action === "get-first"){
    document.getElementById(submitedData.msg.text.id).classList.replace("players-list","playing")
  }

   // condições que vão exibir o desenho no canvas dentro do websocket
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

  // condição que vai exibir as mensagens/respostas no chat
  if (submitedData.path === "/chat") {
    show(submitedData.msg.text);
  }
};

// seção que adiciona funcionalidade na barra de ferramentas do desenho e no canvas
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


// funções que nomeia os jogadores no chat na visão de quem está jogando, "eu" pra primeira pessoa, e "jogador" pra identificar os outros
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


// função que vai controlar o websocket ao clicar no botão "enviar" e receber as mensagens enviadas no chat
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
