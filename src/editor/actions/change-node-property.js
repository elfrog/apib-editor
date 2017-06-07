
const PROPERTY_CHANGE_DELAY = 300;

let timer = null;

export default function changeNodeProperty(node, key, value) {
  if (timer) {
    clearTimeout(timer);
  }

  return new Promise(resolve => {
    timer = setTimeout(() => {
      let rootNode = this.state.rootNode.clone();
      let changeNode = rootNode.findNodeById(node.id);

      changeNode[key] = value;

      resolve({ rootNode });

      timer = null;
    }, PROPERTY_CHANGE_DELAY);
  });
}
