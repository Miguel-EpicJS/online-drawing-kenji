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
          path: "/chat",
        })
      );
    }
  });
}

module.exports = { draw: drawBroadcast, chat: chatBroadcast }; // path: function
