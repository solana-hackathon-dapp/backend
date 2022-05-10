import { Request } from "express";
import Token from "../token";
import _ from "lodash";

export class Context{
    public req: Request;
    public token?: Token;
    public isAuthent = false;
    public isExpired = false;
    constructor(param : {req: Request}){
        this.req = param.req;
        const stringToken = _.get(this.req.headers, "x-token");
        try{
            this.token = Token.decode(stringToken as string);
            this.isAuthent = true;
        }
        catch {
            this.isExpired = true;
        }
    }
    get userID(){
        if(!this.isAuthent) throw Error("unauthent");
        return this.token?._id;
    }
     
}