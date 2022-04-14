const { listUsers, actualPlayer } = require("../__mock__/data-mock");
const { Connection } = require("./connection");

class Game extends Connection {
  constructor(_data, _ws, _wss, _WebSocket) {
    super(_data, _ws, _wss, _WebSocket);
    this.chatList;
    this.players = [];
    this.currentPlayer = {};
    this.winner = "";
    this.score = [];
    this.order = this.chatList;
    this.nextPlayer = {};
  }

  setPlayers(_players) {
    this.players = _players;
  }

  setScore(_objPlayer) {
    const userScoreFound = this.score.find((elem) => {
      if (elem.id === -_objPlayer.id) {
        return (elem.score += 10);
      }
      return;
    });

    if (!userScoreFound) {
      this.score.push({
        name: listUsers[_objPlayer.id],
        id: _objPlayer.id,
        score: 10,
      });
    }

    this.score.push(_objPlayer);
  }

  getFirstPlayer() {
    super.getChatList();
    super.sendMessage("server", this.chatList[0], "control_game", "get-first");
    this.currentPlayer = this.chatList[0];
    return;
  }

  getNextToPlay(_id) {
    this.currentPlayer = _id;
    this.order.findIndex(this.findUser);
    super.sendMessage("server", this.nextPlayer, "control_game", "get-next");
    return;
  }

  findUser(elem, index) {
    if (elem.id === this.currentPlayer) {
      this.nextPlayer = this.order[index + 1] || this.order[0];
      return;
    }
  }

  getActualPlayer (){
      return this.currentPlayer
  }

  getWinner() {
    const sortScore = this.score.sort(a, (b) => {
      if (a.score < b.score) {
        return 1;
      }
      if (a.score > b.score) {
        return -1;
      }
      return 0;
    });

    super.sendMessage("server", sortScore[0], "control_game", "get-winner");

    return;
  }
}

module.exports = { Game };
