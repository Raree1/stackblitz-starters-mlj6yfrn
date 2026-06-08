import React from 'react';

export function Footer({ autoSaveStatus }) {
  return (
    <footer className="game-footer">
      <span>[ SYSTEM v0.1 ]</span> |
      <span>자동 저장: {autoSaveStatus}</span> |
      <span>연산 코어: 온라인</span>
      <span className="cursor-blink">_</span>
    </footer>
  );
}
