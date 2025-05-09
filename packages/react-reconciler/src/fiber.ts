import { Key, Props } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
  tag: WorkTag;
  key: Key;
  type: any;
  ref: Ref | null;
  stateNode: any;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  pendingProps: Props;
  memoizedProps: Props | null;
  memoizedState: any;

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

    //
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.memoizedState = null;

    this.alternate = null;

    // 比较状态
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
  }
}
