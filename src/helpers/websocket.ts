import app, {middleWare} from "./express";
import http from "http";
import config from "config";
import {Server} from "socket.io";


const port = config.get<string>("port") || 4000;

const server = http.createServer();

const io = new Server(server, {cors: {
		origin: ["http://localhost:3000"],
	}});

export function startServer(){
    middleWare();
    // server.on("request", app);

    const userIO = io.of("/round");
    userIO.on("connection", (socket) => {
        let round = {id: "something in id", pool: 0, currentPrice: 0, lastPrice: 0, numberOfUser: 0};
        socket.emit("send-round", round.id);
        socket.on("update-round", (ping) => {
            console.log(ping)
            socket.emit("send-update-round", "some thing")
        })
        // setInterval(() => {
        //     socket.emit("send-round", [round.id, round.pool, round.currentPrice, round.lastPrice, round.numberOfUser]);            
        // }, 5000);
    })
    

    // userIO.on("connection", (ws) => {
    //     ws.on("message", (incomingMessage) => {
    //         console.log(`recived ${incomingMessage}`);
    //         console.log(ws);
    //         ws.send(JSON.stringify({
    //             something: 32,
    //         }));
    //     })
    // })

    server.listen(port, () => {
        console.log(`http/ws server listening ${port}`);
    }) 
}

export default app;