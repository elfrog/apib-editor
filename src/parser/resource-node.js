
export const NodeTypes = {
  NODE: 'NODE',
  GROUP: 'GROUP',
  MODELS: 'MODELS',
  RESOURCE: 'RESOURCE',
  ACTION: 'ACTION'
};

export const NodeActions = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
  OPTIONS: 'OPTIONS'
};

let nodeIdCounter = 1;

export class ResourceNode {
  constructor(depth = 0) {
    this.id = nodeIdCounter++;
    this.parent = null;
    this.children = [];
    this.type = NodeTypes.NODE;
    this.depth = depth;
    this.header = '';
    this.url = '';
    this.action = '';
    this.lines = [];
    this._description = null;
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

  hasChild(child) {
    return this.children.indexOf(child) >= 0;
  }

  addChild(child) {
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
