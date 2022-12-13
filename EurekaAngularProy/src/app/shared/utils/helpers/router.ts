import { curry, mapObjIndexed, prop } from 'ramda';
import { isNotNilOrEmpty } from 'ramda-adjunct';

function hasChildren(node) {
  return isNotNilOrEmpty(prop('children', node));
}

function flattenToArray(arr, { children, ...data }) {
  return arr.concat([{ ...data }]);
}

const TreeObject = {
  reduce: curry(function reduce(reducerFn, init, node) {
    const acc = reducerFn(init, node);
    if (!hasChildren(node)) {
      return acc;
    }
    return node.children
      .map((item) => {
        return { ...item, key: item.link, link: `${node.link}/${item.link}` };
      })
      .reduce(TreeObject.reduce(reducerFn), acc);
  }),
};

export function generateFullRoutes(obj, path: string): any {
  const parseRoute = (val) => path + val;
  return mapObjIndexed(parseRoute, obj);
}

export function generateFullRoutesTree(obj, tree): any {
  const links = TreeObject.reduce(flattenToArray, [], tree);
  const parseRoute = (val) => {
    const result = links.find((link) => link.key === val);
    return result ? `/${result.link}` : false;
  };
  return mapObjIndexed(parseRoute, obj);
}
