const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");
const text = document.querySelector(".show-answer");
const sendBtn = document.querySelector(".answer-button");
const messageBox = document.querySelector(".answer-input");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let color = "#000000";
let startX;
let startY;

/* WS */

ws = new WebSocket("wss://localhost:5050");

ws.onmessage = (ms) => {
  const submitedData = JSON.parse(ms.data);

  ctx.strokeStyle = submitedData.drawing.color;
  ctx.lineWidth = submitedData.drawing.lineWidth;
  ctx.lineCap = "round";

  isPainting = false;
  show(submitedData.drawing.text);
  ctx.lineTo(submitedData.drawing.x, submitedData.drawing.y);
  ctx.stroke();
};

/* DRAW */

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    color = e.target.value;
    ctx.strokeStyle = e.target.value;
  }

  if (e.target.id === "lineWidth") {
    lineWidth = e.target.value;
  }
});

const draw = (e) => {
  if (!isPainting) {
    return;
  }
  ws.send(
    JSON.stringify({
      path: "draw",
      lineWidth: lineWidth,
      x: e.clientX - canvasOffsetX,
      y: e.clientY,
      color: color,
    })
  );

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
  ctx.stroke();
  console.log("mousemove");
};

canvas.addEventListener("mousedown", (e) => {
  isPainting = true;
  startX = e.clientX;
  startY = e.clientY;
  console.log("mousedown");
});

canvas.addEventListener("mouseup", (e) => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
  console.log("mouseup");
});

canvas.addEventListener("mousemove", draw);

function showMessage(message) {
  text.innerHTML += `<p id="my">Eu: ${message}<p/>`;
  text.scrollTop = text.scrollHeight;
  messageBox.value = "";

  console.log(message);
}

function show(message) {
  text.innerHTML += `<p id="you">Jogador: ${message}<p/>`;
  text.scrollTop = text.scrollHeight;
  messageBox.value = "";

  console.log(message);
}

sendBtn.onclick = function () {
  if (!ws) {
    showMessage("No websocket connection :(");
    return;
  }
  let userObj = {
    nick: "",
    message: messageBox.value,
  };

  let user = `${userObj.message}`;

  ws.send(JSON.stringify({ path: "draw", text: user }));
  showMessage(messageBox.value);
};
