
import openNewDocument from './open-new-document';
import loadFromFile from './load-from-file';
import loadFromRepository from './load-from-repository';
import filterNodeList from './filter-node-list';
import selectNode from './select-node';
import changeNodeProperty from './change-node-property';
import addChildNode from './add-child-node';
import removeChildNode from './remove-child-node';
import changeNodeIndex from './change-node-index';

export let actions = [
  openNewDocument,
  loadFromFile,
  loadFromRepository,
  filterNodeList,
  selectNode,
  changeNodeProperty,
  addChildNode,
  removeChildNode,
  changeNodeIndex
];

export let initialState = {
  rootNode: null,
  activeNodeId: null,
  nodeListFilter: ''
};
