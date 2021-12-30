import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const winston = __require("winston");
const { format } = winston;
import util from 'util';
const { combine, timestamp, prettyPrint, printf } = format;
/**
 * custom logging format for the console logger
 *
 * @type       {Function}
 */
const formatter = printf(({ timestamp, level, message, meta, service, module }) => {
    return `${timestamp.substr(8).replace('Z', '').replace('T', ' ')} ${service}::${module} [${level}] ${message}${meta ? `\n${JSON.stringify(meta)}` : ''}`;
});
const configDefaults = {
    serviceName: 'unnamed-service',
    console: {
        enabled: true,
        level: 'debug',
    },
};
class RainbowLogger {
    constructor(parentLogger, moduleName) {
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
    createTransports(options) {
        const transports = [];
        if (options?.console?.enabled) {
            transports.push(new winston.transports.Console({
                format: combine(timestamp(), prettyPrint(), format.colorize(), formatter),
                level: options.console.level,
            }));
        }
        return transports;
    }
    getLogger() {
        if (!this.logger) {
            throw new Error(`Cannot create module: the logger was not confgured. Please call the configure method in your main file!`);
        }
        return this.logger;
    }
    checkStatus() {
        if (!this.logger) {
            const loggerInstance = this.parentLogger.getLogger();
            this.logger = loggerInstance.child({ module: this.moduleName });
        }
    }
    module(name) {
        return new RainbowLogger(this, name);
    }
    emerg(...args) {
        this.checkStatus();
        for (const item of args) {
            this.logger.emerg(item);
        }
    }
    alert(...args) {
        this.checkStatus();
        for (const item of args) {
            this.logger.alert(item);
        }
    }
    crit(...args) {
        this.checkStatus();
        for (const item of args) {
            this.logger.crit(item);
        }
    }
    error(...args) {
        this.checkStatus();
        for (const item of args) {
            this.logger.error(item);
        }
    }
    warning(...args) {
        this.checkStatus();
        for (const item of args) {
            this.logger.warning(item);
        }
    }
    notice(...args) {
        this.checkStatus();
        for (const item of args) {
            this.logger.notice(item);
        }
    }
    info(...args) {
        this.checkStatus();
        for (const item of args) {
            this.logger.info(item);
        }
    }
    debug(...args) {
        this.checkStatus();
        for (const item of args) {
            this.logger.debug(item);
        }
    }
    inspect(...args) {
        for (const arg of args) {
            console.log(util.inspect(arg, { depth: null, colors: true }));
        }
    }
}
export default new RainbowLogger(undefined, undefined);
//# sourceMappingURL=logger.js.map