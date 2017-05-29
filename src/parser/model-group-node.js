import ApibNode from './apib-node';
import ModelNode from './model-node';

export default class ModelGroupNode extends ApibNode {
  static headerRegex = /^#* Data Structures$/;
  static acceptableNodes = [ModelNode];

  get name() {
    return 'Data Structures';
  }

  set name(value) {
    ;
  }

  get header() {
    return this.hashHeader + ' Data Structures';
  }

  set header(value) {
    ;
  }

  static canAcceptHeader(header) {
    return ModelGroupNode.headerRegex.test(header);
  }
}
