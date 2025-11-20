import { useCallback, useRef } from "react";

type UseInfiniteScrollParams = {
  hasNextPage: boolean;
  isFetching?: boolean;
  onLoadMore: () => void;
};

export const useInfiniteScroll = ({
  hasNextPage,
  isFetching = false,
  onLoadMore,
}: UseInfiniteScrollParams) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!hasNextPage || isFetching) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasNextPage, isFetching, onLoadMore]
  );

  return { lastElementRef };
};
