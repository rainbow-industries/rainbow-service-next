import Action from '../lib/Action.js';
export default class PasswordForgotAction extends Action {
    constructor() {
        super(...arguments);
        this.name = 'PasswordForgotAction';
    }
    async load() {
        const typeDef = await this.signUpTypeDefinition();
        const typeDef1 = await this.signUpTypeDefinition1();
        this.registerResolver('Mutation', 'passwordForgot', typeDef, this.passwordForgot.bind(this));
        this.registerResolver('Query', 'users', typeDef1, this.getUser.bind(this));
        return super.load();
    }
    async signUpTypeDefinition() {
        return `
            type Mutation {
                passwordForgot(email: String): Status
            }

            type Status {
                status: Boolean
            }
        `;
    }
    async signUpTypeDefinition1() {
        return `
            type Query {
                users: [User]
            }

            type User {
                email: String
            }
        `;
    }
    async getUser(parent, args, context, info) {
        return [{
                email: 'pussy'
            }];
    }
    async passwordForgot(parent, args, context, info) {
        return { status: true };
    }
}
//# sourceMappingURL=PasswordForgotAction.js.map