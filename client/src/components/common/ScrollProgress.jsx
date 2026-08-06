import React, { useEffect, useState } from 'react';

export const ScrollProgress = ({ totalSections = 3 }) => {
  const [fills, setFills] = useState([0, 0, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPercent = scrollTop / docHeight;

      const newFills = Array.from({ length: totalSections }, (_, index) => {
        const sectionStart = index / totalSections;
        const sectionEnd = (index + 1) / totalSections;
        let progress = (scrollPercent - sectionStart) / (sectionEnd - sectionStart);
        progress = Math.max(0, Math.min(1, progress));
        return progress * 100;
      });

      setFills(newFills);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  return (
    <div className="scroll-progress" id="scrollProgress">
      {fills.map((fillHeight, idx) => (
        <div key={idx} className="progress-dash">
          <div
            className="progress-fill"
            style={{ height: `${fillHeight}%` }}
          />
        </div>
      ))}
    </div>
  );
};
