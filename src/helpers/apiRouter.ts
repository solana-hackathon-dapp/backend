import {Application, Request, Response, Router} from "express";
import { loadRouter } from "./graphql/autoloader";
import logger from "./logger";

export class APIRouter{
    router = Router();
    constructor(private app: Application){}
    async start(path = "/api"){
        console.log(this.router);
        const config = await loadRouter();
        for(const {method, endPoint, handler} of config ){
            this.router[method as "get"](endPoint, handler);
        }
        console.log(this.router);
        this.app.use(path, this.router);
        logger.info(`API router started at ${path}`)
    }
}