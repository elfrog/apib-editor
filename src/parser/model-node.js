import ApibNode from './apib-node';

export default class ModelNode extends ApibNode {
  static headerRegex = /^#* (.+) \((\S+)\)$/;
  static acceptableNodes = [];

  constructor() {
    super();

    this.modelType = 'object';
  }

  get header() {
    if (this.modelType) {
      return this.hashHeader + ' ' + this.name + ' (' + this.modelType + ')';
    }

    return super.header;
  }

  set header(value) {
    let result = ModelNode.headerRegex.exec(value);

    this.name = result[1];
    this.modelType = result[2];
  }

  static canAcceptHeader(header) {
    return ModelNode.headerRegex.test(header);
  }
}
