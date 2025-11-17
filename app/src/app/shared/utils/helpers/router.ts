import { curry, isEmpty, isNil, map, prop } from 'ramda';
import { isNotNilOrEmpty } from 'ramda-adjunct';

interface TreeNode {
  children?: TreeNode[];
  link?: string;
  path?: string;
  key?: string;
}

function hasChildren(node: TreeNode): boolean {
  return isNotNilOrEmpty(prop('children', node));
}

function flattenToArrayReducer(acc: TreeNode[], node: TreeNode): TreeNode[] {
  const { children, ...data } = node;
  return acc.concat([{ ...data }]);
}

function _reduceTreeRecursive<T extends TreeNode, U>(
  reducerFn: (acc: U, node: T) => U,
  initialAcc: U,
  node: T,
): U {
  let currentAcc = reducerFn(initialAcc, node); // Apply reducer to the current node

  if (hasChildren(node) && node.children) {
    currentAcc = node.children.reduce((accFromChildren, child) => {
      const link = isNil(child.path) ? child.link : child.path;
      const parent = isEmpty(node.link) ? '' : '/';
      const processedChild = {
        ...child,
        key: child.link,
        link: `${node.link}${parent}${link}`,
      };
      return _reduceTreeRecursive(
        reducerFn,
        accFromChildren,
        processedChild as T,
      );
    }, currentAcc);
  }
  return currentAcc;
}

const TreeObject = {
  reduce: curry(_reduceTreeRecursive),
};

export const generateFullRoutes: any = (obj: any, path: string) => {
  const parseRoute = (val: string) => path + val;
  return map(parseRoute, obj);
};

export const generateFullRoutesTree: any = (obj: any, tree: TreeNode) => {
  const links: TreeNode[] = TreeObject.reduce(flattenToArrayReducer)([], tree);

  const parseRoute = (val: string) => {
    const result = links.find((link) => link.key === val);
    return result ? result.link : false;
  };
  return map(parseRoute, obj);
};
