const express = require('express');
const { Server } = require("socket.io");
const { createServer } = require("http");
const { words } = require("./words.js");


const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 80;

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

io.on("connection", (socket) => {
  const word = words[getRndInteger(1, 5760)]
  socket.emit("word", {word: word})
});


app.use(express.static("app"))



server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});