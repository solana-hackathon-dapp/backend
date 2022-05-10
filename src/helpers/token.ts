import jwt from "jsonwebtoken";
import config from "config";

export default class Token{
    constructor(
        readonly _id: string,
        readonly role: string,
        readonly payload: any = {},
        readonly expiredIn: string | number = "7d"    
    ){}
    get sign(){
        return jwt.sign({...this.payload, id: this._id, role: this.role}, config.get<string>("secret"), {expiresIn: this.expiredIn})
    }
    static decode(token: string){
        const {_id, role, payload}: any = jwt.verify(token, config.get<string>("secret"));
        return new Token(_id, role, payload);
    }
}