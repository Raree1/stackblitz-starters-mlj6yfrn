import React from 'react';
import { formatNumber } from '../utils/numberFormat';

export function ResourcePanel({ bytes, productionRate, onManualCollect }) {
  return (
    <section className="panel resource-panel">
      <div className="panel-title">&gt;&gt; 시스템 상태</div>

      <div className="resource-display">
        <span className="number">{formatNumber(bytes)}</span>
        <span className="resource-label">Bytes 수집됨</span>
      </div>

      <div className="production-rate">
        <span>+{productionRate.toFixed(1)}</span> Bytes/sec
      </div>

      <button className="btn btn-manual" onClick={onManualCollect}>
        &gt; [수동 크롤링 코드 실행]
      </button>
    </section>
  );
}
