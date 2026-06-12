import React from 'react';
import { formatNumber } from '../utils/numberFormat';
import { COLLECTOR_CONFIG } from '../utils/milestones';

export function AutoBuyPanel({
  canBuyAutoWord,
  canBuyAutoSentence,
  canBuyAutoText,
  autoBuyWordPurchased,
  autoBuySentencePurchased,
  autoBuyTextPurchased,
  autoBuyWord,
  autoBuySentence,
  autoBuyText,
  onBuyAutoBuy,
  onToggleAutoBuy,
  isUnlocked,
  tokens,
}) {
  if (!isUnlocked) return null;

  const types = [
    { type: 'word', name: '단어 수집기', purchased: autoBuyWordPurchased, enabled: autoBuyWord, canBuy: canBuyAutoWord },
    { type: 'sentence', name: '문장 수집기', purchased: autoBuySentencePurchased, enabled: autoBuySentence, canBuy: canBuyAutoSentence },
    { type: 'text', name: '글 수집기', purchased: autoBuyTextPurchased, enabled: autoBuyText, canBuy: canBuyAutoText },
  ];

  const hasAny = types.some(t => t.purchased);

  return (
    <div className="autobuy-section">
      <div className="autobuy-card">
        <div className="autobuy-title">자동 구매기</div>
        {types.map(({ type, name, purchased, enabled, canBuy: cb }) => (
          <div key={type} className="autobuy-item">
            <span className="autobuy-label">{name}</span>
            <div className="autobuy-purchase">
              {!purchased ? (
                <button
                  className="btn btn-token-buy"
                  onClick={() => onBuyAutoBuy(type)}
                  disabled={!cb}
                >
                  {formatNumber(COLLECTOR_CONFIG[type].autoBuyCost)} T
                </button>
              ) : (
                <div
                  className={`toggle ${enabled ? 'active' : ''}`}
                  onClick={() => onToggleAutoBuy(type)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
