import {
  PackageNode,
  ResourceGroupNode,
  ModelGroupNode,
  ResourceNode,
  ModelNode,
  ActionNode,
  NodeActions
} from './apib-node';

export default class ApibParser {
  constructor() {
    this.nodeClasses = [
      ActionNode,
      ModelNode,
      ResourceNode,
      ModelGroupNode,
      ResourceGroupNode,
      PackageNode
    ];
  }

  async parse(markdownString) {
    let lines = markdownString.split(/\r?\n/);
    let root = new PackageNode();

    let parsingNote = false;
    let node = root;

    for (let line of lines) {
      if (!parsingNote && line[0] === '#') {
        let depth = line.indexOf(' ');
        let header = line.substring(depth + 1, line.length);
        let parent = node.findRecentParent(depth);

        node = new ResourceNode(depth);
        parent.addChild(node);
        this.parseHeader(node, header);
      } else if (line.trim().indexOf(':::') === 0) {
        parsingNote = !parsingNote;
        node.lines.push(line);
      } else {
        node.lines.push(line);
      }
    }

    return root;
  }

  parseHeader(node, header) {
    if (header.indexOf('Group') === 0) {
      node.type = NodeTypes.GROUP
      node.header = header.substring(6, header.length);
      return;
    }

    if (header.indexOf('Data Structures') === 0) {
      node.type = NodeTypes.MODELS;
      node.header = 'Models';
      return;
    }

    let endpointRegex = /(.+)\[(.+)\]/;
    let result = endpointRegex.exec(header);

    if (result) {
      node.header = result[1];

      let url = result[2];
      let urlSplits = url.split(' ');

      if (urlSplits.length === 1) {
        if (url in NodeActions) {
          node.type = NodeTypes.ACTION;
          node.action = url;

          if (!node.parent || !node.parent.url) {
            throw new Error('Resource is not defined.');
          }

          node.url = node.parent.url;
        } else {
          node.type = NodeTypes.RESOURCE;
          node.url = url;
        }
      } else {
        if (!(urlSplits[0] in NodeActions)) {
          throw new Error('Unsupported action type: ' + urlSplits[0]);
        }

        node.type = NodeTypes.ACTION;
        node.action = urlSplits[0];
        node.url = urlSplits[1];
      }
    } else {
      node.header = header;
    }
  }
}
