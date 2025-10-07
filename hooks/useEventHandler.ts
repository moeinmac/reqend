import { useRef, useCallback, MouseEvent } from "react";

type EventHandler = {
  onClick: (event: MouseEvent) => void;
  onDoubleClick: (event: MouseEvent) => void;
  delay?: number;
};

export const useEventHandler = <T>({ onClick, onDoubleClick, delay = 250 }: EventHandler) => {
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const clickHandler = useCallback(
    (event: MouseEvent) => {
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
      clickTimeout.current = setTimeout(() => {
        onClick(event);
      }, delay);
    },
    [onClick, delay]
  );

  const doubleClickHandler = useCallback(
    (event: MouseEvent) => {
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
      onDoubleClick(event);
    },
    [onDoubleClick]
  );

  return { clickHandler, doubleClickHandler };
};
