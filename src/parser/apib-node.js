export const NodeActions = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
  OPTIONS: 'OPTIONS'
};

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
export class ApibNode {
  constructor(depth = 0) {
    this.id = nodeIdCounter++;
    this.parent = null;
    this.children = [];
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

export class PackageNode extends ApibNode {
  static canAcceptHeader(header) {
    return true;
  }

  static createFromHeader(header) {
    let node = new PackageNode();
    node.header = header;
    return node;
  }

  checkAcceptableChild(child) {
    if (!(child instanceof PackageNode) ||
        !(child instanceof ResourceGroupNode) ||
        !(child instanceof ModelGroupNode)
    ) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}

export class ResourceGroupNode extends ApibNode {
  static canAcceptHeader(header) {
    return header.trim().indexOf('Group') === 0;
  }

  checkAcceptableChild(child) {
    if (!(child instanceof ResourceNode) ||
        !(child instanceof ModelGroupNode) ||
        !(child instanceof ActionNode)
    ) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}

export class ResourceNode extends ApibNode {
  static canAcceptHeader(header) {
    return true;
  }

  checkAcceptableChild(child) {
    if (!(child instanceof ActionNode)) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}

export class ModelGroupNode extends ApibNode {
  static canAcceptHeader(header) {
    return header.trim().indexOf('Data Structures') === 0;
  }

  checkAcceptableChild(child) {
    if (!(child instanceof ModelNode)) {
      throw new Error('The given node is not acceptable for child.');
    } 
  }
}

export class ModelNode extends ApibNode {
  static canAcceptHeader(header) {
    return /\S+ \(\S+\)/.test(header);
  }

  checkAcceptableChild(child) {
    throw new Error('Model node is a terminal node that doesn\'t accept any children.');
  }
}

export class ActionNode extends ApibNode {
  static canAcceptHeader(header) {
    return /.+ \[.+\]/.test(header);
  }

  checkAcceptableChild(child) {
    throw new Error('Action node is a terminal node that doesn\'t accept any children.');
  }
}
