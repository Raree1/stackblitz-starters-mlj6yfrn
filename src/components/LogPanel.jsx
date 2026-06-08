import React, { useRef, useEffect } from 'react';
import { LOG_TYPES } from '../utils/logMessages';

export function LogPanel({ logs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogClass = (type) => {
    switch (type) {
      case LOG_TYPES.SYSTEM: return 'log-system';
      case LOG_TYPES.THOUGHT: return 'log-thought';
      case LOG_TYPES.WARNING: return 'log-warning';
      case LOG_TYPES.ERROR: return 'log-error';
      default: return 'log-system';
    }
  };

  const getLogLabel = (type) => {
    switch (type) {
      case LOG_TYPES.THOUGHT: return 'Thought';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <section className="panel log-panel">
      <div className="panel-title">&gt;&gt; AI 내부 상태 로그</div>
      <div className="log-container" ref={containerRef}>
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            <span className="log-timestamp">[{log.timestamp}]</span>
            <span className={getLogClass(log.type)}>
              [{getLogLabel(log.type)}] {log.message}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
