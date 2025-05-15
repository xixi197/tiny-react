import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
  ElementType,
  Key,
  Props,
  ReactElementType,
  Ref
} from 'shared/ReactTypes';

const ReactElement = function (
  type: ElementType,
  key: Key,
  ref: Ref,
  props: Props
): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'xixi'
  };
  return element;
};

export const jsx = (type: ElementType, config: unknown, key?: Key) => {
  let ref: Ref = null;
  const props: Props = {};

  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }
  return ReactElement(type, key, ref, props);
};

export const jsxDEV = jsx;
