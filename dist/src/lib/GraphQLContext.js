/**
 * graphql context implementaiton as used by rainbow services
 */
export default class GraphQLContext {
    constructor({ dataSources, services, authorizationContext, }) {
        this.dataSources = dataSources;
        this.services = services;
        this.authorizationContext = authorizationContext;
    }
    /**
     * Returns the authentication context for the current request
     *
     * @returns AuthenticationContext
     */
    getAuthenticationContext() {
        return this.authorizationContext;
    }
    /**
     * Gets a service by its name
     *
     * @param serviceName the name of the service
     * @returns Service. Throws an Error if the Service is not availble on the context
     */
    getService(serviceName) {
        if (this.services.has(serviceName)) {
            return this.services.get(serviceName);
        }
        else {
            throw new Error(`Service ${serviceName} is not a registered service on the GraphQLContext!`);
        }
    }
    /**
     * Gets a data source by its name
     *
     * @param dataSourceName the name of the data source
     * @returns DataSource. Throws an Error if the data source is not available on the context
     */
    getDataSource(dataSourceName) {
        if (this.dataSources.has(dataSourceName)) {
            return this.dataSources.get(dataSourceName);
        }
        else {
            throw new Error(`DataSource ${dataSourceName} is not a registered data source on the GraphQLContext!`);
        }
    }
}
//# sourceMappingURL=GraphQLContext.js.map