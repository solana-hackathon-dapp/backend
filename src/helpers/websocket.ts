import ws from "ws";
import app, {middleWare} from "./express";
import http from "http";
import config from "config";


const port = config.get<string>("port") || 3000;

const server = http.createServer();

const wssServer = new ws.Server({
    server: server,
})

export function startServer(){
    middleWare();
    server.on("request", app);

    wssServer.on("connection", (ws) => {
        ws.on("message", (incomingMessage) => {
            console.log(`recived ${incomingMessage}`);
            console.log(ws);
            ws.send(JSON.stringify({
                something: 32,
            }));
        })
    })

    server.listen(port, () => {
        console.log(`http/ws server listening ${port}`);
    }) 
}

export default app;