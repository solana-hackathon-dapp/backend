import {Schema} from "mongoose";
import { Mongo } from "../../helpers/mongo";
import { BaseDocument } from "../../base/model";


export type Round = BaseDocument & {
    statusCard: string;
    cardID: number;
    payOutUp: number;
    payOutDown: number;
    lockPrice: number;
    lastPrice: number;
    deviant: number;
    pricePool: number;
}

const roundSchema = new Schema({
    statusCard: {type: String, required: true}, // LIVE, LAST, NEXT, EXPIRED
    cardID: {type: Number, required: true},
    payOutUp: {type: Number, required: true},
    payOutDown: {type: Number, required: true},
    lockPrice: {type: Number, required: true},
    lastPrice: {type: Number, required: true},
    deviant: {type: Number, required: true},
    pricePool: {type: Number, required: true},
})

export const RoundModel = Mongo.model<Round>("Round", roundSchema);