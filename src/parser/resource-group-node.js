import ApibNode from './apib-node';
import ResourceNode from './resource-node';
import ModelGroupNode from './model-group-node';
import ActionNode from './action-node';

export default class ResourceGroupNode extends ApibNode {
  static headerRegex = /^#* Group (.+)$/;
  static acceptableNodes = [ResourceNode, ActionNode, ModelGroupNode];

  get header() {
    return this.hashHeader + ' Group ' + this.name;
  }

  set header(value) {
    let result = ResourceGroupNode.headerRegex.exec(value);

    this.name = result[1];
  }

  static canAcceptHeader(header) {
    return ResourceGroupNode.headerRegex.test(header);
  }
}
