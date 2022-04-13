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
    if (this.chatList.find((names) => names === this.data.name)) {
      this.ws.send(
        JSON.stringify({
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

  getChatList() {
    this.chatList = channels[this.data.channel]
      .map(function (e) {
        if (listUsers[e.id]) {
          return listUsers;
        }
        return;
      })
      .filter(function (e) {
        if (e) {
          return e;
        }
      });
  }
}

module.exports = { Connection };
