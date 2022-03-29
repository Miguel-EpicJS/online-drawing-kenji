const https = require("https");
const path = require("path");
const fs = require("fs");

const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, "certs", "selfsigned.key")),
  cert: fs.readFileSync(path.join(__dirname, "certs", "mycert.crt")),
});


module.exports = { server };
