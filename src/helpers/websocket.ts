import http from "http";
import config from "config";
import {Server} from "socket.io";
import axios from "axios";

import app, {middleWare} from "./express";
import { RoundModel ,Round} from "../modules/round/round.model";

const port = config.get<string>("port") || 4000;
const server = http.createServer();
const io = new Server(server, {cors: {
		origin: ["http://localhost:3000"],
	}});

export type Card = {
    statusCard: string;
    cardID: number;
    payOutUp: number;
    payOutDown: number;
    lockPrice: number;
    lastPrice: number;
    deviant: number;
    pricePool: number;
}

export function startServer(){
    middleWare();
    const userIO = io.of("/round");
    userIO.on("connection", async (socket) => {
        console.log(socket.id);
        const prevCard = RoundModel.find();
        const curSOLPrice = await axios.get<{symbol: string, price: number}>("https://api.binance.com/api/v1/ticker/price?symbol=SOLUSDT");
        setInterval(() => {
            if(!prevCard) {
                const lastPrice = curSOLPrice.data.price;
                const lockPrice = curSOLPrice.data.price;
                const deviant: number = lastPrice - lockPrice;
                const currentCard: Card = {            
                    statusCard: "LIVE",
                    cardID: 0,
                    payOutUp: 0,
                    payOutDown: 0,
                    lockPrice: lockPrice,
                    lastPrice: lastPrice,
                    deviant: deviant,
                    pricePool: 0,
                }
                socket.emit("send-round", 
                [
                    currentCard.statusCard,
                    currentCard.cardID,
                    currentCard.payOutUp,
                    currentCard.payOutDown,
                    currentCard.lockPrice,
                    currentCard.lastPrice,
                    currentCard.deviant,
                    currentCard.pricePool
                ])
            }
            else {
                
            }    
        }, 1000);
        socket.on("save-round", async (statusCard, cardID, payOutUp, payOutDown, lockPrice, lastPrice, deviant, pricePool) => {
            const round = await RoundModel.create({
                statusCard: statusCard,
                cardID: cardID,
                payOutUp: payOutUp,
                payOutDown: payOutDown,
                lockPrice: lockPrice,
                lastPrice: lastPrice,
                deviant: deviant,
                pricePool: pricePool
            })
        })
        socket.on("update-sol-price", async () => {
            //update sol last price
            //update deviant value
        });
        socket.on("add-pool", async () => {});
        socket.on("update-pullUp", async () => {});
        socket.on("update-pulldown", async () => {});
    });

    server.listen(port, () => {
        console.log(`http/ws server listening ${port}`);
    }) 
}

export default app;