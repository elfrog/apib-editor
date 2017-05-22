'use strict';

require('babel-polyfill');

var _apiBlueprintParser = require('./parser/api-blueprint-parser');

var _apiBlueprintParser2 = _interopRequireDefault(_apiBlueprintParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEST_FILE_PATH = 'c:/projects/API 명세/index.apib';

var parser = new _apiBlueprintParser2.default();

parser.parseFromFile(TEST_FILE_PATH).then(function (root) {
  console.log(root);
});