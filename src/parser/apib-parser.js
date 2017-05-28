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
    let root = new PackageNode();

    root.name = 'Document';

    let parsingNote = false;
    let node = root;

    for (let line of lines) {
      if (!parsingNote && line[0] === '#') {
        let depth = line.indexOf(' ');
        let parent = node.findRecentParent(depth);
        let nodeClass = this.nodeClasses.find(p => p.canAcceptHeader(line));
        node = new nodeClass();
        node.depth = depth;
        node.header = line;
        parent.addChild(node);
      } else if (line.trim().indexOf(':::') === 0) {
        parsingNote = !parsingNote;
        node.lines.push(line);
      } else {
        node.lines.push(line);
      }
    }

    return root;
  }
}
