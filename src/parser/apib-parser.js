import ApibNode from './apib-node';
import PackageNode from './package-node';
import ResourceGroupNode from './resource-group-node';
import ModelGroupNode from './model-group-node';
import ResourceNode from './resource-node';
import ModelNode from './model-node';
import ActionNode from './action-node';

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
    let root = new ApibNode();
    let node = root;
    let parsingNote = false;

    for (let line of lines) {
      if (!parsingNote && line[0] === '#') {
        let depth = line.indexOf(' ');
        let parent = node.findRecentParent(depth);
        let nodeClass = this.nodeClasses.find(p => p.canAcceptHeader(line));
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
}
