import type { IResolvers } from '@graphql-tools/utils';
import { DataSource } from 'apollo-datasource';
import Action from './Action.js';
import Service from './Service.js';

export { IResolvers };

export interface IGraphQLConfig {
    typeDefinitions: string,
    resolvers: ResolverConfigMap,
}




export interface IResolverConfig {
    [key: string]: {
        [key: string]: Function
    }
};




export type DataSourceMap = Map<string, DataSource>;
export type ServiceMap = Map<string, Service>;
export type ActionMap = Map<string, Action>;
export type PublicRouteSet = Set<string>;
export type ActionConfigMap = Map<string, Function>;
export type ResolverConfigMap = Map<string, ActionConfigMap>;