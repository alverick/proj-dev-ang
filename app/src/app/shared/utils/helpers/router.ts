import { curry, isEmpty, isNil, map, prop } from 'ramda';
import { isNotNilOrEmpty } from 'ramda-adjunct';

// Define an interface for the tree node structure
interface TreeNode {
  children?: TreeNode[];
  link?: string;
  path?: string;
  key?: string;
}

function hasChildren(node: TreeNode): boolean {
  return isNotNilOrEmpty(prop('children', node));
}

// This reducer function is meant to be applied to a single node to accumulate it into an array.
function flattenToArrayReducer(acc: TreeNode[], node: TreeNode): TreeNode[] {
  const { children, ...data } = node; // Exclude children from the data being added
  return acc.concat([{ ...data }]);
}

// Recursive function to traverse the tree and apply the reducer
function _reduceTreeRecursive<T extends TreeNode, U>(
  reducerFn: (acc: U, node: T) => U,
  initialAcc: U,
  node: T
): U {
  let currentAcc = reducerFn(initialAcc, node); // Apply reducer to the current node

  if (hasChildren(node) && node.children) {
    currentAcc = node.children.reduce((accFromChildren, child) => {
      // Transform the child node before recursively reducing it
      const link = isNil(child.path) ? child.link : child.path;
      const parent = isEmpty(node.link) ? '' : '/';
      const processedChild = {
        ...child,
        key: child.link, // Assuming child.link is the key for lookup
        link: `${node.link}${parent}${link}`, // Build the full link path
      };
      // Recursively call _reduceTreeRecursive for each child
      return _reduceTreeRecursive(reducerFn, accFromChildren, processedChild as T);
    }, currentAcc);
  }
  return currentAcc;
}

const TreeObject = {
  reduce: curry(_reduceTreeRecursive), // Curry the recursive function
};

export const generateFullRoutes: any = (obj: any, path: string) => {
  const parseRoute = (val: string) => path + val;
  return map(parseRoute, obj);
};

export const generateFullRoutesTree: any = (obj: any, tree: TreeNode) => {
  // Correctly call the curried function
  const links: TreeNode[] = TreeObject.reduce(flattenToArrayReducer)([], tree);

  const parseRoute = (val: string) => {
    // 'links' should now be a flat array of all nodes with their full 'link' paths.
    const result = links.find((link) => link.key === val);
    return result ? result.link : false;
  };
  return map(parseRoute, obj);
};
