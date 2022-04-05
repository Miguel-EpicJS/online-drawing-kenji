// -------------- WEBSOCKET ----------------
const routes = require("./routes/routes");

const paths = Object.keys(routes);

const crypto = require("crypto");

const wsServer = (wss, WebSocket) => {
  wss.on("connection", (ws) => {
    ws.id = crypto.randomBytes(20).toString("hex");
    ws.channels = []
    ws.username = null

    console.log(ws);

    ws.on("message", (data) => {
      let receivedData;
      
      try {
        receivedData = JSON.parse(data.toString());
        console.log("--------------------- path ----------------");
        console.log(receivedData.path);
        console.log(receivedData);
      } catch (error) {
        ws.send({ message: "Please submit a json" });
        return 0;
      }

      if (receivedData.path) {
        if (paths.indexOf(receivedData.path) >= 0) {
          routes[receivedData.path](receivedData, ws, wss, WebSocket);
        } else {
          ws.send(
            JSON.stringify({
              message: "This path don't exist",
              statusCode: 404,
            })
          );
        }
      } else {
        ws.send(
          JSON.stringify({ message: "Please send the path of your data" })
        );
      }
    });

    ws.onerror = function () {
      console.log("Some Error occurred");
    };
  });
};

module.exports = wsServer;