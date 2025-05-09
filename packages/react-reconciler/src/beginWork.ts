import { FiberNode } from './fiber';

export const beginWork = (wip: FiberNode) => {
  return wip.child;
};
