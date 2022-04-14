const { listUsers } = require("../__mock__/data-mock.js");
const { Disconnection } = require("./disconnection.js");

class Logout extends Disconnection {
  constructor(_data, _ws, _wss, _WebSocket) {
    super(_data, _ws, _wss, _WebSocket);
    this.ws;
    this.data;
    this.chatList;
    this.hour;
    this.websocket;
  }

  logout() {
    this.notifyUser();
    this.sendNotifyForUsers();
    super.removePlayerOnList();
    super.removeObjectWS();
    super.removeUserOnChannel();
  }

  sendNotifyForUsers() {
    channels[this.data.channel].forEach((client) => {
      if (
        client.readyState === this.websocket.OPEN &&
        client.id !== this.ws.id
      ) {
        client.send(
          JSON.stringify({
            name: "server",
            msg: {
              text: `${listUsers[this.data.id]} saiu do canal.`,
            },
            hour: this.hour,
            path: "/chat",
          })
        );
      }
    });
  }

  notifyUser() {
    this.ws.send(
      JSON.stringify({
        msg: {
          text: "Logout OK",
        },
        ok: true,
        path: "/logout",
        hour: this.hour,
        channel: this.data.channel,
        chatList: this.chatList,
        id: this.data.id,
      })
    );
  }
}

module.exports = { Logout };
