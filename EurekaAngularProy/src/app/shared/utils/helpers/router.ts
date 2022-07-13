import { mapObjIndexed } from 'ramda';

export const generateFullRoutes: any = (obj, path) => {
  const parseRoute = (val) => path + val;
  return mapObjIndexed(parseRoute, obj);
};
