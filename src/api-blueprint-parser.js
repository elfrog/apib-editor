
class ApiBlueprintResourceNode {
  constructor(header = '', depth = 0, parent = null) {
    this.parent = parent;
    this.type = 'root';
    this.depth = depth;
    this.header = header;
    this.url = '';
    this.method = '';
    this.lines = [];
    this.children = [];

    if (parent) {
      parent.children.push(this);
    }
  }

  determineTypeByHeader(header) {
    let idx = header.indexOf('Group');

    if (idx === 0) {
      this.type = 'group';
      this.header = header.substring(idx + 1, header.length);
      return;
    }

    idx = header.indexOf('Data Structures');

    if (idx === 0) {
      this.type = 'models';
      return;
    }

    let endpointRegex = /(.+)\[(.+)\]/;
    let result = endpointRegex.exec(header);

    if (result) {
      this.header = result[1];

      let url = result[2];
      let urlSplits = url.split(' ');

      if (urlSplits.length === 1) {
        this.type = 'resource';
        this.url = url;
      } else {
        this.type = 'action';
        this.method = urlSplits[0];
        this.url = urlSplits[1];
      }
    } else {
      this.type = 'node';
    }
  }

  findRecentParent(depth) {
    if (depth > this.depth) {
      return this;
    }

    let node = this;

    while (node = node.parent) {
      if (node.depth < depth) {
        return node;
      }
    }

    return null;
  }
}

export default class ApiBlueprintParser {
  constructor() {
    this.lines = [];
    this.index = 0;
    this.parsingNote = false;
  }

  parse(markdownString) {
    this.lines = markdownString.split(/\r?\n/);
    this.index = 0;

    let root = new ApiBlueprintResourceNode();

    this._parse(root);

    return root;
  }

  _parse(node) {
    if (this.index >= this.lines.length) {
      return;
    }

    let line = this.lines[this.index++];

    if (!this.parsingNote && line[0] === '#') {
      let depth = line.indexOf(' ');

      if (depth > 0) {
        let header = line.substring(depth + 1, line.length);
        let parent = node.findRecentParent(depth);
        let newNode = new ApiBlueprintResourceNode(header, depth, parent);
        newNode.determineTypeByHeader(header);
        this._parse(newNode);
        return;
      }
    } else if (line.indexOf(':::') === 0) {
      this.parsingNote = !this.parsingNote;
    }

    node.lines.push(line);

    this._parse(node);
  }
}
