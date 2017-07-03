import assert from 'assert';
import ApibParser from '../../src/parser/apib-parser';
import ResourceGroupNode from '../../src/parser/resource-group-node';
import ResourceNode from '../../src/parser/resource-node';
import ActionNode from '../../src/parser/action-node';

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
# Without Resource Definition
This is api-blueprint source for test errors.

## Without resource definition [GET]
It should throw an error.
`; 

const UNSUPPORTED_METHOD_TEXT = `
# Unsupported Method
This is api-blueprint source for test errors.

## Action with unsupported method [PUNCH /resource]
It should throw an error.
`;

describe('ApibParser', () => {
  it('should parse correctly', async () => {
    let parser = new ApibParser();
    let root = parser.parse(TEST_TEXT);

    assert.equal(root.children.length, 3);
    assert.ok(root.children[1] instanceof ResourceGroupNode);
    assert.equal(root.children[1].children.length, 1);
    assert.equal(root.children[1].children[0].children.length, 2);
    assert.ok(root.children[1].children[0] instanceof ResourceNode);
    assert.ok(root.children[1].children[0].children[1] instanceof ActionNode);
    assert.equal(root.children[2].children[0].action, 'GET');
    assert.equal(root.children[2].children[0].url, '/resource2');
  });

  it('should convert JSON to Node object and vice versa', () => {
    let parser = new ApibParser();
    let root = parser.parse(TEST_TEXT);
    let jsonData = root.asJson();

    assert.equal(root.header, jsonData.header);
    assert.equal(root.children.length, jsonData.children.length);

    let converted = parser.createNodeFromJson(jsonData);

    assert.equal(converted.header, jsonData.header);
    assert.equal(converted.children.length, jsonData.children.length);
    assert.equal(converted, converted.children[0].parent);
    assert.ok(converted.children[1] instanceof ResourceGroupNode);
  });

  it('should throw an error when parsing without resource definition', () => {
    let parser = new ApibParser();

    assert.throws(() => {
      parser.parse(WITHOUT_RESOURCE_DEFINITION_TEXT);
    });
  });

  it('should throw an error when parsing unsupported method', () => {
    let parser = new ApibParser();

    assert.throws(() => {
      parser.parse(UNSUPPORTED_METHOD_TEXT);
    });
  });
});
