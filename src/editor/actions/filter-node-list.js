
const FILTER_DELAY = 300;

// parents are also included if at least one of their children included.
function filterAndFlattenNode(node, filterValue) {
  let test = node.name.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
  let list = test ? [node] : [];

  for (let child of node.children) {
    list = list.concat(filterAndFlattenNode(child, filterValue));
  }

  if (!test && list.length > 0) {
    list.unshift(node);
  }

  return list;
}

let filterTimer = null;

export default function filterNodeList(value) {
  return new Promise(resolve => {
    if (filterTimer) {
      clearTimeout(filterTimer);
    }

    filterTimer = setTimeout(() => {
      let rootNode = this.rootNode;

      if (!rootNode) {
        resolve({ nodeList: [] });
      }

      if (!value) {
        resolve({ nodeList: rootNode.flatten() });
      }

      resolve({ nodeList: filterAndFlattenNode(rootNode, value) });
    }, 100);
  });
}
