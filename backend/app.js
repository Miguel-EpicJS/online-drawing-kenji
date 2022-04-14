const { server } = require("./server");
const PORT = 5050;

server.listen(PORT, () => console.log(`HTTPS running at port ${PORT}`));
