import { Autoloader } from "autoloader-ts";
import { Request, Response } from "express";
import _ from "lodash";

export type RouterConfig = {
    method: "get" | "post" | "push" | "delete", 
    endPoint: string, 
    middleware: ((req: Request, res: Response, next: () => void) => void) [],
    handler: (req: Request, res: Response) => Promise<void>;
}

export async function loadGraphqlSchema(){
    const loader = await Autoloader.dynamicImport();
    await loader.fromGlob(__dirname + "/../modules/**/*.schema.ts");
    const exports = loader.getResult().exports;
    return exports;
}

export async function loadGraphqlResolver(){
    const loader = await Autoloader.dynamicImport();
    await loader.fromGlob(__dirname + "/../modules/**/*.resolver.ts");
    exports = loader.getResult().exports;
    return _.reduce(exports, (pre, value) => {
       return _.merge(pre, value); 
    } ,{});
}

export async function loadGraphql(){
    const loader = await Autoloader.dynamicImport();
    await loader.fromGlob(__dirname + "/../modules/**/*.graphql.ts");
    const exports = loader.getResult().exports;
    return _.reduce(exports, (res: any, val: any, index: any) => {
        res["typeDefs"].push(val.typeDefs);
        _.merge(res.resolvers, val.resolvers);
        return res;
    }, { typeDefs: [], resolvers: {}});
}

export async function loadRouter(){
    const loader = await Autoloader.dynamicImport();
    await loader.fromGlob(__dirname + "/../modules/**/*.router.ts");    
    const exports = loader.getResult().exports;
    return _.reduce(exports, (pre, value) => {
        pre.concat (value);
        return pre;
    }, [] as any[]);
}