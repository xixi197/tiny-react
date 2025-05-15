import { Key, Props, ReactElementType, Ref } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
import { UpdateQueue } from './updateQueue';

export class FiberNode {
  tag: WorkTag; // Root Component Text
  key: Key;
  type: unknown; // div span
  ref: Ref;
  stateNode: unknown;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  pendingProps: Props;
  memoizedProps: Props;
  memoizedState: unknown;
  updateQueue: UpdateQueue<unknown> | null;

  alternate: FiberNode | null;
  flags: Flags;
  subtreeFlags: Flags;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key;
    this.type = null;
    this.ref = null;
    // 真实Dom节点
    this.stateNode = null;

    // 树状结构
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;

    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.memoizedState = null;
    this.updateQueue = null;

    this.alternate = null;
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
  }
}

export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null; // 更新完后
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

export const createWip = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let wip = current.alternate;
  if (wip === null) {
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    wip.alternate = current;
    current.alternate = wip;
  } else {
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
    wip.subtreeFlags = NoFlags;
  }
  wip.type = current.type;
  wip.child = current.child;
  wip.updateQueue = current.updateQueue;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  return wip;
};

export function createFiberFromElement(element: ReactElementType) {
  const { type, key, props } = element;
  let fiberTag: WorkTag = FunctionComponent;
  if (typeof type === 'string') {
    fiberTag = HostComponent;
  } else if (typeof type !== 'function') {
    console.log('error');
  }
  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  return fiber;
}
