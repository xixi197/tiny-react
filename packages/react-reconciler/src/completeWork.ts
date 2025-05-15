import {
  appendInitialChild,
  Container,
  createInstance,
  createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { NoFlags } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps;
  const cur = wip.alternate;
  switch (wip.tag) {
    case HostRoot:
      bubbleProperties(wip);
      break;
    case HostComponent:
      if (cur && wip.stateNode) {
        // update
      } else {
        // mount
        const instance = createInstance(wip.type as string, newProps);
        appendAllChildren(instance, wip);
        wip.stateNode = instance;
      }
      bubbleProperties(wip);
      break;
    case HostText:
      if (cur && wip.stateNode) {
        // TODO: 组件的更新阶段
      } else {
        const instance = createTextInstance(newProps.content as string);
        wip.stateNode = instance;
      }
      // 收集更新 flags
      bubbleProperties(wip);
      break;
    default:
      break;
  }
};

function appendAllChildren(parent: Container, wip: FiberNode) {
  let node = wip.child;
  while (node !== null) {
    if (node.tag == HostComponent || node.tag == HostText) {
      // 处理原生 DOM 元素节点或文本节点
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 递归处理其他类型的组件节点的子节点
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node == wip) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }
      node = node.return;
    }
    // 处理下一个兄弟节点
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function bubbleProperties(workInProgress: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = workInProgress.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child.return = workInProgress;
    child = child.sibling;
  }

  workInProgress.subtreeFlags |= subtreeFlags;
}
