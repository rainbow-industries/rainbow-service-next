import GraphQLServer from './GraphQLServer.js';
import { gql } from 'apollo-server-core';
import logger from './logger.js';
import StatusAction from './StatusAction.js';
const log = logger.module('RainbowService');
export default class RainbowService {
    constructor() {
        this.dataSources = new Map();
        this.services = new Map();
        this.actions = new Map();
        this.publicRoutes = new Set();
        this.resolvers = new Map();
        this.typeDefinitions = '';
        log.debug('Initializing rainbow service ...');
    }
    /**
     * load the application after all components got registered
     */
    async load() {
        log.debug('Service is loading ...');
        const statusAction = new StatusAction();
        this.registerAction(statusAction);
        await this.loadActionConfigurations();
        this.server = new GraphQLServer({
            dataSources: this.dataSources,
            services: this.services,
            publicRoutes: this.publicRoutes,
        });
        const resolverObject = {};
        for (const [type, resolvers] of this.resolvers.entries()) {
            if (!resolverObject[type]) {
                resolverObject[type] = {};
            }
            for (const [action, resolver] of resolvers.entries()) {
                log.debug(`Seetin up resolver ${type}/${action} ...`);
                resolverObject[type][action] = resolver;
            }
        }
        if (!this.typeDefinitions.trim().length) {
            throw new Error(`There are no GraphQL type definitions, cannot start server! Mybe you need to register an action on the application using the registerAction method?`);
        }
        log.debug(`Compiling type definitions ...`);
        const graphQLTypeDefinitions = gql `${this.typeDefinitions}`;
        // load the server
        await this.server.load(graphQLTypeDefinitions, resolverObject);
    }
    /**
     * load all the actions and collect their resolver and type definitions
     */
    async loadActionConfigurations() {
        log.debug('Loading actions ...');
        for (const action of this.actions.values()) {
            log.debug(`Loading action ${action.name} ...`);
            const { typeDefinitions, resolvers, } = await action.load();
            this.typeDefinitions += '\n' + typeDefinitions;
            for (const [type, actionMap] of resolvers.entries()) {
                if (!this.resolvers.has(type)) {
                    this.resolvers.set(type, new Map());
                }
                const actions = this.resolvers.get(type);
                for (const [actionName, resolver] of actionMap.entries()) {
                    log.debug(`Registering resolver ${type}/${actionName} for action ${action.name} ...`);
                    if (actions)
                        actions.set(actionName, resolver);
                }
            }
        }
    }
    /**
     * registers a new action on the application
     *
     * @param name the name of the action
     * @param action the action implementation
     */
    registerAction(action) {
        log.debug(`Registering action '${action.name}' ...`);
        this.actions.set(action.name, action);
    }
    registerService(service) {
        log.debug(`Registering service '${service.name}' ...`);
        this.services.set(service.name, service);
    }
}
//# sourceMappingURL=RainbowService.js.map