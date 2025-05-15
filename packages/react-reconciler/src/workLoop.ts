import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { createWip, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let wip: FiberNode | null = null;

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = fiber.return;
  while (parent) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode as FiberRootNode;
  }
  return null;
}

function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root);
  do {
    try {
      workLoop();
      break;
    } catch (error) {
      console.warn('workLoop error', error);
      wip = null;
    }
  } while (true);

  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  commitRoot(root);
}

function prepareFreshStack(root: FiberRootNode) {
  wip = createWip(root.current, {});
}

function workLoop() {
  while (wip) {
    performUnitOfWork(wip);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  if (next) {
    wip = next;
    return;
  }
  completeUnitOfWork(fiber);
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;
  do {
    completeWork(node);
    const sibling = node.sibling;
    if (sibling) {
      wip = sibling;
      return;
    }
    node = node.return;
    wip = node;
  } while (node);
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }

  root.finishedWork = null;

  // 判断是否存在 3 个子阶段需要执行的操作
  const subtreeHasEffects =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffects = (finishedWork.flags & MutationMask) !== NoFlags;

  if (subtreeHasEffects || rootHasEffects) {
    // TODO: BeforeMutation

    // Mutation
    commitMutationEffects(finishedWork);
    // Fiber 树切换，workInProgress 变成 current
    root.current = finishedWork;

    // TODO: Layout
  } else {
    root.current = finishedWork;
  }
}
