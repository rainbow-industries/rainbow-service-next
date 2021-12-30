import { FastifyReply, FastifyRequest } from "fastify";
import AuthorizationService from "./AuhtorizationService.js";
import { PublicRouteSet } from "./types.js";


export interface IAuthenticationContextArgs {
    publicRoutes: PublicRouteSet,
    authorizationService: AuthorizationService,
    request: FastifyRequest,
    reply: FastifyReply,
}


class AuthorizationError extends Error {
    readonly path : string;

    constructor(path: string) {
        super(`Permission denied for path ${path}!`);

        this.path = path;
        this.name = 'AuthenticationError';
    }
}


export default class AuthorizationContext {

    // interface to the authorization service
    private readonly authorizationService: AuthorizationService;

    // the fastify request object
    private readonly request: FastifyRequest;

    // the fastify reply
    private readonly reply: FastifyReply;

    // routes that are public and do not need authorization checks
    private readonly publicRoutes: PublicRouteSet;

    // authorization error class
    static AuthorizationError = AuthorizationError;

    constructor({
        authorizationService,
        publicRoutes,
        reply,
        request,
    } : IAuthenticationContextArgs) {
        this.authorizationService = authorizationService;
        this.publicRoutes = publicRoutes;
        this.reply = reply;
        this.request = request;
    }



    isActionAllowed(): boolean {
        return true;
    }
}