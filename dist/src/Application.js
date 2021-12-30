import logger from './lib/logger.js';
import Application from './lib/Application.js';
import Service from './lib/Service.js';
import PasswordSignUpAction from './actions/PasswordSignUpAction.js';
const log = logger.module('src/Application.ts');
export default class AuthenticationApplication extends Application {
    async load() {
        this.registerService(new Service());
        this.loadActions();
        return super.load();
    }
    async loadActions() {
        const passwordSignUpAction = new PasswordSignUpAction();
        this.registerAction(passwordSignUpAction);
    }
}
//# sourceMappingURL=Application.js.map