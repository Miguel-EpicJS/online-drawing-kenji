function drawBroadcast(data, ws, wss, WebSocket) {
    // data is the data received from wss connection

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
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
                })
            );
        }
    });
}

function chatBroadcast(data, ws, wss, WebSocket) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
            client.send(
                JSON.stringify({
                    msg: {
                        ...data,
                        text: data.text,
                    },
                    ok: true,
                    path: "/chat",
                })
            );
        }
    });
}

function userLogin(data, ws, wss, WebSocket) {

    // login validations

    ws.send(JSON.stringify({
        msg: {
            text: "Login Ok",
        },
        ok: true,
        path: "/login"
    }));

    // salvar no banco

}

module.exports = { draw: drawBroadcast, chat: chatBroadcast, login: userLogin }; // path: function
