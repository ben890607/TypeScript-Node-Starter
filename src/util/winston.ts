//= winston : A logger for just about everything. - http://github.com/winstonjs/winston
//= winston-daily-rotate-file - https://www.npmjs.com/package/winston-daily-rotate-file
//= winston-mongodb - https://github.com/winstonjs/winston-mongodb
//* winston-daily-rotate-file transports - https://www.npmjs.com/package/winston-daily-rotate-file#options

// import * as ENV from "./secrets";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
//import Environment from './Environment';
// import {MongoDB} from "winston-mongodb";

//! Define log foramt
const fmt = format.combine(
	format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	format.errors({ stack: true }),
	format.splat(),
	format.metadata({
		fillExcept: ["level", "timestamp", "service", "message", "stack"],
	}),
	format.json(), // default is JSON Format.
	format.prettyPrint()
);

//! Create Default Log
const logger = createLogger({
	// level: process.env.NODE_ENV === "production" ? "info" : "debug",
	level: "debug",
	format: fmt,
	defaultMeta: { service: "b-dev" },
	transports: [
		// new transports.File({ filename: 'log/error.json', level: 'error' }),
		// new transports.File({ filename: 'log/combined.json' }),
	],
});

if (true) {
	//! Daily Rotate File log only errors.
	logger.add(
		new transports.DailyRotateFile({
			level: "error",
			filename: "log/error-%DATE%.log",
			datePattern: "YYYY-MM-DD-HH",
			maxSize: "50m",
			handleExceptions: true,
		})
	);
	//! Daily Rotate File log for all
	logger.add(
		new transports.DailyRotateFile({
			filename: "log/wdev-%DATE%.log",
			datePattern: "YYYY-MM-DD-HH",
			maxSize: "30m",
			handleExceptions: true,
		})
	);
}

//! MongoDB Log
// if (process.env.NODE_ENV !== "production") {
//     logger.add(
//     new MongoDB({
//       level:"debug",
//       db:"mongodb://localhost:27017/tsns",
//       options: {useUnifiedTopology: true},
//       collection: "log"
//     }));
// }

//! log to the `console`
// if (process.env.NODE_ENV !== "production") {
logger.add(
	new transports.Console({
		format: format.combine(
			format.colorize()
			// format.simple(),
			// format.logstash(),
			// format.json(),
			// format.prettyPrint(),
			// format.printf(({ level, message,label, service, timestamp }) => {
			//   return `${timestamp} [${service}] [${label}] ${level}: ${message}`;
			// }),
			// format.printf((info) => {
			//   return `${info.timestamp} [${info.service}] ${info.level}: ${info.message} - ${info.meta}`;
			// }),
		),
	})
);
// }

//* ***************
//* Allows for JSON logging
//* ***************

// logger.debug({
//   message: 'Allows for JSON logging',
//   additional: 'properties',
//   are: 'passed along'
// });

//* ***************
//* Allows for parameter-based logging
//* ***************

// logger.info('Allows for parameter-based logging', {
//   additional: 'properties',
//   are: 'passed along'
// });

// logger.debug("log user", {
//   gender:"Female",
//   name:"Milk"
// });

//* ***************
//* Allows for string interpolation
//* ***************
// logger.debug('Allows for string interpolation - %s', 'my string');
// logger.debug('Allows for string interpolation - %d', 123);
// logger.debug('Allows for string interpolation - %s, %s', 'first', 'second', { number: 123 });
// logger.info('Found %s at %s', 'error', new Date());
// logger.info('Found %s at %s', 'error', new Error('chill winston'));
// logger.info('Found %s at %s', 'error', /WUT/);
// logger.info('Found %s at %s', 'error', true);
// logger.info('Found %s at %s', 'error', 100.00);
// logger.info('Found %s at %s', 'error', ['1, 2, 3']);

//* ***************
//* Allows for logging Error instances
//* ***************

// logger.warn("Maybe important error: ", new Error("Error passed as meta"));
// logger.error(new Error("Error passed as info"));

//* ***************
//* show logger load success when debug
//* ***************

logger.debug("winston running up with ENV.");

export default logger;
