import Action from '../lib/Action.js';
export default class PasswordSignUpAction extends Action {
    constructor() {
        super(...arguments);
        this.name = 'PasswordSignUpAction';
    }
    async load() {
        const typeDef = await this.signUpTypeDefinition();
        this.registerResolver('Mutation', 'passwordSignUp', typeDef, this.passwordSignUp.bind(this));
        return super.load();
    }
    async signUpTypeDefinition() {
        return `
            type Mutation {
                passwordSignUp(email: String, password: String): Status
            }

            type Status {
                status: Boolean
            }
        `;
    }
    async passwordSignUp(parent, args, context, info) {
        return { status: true };
    }
}
//# sourceMappingURL=PasswordSignUpAction.js.map