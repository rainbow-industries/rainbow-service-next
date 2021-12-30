import { GraphQLResolveInfo } from 'graphql';
import Action from '../lib/Action.js';
import GraphQLContext from '../lib/GraphQLContext.js';
import type { IGraphQLConfig } from '../lib/types.js';


type ForgotArguments = {
    email: string;
};



export default class PasswordForgotAction extends Action {


    readonly name: string = 'PasswordForgotAction';



    async load(): Promise<IGraphQLConfig> {
        const typeDef: string = await this.signUpTypeDefinition();
        const typeDef1: string = await this.signUpTypeDefinition1();

        this.registerResolver('Mutation', 'passwordForgot', typeDef, this.passwordForgot.bind(this));
        this.registerResolver('Query', 'users', typeDef1, this.getUser.bind(this));

        return super.load();
    }




    async signUpTypeDefinition(): Promise<string> {
        return `
            type Mutation {
                passwordForgot(email: String): Status
            }

            type Status {
                status: Boolean
            }
        `;
    }


    async signUpTypeDefinition1(): Promise<string> {
        return `
            type Query {
                users: [User]
            }

            type User {
                email: String
            }
        `;
    }


    async getUser(parent: undefined,
        args: undefined,
        context: GraphQLContext,
        info: GraphQLResolveInfo) : Promise<any> {
            return [{
                email: 'pussy'
            }]
    }

    async passwordForgot(parent: undefined,
        args: ForgotArguments,
        context: GraphQLContext,
        info: GraphQLResolveInfo) : Promise<any> {
        
        return { status: true };
    }
}