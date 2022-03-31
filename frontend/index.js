const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const context = canvas.getContext("2d");
const text = document.querySelector(".show-answer");
const sendBtn = document.querySelector(".answer-button");
const messageBox = document.querySelector(".answer-input");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY - 60;

const paintStyle = {
  lineWidth: 3,
  color: "#000000",
};

const paint = {
  active: false,
  move: false,
  pos: {
    x: 0,
    y: 0,
  },
  before: null,
};

/* WS */
ws = new WebSocket("wss://localhost:5050");

ws.onmessage = (ms) => {
  const submitedData = JSON.parse(ms.data);

  if (submitedData.drawing.action === "clear") {
    return context.clearRect(0, 0, canvas.width, canvas.height);
  }

  context.strokeStyle = submitedData.drawing.color;
  context.lineWidth = submitedData.drawing.lineWidth;
  context.lineCap = "round";

  paint.active = false;
  show(submitedData.drawing.text);
  context.lineTo(submitedData.drawing.x, submitedData.drawing.y);
  context.stroke();
};

/* DRAW */

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    console.log("clear");
    context.clearRect(0, 0, canvas.width, canvas.height);
    ws.send(
      JSON.stringify({
        path: "draw",
        action: "clear",
        lineWidth: paintStyle.lineWidth,
        x: 0,
        y: 0,
        color: paintStyle.color,
      })
    );
  }
});

toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    paintStyle.color = e.target.value;
    context.strokeStyle = e.target.value;
  }

  if (e.target.id === "lineWidth") {
    paintStyle.lineWidth = e.target.value;
  }
});

const draw = (e) => {
  if (!paint.active) {
    return;
  }

  paint.move = true;
  paint.before = {
    x: paint.pos.x,
    y: paint.pos.y,
  };
  paint.pos.x = e.clientX - canvasOffsetX;
  paint.pos.y = e.clientY - canvasOffsetY;

  ws.send(
    JSON.stringify({
      path: "draw",
      action: "drawing",
      lineWidth: paintStyle.lineWidth,
      x: paint.pos.x,
      y: paint.pos.y,
      color: paintStyle.color,
    })
  );

  context.lineWidth = paintStyle.lineWidth;
  context.lineCap = "round";

  // context.moveTo(paint.before.x, paint.before.y);
  context.lineTo(paint.pos.x, paint.pos.y);
  context.stroke();
  console.log("mousemove");
};

canvas.addEventListener("mousedown", (e) => {
  paint.active = true;
  paint.before = {
    x: e.clientX,
    y: e.clientY,
  };

  console.log("mousedown");
});

canvas.addEventListener("mouseup", (e) => {
  paint.active = false;
  context.stroke();
  context.beginPath();
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
