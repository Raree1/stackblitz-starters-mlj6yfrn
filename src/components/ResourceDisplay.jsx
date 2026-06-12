import React from 'react';
import { formatNumber, formatTime } from '../utils/numberFormat';

export function ResourceDisplay({ bytes, byteRate, tokens, tokenRate, totalBytes, totalTokens, uptime, showTokens }) {
  return (
    <div className="resource-display">
      <div className="resource-bytes">{formatNumber(bytes)}</div>
      <div className="resource-bytes-label">Bytes</div>
      <div className="resource-rate">+{formatNumber(byteRate)}/초</div>

      {showTokens && (
        <div className="resource-tokens">
          <div className="resource-tokens-value">{formatNumber(tokens)}</div>
          <div className="resource-tokens-label">Tokens</div>
          <div className="resource-tokens-rate">+{formatNumber(tokenRate)}/초</div>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-value">{formatNumber(totalBytes)}</div>
          <div className="stat-label">총 Bytes</div>
        </div>
        {showTokens && (
          <div className="stat-item">
            <div className="stat-value">{formatNumber(totalTokens)}</div>
            <div className="stat-label">총 Tokens</div>
          </div>
        )}
        <div className="stat-item">
          <div className="stat-value">{formatTime(uptime)}</div>
          <div className="stat-label">가동 시간</div>
        </div>
      </div>
    </div>
  );
}
