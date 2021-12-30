import logger from './src/lib/logger.js';
import AuthenticationService from './src/AuthenticationService.js';
// set up the logger
logger.configure({
    serviceName: 'authentication-service',
    console: {
        enabled: true,
        level: 'debug',
    }
});
const log = logger.module('app');
const app = new AuthenticationService();
app.load().then(() => {
    log.info('The service was startet successfully ...');
}).catch((err) => {
    log.error(`The service crashed!`);
    log.error(err.stack);
});
//# sourceMappingURL=app.js.map