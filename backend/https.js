const https = require("https");
const path = require("path");
const fs = require("fs");
const PORT = 3030;

const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, "certs", "selfkey.key")),
  cert: fs.readFileSync(path.join(__dirname, "certs", "selfCerts.crt")),
});


module.exports = { server };


// server.listen(PORT, function (err) {
//   if (err) console.log(err);
//   console.log("Server listening on PORT", PORT);
// });
