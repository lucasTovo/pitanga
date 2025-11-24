import { useEffect, useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);
export const breakpoints = fullConfig.theme?.screens as Record<string, string>;

const orderedBreakpoints = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

export type TailwindBreakpoint = typeof orderedBreakpoints[number];

export function useTailwindBreakpoint() {
  const [current, setCurrent] = useState<TailwindBreakpoint>('sm');

  useEffect(() => {
    const queries = orderedBreakpoints.map((key) => ({
      key,
      media: window.matchMedia(`(min-width: ${breakpoints[key]})`)
    }));

    const update = () => {
      const active = queries
        .filter((q) => q.media.matches)
        .map((q) => q.key)
        .at(-1);

      if (active) setCurrent(active);
    };

    update();

    queries.forEach((q) =>
      q.media.addEventListener("change", update)
    );

    return () => {
      queries.forEach((q) =>
        q.media.removeEventListener("change", update)
      );
    };
  }, []);

  return current;
}
