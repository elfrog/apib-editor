import ApibNode from './apib-node';
import ModelNode from './model-node';

export default class ModelGroupNode extends ApibNode {
  get name() {
    return 'Data Structures';
  }

  set name(value) {
    ;
  }

  get header() {
    return 'Data Structures';
  }

  set header(value) {
    ;
  }

  static canAcceptHeader(header) {
    return header.trim().indexOf('Data Structures') === 0;
  }

  checkAcceptableChild(child) {
    if (!(child instanceof ModelNode)) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}
