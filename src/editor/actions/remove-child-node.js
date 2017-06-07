
export default function removeChildNode(parent, child) {
  if (!parent.hasChild(child)) {
    return {};
  }

  let rootNode = this.state.rootNode.clone();
  let activeNodeId = this.state.activeNodeId;
  let changeParent = rootNode.findNodeById(parent.id);
  let changeChild = rootNode.findNodeById(child.id);

  changeParent.removeChild(changeChild);

  // change active node with parent node if active node is one of deletions
  if (parent.findNodeById(activeNodeId)) {
    activeNodeId = parent.id;
  }

  return {
    rootNode,
    activeNodeId
  };
}
