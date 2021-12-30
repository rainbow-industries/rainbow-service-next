import Action from './Action.js';
export default class StatusAction extends Action {
    constructor() {
        super();
        this.name = 'StatusAction';
        this.startTime = Date.now();
    }
    async load() {
        const typeDef = await this.signUpTypeDefinition();
        this.registerResolver('Query', 'status', typeDef, this.status.bind(this));
        return super.load();
    }
    async signUpTypeDefinition() {
        return `
            type Query {
                status: Status
            }

            type Status {
                uptime: String
            }
        `;
    }
    msToTime(duration) {
        const milliseconds = Math.floor((duration % 1000) / 100), seconds = Math.floor((duration / 1000) % 60), minutes = Math.floor((duration / (1000 * 60)) % 60), hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        const hoursString = String(hours).padStart(2, '0');
        const minutesString = String(minutes).padStart(2, '0');
        const secondsString = String(seconds).padStart(2, '0');
        const millisecondsString = String(milliseconds).padEnd(3, '0');
        return `${hoursString}:${minutesString}:${secondsString}.${millisecondsString}`;
    }
    async status() {
        const diff = Date.now() - this.startTime;
        return { uptime: this.msToTime(diff) };
    }
}
//# sourceMappingURL=StatusAction.js.map