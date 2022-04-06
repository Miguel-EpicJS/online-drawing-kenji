const crypto = require("crypto");

let playersWS = [];
let listUsers = {};

let channels = {
  general: [],
};

function drawBroadcast(data, ws, wss, WebSocket) {
  // data is the data received from wss connection

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
      client.send(
        JSON.stringify({
          drawing: {
            ...data,
            lineWidth: data.lineWidth,
            x: data.x,
            y: data.y,
            color: data.color,
            text: data.text,
          },
          ok: true,
          path: "/draw",
        })
      );
    }
  });
}

function chatBroadcast(data, ws, wss, WebSocket) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
      client.send(
        JSON.stringify({
          msg: {
            ...data,
            text: data.text,
          },
          ok: true,
          path: "/chat",
        })
      );
    }
  });
}

function userLogin(data, ws, wss, WebSocket) {
  // login validations
  const hour = new Date().toLocaleTimeString();

  if (!data.id && !ws.id) {
    const id = crypto.randomBytes(20).toString("hex");
    data.id = id;
    ws.id = id;
  }

  if (!listUsers[data.id]) {
    listUsers[data.id] = data.name;
  }

  if (!playersWS.find((elem) => elem.id === data.id)) {
    playersWS.push(ws);
  }

  if (!channels[data.channel]) {
    ws.send(
      JSON.stringify({
        msg: {
          text: "invalid channel",
        },
        ok: false,
        path: "/login",
        hour,
      })
    );
  }

  channels[data.channel].push(ws);

  const chatList = channels[data.channel]
    .map((e) => listUsers[e.id])
    .filter((e) => {
      if (e) {
        return e;
      }
    });

  ws.send(
    JSON.stringify({
      msg: {
        text: "Login Ok",
      },
      ok: true,
      path: "/login",
      hour,
      channel: data.channel,
      chatList,
      id: data.id,
    })
  );

  channels[data.channel].forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
      client.send(
        JSON.stringify({
          msg: {
            text: `${listUsers[data.id]} entrou no canal.`,
          },
          hour,
          path: "/chat",
        })
      );
    }
  });

  // salvar no banco
}

module.exports = { draw: drawBroadcast, chat: chatBroadcast, login: userLogin }; // path: function
