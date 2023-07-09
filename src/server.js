import http from "http";
import WebSocket from "ws";

import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/view");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res)=> res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("connected from browser");
    socket.on("close", () => {
        console.log("disconnected form the browser");
    });
    socket.on("message", (message) => {
        //console.log(message.toString('utf8'));
        //sockets.forEach(aSocket => aSocket.send(message.toString('utf8')));
        const parsed = JSON.parse(message.toString('utf8'));
        switch(parsed.type) {
            case "new_message" :
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${parsed.payload}`));
                break;
            case "nickname":
                socket["nickname"] = parsed.payload;
                break;
            default:
        }
    });
})

server.listen(3000, handleListen);