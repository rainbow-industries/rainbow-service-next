import Server from './GraphQLServer.js';
import { gql } from 'apollo-server-core';
export default class Application {
    constructor() {
        this.dataSources = new Map();
        this.services = new Map();
        this.actions = new Map();
        this.publicRoutes = new Set();
        this.resolvers = new Map();
        this.typeDefinitions = '';
    }
    /**
     * load the application after all components got registered
     */
    async load() {
        this.server = new Server({
            dataSources: this.dataSources,
            services: this.services,
            publicRoutes: this.publicRoutes,
        });
        const resolverObject = {};
        for (const [type, resolvers] of this.resolvers.entries()) {
            if (!resolverObject[type]) {
                resolverObject[type] = {};
            }
            for (const resolver of resolvers) {
                resolverObject[type] = resolver;
            }
        }
        if (!this.typeDefinitions.trimRight().length) {
            throw new Error(`There are no GraphQL type definitions, cannot start server! Mybe you need to register an action on the application using the registerAction method?`);
        }
        // clean up the graphql
        const graphQLTypeDefinitions = gql `${this.typeDefinitions}`;
        // laod the server
        await this.server.load(graphQLTypeDefinitions, resolverObject);
    }
    /**
     * load all the actions and collect their resolver and type definitions
     */
    async loadActions() {
        for (const action of this.actions.values()) {
            const { typeDefinitions, resolvers, } = await action.load();
            this.typeDefinitions += '\n' + typeDefinitions;
            for (const [type, actionMap] of resolvers.entries()) {
                if (!this.resolvers.has(type)) {
                    this.resolvers.set(type, new Map());
                }
                const actions = this.resolvers.get(type);
                for (const [action, resolver] of actionMap.entries()) {
                    if (actions)
                        actions.set(action, resolver);
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
        this.actions.set(action.name, action);
    }
    registerService(service) {
        this.services.set(service.name, service);
    }
}
//# sourceMappingURL=Application.js.map