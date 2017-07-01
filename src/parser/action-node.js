import ApibNode from './apib-node';

export const SUPPORTED_ACTION_METHODS = ['GET', 'PUT', 'POST', 'DELETE', 'UPDATE'];

export default class ActionNode extends ApibNode {
  static headerRegex = /^#* (.+) \[([A-Z]+) ?(\S*)\]$/;
  static acceptableNodes = [];

  constructor() {
    super();

    this.url = '';
    this.action = 'GET';
  }

  get header() {
    if (this.url) {
      return this.hashHeader + ' ' + this.name + ' [' + this.action + ' ' + this.url + ']';
    }

    return this.hashHeader + ' ' + this.name + ' [' + this.action + ']';
  }

  set header(value) {
    let result = ActionNode.headerRegex.exec(value);

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
    let result = ActionNode.headerRegex.exec(header);

    if (!result) {
      return false;
    }

    let action = result[2];

    if (SUPPORTED_ACTION_METHODS.indexOf(action) < 0) {
      throw new Error('Unsupported action method: ' + action);
    }

    return true;
  }
}
