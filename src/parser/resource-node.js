import ApibNode from './apib-node';
import ActionNode from './action-node';

export default class ResourceNode extends ApibNode {
  constructor() {
    super();

    this.url = '';
  }

  get header() {
    return this.name + ' [' + this.url + ']';
  }

  set header(value) {
    let endpointRegex = /(.+)\[(.+)\]/;
    let result = endpointRegex.exec(value);

    this.name = result[1].trim();
    this.url = result[2];
  }

  static canAcceptHeader(header) {
    let resourceRegex = /.+\[.+\]/;

    if (resourceRegex.test(header)) {
      let actionRegex = /.+\[(GET|POST|DELETE|PUT|UPDATE)\s?(.*)\]/;
      
      if (!actionRegex.test(header)) {
        return true;
      }
    }

    return false;
  }

  checkAcceptableChild(child) {
    if (!(child instanceof ActionNode)) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}
