const { expect } = require('chai');
const request = require('supertest');

const Controllers = require('app/controllers/helloWorld');
const MockServer = require('test/test-helpers/mockServer');
const { startFile, finishFile } = require('test/test-helpers/test-filename');

describe('controllers/helloWorld', () => {
  let mockServer;

  before(async () => {
    mockServer = await MockServer(Controllers);
    startFile(__filename);
  });

  after(() => {
    finishFile(__filename);
    mockServer.bye();
  });

  describe('api endpoints', () => {
    describe('GET /hello-world', () => {
      it('should say hello world', async () => {
        const res = await request(mockServer.listener)
          .get('/hello-world')
          .query();
        expect(res).to.be.an('object');
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal('Hello, World');
      });
    });
    describe('GET /hello', () => {
      it('should say hello to the user', async () => {
        const name = 'Lil Wayne';
        const res = await request(mockServer.listener)
          .get('/hello')
          .query({ name });
        expect(res).to.be.an('object');
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal(`Hello, ${name}!`);
      });
    });
  });
});
