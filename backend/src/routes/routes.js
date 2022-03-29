function drawBroadcast(data, ws, wss, WebSocket) { // data is the data received from wss connection

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
            console.log(data);
            client.send( JSON.stringify( { drawing: { lineWidth: data.lineWidth, x: data.x, y: data.y } , path: "/draw"} ) );
        }
    });

}

module.exports = { draw: drawBroadcast }; // path: function