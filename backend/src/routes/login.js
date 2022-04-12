const { Connection } = require("./connection");
const { listUsers, channels } = require("../__mock__/data-mock");

class Login extends Connection {
  constructor(_data, _ws, _wss, _WebSocket) {
    super(_data, _ws, _wss, _WebSocket);
    this.ws;
    this.data;
    this.chatList;
    this.hour;
    this.websocket;
  }

  login() {
    super.validateChannel();
    super.getChatList();
    super.duplicateName();
    super.verifyBeforeConection();
    super.insertNameOnList();
    super.playersObjectWS();
    super.insertUserOnChannel();
    this.sendNotifyUsersInto();
    this.notifyUser();
  }

  sendNotifyUsersInto() {
    channels[this.data.channel].forEach((client) => {
      if (
        client.readyState === this.websocket.OPEN &&
        client.id !== this.ws.id
      ) {
        client.send(
          JSON.stringify({
            name: "server",
            msg: {
              text: `${listUsers[this.data.id]} entrou no canal.`,
            },
            hour: this.hour,
            path: "/chat",
          })
        );
      }
    });
  }

  notifyUser() {
    console.log(this.chatList);
    this.ws.send(
      JSON.stringify({
        msg: {
          text: "Login Ok",
        },
        ok: true,
        path: "/login",
        hour: this.hour,
        channel: this.data.channel,
        chatList: this.chatList,
        id: this.data.id,
      })
    );
  }
}

module.exports = { Login };
