export type ElementType = unknown;
export type Key = string | number | undefined;
export type Ref = unknown;
export type Props = unknown;

export interface ReactElementType {
  $$typeof: symbol | number;
  type: ElementType;
  key: Key;
  ref: Ref;
  props: Props;
  __mark: string;
}

export type Action<State> = State | ((prevState: State) => State);
