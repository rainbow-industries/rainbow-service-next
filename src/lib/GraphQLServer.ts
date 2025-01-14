import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import fastify from 'fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import logger from './logger.js';
import type { IResolvers } from '@graphql-tools/utils';
import GraphQLContext from './GraphQLContext.js';
import { DataSourceMap, PublicRouteSet, ServiceMap } from './types.js';
import AuthorizationService from './AuhtorizationService.js';
import AuthorizationContext from './AuthorizationContext.js';
import { DocumentNode } from 'graphql';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';


const log = logger.module('GraphQLServer');


interface IServerOptions {
    dataSources: DataSourceMap,
    services: ServiceMap
    publicRoutes: PublicRouteSet,
}



export default class GraphQLServer {

    private server: ApolloServer;
    private dataSources: DataSourceMap;
    private services: ServiceMap;
    private readonly authorizationService: AuthorizationService;
    private readonly publicRoutes: PublicRouteSet;

    
    constructor({
        dataSources,
        services,
        publicRoutes,
    }: IServerOptions) {
        log.debug('Initializing the GraphQLServer ...');

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
    async load(typeDefs: DocumentNode, resolvers: IResolvers): Promise<void> {
        log.debug('Loading the GraphQLServer ...');
        log.debug('Loading the fastify server ...');
        const app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify.default();

        log.debug('Loading the ApollServer ...');
        this.server = new ApolloServer({
            typeDefs,
            resolvers,
            introspection: true,
            context: async ({ request, reply }) => this.createContext(request, reply),
            plugins: [
                this.fastifyAppClosePlugin(app),
                ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
            ],
        });

        log.debug('Startign the ApolloServer ...');
        await this.server.start();

        app.register(this.server.createHandler());

        log.debug('Opeing port 4000 ...');
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
    async loadAuthorizationContext(request: FastifyRequest, reply: FastifyReply) :Promise<AuthorizationContext> {
        log.debug(`Loading the AuthorizationContext for ${request.routerPath} ...`);

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
    private async createContext(request: FastifyRequest, reply: FastifyReply): Promise<GraphQLContext> {
        const authorizationContext = await this.loadAuthorizationContext(request, reply);

        if (!authorizationContext.isActionAllowed()) {
            throw new AuthorizationContext.AuthorizationError(request.routerPath);
        }

        log.debug(`Creating the GraphQLContext for ${request.routerPath} ...`);
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
    private fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
        return {
            async serverWillStart() {
                return {
                    async drainServer() {
                       await app.close();
                    },
                };
            },
        };
    };
}