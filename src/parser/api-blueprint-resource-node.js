
const SUPPORTED_ACTIONS = ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'];

export default class ApiBlueprintResourceNode {
  constructor(header = '', depth = 0, parent = null) {
    this.parent = parent;
    this.type = 'node';
    this.depth = depth;
    this.header = header;
    this.url = '';
    this.method = '';
    this.lines = [];
    this.children = [];

    if (parent) {
      parent.children.push(this);
    }

    if (header) {
      this.determineTypeByHeader(header);
    }
  }

  determineTypeByHeader(header) {
    if (header.indexOf('Group') === 0) {
      this.type = 'group';
      this.header = header.substring(6, header.length);
      return;
    }

    if (header.indexOf('Data Structures') === 0) {
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
        if (SUPPORTED_ACTIONS.indexOf(url) >= 0) {
          this.type = 'action';
          this.method = url;

          if (!this.parent || !this.parent.url) {
            throw new Error('Resource is undefined.');
          }

          this.url = this.parent.url;
        } else {
          this.type = 'resource';
          this.url = url;
        }
      } else {
        if (SUPPORTED_ACTIONS.indexOf(urlSplits[0]) < 0) {
          throw new Error('Unsupported action type: ' + urlSplits[0]);
        }

        this.type = 'action';
        this.method = urlSplits[0];
        this.url = urlSplits[1];
      }
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
