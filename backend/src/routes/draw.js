const { Connection } = require("./connection");
const { channels } = require("../__mock__/data-mock");
const { RedisDB } = require("../database/index");

class Draw extends Connection {
  constructor(_data, _ws, _wss, _WebSocket) {
    super(_data, _ws, _wss, _WebSocket);
    this.ws;
    this.data;
    this.chatList;
    this.hour;
    this.websocket;

    this.db = new RedisDB();
  }

  sendDraw() {
    channels[this.data.channel].forEach((client) => {
      const data = this.data;

      if (
        client.readyState === this.websocket.OPEN
      ) {

        this.db.saveNewDrawing(data);

        this.db.saveBase64(data.base64);

        if (data.action == "clear") {
            this.db.clearAllDrawings();
        }

        client.send(
          JSON.stringify({
            action:"draw",
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
