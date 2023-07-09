const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");


const socket = new  WebSocket(`ws://${window.location.host}`);


socket.addEventListener("open", () => {
    console.log("connected to server");
})

socket.addEventListener("message", (message) => {
    //console.log("New message : ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

socket.addEventListener("close", () => {
    console.log("disconnected to server");
})

/*
setTimeout(() => {
    socket.send("hello from browser");
}, 3000);
*/

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    //console.log(input.value);
    socket.send(makeMessage("new_message", input.value));

    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
}

function handleNicksubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNicksubmit);