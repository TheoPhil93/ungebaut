import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '../hooks/useFinePointer';

const SPRING = { stiffness: 380, damping: 30, mass: 0.6 };
const SIZE_REST = 8;
const SIZE_HOVER = 36;
const SIZE_GALLERY = 54;

export function Cursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  const [cursorMode, setCursorMode] = useState('rest');

  useEffect(() => {
    if (!fine) return undefined;
    document.body.dataset.customCursor = 'on';
    return () => {
      delete document.body.dataset.customCursor;
    };
  }, [fine]);

  useEffect(() => {
    if (!fine) return undefined;

    // Walk up the DOM looking for any element that should grow the cursor.
    // We treat both explicit `data-cursor` flags and natively-interactive
    // elements (links, buttons) as hover targets, so the cursor scales over
    // every clickable bit of chrome without each one needing the attribute.
    const findHoverTarget = (node) => {
      let cur = node;
      while (cur && cur !== document.body) {
        if (cur.dataset && cur.dataset.cursor) return cur;
        const tag = cur.tagName;
        if (tag === 'A' || tag === 'BUTTON') return cur;
        if (cur.getAttribute && cur.getAttribute('role') === 'button') return cur;
        cur = cur.parentElement;
      }
      return null;
    };

    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = findHoverTarget(event.target);
      setCursorMode(
        target?.dataset.cursor === 'gallery' ? 'gallery' : target ? 'hover' : 'rest',
      );
    };

    const onOver = (event) => {
      const target = findHoverTarget(event.target);
      if (target) setCursorMode(target.dataset.cursor === 'gallery' ? 'gallery' : 'hover');
    };
    const onOut = (event) => {
      const target = findHoverTarget(event.target);
      const related = findHoverTarget(event.relatedTarget);
      if (target && related === target) return;
      if (!related) setCursorMode('rest');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const size =
    cursorMode === 'gallery'
      ? SIZE_GALLERY
      : cursorMode === 'hover'
        ? SIZE_HOVER
        : SIZE_REST;

  return (
    <motion.div
      className="cursor"
      aria-hidden="true"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: size, height: size }}
      transition={{ type: 'spring', stiffness: 240, damping: 24 }}
    />
  );
}
