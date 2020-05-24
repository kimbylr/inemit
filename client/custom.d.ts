// this file is only needed until window.visualViewport is defined in TS
// copied from https://github.com/microsoft/TSJS-lib-generator/pull/845

export {};

declare global {
  interface Window {
    visualViewport?: VisualViewport;
  }
}

export interface VisualViewportEventMap {
  resize: UIEvent;
  scroll: Event;
}

export interface VisualViewport extends EventTarget {
  readonly height: number;
  readonly offsetLeft: number;
  readonly offsetTop: number;
  onresize: ((this: VisualViewport, ev: UIEvent) => any) | null;
  onscroll: ((this: VisualViewport, ev: Event) => any) | null;
  readonly pageLeft: number;
  readonly pageTop: number;
  readonly scale: number;
  readonly width: number;
  addEventListener<K extends keyof VisualViewportEventMap>(
    type: K,
    listener: (this: VisualViewport, ev: VisualViewportEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof VisualViewportEventMap>(
    type: K,
    listener: (this: VisualViewport, ev: VisualViewportEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare var VisualViewport: {
  prototype: VisualViewport;
  new (): VisualViewport;
};
