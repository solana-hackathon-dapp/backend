import app , { startServer } from './helpers/websocket';
import {GraphqlServer} from './helpers/graphql/apollo';

startServer();


const graphqlServer = new GraphqlServer(app);
graphqlServer.start();