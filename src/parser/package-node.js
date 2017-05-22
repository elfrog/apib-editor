import ApibNode from './apib-node';
import ResourceGroupNode from './resource-group-node';
import ModelGroupNode from './model-group-node';

export default class PackageNode extends ApibNode {
  static canAcceptHeader(header) {
    return true;
  }

  checkAcceptableChild(child) {
    if (!(child instanceof PackageNode) &&
        !(child instanceof ResourceGroupNode) &&
        !(child instanceof ModelGroupNode)
    ) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}
