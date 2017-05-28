import ApibNode from './apib-node';
import ActionNode, { ACTION_NODE_HEADER_REGEX } from './action-node';

export default class ResourceNode extends ApibNode {
  static headerRegex = /^#* (.+) \[(\S+)\]$/;

  constructor() {
    super();

    this.url = '';
  }

  get header() {
    return this.hashHeader + ' ' + this.name + ' [' + this.url + ']';
  }

  set header(value) {
    let result = ResourceNode.headerRegex.exec(value);

    this.name = result[1].trim();
    this.url = result[2];
  }

  static canAcceptHeader(header) {
    return ResourceNode.headerRegex.test(header);
  }

  checkAcceptableChild(child) {
    if (!(child instanceof ActionNode)) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}
