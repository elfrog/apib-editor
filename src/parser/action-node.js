import ApibNode from './apib-node';

export default class ActionNode extends ApibNode {
  constructor() {
    super();

    this._url = '';
    this.action = '';
  }

  get header() {
    return super.header;
  }

  set header(value) {
    super.header = value;

    let actionRegex = /(.+)\[(GET|POST|DELETE|PUT|UPDATE)\s?(.*)\]/;
    let result = actionRegex.exec(value);

    this.name = result[1];
    this.action = result[2];
    this._url = result[3];
  }

  get url() {
    if (this._url) {
      return this._url;
    }

    if (!this.parent || !this.parent.url) {
      throw new Error('Resource is not defined.');
    }

    return this.parent.url;
  }

  static canAcceptHeader(header) {
    let actionRegex = /.+\[(GET|POST|DELETE|PUT|UPDATE)\s?(.*)\]/;
    
    return actionRegex.test(header);
  }

  checkAcceptableChild(child) {
    throw new Error('Action node is a terminal node that doesn\'t accept any children.');
  }
}
