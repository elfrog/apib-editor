import fs from 'fs';
import path from 'path';

import ApiBlueprintResourceNode from './api-blueprint-resource-node';

export default class ApiBlueprintParser {
  constructor(fileLoader = null) {
    this.basePath = '';
    this.fileLoader = fileLoader || (async (filepath) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path.join(this.basePath, filepath), 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    });
  }

  async parseFromFile(filepath) {
    let markdownString = await this.fileLoader(filepath);
    this.basePath = path.dirname(filepath);
    return await this.parse(markdownString);
  }

  async parse(markdownString) {
    let lines = markdownString.split(/\r?\n/);
    let root = new ApiBlueprintResourceNode();

    let parsingNote = false;
    let node = root;

    for (let line of lines) {
      if (!parsingNote && line[0] === '#') {
        let depth = line.indexOf(' ');
        let header = line.substring(depth + 1, line.length);
        let parent = node.findRecentParent(depth);

        node = new ApiBlueprintResourceNode(header, depth, parent);
      } else if (line.indexOf(':::') === 0) {
        parsingNote = !parsingNote;
        node.lines.push(line);
      } else if (line.indexOf('<!--') === 0 && this.fileLoader) {
        let regex = /include\(([\w\-]+\.apib)/;
        let matches = regex.exec(line);

        if (matches) {
          let loadedString = await this.fileLoader(matches[1]);
          let loadedNode = await this.parse(loadedString);

          for (let childNode of loadedNode.children) {
            let parent = node.findRecentParent(childNode.depth);
            childNode.parent = parent;
            parent.children.push(childNode);
          }
        }
      } else {
        node.lines.push(line);
      }
    }

    return root;
  }
}
