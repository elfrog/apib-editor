import 'babel-polyfill';

import ApiBlueprintParser from './parser/api-blueprint-parser';

const TEST_FILE_PATH = 'c:/projects/API 명세/index.apib';

let parser = new ApiBlueprintParser();

parser.parseFromFile(TEST_FILE_PATH).then(root => {
  console.log(root);
});
