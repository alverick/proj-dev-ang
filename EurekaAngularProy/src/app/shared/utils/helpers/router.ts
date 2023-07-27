import { curry, isEmpty, isNil, map, prop } from 'ramda';
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
        const link = isNil(item.path) ? item.link : item.path;
        const parent = isEmpty(link) ? '' : '/';
        return {
          ...item,
          key: item.link,
          link: `${node.link}${parent}${link}`,
        };
      })
      .reduce(TreeObject.reduce(reducerFn), acc);
  }),
};

export const generateFullRoutes: any = (obj, path: string) => {
  const parseRoute = (val: string) => path + val;
  return map(parseRoute, obj);
};

export const generateFullRoutesTree: any = (obj, tree) => {
  const links = TreeObject.reduce(flattenToArray, [], tree);

  const parseRoute = (val) => {
    const result = links.find((link) => link.key === val);
    const parent = isEmpty(links[0].link) ? '' : '/';
    return result ? `${parent}${result.link}` : false;
  };
  return map(parseRoute, obj);
};
