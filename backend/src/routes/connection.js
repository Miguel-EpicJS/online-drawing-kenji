const crypto = require("crypto");
const { playersWS, listUsers, channels } = require("../__mock__/data-mock");

class Connection {
  constructor(_data, _ws, _wss, _WebSocket) {
    this.user;
    this.channel;
    this.idUser;
    this.listPlayers = [];
    this.data = _data;
    this.clients = [];
    this.hour = new Date().toLocaleTimeString();
    this.ws = _ws;
    this.wss = _wss;
    this.websocket = _WebSocket;
    this.chatList = [];
  }

  duplicateName() {
    if (this.chatList.find((obj) => obj.name === this.data.name)) {
      this.ws.send(
        JSON.stringify({
          action: "entry",
          msg: {
            text: "invalid name",
          },
          ok: false,
          path: "/login",
          hour: this.hour,
        })
      );
      return true;
    }
    return false;
  }

  verifyBeforeConection() {
    if (!this.data.id && !this.ws.id) {
      const id = crypto.randomBytes(20).toString("hex");
      this.data.id = id;
      this.ws.id = id;
    }
  }

  insertNameOnList() {
    if (!listUsers[this.data.id]) {
      listUsers[this.data.id] = this.data.name;
    }
  }

  playersObjectWS() {
    const alreadyInsert = playersWS.find(function (elem) {
      return elem.id === this.data.id;
    });

    if (alreadyInsert) {
      playersWS.push(this.ws);
    }
  }

  validateChannel() {
    if (!channels[this.data.channel]) {
      this.ws.send(
        JSON.stringify({
          action: "entry",
          msg: {
            text: "invalid channel",
          },
          ok: false,
          path: "/login",
          hour,
        })
      );
    }
    return;
  }

  insertUserOnChannel() {
    channels[this.data.channel].push(this.ws);
  }

  sendMessage(_name, _message, _path, _action) {
    channels[this.data.channel].forEach((client) => {
      if (client.readyState === this.websocket.OPEN) {
        client.send(
          JSON.stringify({
            action: _action,
            name: _name,
            msg: {
              text: _message,
            },
            hour: this.hour,
            path: _path,
            chatList: this.chatList,
          })
        );
      }
    });
  }

  getChatList() {
    this.chatList = channels[this.data.channel].map(function (e) {
      if (listUsers[e.id]) {
        return {
          name: listUsers[e.id],
          id: e.id,
        };
      }
      return;
    });
  }
}

module.exports = { Connection };
