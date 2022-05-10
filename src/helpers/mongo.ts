import mongoose from "mongoose";
import config from "config";

const mongoURI = config.get<string>("mongo.uri");

const connection = mongoose.createConnection(mongoURI)

connection.on("connected", () => {
    console.log("mongoose connected");
})

export const Mongo = connection;