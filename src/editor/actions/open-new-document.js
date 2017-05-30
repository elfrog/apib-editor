import PackageNode from '../../parser/package-node';

export default function openNewDocument() {
  let root = new PackageNode();

  root.name = 'my-project.apib';
  root.description = `FORMAT: 1A\r\nHOST: https://api.example.com`;

  return {
    rootNode: root,
    activeNodeId: root.id,
    nodeListFilter: ''
  };
}
