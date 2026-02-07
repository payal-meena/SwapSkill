const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket/socket");

// env
dotenv.config();

// DB
connectDB();

// http server
const server = http.createServer(app);

// socket server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ["websocket", "polling"],
});

// init socket
socketHandler(io);

// Make io available in all routes - ye line add ho gayi
app.use((req, res, next) => {
  req.io = io;
  next();
});

// port
const PORT = process.env.PORT;

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
