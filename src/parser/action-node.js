import ApibNode from './apib-node';

export default class ActionNode extends ApibNode {
  constructor() {
    super();

    this.url = '';
    this.action = '';
  }

  get header() {
    if (this.url) {
      return this.name + ' [' + this.action + ' ' + this.url + ']';
    }

    return this.name + ' [' + this.action + ']';
  }

  set header(value) {
    let actionRegex = /(.+)\[(GET|POST|DELETE|PUT|UPDATE)\s?(.*)\]/;
    let result = actionRegex.exec(value);

    this.name = result[1].trim();
    this.action = result[2];
    this.url = result[3];
  }

  get urlInherited() {
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
