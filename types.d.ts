interface BaseWebLockSentinelEventMap {
  onrelease: Event;
}

type WakeLockSentinel = {
  readonly released: boolean;
  readonly type: string;
  release(): Promise;
  addEventListener(
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: Event, ev: BaseWebLockSentinelEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: Event, ev: BaseWebLockSentinelEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
};

type WakeLockRequestType = 'screen';

interface Navigator {
  wakeLock: {
    request: (type: WakeLockRequestType) => Promise;
  };
}
