import React, { useEffect, useRef } from 'react';

export const RevealText = ({ text, className = 'display-title', tag = 'h1' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // IntersectionObserver to trigger 'active' class
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split text into characters preserving line breaks
  const renderFormattedChars = () => {
    let globalCharIndex = 0;
    const parts = text.split(/(<br\s*\/?>|\n)/i);

    return parts.map((part, pIdx) => {
      if (part.toLowerCase().startsWith('<br') || part === '\n') {
        return <br key={`br-${pIdx}`} />;
      }
      return (
        <React.Fragment key={`part-${pIdx}`}>
          {part.split('').map((char, cIdx) => {
            if (char === ' ') {
              return <span key={`space-${pIdx}-${cIdx}`}> </span>;
            }
            const delay = globalCharIndex * 0.03;
            globalCharIndex++;
            return (
              <span
                key={`char-${pIdx}-${cIdx}`}
                className="char"
                style={{ transitionDelay: `${delay}s` }}
              >
                {char}
              </span>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const Tag = tag;

  return (
    <Tag ref={containerRef} className={`reveal-text ${className}`}>
      {renderFormattedChars()}
    </Tag>
  );
};

export const FadeUp = ({ children, className = 'body-text', delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-up ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export const ImageWipe = ({ src, alt = '', className = '', style = {} }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`image-wipe ${className}`} style={style}>
      <img src={src} alt={alt} />
    </div>
  );
};
