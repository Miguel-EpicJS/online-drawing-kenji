//------------- HTTPS ----------------
import dotenv from "dotenv"
dotenv.config();
import https from "https"
import fs from "fs"
import path from "path"
import express from "express"
import WebSocket from "ws";
import wsServer from "./src/index.js";

const app = express();
app.use(express.static("dist"));

app.get("/", (req, res, next) => {
  const options = {
    root: path.join(__dirname + ".." + "dist"),
  };

  res.sendFile("index.html", options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
      next();
    }
  });
});

export const server = https.createServer(
  {
    cert: fs.readFileSync(path.join(__dirname, "certs", "mycert.crt")),
    key: fs.readFileSync(path.join(__dirname, "certs", "selfsigned.key")),
  },
  app
);

server.on("error", (err) => console.error(err));

export const wss = new WebSocket.Server({ server, path: "/" });

wsServer(wss, WebSocket);
