const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket/socket");

// Load env
dotenv.config();

// Connect DB
connectDB();

// HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket"]
});
socketHandler(io);
const User = require('./models/User'); // Path check kar lena

const fixDatabaseOnce = async () => {
  try {
    const result = await User.updateMany(
      { isOnline: { $exists: false } }, 
      { $set: { isOnline: false, lastSeen: new Date() } }
    );
    console.log(`✅ Success: ${result.modifiedCount} purane users fix ho gaye!`);
  } catch (err) {
    console.error("❌ Database fix error:", err);
  }
};

// Ise sirf ek baar chalane ke liye call karein
fixDatabaseOnce();

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
