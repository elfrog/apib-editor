
import loadNodeList from './load-node-list';
import filterNodeList from './filter-node-list';
import selectNode from './select-node';

export let actions = [
  loadNodeList,
  filterNodeList,
  selectNode
];

export let initialState = {
  rootNode: null,
  activeNode: null,
  nodeList: []
};
