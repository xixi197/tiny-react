export type Container = Element;
export type Instance = Element;

export const createInstance = (type: string, props: any): Instance => {
  const element = document.createElement(type);
  return element;
};

export const appendInitialChild = (parent: Instance, child: Instance) => {
  parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
  const element = document.createTextNode(content);
  return element;
};

export const appendChildToContainer = (child: Instance, parent: Instance) => {
  parent.appendChild(child);
};
