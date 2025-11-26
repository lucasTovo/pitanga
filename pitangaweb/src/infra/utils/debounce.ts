export type DebouncedFunction<CB extends (...args: any[]) => void> =
  ((...args: Parameters<CB>) => void) & {
    flush: () => void;
    cancel: () => void;
  };

export const debounce = <CB extends (...args: any[]) => void>(
  cb: CB,
  delay = 1000
): DebouncedFunction<CB> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<CB> | null = null;

  const debounced = (...args: Parameters<CB>) => {
    lastArgs = args;

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      if (lastArgs) {
        cb(...lastArgs);
      }
      timer = null;
      lastArgs = null;
    }, delay);
  };

  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;

      if (lastArgs) {
        cb(...lastArgs);
        lastArgs = null;
      }
    }
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      lastArgs = null;
    }
  };

  return debounced;
};
