import assert from 'assert';
import ApiBlueprintParser from '../../src/parser/api-blueprint-parser';

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

const INCLUDE_TEST_TEXT = `
This is a including external files test.

# TEST

<!-- include(test.apib) -->
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
    assert.equal(root.children[1].type, 'group');
    assert.equal(root.children[1].children.length, 1);
    assert.equal(root.children[1].children[0].children.length, 2);
    assert.equal(root.children[1].children[0].type, 'resource');
    assert.equal(root.children[1].children[0].children[1].type, 'action');
    assert.equal(root.children[2].children[0].method, 'GET');
    assert.equal(root.children[2].children[0].url, '/resource2');
  });

  it('should include external files', async () => {
    let parser = new ApiBlueprintParser(async (filename) => {
      assert.equal(filename, 'test.apib');
      return TEST_TEXT;
    });
    let root = await parser.parse(INCLUDE_TEST_TEXT);

    assert.equal(root.children.length, 4);
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
