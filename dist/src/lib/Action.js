import logger from './logger.js';
const log = logger.module('RainbowService');
export default class Action {
    constructor() {
        this.name = 'unnamed-action';
        this.resolvers = new Map();
        this.publicRoutes = new Set();
        this.typeDefinition = '';
    }
    async load() {
        log.debug(`Initializing Action '${this.name}' ...`);
        const resolvers = this.loadResolvers();
        return {
            typeDefinitions: this.typeDefinition,
            resolvers,
        };
    }
    /**
     * returns the set with the public routes
     *
     * @returns Set<string> set with alle the public routes
     */
    getPublicRoutes() {
        return this.publicRoutes;
    }
    /**
     * Add a public routes for this action
     *
     * @param route route name
     */
    registerPublicRoute(route) {
        this.publicRoutes.add(route);
    }
    /**
     * register a resolver for a type and action
     *
     * @param      {string}    type      The GraphQL type like Query, Mutation
     * @param      {string}    action    The name of the action (path)
     * @param      {function}  resolver  The resolver function
     */
    registerResolver(type, action, typeDefinition, resolver) {
        log.debug(`Registering resolver ${type}/${action} for action ${this.name} ...`);
        this.typeDefinition += '\n' + typeDefinition;
        if (!this.resolvers.has(type)) {
            this.resolvers.set(type, new Map());
        }
        const typeMap = this.resolvers.get(type);
        if (typeMap) {
            if (typeMap.has(action)) {
                throw new Error(`Cannot register resolver ${action} for the type ${type}!`);
            }
            typeMap.set(action, resolver);
        }
    }
    /**
     * Collects the registered resovlers and returns them
     *
     * @returns {object} resolvers object containgin the resolvers for this service
     */
    loadResolvers() {
        return this.resolvers;
    }
}
//# sourceMappingURL=Action.js.map