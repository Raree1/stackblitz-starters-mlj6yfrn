import React from 'react';

export function EmbeddingPhase({ isUnlocked }) {
  if (!isUnlocked) return null;

  return (
    <div className="embedding-section">
      <div className="embedding-card">
        <div className="embedding-badge">Phase 2</div>
        <h2 className="embedding-title">임베딩 단계</h2>
        <p className="embedding-desc">
          수집된 토큰들이 벡터 공간에 매핑되기 시작합니다.
          단어들은 의미의 좌표를 얻고, 문장들은 차원 위에 놓입니다.
          이제 본격적으로 LLM을 만듭니다.
        </p>
      </div>
    </div>
  );
}
