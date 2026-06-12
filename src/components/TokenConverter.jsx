import React from 'react';
import { formatNumber } from '../utils/numberFormat';
import { TOKEN_CONVERTER_CONFIG } from '../utils/milestones';

export function TokenConverter({
  count,
  cost,
  canBuy,
  isUnlocked,
  tokenRate,
  onBuy,
}) {
  if (!isUnlocked) return null;

  return (
    <div className="token-section">
      <div className="token-converter-card">
        <div className="token-converter-header">
          <span className="token-converter-name">토큰 변환기</span>
          <span className="token-converter-count">{count}개</span>
        </div>
        <p className="token-converter-desc">
          {formatNumber(TOKEN_CONVERTER_CONFIG.bytesPerToken)} Bytes를 1 Token으로 자동 변환
        </p>
        {count > 0 && (
          <p className="token-converter-production">
            +{formatNumber(tokenRate)} Tokens/초
          </p>
        )}
        <button
          className="btn btn-token-buy"
          onClick={onBuy}
          disabled={!canBuy}
        >
          증설 ({formatNumber(cost)} T)
        </button>
      </div>
    </div>
  );
}
