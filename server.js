const express = require("express");
var bodyParser = require("body-parser");
const { Socket } = require("socket.io");
const Connection = require("./Config/Connection");
const UsersController = require("./Controllers/UsersController");
const ChatsController = require("./Controllers/ChatsController");
const HandleSocket = require("./HandleSocket/Main");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var server = require("http").createServer(app);

// khởi tạo 1 socket io nối vào server
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

Connection();
UsersController(app);
ChatsController(app);
HandleSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
