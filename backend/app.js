// ----------------- LISTEN SERVER ---------------

const { server } = require("./server");

server.listen(8000, () => console.log("Http running on port 8000"));