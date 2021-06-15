'use strict';
// start of keep this stuff on top
process.on('uncaughtException', (err) => {
  util.log('uncaughtException', err);
  process.abort();
});

process.on('unhandledRejection', (err) => {
  util.log('unhandledRejection', err);
  process.abort();
});

// configuration set up
process.env.NODE_ENV = 'test';
process.env.SMTP_HOST = 'test';
process.env.SMTP_USERNAME = 'test';
process.env.SMTP_PASSWORD = 'test';

// end of keep this stuff on top
const util = require('util');
const lodash = require('lodash');
const sinon = require('sinon');

// set up chai plugins
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiUrl = require('chai-url');
const chaiSerialize = require('test/test-helpers/chai-helpers/serialize');

chai.use(chaiAsPromised);
chai.use(chaiUrl);
chai.use(chaiSerialize);

const logger = require('app/lib/logger');

// initialize fake task kue
class FakeTaskKue {
  constructor() {
    this.taskQueue = [];
    this.registeredTasks = new Map();
  }

  queue(task) {
    this.taskQueue.push(task._serialize());
    return this;
  }

  save() {
    return this;
  }

  delay(delayMs) {
    util.log(`Called delay on a FakeTaskKue with delayMs: ${delayMs}, but ignoring in test environment.`);
    return this;
  }

  pop() {
    const jobData = this.taskQueue.pop();
    if (jobData) {
      const taskCls = this.registeredTasks.get(jobData.type);
      return taskCls._deserialize(jobData);
    }
  }

  size() {
    return this.taskQueue.length;
  }

  reset() {
    this.taskQueue = [];
  }

  register(taskCls) {
    taskCls._setDefaultTaskKue(this);
    this.registeredTasks.set(taskCls._jobType(), taskCls);
  }
}

const fakeTaskKue = new FakeTaskKue();

global.fakeTaskKue = fakeTaskKue;

const stubLoggers = [
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace'
];

stubLoggers.forEach((stubLogger) => {
  sinon.stub(logger.getClass().prototype, stubLogger);
});
