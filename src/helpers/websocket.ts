import http from "http";
import config from "config";
import {Server} from "socket.io";
import axios from "axios";

import app, {middleWare} from "./express";
import { RoundModel } from "../modules/round/round.model";

const port = config.get<string>("port") || 4000;
const server = http.createServer();
const io = new Server(server, {cors: {
		origin: ["http://localhost:3000"],
	}});

export type RoundData = {
    isPrev: boolean;
    id: number;
    startTimestamp: Date;
    lockTimestamp?: Date;
    closeTimestamp?: Date;
    lockPrice?: number;
    closePrice?: number;
    totalAmountPool: number;
    betUpAmount: number;
    betDownAmount: number;
    rewardAmount: number;
}

export function startServer(){
    middleWare();
    io.on("connection", async (socket) => {
        console.log(socket.id);
        setInterval(async () => {
            const prevRound = await RoundModel.findOne({isPrev: true});
            const curSOLPrice = await axios.get<{symbol: string, price: number}>("https://api.binance.com/api/v1/ticker/price?symbol=SOLUSDT");
            let dateTime = new Date();
            const lockPrice = curSOLPrice.data.price;
            if(!prevRound) {
                const currentRound: RoundData = {
                    isPrev: true,          
                    id: 0,
                    startTimestamp: dateTime,
                    lockTimestamp: new Date(dateTime.getTime() + 5 * 60000),
                    closeTimestamp: new Date(dateTime.getTime() + 7 * 60000),
                    lockPrice: lockPrice,
                    totalAmountPool: 0,
                    betUpAmount: 0,
                    betDownAmount: 0,
                    rewardAmount: 0
                }
                await RoundModel.create(currentRound)
                socket.emit("send-round", [currentRound, setTimeout(() => {})])
            }
            else {
                prevRound["isPrev"] = false;
                prevRound.save();
                const id: number = prevRound["id"] + 1;
                const currentRound: RoundData = {
                    isPrev: true,
                    id: id,
                    startTimestamp: dateTime,
                    lockTimestamp: new Date(dateTime.getTime() + 5 * 60000),
                    closeTimestamp: new Date(dateTime.getTime() + 7 * 60000),
                    lockPrice: lockPrice,
                    totalAmountPool: 0,
                    betUpAmount: 0,
                    betDownAmount: 0,
                    rewardAmount: 0
                }
                await RoundModel.create(currentRound);
                socket.emit("send-round", [currentRound, setTimeout(() => {})])
            }    
        }, 10000);
        // socket.on("save-round", async (statusCard, cardID, payOutUp, payOutDown, lockPrice, lastPrice, deviant, pricePool) => {
        //     const round = await RoundModel.create({
        //         statusCard: statusCard,
        //         cardID: cardID,
        //         payOutUp: payOutUp,
        //         payOutDown: payOutDown,
        //         lockPrice: lockPrice,
        //         lastPrice: lastPrice,
        //         deviant: deviant,
        //         pricePool: pricePool
        //     })
        // })
        // socket.on("update-sol-price", async () => {
        //     //update sol last price
        //     //update deviant value
        // });
        // socket.on("add-pool", async () => {});
        // socket.on("update-pullUp", async () => {});
        // socket.on("update-pulldown", async () => {});
    });
    server.listen(port, () => {
        console.log(`http/ws server listening ${port}`);
    }) 
}

export default app;