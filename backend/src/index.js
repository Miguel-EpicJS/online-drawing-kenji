// -------------- WEBSOCKET ----------------
import routes from "./routes/routes.js"

const paths = Object.keys(routes);

const wsServer = (wss, WebSocket) => {
  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      let receivedData;

      try {
        receivedData = JSON.parse(data);
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

export default wsServer