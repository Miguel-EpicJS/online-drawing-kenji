//  -------------- WEBSOCKET -- LAYSSA -------------- //
const ws = require("ws");
const { v4: uuidv4 } = require("uuid");
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

webSocket.on("connection", async function connection(ws) {
    ws.on("message", async function message(data) {
        try {
            const { path } = data;

            const msg = JSON.parse(data);

            console.log("----------------DATA");
            console.log(msg);

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

            if (msg.event == "connect") {
                return await sendMessageToClients({
                    name: "server",
                    msg: `${listUsers[msg.id]} acabou de entrar no canal`,
                    id: msg.id,
                    listPlayers: playersWS,
                })
            }

            if (msg.event == "disconnect") {
                return await sendMessageToClients({
                    name: "server",
                    msg: `${listUsers[msg.id]} saiu do canal`,
                    id: msg.id,
                    listPlayers: playersWS,
                })
            }

            sendMessageToClients({ 
                name: msg.name,
                msg, 
                id: msg.id, 
                listPlayers: playersWS 
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

async function sendMessageToClients({ name, listPlayers, msg, id }) {
    const players = Object.values(listUsers);

    await listPlayers.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
            return client.send(
                JSON.stringify({
                    name: name,
                    msg: msg,
                    players,
                    id: id,
                })
            );
        }
    });
}

module.exports = { server }