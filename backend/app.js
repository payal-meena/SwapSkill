const express = require("express");

const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();


app.use(express.json());
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/chats", chatRoutes);


module.exports = app;
