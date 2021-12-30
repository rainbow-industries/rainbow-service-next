import { GraphQLResolveInfo } from 'graphql';
import Action from './Action.js';
import GraphQLContext from './GraphQLContext.js';
import type { IGraphQLConfig } from './types.js';





export default class StatusAction extends Action {


    readonly name: string = 'StatusAction';
    private readonly startTime: number;

    constructor() {
        super();

        this.startTime = Date.now();
    }


    async load(): Promise<IGraphQLConfig> {
        const typeDef: string = await this.signUpTypeDefinition();

        this.registerResolver('Query', 'status', typeDef, this.status.bind(this));

        return super.load();
    }




    async signUpTypeDefinition(): Promise<string> {
        return `
            type Query {
                status: Status
            }

            type Status {
                uptime: String
            }
        `
    }


    msToTime(duration: number) {
        const milliseconds = Math.floor((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        
        
        const hoursString = String(hours).padStart(2, '0');
        const minutesString = String(minutes).padStart(2, '0');
        const secondsString = String(seconds).padStart(2, '0');
        const millisecondsString = String(milliseconds).padEnd(3, '0');
      
        return `${hoursString}:${minutesString}:${secondsString}.${millisecondsString}`;
    }




    async status() : Promise<any> {
        const diff: number = Date.now() - this.startTime;

        return { uptime: this.msToTime(diff) };
    }
}