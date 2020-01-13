const dgram = require("dgram");
const wait = require("waait");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const throttle = require("lodash/throttle");
const commandDelays = require("./commandDelays");

const PORT = 8889;
const HOST = "192.168.10.1";
const drone = dgram.createSocket("udp4");

drone.bind(PORT);

function parseState(state) {
  return state
    .split(";")
    .map(x => x.split(":"))
    .reduce((data, [key, value]) => {
      data[key] = value;
      return data;
    }, {});
}

const droneState = dgram.createSocket("udp4");
droneState.bind(8890);

drone.on("message", message => {
  console.log(`🤖 : ${message}`);
  io.sockets.emit("status", message.toString());
});

function handleError(err) {
  if (err) {
    console.log("ERROR");
    console.log(err);
  }
}

drone.send("command", 0, "command".length, PORT, HOST, handleError);

io.on("connection", socket => {
  console.log("Socket ready");
  socket.on("command", command => {
    drone.send(command, 0, command.length, PORT, HOST, handleError);
  });

  socket.emit("status", "CONNECTED");
});

droneState.on(
  "message",
  throttle(state => {
    const formattedState = parseState(state.toString());
    io.sockets.emit("dronestate", formattedState);
  }, 100)
);

http.listen(6767, () => {
  console.log("Socket io server up and running");
});
