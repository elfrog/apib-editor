import assert from 'assert';
import ApiBlueprintParser from '../../src/parser/api-blueprint-parser';
import { ResourceNode, NodeTypes, NodeActions } from '../../src/parser/resource-node';

const TEST_TEXT = `
This is test api-blueprint source.
It should be a root node.

# API BLUEPRINT
First description.

# Group FirstGroup
First group description.

## Resource [/resource]
Resource description.

### Get Resource [GET]
Get a resource.

:::
# Note Block
this block doesn't affect on tree structure.
:::

### Put Resource [PUT]
Put a resource.

# Group SecondGroup
Second group description.

## Resource2 [GET /resource2]
blah blah...
`;

const WITHOUT_RESOURCE_DEFINITION_TEXT = `
This is api-blueprint source for test errors.

# Without resource definition [GET]
It should throw an error.
`; 

const UNSUPPORTED_METHOD_TEXT = `
This is api-blueprint source for test errors.

# Resource with unsupported method [PUNCH /resource]
It should throw an error.
`;

describe('ApiBlueprintParser', () => {
  it('should parse correctly', async () => {
    let parser = new ApiBlueprintParser();
    let root = await parser.parse(TEST_TEXT);

    assert.equal(root.children.length, 3);
    assert.equal(root.children[1].type, NodeTypes.GROUP);
    assert.equal(root.children[1].children.length, 1);
    assert.equal(root.children[1].children[0].children.length, 2);
    assert.equal(root.children[1].children[0].type, NodeTypes.RESOURCE);
    assert.equal(root.children[1].children[0].children[1].type, NodeTypes.ACTION);
    assert.equal(root.children[2].children[0].action, NodeActions.GET);
    assert.equal(root.children[2].children[0].url, '/resource2');
  });

  it('should throw an error when parsing without resource definition', (done) => {
    let parser = new ApiBlueprintParser();

    parser.parse(WITHOUT_RESOURCE_DEFINITION_TEXT).then(() => {
      done('error');
    }).catch(() => {
      done();
    });
  });

  it('should throw an error when parsing unsupported method', (done) => {
    let parser = new ApiBlueprintParser();

    parser.parse(UNSUPPORTED_METHOD_TEXT).then(() => {
      done('error');
    }).catch(() => {
      done();
    });
  });
});
