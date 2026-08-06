import React, { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const innerRef = useRef(null);
  const outerRef = useRef(null);

  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    let mouseX = -100, mouseY = -100;
    let outerX = -100, outerY = -100;
    let animId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      inner.style.left = `${mouseX}px`;
      inner.style.top = `${mouseY}px`;

      const target = e.target;
      const isHoverable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.hover-target') ||
        target.getAttribute('role') === 'button';

      if (isHoverable) {
        inner.classList.add('hovering');
        outer.classList.add('hovering');
      } else {
        inner.classList.remove('hovering');
        outer.classList.remove('hovering');
      }
    };

    const animateCursor = () => {
      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;
      outer.style.left = `${outerX}px`;
      outer.style.top = `${outerY}px`;
      animId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div className="cursor-inner" ref={innerRef} id="cursorInner" />
      <div className="cursor-outer" ref={outerRef} id="cursorOuter" />
    </>
  );
};

