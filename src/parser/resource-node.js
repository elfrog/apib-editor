import ApibNode from './apib-node';
import ActionNode from './action-node';

export default class ResourceNode extends ApibNode {
  static headerRegex = /^#* (.+) \[(\S+)\]$/;
  static acceptableNodes = [ActionNode];

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
}
