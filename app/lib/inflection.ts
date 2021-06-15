import { memoize } from 'lodash';
import * as inflection from 'inflection';

export default {
  pluralize: memoize(inflection.pluralize),
  underscore: memoize(inflection.underscore),
  singularize: memoize(inflection.singularize),
  camelize: memoize(inflection.camelize),
  camelizeLowFirstLetter: memoize((str) => inflection.camelize(str, true)),
  classify: memoize(inflection.classify),
  dasherize: memoize(inflection.dasherize),
  titleize: memoize(inflection.titleize)
};
