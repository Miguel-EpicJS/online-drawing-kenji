const { playersWS, listUsers, channels } = require("../__mock__/data-mock");

class Disconnection {
  constructor(_data, _ws, _wss, _WebScoket) {
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

  removePlayerOnList() {
    if (listUsers[this.data.id]) {
      delete listUsers[this.data.id];
    }
  }

  removeObjectWS() {
    if (playersWS.includes(this.ws)) {
      playersWS = removeElement(playersWS);
    }
  }

  removeUserOnChannel() {
    if (channels[this.data.channel]) {
      delete channels[this.data.channel];
    }
  }
}

function removeElement(array, value) {
  return array.filter((x) => {
    return x != value;
  });
}

module.exports = { Disconnection };
