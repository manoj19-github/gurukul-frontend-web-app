import { useEffect, useState } from "react";

const useMounted = (): boolean => {
  const [isMounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return isMounted;
};

export default useMounted;
