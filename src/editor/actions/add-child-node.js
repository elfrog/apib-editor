
export default function addChildNode(parent, child) {
  let rootNode = this.state.rootNode.clone();
  let changeParent = rootNode.findNodeById(parent.id);

  changeParent.addChild(child);

  return {
    rootNode,
    activeNodeId: child.id
  };
}
