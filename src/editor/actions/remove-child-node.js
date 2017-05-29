
export default function removeChildNode(parent, child) {
  if (!parent.hasChild(child)) {
    return {};
  }

  let rootNode = this.rootNode.clone();
  let changeParent = rootNode.findNodeById(parent.id);
  let changeChild = rootNode.findNodeById(child.id);

  changeParent.removeChild(changeChild);

  return {
    rootNode,
    activeNodeId: this.activeNodeId === child.id ? parent.id : this.activeNodeId
  };
}
