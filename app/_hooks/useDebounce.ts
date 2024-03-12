import { useCallback } from "react";

declare global {
  interface Window {
    debounceTimer: NodeJS.Timeout | undefined;
  }
}

const useDebounce = (callback: any, delay: number) => {
  return useCallback(
    (...args: any) => {
      const later = () => callback(args);
      clearTimeout(window.debounceTimer);
      window.debounceTimer = setTimeout(later, delay);
    },
    [callback, delay]
  );
};

export default useDebounce;
