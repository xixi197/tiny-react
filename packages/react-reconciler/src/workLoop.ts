import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let wip: FiberNode | null = null;

function prepareFreshStack(root: FiberNode) {
  //   wip = root;
}

function renderRoot(root: FiberNode) {
  prepareFreshStack(root);
  do {
    try {
      workLoop();
    } catch (error) {
      console.warn('workLoop error', error);
      wip = null;
    }
  } while (true);
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
