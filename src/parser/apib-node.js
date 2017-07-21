
const HASH_HEADERS = ['', '#', '##', '###', '####', '#####', '######', '######', '########', '#########'];

/**
 * Node for Api-blueprint parsing tree.
 * ApibNode is just an abstract node.
 * Node's parent-chlid relationship is only allowed when
 * 
 * - Package > Package
 * - Package > ResourceGroup
 * - Package > ModelGroup
 * - ResourceGroup > ModelGroup
 * - ResourceGroup > Resource
 * - ModelGroup > Model
 * - Resource > Action
 * 
 * So ModelNode and ActionNode become terminal nodes.
 */
export default class ApibNode {
  static headerRegex = /^#* ([^#]*)$/;
  static acceptableNodes = [ApibNode];

  constructor() {
    this.id = 1 + Math.floor(Math.random() * 0x100000);
    this.parent = null;
    this.children = [];
    this.depth = 0;
    this.name = '';
    this.lines = [];
    this._description = null;
  }

  get header() {
    return this.hashHeader + ' ' + this.name;
  }

  set header(value) {
    let content = value.substring(value.lastIndexOf('#') + 1, value.length).trim();
    this.name = content;
  }

  get description() {
    if (this._description === null) {
      this._description = this.lines.join('\n');
    }

    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  get hashHeader() {
    return HASH_HEADERS[this.depth];
  }

  // Not only check the header is parsable or not,
  // but also check data validity by throwing exception. 
  static canAcceptHeader(header) {
    return ApibNode.headerRegex.test(header);
  }

  checkAcceptableChild(child) {
    if (!this.constructor.acceptableNodes.some(nodeClass => child instanceof nodeClass)) {
      throw new Error('The given node can\'t be a child.');
    }
  }

  hasChild(child) {
    return this.children.indexOf(child) >= 0;
  }

  addChild(child) {
    this.checkAcceptableChild(child);

    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;
    child.setDepth(this.depth + 1);
    this.children.push(child);
  }

  addChildAt(child, index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error('The index is out of bounds: ', index);
    }

    this.checkAcceptableChild(child);

    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;
    child.setDepth(this.depth + 1);
    this.children.splice(index, 0, child);
  }

  getChildIndex(child) {
    let index = this.children.indexOf(child);

    if (index < 0) {
      throw new Error('The given node is not child of this node.');
    }

    return index;
  }

  removeChild(child) {
    if (child.parent !== this) {
      return;
    }

    let index = this.children.indexOf(child);
    this.children.splice(index, 1);
    child.parent = null;
  }

  removeChildAt(index) {
    let child = this.children[index];

    if (child) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  setDepth(depth) {
    this.depth = depth;

    for (let child of this.children) {
      child.setDepth(depth + 1);
    }
  }

  findNodeById(id) {
    if (this.id === id) {
      return this;
    }

    for (let child of this.children) {
      let node = child.findNodeById(id);

      if (node) {
        return node;
      }
    }

    return null;
  }

  findRecentParent(depth) {
    if (depth > this.depth) {
      return this;
    }

    let node = this;

    while (node = node.parent) {
      if (node.depth < depth) {
        return node;
      }
    }

    return null;
  }

  flatten() {
    let list = [this];

    for (let child of this.children) {
      list = list.concat(child.flatten());
    }

    return list;
  }

  clone() {
    let node = new this.constructor();
    Object.assign(node, this);

    node.children = this.children.map(child => {
      let childNode = child.clone();
      childNode.parent = node;
      return childNode;
    });

    return node;
  }

  asString(newLine = '\n') {
    let content = (this.parent ? this.header : '') + newLine + this.description;

    if (this.children.length > 0) {
      let list = this.children.map(child => child.asString(newLine).trim());

      return content.trim() + newLine + newLine + list.join(newLine + newLine) + newLine;
    } else {
      return content.trim() + newLine;
    }
  }

  asJson() {
    return {
      id: this.id,
      header: this.header,
      description: this.description,
      children: this.children.map(child => child.asJson())
    };
  }
}
