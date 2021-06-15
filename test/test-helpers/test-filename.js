'use strict';

function startFile (filename) {
  // eslint-disable-next-line no-console
  console.log(`EXECUTING TEST ${filename}`);

  // eslint-disable-next-line no-console
  console.time(`TEST_TIME ${filename}`);
}

function finishFile (filename) {
  // eslint-disable-next-line no-console
  console.timeEnd(`TEST_TIME ${filename}`);
  // eslint-disable-next-line no-console
  console.log('TEST_MEMORY', process.memoryUsage().rss / 1024 / 1024, '(MiB)');
}

module.exports = {
  startFile,
  finishFile
};
