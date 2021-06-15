'use strict';

// const continuationLocalStorage = require('cls-hooked');
import continuationLocalStorage from 'cls-hooked';
const loggerNamespace = continuationLocalStorage.createNamespace('logger');

class Logger {
  setDefaultLogger (logger) {
    this.defaultLogger = logger;
  }

  getLogger () {
    this.defaultLogger = this.defaultLogger || require('pino')();
    return loggerNamespace.get('logger') || this.defaultLogger;
  }

  setLogger (logger) {
    loggerNamespace.set('logger', logger);
  }

  setLoggerContext (context) {
    this.setLogger(this.getLogger().child(context));
  }

  wrapWithLogger (logger, func) {
    return loggerNamespace.runAndReturn((_ctx) => {
      this.setLogger(logger);
      return func();
    });
  }

  wrapWithLoggerContext (context, func) {
    return loggerNamespace.runAndReturn((_ctx) => {
      this.setLoggerContext(context);
      return func();
    });
  }

  fatal () {
    return this.getLogger().fatal(...arguments);
  }

  error () {
    return this.getLogger().error(...arguments);
  }

  warn () {
    return this.getLogger().warn(...arguments);
  }

  info () {
    return this.getLogger().info(...arguments);
  }

  debug () {
    return this.getLogger().debug(...arguments);
  }

  trace () {
    return this.getLogger().trace(...arguments);
  }

  // used by tests so we can stub instance methods and suppress logger output
  getClass () {
    return Logger;
  }
}

module.exports = new Logger();
