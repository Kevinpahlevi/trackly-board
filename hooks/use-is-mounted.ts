import * as React from "react";

const emptySubscribe = () => () => {};

export function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
