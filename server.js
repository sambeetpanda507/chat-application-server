const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 8081;

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//test route
app.get("/", (req, res, next) => {
  res.status(201).send("<h1>Hello World</h1>");
});

app.post("/api/create-user", (req, res, next) => {
  const { username } = req.body;
  res.status(200).json(username);
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("sent", (data) => {
    socket.broadcast.emit("recieve", data);
  });
  socket.on("disconnect", () => {
    console.log("user left");
  });
});

server.listen(port, () => {
  console.log(`server is listening on port: http://localhost:${port}`);
});
