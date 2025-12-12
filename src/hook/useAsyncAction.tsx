import { useCallback, useState } from "react";

function useAsyncAction<T extends unknown[], R>(
  asyncFn: (...args: T) => Promise<R>
) {
  const [onLoading, setOnLoading] = useState(false);
  const [data, setData] = useState<R | null>(null);

  const action = useCallback(
    async (...args: T): Promise<R> => {
      setOnLoading(true);
      return asyncFn(...args)
        .then((res) => {
          setData(res);
          return res;
        })
        .finally(() => setOnLoading(false));
    },
    [asyncFn]
  );

  return { onLoading, action, data };
}

export default useAsyncAction;
