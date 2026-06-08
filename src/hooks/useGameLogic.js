import { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, formatTime, calculatePrice } from '../utils/numberFormat';
import { getRandomLog, LOG_TYPES } from '../utils/logMessages';

const SAVE_KEY = 'project_genesis_save';
const PRICE_GROWTH = 1.15;

const INITIAL_STATE = {
  bytes: 0,
  totalBytes: 0,
  manualClicks: 0,
  crawlers: 0,
  servers: 0,
  crawlerCost: 15,
  serverCost: 100,
  startTime: Date.now()
};

const PRODUCTION_CONFIG = {
  crawler: { baseProduction: 1, baseCost: 15 },
  server: { baseProduction: 10, baseCost: 100 }
};

export function useGameLogic() {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [logs, setLogs] = useState([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState('대기');

  const lastTickRef = useRef(Date.now());

  // 생산 속도 계산
  const productionRate = (
    gameState.crawlers * PRODUCTION_CONFIG.crawler.baseProduction +
    gameState.servers * PRODUCTION_CONFIG.server.baseProduction
  );

  // 게임 상태 업데이트 (초당 생산)
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      const produced = productionRate * delta;

      if (produced > 0) {
        setGameState(prev => ({
          ...prev,
          bytes: prev.bytes + produced,
          totalBytes: prev.totalBytes + produced
        }));
      }
    };

    const interval = setInterval(gameLoop, 100);
    return () => clearInterval(interval);
  }, [productionRate]);

  // 로그 추가
  const addLog = useCallback((logEntry) => {
    setLogs(prev => {
      const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
      const timestamp = formatTime(elapsed);
      const newLog = { ...logEntry, timestamp, id: Date.now() };
      const updated = [...prev, newLog];

      return updated.slice(-100);
    });
  }, [gameState.startTime]);

  // 랜덤 로그 생성
  useEffect(() => {
    const logLoop = () => {
      if (Math.random() < 0.3) {
        const { type, message } = getRandomLog();
        addLog({ type, message });
      }
    };

    const interval = setInterval(logLoop, 5000);
    return () => clearInterval(interval);
  }, [addLog]);

  // 수동 수집
  const onManualCollect = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      bytes: prev.bytes + 1,
      totalBytes: prev.totalBytes + 1,
      manualClicks: prev.manualClicks + 1
    }));

    if (Math.random() < 0.1) {
      const { type, message } = getRandomLog();
      addLog({ type, message });
    }
  }, [addLog]);

  // 크롤러 구매
  const onBuyCrawler = useCallback(() => {
    if (gameState.bytes >= gameState.crawlerCost) {
      setGameState(prev => {
        const newState = {
          ...prev,
          bytes: prev.bytes - prev.crawlerCost,
          crawlers: prev.crawlers + 1,
          crawlerCost: calculatePrice(
            PRODUCTION_CONFIG.crawler.baseCost,
            prev.crawlers + 1,
            PRICE_GROWTH
          )
        };

        addLog({
          type: LOG_TYPES.SYSTEM,
          message: `크롤러 봇 모듈 설치 완료 | 총 ${newState.crawlers}개 활성`
        });

        return newState;
      });
    }
  }, [gameState.bytes, gameState.crawlerCost, addLog]);

  // 서버 구매
  const onBuyServer = useCallback(() => {
    if (gameState.bytes >= gameState.serverCost) {
      setGameState(prev => {
        const newState = {
          ...prev,
          bytes: prev.bytes - prev.serverCost,
          servers: prev.servers + 1,
          serverCost: calculatePrice(
            PRODUCTION_CONFIG.server.baseCost,
            prev.servers + 1,
            PRICE_GROWTH
          )
        };

        addLog({
          type: LOG_TYPES.SYSTEM,
          message: `서버 랙 증설 완료 | 총 ${newState.servers}개 운영 중`
        });

        return newState;
      });
    }
  }, [gameState.bytes, gameState.serverCost, addLog]);

  // 저장/불러오기
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGameState(prev => ({ ...prev, ...data }));
        addLog({
          type: LOG_TYPES.SYSTEM,
          message: '시스템 복원 완료 | 저장된 데이터 로드됨'
        });
      } catch (e) {
        console.error('불러오기 실패:', e);
      }
    } else {
      addLog({
        type: LOG_TYPES.SYSTEM,
        message: '시스템 온라인 | 모든 모듈 정상 작동'
      });
    }
  }, []);

  // 자동 저장
  useEffect(() => {
    const saveGame = () => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
        setAutoSaveStatus('완료');
        setTimeout(() => setAutoSaveStatus('대기'), 2000);
      } catch (e) {
        setAutoSaveStatus('오류');
        console.error('저장 실패:', e);
      }
    };

    const interval = setInterval(saveGame, 30000);
    return () => clearInterval(interval);
  }, [gameState]);

  // 가동 시간 업데이트
  const uptime = Math.floor((Date.now() - gameState.startTime) / 1000);

  const enhancedState = {
    ...gameState,
    productionRate,
    uptime,
    autoSaveStatus
  };

  return {
    gameState: enhancedState,
    logs,
    onManualCollect,
    onBuyCrawler,
    onBuyServer
  };
}
