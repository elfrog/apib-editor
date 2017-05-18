import fs from 'fs';
import ApiBlueprintParser from './api-blueprint-parser';

const TEST_FILE_PATH = 'C:/Users/Administrator/Documents/개발 문서/씽크매스 리뉴얼 스펙/API 명세/learning-management-system.apib';

fs.readFile(TEST_FILE_PATH, 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  console.log(parseIncludeFiles(data));

  let parser = new ApiBlueprintParser();
  let root = parser.parse(data);

  console.log(root.children[0].children[1]);
});

function parseIncludeFiles(str) {
  let regex = /include\(([\w\-]+\.apib)/g;
  let includes = [];
  let matches = null;

  while (matches = regex.exec(str)) {
    includes.push(matches[1]);
  }

  return includes;
}
