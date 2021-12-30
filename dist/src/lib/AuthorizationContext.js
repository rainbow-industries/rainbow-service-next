class AuthorizationError extends Error {
    constructor(path) {
        super(`Permission denied for path ${path}!`);
        this.path = path;
        this.name = 'AuthenticationError';
    }
}
export default class AuthorizationContext {
    constructor({ authorizationService, publicRoutes, reply, request, }) {
        this.authorizationService = authorizationService;
        this.publicRoutes = publicRoutes;
        this.reply = reply;
        this.request = request;
    }
    isActionAllowed() {
        return true;
    }
}
// authorization error class
AuthorizationContext.AuthorizationError = AuthorizationError;
//# sourceMappingURL=AuthorizationContext.js.map