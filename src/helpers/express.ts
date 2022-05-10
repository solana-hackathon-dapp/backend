import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from "morgan";

const app = express();

export function startServer(){
    app.use(json());
    app.use(cors());
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    app.get("/", (req, res) => {
        res.send("hello em")
    })
    app.get("/get", (req, res) => {
        res.send("ok em");
    })
    app.post("/post", (req, res) => {
        res.json(req.body);
    })
    app.listen(3000, () => {
        console.log("start express on http://localhost:3000");    
    })
}
export default app;