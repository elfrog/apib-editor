
export default function changeNodeIndex(node, id) {
  if (node.id === id) {
    return {};
  }

  let rootNode = this.state.rootNode.clone();
  let changeNode = rootNode.findNodeById(node.id);
  let targetNode = rootNode.findNodeById(id);

  // If target node is empty and can accept dragged node, push dragged node to it.
  if (targetNode.children.length === 0) {
    try {
      targetNode.checkAcceptableChild(changeNode);
      targetNode.addChild(changeNode);
      return { rootNode };
    } catch (e) {
      ;
    }
  }

  let targetParent = targetNode.parent;

  if (!targetParent) {
    throw new Error('Given node can\'t move to this position.');
  }

  let targetIndex = targetParent.getChildIndex(targetNode);

  targetParent.addChildAt(changeNode, targetIndex);

  return { rootNode };
}
