import logger from './lib/logger.js';
import RainbowService from './lib/RainbowService.js';
import Service from './lib/Service.js';
import PasswordSignUpAction from './actions/PasswordSignUpAction.js';
import PasswordForgotAction from './actions/PasswordForgotAction.js';


const log = logger.module('AuthenticationService');



export default class AuthenticationService extends RainbowService {



    async load() : Promise<void> {
        this.registerService(new Service());

        this.loadActions();

        return super.load();
    }






    async loadActions() : Promise<void> {
        const passwordSignUpAction = new PasswordSignUpAction();
        this.registerAction(passwordSignUpAction);

        const forgotPasswordAction = new PasswordForgotAction();
        this.registerAction(forgotPasswordAction);
    }
}