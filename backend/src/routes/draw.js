const { Connection } = require("./connection");
const { channels } = require("../__mock__/data-mock");

class Draw extends Connection {
  constructor(_data, _ws, _wss, _WebSocket) {
    super(_data, _ws, _wss, _WebSocket);
    this.ws;
    this.data;
    this.chatList;
    this.hour;
    this.websocket;
  }

  sendDraw() {
    channels[this.data.channel].forEach((client) => {
      const data = this.data;

      if (
        client.readyState === this.websocket.OPEN &&
        client.id !== this.ws.id
      ) {
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
            chatList: this.chatList,
            id: this.data.id,
            hour: this.hour,
            channel: this.data.channel,
          })
        );
      }
    });
  }
}

module.exports = {
  Draw,
};
