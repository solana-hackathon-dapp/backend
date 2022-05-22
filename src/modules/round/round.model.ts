import {Schema} from "mongoose";
import { Mongo } from "../../helpers/mongo";
import { BaseDocument } from "../../base/model";


export type Round = BaseDocument & {
    isPrev: boolean;
    id: string;
    startTimestamp: number;
    lockTimestamp: number;
    closeTimestamp: number;
    lockPrice: number;
    closePrice: number;
    totalAmountPool: number;
    betUpAmount: number;
    betDownAmount: number;
    rewardAmount: number;
}

const roundSchema = new Schema({
    isPrev: {type: Boolean, required: true},
    id: {type: String, required: true},
    startTimestamp: {type: Date, required: true},
    closeTimestamp: {type: Date},
    lockPrice: {type: Number},
    closePrice: {type: Number},
    totalAmountPool: {type: Number, required: true},
    betUpAmount: {type: Number, required: true},
    betDownAmount: {type: Number,  required: true},
    rewardAmount: {type: Number, required: true}
})

export const RoundModel = Mongo.model<Round>("Round", roundSchema);