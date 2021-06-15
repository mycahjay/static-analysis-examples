'use strict';

const inflection = require('app/lib/inflection');

module.exports = function (chai /* utils */) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('serialize', function (modelName) {
    const obj = this._obj;

    const underscored = inflection.underscore(modelName);
    const pluralized = inflection.pluralize(underscored);

    // first, check response is 200
    new Assertion(obj.statusCode).to.be.equal(200);

    // then, check that the response has the expected serialized key
    this.assert(
      new Assertion(obj.payload[`${pluralized}`]).to.be.an('array').and.to.not.be.empty
      , 'expected #{this} to be a non-empty array'
      , 'expected #{this} to not be a populated array '
    );
  });
};
