const express = require("express");
const http = require("http");
const connectDB = require("./DBconnection");
const cors = require("cors");
const socketConnect = require("./SocketConfig");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.ENDPOINT || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (_req, res) => res.json({ status: "ok", app: "Xitify API" }));

const server = http.createServer(app);
socketConnect(server);

server.listen(PORT, () => {
  console.log(`\x1b[36m✓ Xitify server running on http://localhost:${PORT}\x1b[0m`);
});
