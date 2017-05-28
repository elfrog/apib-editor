import assert from 'assert';

import ApibNode from '../../src/parser/apib-node';
import PackageNode from '../../src/parser/package-node';
import ResourceGroupNode from '../../src/parser/resource-group-node';
import ResourceNode from '../../src/parser/resource-node';

describe('ApibNode', () => {
  it('should add children correctly', () => {
    let parent = new ApibNode();
    let child1 = new ApibNode();
    let child2 = new ApibNode();

    parent.addChild(child1);
    parent.addChild(child2);

    assert.equal(parent.children.length, 2);
    assert.equal(child1.parent, parent);
    assert.equal(child2.parent, parent);
  });

  it('should remove children correctly', () => {
    let parent = new ApibNode();
    let child1 = new ApibNode();
    let child2 = new ApibNode();

    parent.addChild(child1);
    parent.addChild(child2);
    parent.removeChild(child1);

    assert.equal(parent.children.length, 1);
    assert.equal(parent.children[0], child2);
    assert.equal(child1.parent, null);
  });

  it('should add children owned by another parent correctly', () => {
    let parent1 = new ApibNode();
    let parent2 = new ApibNode();
    let child1 = new ApibNode();
    let child2 = new ApibNode();

    parent1.addChild(child2);
    parent2.addChild(child2);
    parent2.addChild(child1);

    assert.equal(child1.parent, parent2);
    assert.equal(parent1.children.length, 0);
  });

  it('should clone itself and its children', () => {
    let parent = new PackageNode();
    let child1 = new ResourceGroupNode();
    let child2 = new ResourceGroupNode();
    let child3 = new ResourceNode();

    parent.header = '# Test Package';
    child1.header = '## Group ResourceGroup1';
    child2.header = '## Group ResourceGroup2';
    child3.header = '### Resource [GET]';

    parent.addChild(child1);
    parent.addChild(child2);
    child1.addChild(child3);

    let copy = parent.clone();

    assert.notEqual(copy, parent);
    assert.deepEqual(copy, parent);
    assert.notEqual(copy.children[0], parent.children[0]);
    assert.deepEqual(copy.children[0], parent.children[0]);
  });
});
