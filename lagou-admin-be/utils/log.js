const log4js = require("log4js");

log4js.configure({
    appenders: { lagou: { type: "file", filename: "./log/lagou.log" } },
    categories: { default: { appenders: ["lagou"], level: "trace" } }
});


const logger = log4js.getLogger("lagou");
// 日志级别由低到高
// logger.trace("Entering cheese testing");
// logger.debug("Got cheese.");
// logger.info("Cheese is Comté.");
// logger.warn("Cheese is quite smelly.");
// logger.error("gp-18")
// logger.error("Cheese is too ripe!");
// logger.fatal("Cheese was breeding ground for listeria.");

module.exports = logger;