//  -------------- WEBSOCKET -- LAYSSA -------------- //
const ws = require("ws");
const { server } = require("../https");

const webSocket = new ws.Server({ server });

let playersWS = [];
let listUsers = {};

webSocket.on("open", function open() {
  try {
    ws.send(JSON.stringify({ users }));
  } catch (error) {
    console.log(error);
    ws.send(JSON.stringify({ msg: "internal error" }));
  }
});

webSocket.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    try {
      const { path } = data;

      const msg = JSON.parse(data);

      if (!msg.id) {
        const id = uuidv4();
        msg.id = id;
        ws.id = id;
      }

      if (!listUsers[msg.id]) {
        listUsers[msg.id] = msg.name;
      }

      if (!playersWS.find((elem) => elem.id === msg.id)) {
        playersWS.push(ws);
      }

      
      playersWS.forEach(function each(client) {
        if (client !== ws && client.readyState === ws.OPEN) {
          if (msg.event == "connect") {
            return client.send(
              JSON.stringify({
                name: "server",
                msg: `${listUsers[msg.id]} acabou de entrar no canal`,
                hour,
                users,
                id: msg.id,
              })
            );
          }

          if (msg.event == "disconnect") {
            return client.send(
              JSON.stringify({
                name: "server",
                msg: `${listUsers[msg.id]} saiu do canal`,
                hour,
              })
            );
          }

          client.send(JSON.stringify(msg));
        }
      });
    } catch (error) {
      console.log(error);
      ws.send(JSON.stringify({ msg: "internal error" }));
    }
  });

  ws.on("close", function close(data) {
    ws.on("message", function message(data) {
      try {
        webSocket.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === ws.OPEN) {
            const hour = new Date().toLocaleTimeString();

            client.send(
              JSON.stringify({
                name: "server",
                msg: `${users[ws.id]} acabou de sair da sala.`,
                hour,
              })
            );
          }
        });
      } catch (error) {
        console.log(error);
        ws.send(JSON.stringify({ msg: "internal error" }));
      }
    });
  });

  ws.send(
    JSON.stringify({
      name: "server",
      msg: `Você entrou no canal.`,
    })
  );
});

webSocket.on("error", (error) => console.log((ws, error)));




async function sendMessageToClients(listClients, msg){

    const players = Object.values(listUsers);

    listClients.forEach(client => {
        if (client !== ws && client.readyState === ws.OPEN) {
            return client.send(
                JSON.stringify({
                  name: "server",
                  msg: `${listUsers[msg.id]} acabou de entrar no canal`,
                  players,
                  id: msg.id,
                })
              );
        }
    });

}