
import loadNodeList from './load-node-list';
import filterNodeList from './filter-node-list';
import selectNode from './select-node';
import changeNodeProperty from './change-node-property';

export let actions = [
  loadNodeList,
  filterNodeList,
  selectNode,
  changeNodeProperty
];

export let initialState = {
  rootNode: null,
  activeNodeId: null,
  nodeListFilter: ''
};
