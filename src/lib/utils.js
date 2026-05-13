import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names safely. Used by upstream shadcn/unlumen
 * components that pass `className` props through `cn(...)`.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
