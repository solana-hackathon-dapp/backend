import {Server} from "socket.io";
// import { RoundSchema } from "../modules/round/round.model";

// export type round = {
//     id: number;
//     pool: number;
//     currentPrice: number;
//     lastPrice: number;
//     numberOfUser: number
// }
// Send to Everyone
export function startSocketIO() {
    const io = new Server(4000);
    const userIO = io.of("/user");
    userIO.on("connection", (socket) => {
        console.log(socket.id);
        let round = {id: 0, pool: 0, currentPrice: 0, lastPrice: 0, numberOfUser: 0};
        setInterval(() => {
            socket.emit("send-round", [round.id, round.pool, round.currentPrice, round.lastPrice, round.numberOfUser]);            
        }, 5000);
    })
}
