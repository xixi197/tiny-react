import { ReactElementType } from 'shared/ReactTypes';
import { mountChildFibers, reconcilerChildFibers } from './childFibers';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

export const beginWork = (wip: FiberNode) => {
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return updateHostText();
    default:
      return null;
  }
};

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState as ReactElementType | null;
  const updateQueue = wip.updateQueue as UpdateQueue<ReactElementType | null>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState as ReactElementType;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children as ReactElementType;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostText() {
  return null;
}

function reconcileChildren(wip: FiberNode, children: ReactElementType | null) {
  const cur = wip.alternate;
  if (cur) {
    wip.child = reconcilerChildFibers(wip, cur.child, children);
  } else {
    wip.child = mountChildFibers(wip, null, children);
  }
}
