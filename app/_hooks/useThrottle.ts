import { useCallback, useState } from "react";

const useThrottle = (callback: any, limit: number) => {
  const [inThrottle, setInThrottle] = useState<boolean>(false);
  return useCallback(
    (...args: any) => {
      if (!inThrottle) {
        callback(...args);
        setInThrottle(true);
        setTimeout(() => setInThrottle(false), limit);
      }
    },
    [callback, limit, inThrottle]
  );
};

export default useThrottle;
