import {ApolloServer, gql} from "apollo-server-express";
import {Application, Request} from "express";
import {loadGraphqlSchema, loadGraphqlResolver, loadGraphql} from "./autoloader";
import graphqlTypeDate from "graphql-type-datetime";
import _ from "lodash";
import minifyGraphql from "minify-graphql-loader";
import logger from "../logger";
import morgan from "morgan";
import {Context} from "./context";

export class GraphqlServer{
    constructor(public app: Application){}
    async start(){
        let typeDefs = [
            gql`
            scalar DateTime
            scalar Mixed
            type Query{
                _empty: String
            }
            type Mutation{
                _empty: String
            }
            type Subscription{
                _empty: String
            }
            input QueryInput{
                "number of elements"
                limit: Int 
                "page number"
                page: Int
                "order of element"
                order: Mixed
                "filter of page" 
                filter: Mixed
                "search in page"
                search: String
            }
            type Pagination{
                "total number of element"
                total: Int
                "number of element in a page"
                limit: Int
                "page number"
                page: Int
            }`,
        ]

        let resolvers: any = {
            Query: {
                _empty: () => "empty"
            },
            DateTime: graphqlTypeDate
        }       

        const loadSchema = await loadGraphqlSchema();
        typeDefs = typeDefs.concat(loadSchema);

        const loadResolver = await loadGraphqlResolver();
        resolvers = _.merge(resolvers, loadResolver);

        const loadSchemaResolver: any = await loadGraphql();
        typeDefs = typeDefs.concat(loadSchemaResolver.typeDefs);
        resolvers = _.merge(resolvers, loadSchemaResolver.resolvers);
        
        const server = new ApolloServer({
            typeDefs: typeDefs,
            resolvers: resolvers,
            context: async ({req}) => {
                return new Context({req});
            }
        });
        
        morgan.token("gql-query", (req: Request) => req.body.query)
        this.app.use("/graphql", (req, res, next) => {
            if(req.body?.query){
                let minify = minifyGraphql(req.body.query);
                req.body.query = minify;
            }
            next();
        }, morgan("GRAPHQL :gql-query - :status :response-time ms", {
            skip: (req) => _.get(req, "body.query", "").includes("IntrospectionQuery"),
            stream: {
                write: (msg: string) => logger.info(msg)
            }
        }))
        await server.start();
        server.applyMiddleware({app: this.app});
    }
}