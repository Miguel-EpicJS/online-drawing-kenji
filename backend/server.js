//------------- HTTPS ----------------
require("dotenv").config();
const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT;

const server = https.createServer({
    cert: fs.readFileSync(path.join(__dirname, "certs", "mycert.crt")),
    key: fs.readFileSync(path.join(__dirname, "certs", "selfsigned.key"))
}, app);

// ------------ Apenas para testar --------------
//app.listen(PORT, () => {
//    console.log("Https connection is working");
//});