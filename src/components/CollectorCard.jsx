import React, { useState } from 'react';
import { formatNumber } from '../utils/numberFormat';
import { COLLECTOR_CONFIG } from '../utils/milestones';

export function CollectorCard({
  type,
  count,
  cost,
  canBuy,
  canCollect,
  autoBuyPurchased,
  autoBuyEnabled,
  canBuyAutoBuy,
  autoBuyCost,
  onCollect,
  onBuy,
  onBuyAutoBuy,
  onToggleAutoBuy,
  isUnlocked,
}) {
  const config = COLLECTOR_CONFIG[type];
  const [ripples, setRipples] = useState([]);

  if (!isUnlocked) return null;

  const handleClick = (e) => {
    onCollect(type);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  };

  const productionPerUnit = config.baseProduction;

  return (
    <div className="collector-card">
      <div className="collector-header">
        <span className="collector-name">{config.name}</span>
        <span className="collector-count">{count}개</span>
      </div>
      <p className="collector-desc">
        클릭당 {config.clickValue} Byte | 보유당 {productionPerUnit} Byte/초
      </p>
      {count > 0 && (
        <p className="collector-production">
          +{formatNumber(count * productionPerUnit)} Bytes/초
        </p>
      )}
      <div className="collector-actions">
        <button
          className="btn btn-collect"
          onClick={handleClick}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          수집
          {ripples.map(r => (
            <span
              key={r.id}
              className="click-effect"
              style={{ left: r.x, top: r.y }}
            >
              +{config.clickValue}
            </span>
          ))}
        </button>
        <button
          className="btn btn-buy"
          onClick={() => onBuy(type)}
          disabled={!canBuy}
        >
          구매 ({formatNumber(cost)} B)
        </button>
      </div>

      {autoBuyPurchased && (
        <div className="collector-autobuy">
          <span className="collector-autobuy-label">자동 구매</span>
          <div
            className={`toggle ${autoBuyEnabled ? 'active' : ''}`}
            onClick={() => onToggleAutoBuy(type)}
          />
        </div>
      )}
    </div>
  );
}
