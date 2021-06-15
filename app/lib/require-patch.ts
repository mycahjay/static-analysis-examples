/**
 * @module require-patch
 *
 * @description This is our new replacment for the legacy `root-relative`
 * We attempted to use a library that had similar functionality {@link=https://www.npmjs.com/package/tsconfig-paths}
 * however it introduced more problems and had extra dependencies we didn't need, so we rolled our own.
 * This also helps us avoind using webpack or grunt to help resolve modules
 *
 * @example From any file you can require file from our lookupPaths from below
 * const models = require('app/models'); // <- app is treated as a 'base' path
 * const scaffolds = require('test/test-helpers/scaffolds'); // <- again from any file you can require this as long as the path base is in the lookup arrray
 */
import Module from 'module';
import path from 'path';
const DefaultModule = (Module as any);
const lookupPaths = ['app', 'db', 'test', 'ab-cli-commands'];
const rootDir = path.join(__dirname, '..', '..');

// export original module functions for testing
export const originalLoad = DefaultModule._load;
export const originalResolveFilename = DefaultModule._resolveFilename;

/**
* @function updatedResolveFilename
* @description resolves require() requests filename
*/
export const updatedResolveFilename = function (request: string, parent: Module, isMain: boolean): string {
  // check if require request is in our lookupPaths array
  const requestHasPath = lookupPaths.some((path) => {
    return request.startsWith(`${path}/`);
  });
  // the new request will wither be the original request (to maintain normal behavior)
  // or we create the absolute path based on the root dir and our requested file
  const newRequest = requestHasPath ? path.join(rootDir, request) : request;
  // use the original _resolveFilename function to resolve the request
  return originalResolveFilename(newRequest, parent, isMain);
};

/**
* @function _load
* @description Loads require() requested module
* The main purpose of this is to solve the esModuleInterop problem in JS land.
* After the code is compiled JS needs to be able to resolve our modules.
* We didn't want to require('someModule').defualt.
*/
export const updatedLoad = function (request: string, parent: Module, isMain: boolean): any {
  // we use the original load fuction to resolve the initial request
  const result = originalLoad(request, parent, isMain);
  // we want normal behavior for dependancies
  const isNodemodule = parent && parent.id && parent.id.includes('/node_modules/');
  // if it's an esModule just resolve
  if (!result || !result.__esModule || !parent || parent.exports.__esModule || isNodemodule) {
    return result;
  }

  // if not return the default export
  return result.default || result;
};

// override module functions
DefaultModule._resolveFilename = updatedResolveFilename;
DefaultModule._load = updatedLoad;
