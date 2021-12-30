import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import fastify from 'fastify';
import logger from './logger.js';
import GraphQLContext from './GraphQLContext.js';
import AuthorizationContext from './AuthorizationContext.js';
const log = logger.child({ service: 'authentication-service', module: 'src/Server.ts' });
export default class Server {
    constructor({ dataSources, services, publicRoutes, }) {
        this.dataSources = dataSources;
        this.services = services;
        this.publicRoutes = publicRoutes;
        const authorizationService = this.services.get('authorization');
        if (!authorizationService) {
            throw new Error(`Missing the service 'authorization!`);
        }
        this.authorizationService = authorizationService;
    }
    /**
     * loads the server and start listening listening for requests
     *
     * @param typeDefs graphQL type definitions
     * @param resolvers graphQL resolvers
     */
    async load(typeDefs, resolvers) {
        const app = fastify();
        this.server = new ApolloServer({
            typeDefs,
            resolvers,
            context: async ({ request, reply }) => this.createContext(request, reply),
            plugins: [
                this.fastifyAppClosePlugin(app),
                ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
            ],
        });
        await this.server.start();
        await app.listen(4000);
        log.info(`🚀 Server ready at http://localhost:4000${this.server.graphqlPath}`);
    }
    /**
     * Sets up the authorization context for the current request. Makes use of the AuthorizationService
     * that lives in a remote service. The AuthorizationContext can be fed some routes on which no
     * authorization check is executed since there are routes that do not need authorization like requests
     * to the authorization itself
     *
     * @param request the request object
     * @param reply the reply object
     * @returns Promise<AuthorizationContext> the authorization context isntance
     */
    async loadAuthorizationContext(request, reply) {
        return new AuthorizationContext({
            publicRoutes: this.publicRoutes,
            authorizationService: this.authorizationService,
            request,
            reply,
        });
    }
    /**
     * This method creates the context for the incoming request. It first builds the authorization context
     * which handles all authorization concerns. It then checks if the requester is authorized to acces that
     * route. After that the GraphQLContext is built, which provides an interface to the AuthorizationContext,
     * the services and the data sources. Services are other services that can be called and the datasources
     * are interfaces to the datasources that are accesible remotly via grapQL.
     *
     * @param request FastifyRequest the request object
     * @param reply FastifyReply the reply object
     * @returns Promise<GraphQLContext> the context forr the current request
     */
    async createContext(request, reply) {
        const authorizationContext = await this.loadAuthorizationContext(request, reply);
        if (!authorizationContext.isActionAllowed()) {
            throw new AuthorizationContext.AuthorizationError(request.routerPath);
        }
        const context = new GraphQLContext({
            dataSources: this.dataSources,
            services: this.services,
            authorizationContext,
        });
        return context;
    }
    /**
     * Plugin to close down the server cleanly
     *
     * @param app FastifyInstace the fstify server instance
     * @returns Fastify Plugin Object
     */
    fastifyAppClosePlugin(app) {
        return {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await app.close();
                    },
                };
            },
        };
    }
    ;
}
//# sourceMappingURL=Server.js.map