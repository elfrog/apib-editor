import ApibNode from './apib-node';
import PackageNode from './package-node';
import ResourceGroupNode from './resource-group-node';
import ModelGroupNode from './model-group-node';
import ResourceNode from './resource-node';
import ModelNode from './model-node';
import ActionNode from './action-node';

export default class ApibParser {
  static nodeClasses = [
    ActionNode,
    ModelNode,
    ResourceNode,
    ModelGroupNode,
    ResourceGroupNode,
    PackageNode
  ];

  parse(markdownString) {
    let lines = markdownString.split(/\r?\n/);
    let root = new ApibNode();
    let node = root;
    let parsingNote = false;

    for (let line of lines) {
      if (!parsingNote && line[0] === '#') {
        let depth = line.indexOf(' ');
        let parent = node.findRecentParent(depth);
        let nodeClass = ApibParser.nodeClasses.find(p => p.canAcceptHeader(line));
        node = new nodeClass();
        node.header = line;
        node.depth = depth;
        node.parent = parent;
        parent.checkAcceptableChild(node);
        parent.children.push(node);
      } else if (line.trim().indexOf(':::') === 0) {
        parsingNote = !parsingNote;
        node.lines.push(line);
      } else {
        node.lines.push(line);
      }
    }

    // Normalize the depth.
    root.setDepth(0);

    return root;
  }

  createNodeFromJson(data, preserveId = true) {
    let nodeClass = ApibParser.nodeClasses.find(p => p.canAcceptHeader(data.header));
    let node = new nodeClass();

    if (preserveId) {    
      node.id = data.id;
    }

    node.depth = data.header.indexOf(' ');
    node.header = data.header;
    node.description = data.description;
    node.children = data.children.map(child => {
      let childNode = this.createNodeFromJson(child, preserveId);
      childNode.parent = node;
      return childNode;
    });

    return node;
  }
}
