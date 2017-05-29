import ApibNode from './apib-node';
import ResourceGroupNode from './resource-group-node';
import ModelGroupNode from './model-group-node';

export default class PackageNode extends ApibNode {
  static acceptableNodes = [PackageNode, ResourceGroupNode, ModelGroupNode];

  static canAcceptHeader(header) {
    return ApibNode.headerRegex.test(header);
  }
}
