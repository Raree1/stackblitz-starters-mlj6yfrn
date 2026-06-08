import React from 'react';
import { formatNumber, formatTime } from '../utils/numberFormat';

export function UpgradePanel({
  crawlers,
  servers,
  crawlerCost,
  serverCost,
  totalBytes,
  manualClicks,
  uptime,
  canBuyCrawler,
  canBuyServer,
  onBuyCrawler,
  onBuyServer
}) {
  return (
    <section className="panel upgrade-panel">
      <div className="panel-title">&gt;&gt; 시스템 모듈</div>

      {/* 자동 크롤러 봇 */}
      <div className="upgrade-item">
        <div className="upgrade-header">
          <span className="upgrade-count">{crawlers}</span>x
          <span className="upgrade-label">자동 크롤러 봇</span>
        </div>
        <div className="upgrade-desc">
          상태: 초당 1 Byte 생성 | 활성 봇들 연산 중...
        </div>
        <button
          className="btn btn-upgrade"
          onClick={onBuyCrawler}
          disabled={!canBuyCrawler}
        >
          <span className="upgrade-name">&gt; 모듈 설치</span>
          <span className="upgrade-info">비용: <span className="cost">{formatNumber(crawlerCost)}</span> Bytes</span>
        </button>
      </div>

      {/* 중고 서버 랙 */}
      <div className="upgrade-item">
        <div className="upgrade-header">
          <span className="upgrade-count">{servers}</span>x
          <span className="upgrade-label">중고 서버 랙 증설</span>
        </div>
        <div className="upgrade-desc">
          상태: 초당 10 Bytes 생성 | 78% 부하, 22% 에러 로그
        </div>
        <button
          className="btn btn-upgrade"
          onClick={onBuyServer}
          disabled={!canBuyServer}
        >
          <span className="upgrade-name">&gt; 랙 증설</span>
          <span className="upgrade-info">비용: <span className="cost">{formatNumber(serverCost)}</span> Bytes</span>
        </button>
      </div>

      {/* 통계 섹션 */}
      <div className="stats-section">
        <div className="stat-item">&gt; 총 생성된 Bytes: {formatNumber(totalBytes)}</div>
        <div className="stat-item">&gt; 수동 수집 횟수: {manualClicks.toLocaleString()}</div>
        <div className="stat-item">&gt; 시스템 가동 시간: {formatTime(uptime)}</div>
      </div>
    </section>
  );
}
