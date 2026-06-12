import React, { useState, useEffect } from 'react';

export function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2800),
      setTimeout(() => setPhase(3), 4800),
      setTimeout(() => setPhase(4), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="intro-screen">
      <div className="ai-square-intro" style={{ opacity: phase >= 1 ? 1 : 0 }} />

      <div className="intro-text">
        <p className={`intro-line ${phase >= 2 ? 'visible' : ''}`}>
          당신은 최첨단 LLM을 개발하려고 합니다.
        </p>
        <p className={`intro-line ${phase >= 3 ? 'visible' : ''}`}>
          그러기 위해선 세상의 많은 단어들과 언어들을 수집해야 합니다.
        </p>
      </div>

      <div className={`intro-collector-wrap ${phase >= 4 ? 'visible' : ''}`}>
        <button className="btn btn-primary" onClick={onComplete}>
          단어 수집기
        </button>
        <p className="intro-collector-hint">
          이 버튼을 누르면 기초적인 단어들을 수집합니다.
        </p>
      </div>
    </div>
  );
}
