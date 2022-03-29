const { server } = require("./src/ws");
const PORT = 5050;

// -----------------------------------------------------------------------
server.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
