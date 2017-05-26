import ApibNode from './apib-node';
import ResourceNode from './resource-node';
import ModelGroupNode from './model-group-node';
import ActionNode from './action-node';

export default class ResourceGroupNode extends ApibNode {
  get header() {
    return 'Group ' + super.header;
  }

  set header(value) {
    this.name = value.substring(6, value.length);
  }

  static canAcceptHeader(header) {
    return header.trim().indexOf('Group') === 0;
  }

  checkAcceptableChild(child) {
    if (!(child instanceof ResourceNode) && 
        !(child instanceof ModelGroupNode) &&
        !(child instanceof ActionNode)
    ) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}
