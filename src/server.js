import http from "http";
import WebSocket from "ws";
import SocketIO from "socket.io"
//import {Server} from "socket.io"
//import { instrument } from "@socket.io/admin-ui";

import express from "express";

const fs = require("fs");
const https = require("https");
const options = {
    key: fs.readFileSync("./cert.key"),
    cert: fs.readFileSync("./cert.crt"),
}

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/view");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res)=> res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);
//const wsServer = SocketIO(httpServer);
const wsServer = SocketIO(httpsServer);

wsServer.on("connection", socket => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome"); //socket.to 함수 room에서 나를 제외한 모든 클라이언트에게 발송
    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName)=> {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
})

httpServer.listen(3000, handleListen);
httpsServer.listen(3001);