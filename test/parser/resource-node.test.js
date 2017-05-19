import assert from 'assert';

import { ResourceNode } from '../../src/parser/resource-node';

describe('ResourceNode', () => {
  it('should add children correctly', () => {
    let parent = new ResourceNode();
    let child1 = new ResourceNode();
    let child2 = new ResourceNode();

    parent.addChild(child1);
    parent.addChild(child2);

    assert.equal(parent.children.length, 2);
    assert.equal(child1.parent, parent);
    assert.equal(child2.parent, parent);
  });

  it('should remove children correctly', () => {
    let parent = new ResourceNode();
    let child1 = new ResourceNode();
    let child2 = new ResourceNode();

    parent.addChild(child1);
    parent.addChild(child2);
    parent.removeChild(child1);

    assert.equal(parent.children.length, 1);
    assert.equal(parent.children[0], child2);
    assert.equal(child1.parent, null);
  });

  it('should add children owned by another parent correctly', () => {
    let parent1 = new ResourceNode();
    let parent2 = new ResourceNode();
    let child1 = new ResourceNode();
    let child2 = new ResourceNode();

    parent1.addChild(child1);
    parent2.addChild(child2);
    parent2.addChild(child1);

    assert.equal(child1.parent, parent2);
    assert.equal(parent1.children.length, 0);
  });
});
