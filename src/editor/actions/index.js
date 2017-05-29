
import loadNodeList from './load-node-list';
import filterNodeList from './filter-node-list';
import selectNode from './select-node';
import changeNodeProperty from './change-node-property';
import addChildNode from './add-child-node';
import removeChildNode from './remove-child-node';

export let actions = [
  loadNodeList,
  filterNodeList,
  selectNode,
  changeNodeProperty,
  addChildNode,
  removeChildNode
];

export let initialState = {
  rootNode: null,
  activeNodeId: null,
  nodeListFilter: ''
};
