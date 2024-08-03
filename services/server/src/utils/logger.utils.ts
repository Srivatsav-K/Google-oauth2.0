import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
  //TODO https://www.npmjs.com/package/@elastic/ecs-winston-format
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    //new transports.File({ filename: "app.log" }),
  ],
});

export default logger;
