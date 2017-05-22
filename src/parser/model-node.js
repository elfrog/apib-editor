import ApibNode from './apib-node';

export default class ModelNode extends ApibNode {
  constructor() {
    super();

    this.modelType = '';
  }

  get header() {
    return super.header;
  }

  set header(value) {
    super.header = value;

    let result = /(\S+) \(\S+\)/.exec(value);

    this.name = result[1];
    this.modelType = result[2];
  }

  static canAcceptHeader(header) {
    return /\S+ \(\S+\)/.test(header);
  }

  checkAcceptableChild(child) {
    throw new Error('Model node is a terminal node that doesn\'t accept any children.');
  }
}
