
let nodeIdCounter = 1;

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
  constructor() {
    this.id = nodeIdCounter++;
    this.parent = null;
    this.children = [];
    this.depth = 0;
    this._header = '';
    this.name = '';
    this.lines = [];
    this._description = null;
  }

  get header() {
    return this._header;
  }

  set header(value) {
    this._header = value;
    this.name = value;
  }

  get description() {
    if (this._description === null) {
      this._description = this.lines.join('\r\n');
    }

    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  checkAcceptableChild(child) {
    ;
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
}