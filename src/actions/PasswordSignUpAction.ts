import { GraphQLResolveInfo } from 'graphql';
import Action from '../lib/Action.js';
import GraphQLContext from '../lib/GraphQLContext.js';
import type { IGraphQLConfig } from '../lib/types.js';


type SignUpArguments = {
    email: string;
    password: string;
};



export default class PasswordSignUpAction extends Action {


    readonly name: string = 'PasswordSignUpAction';



    async load(): Promise<IGraphQLConfig> {
        const typeDef: string = await this.signUpTypeDefinition();

        this.registerResolver('Mutation', 'passwordSignUp', typeDef, this.passwordSignUp.bind(this));

        return super.load();
    }




    async signUpTypeDefinition(): Promise<string> {
        return `
            type Mutation {
                passwordSignUp(email: String, password: String): Status
            }

            type Status {
                status: Boolean
            }
        `
    }


    async passwordSignUp(parent: undefined,
        args: SignUpArguments,
        context: GraphQLContext,
        info: GraphQLResolveInfo) : Promise<any> {
        
        return { status: true };
    }
}