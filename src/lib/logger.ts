import winston = require('winston');
const { format } = winston;
import util from 'util';

const {
    combine,
    timestamp,
    prettyPrint,
    printf
} = format;


/**
 * custom logging format for the console logger
 *
 * @type       {Function}
 */
const formatter = printf(({
    timestamp,
    level,
    message,
    meta,
    service,
    module
}) => {
    return `${timestamp.substr(8).replace('Z', '').replace('T', ' ')} ${service}::${module} [${level}] ${message}${meta ? `\n${JSON.stringify(meta)}` : ''}`;
});



interface IConsoleLoggerConfig {
    enabled: boolean,
    level: string,
}


interface ILoggerConfig {
    serviceName: string,
    console?: IConsoleLoggerConfig,
}


const configDefaults: ILoggerConfig = {
    serviceName: 'unnamed-service',
    console: {
        enabled: true,
        level: 'debug',
    },
};



class RainbowLogger {
    private logger: winston.Logger;
    private readonly parentLogger: RainbowLogger;
    private readonly moduleName: string;

    constructor(parentLogger: RainbowLogger | undefined, moduleName: string | undefined) {
        if (parentLogger) {
            this.parentLogger = parentLogger;
        }

        if (moduleName) {
            this.moduleName = moduleName;
        }
    }


    configure(options = configDefaults) {
        const transports = this.createTransports(options);

        this.logger = winston.createLogger({
            transports,
        }).child({
            service: options.serviceName,
        });
    }


    createTransports(options: ILoggerConfig) : winston.transport[] {
        const transports: winston.transport[] = [];

        if (options?.console?.enabled) {
            transports.push(new winston.transports.Console({
                format: combine(
                    timestamp(),
                    prettyPrint(),
                    format.colorize(),
                    formatter,
                ),
                level: options.console.level,
            }));
        }

        return transports;
    }


    getLogger() : winston.Logger {
        if (!this.logger) {
            throw new Error(`Cannot create module: the logger was not confgured. Please call the configure method in your main file!`);
        }

        return this.logger;
    }


    private checkStatus() {
        if (!this.logger) {
            const loggerInstance = this.parentLogger.getLogger();
            this.logger = loggerInstance.child({ module: this.moduleName });
        }
    }


    module(name: string) : RainbowLogger {
        return new RainbowLogger(this, name);
    }



    emerg(...args: any[]) : void {
        this.checkStatus();

        for (const item of args) {
            this.logger.emerg(item);
        }
    }


    alert(...args: any[]) : void {
        this.checkStatus();

        for (const item of args) {
            this.logger.alert(item);
        }
    }


    crit(...args: any[]) : void {
        this.checkStatus();

        for (const item of args) {
            this.logger.crit(item);
        }
    }


    error(...args: any[]) : void {
        this.checkStatus();

        for (const item of args) {
            this.logger.error(item);
        }
    }


    warning(...args: any[]) : void {
        this.checkStatus();

        for (const item of args) {
            this.logger.warning(item);
        }
    }


    notice(...args: any[]) : void {
        this.checkStatus();

        for (const item of args) {
            this.logger.notice(item);
        }
    }


    info(...args: any[]) : void {
        this.checkStatus();

        for (const item of args) {
            this.logger.info(item);
        }
    }


    debug(...args: any[]) : void {
        this.checkStatus();

        for (const item of args) {
            this.logger.debug(item);
        }
    }



    inspect(...args: any[]) {
        for (const arg of args) {
            console.log(util.inspect(arg, { depth: null, colors: true }));
        }
    }
}



export default new RainbowLogger(undefined, undefined);

