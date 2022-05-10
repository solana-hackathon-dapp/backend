import app , { startServer } from './helpers/express';
import {GraphqlServer} from './helpers/graphql/apollo';

startServer();
const graphqlServer = new GraphqlServer(app);
graphqlServer.start();