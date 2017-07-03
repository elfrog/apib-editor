import ApibParser from '../../parser/apib-parser';

const NEW_DOCUMENT_TEMPLATE = `FORMAT: 1A
HOST: https://api.example.com

# Group Example API
This is an example group.

## Resource [/resource]
This is an example resource.

### Get a Resource [GET]
This is an example action.

+ Response 200 (text/plain)
        
        test resource

`;

export default function openNewDocument() {
  let parser = new ApibParser();
  let root = parser.parse(NEW_DOCUMENT_TEMPLATE);

  root.name = 'my-project.apib';

  return {
    rootNode: root,
    activeNodeId: root.id,
    nodeListFilter: ''
  };
}
