import { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, calculatePrice } from '../utils/numberFormat';
import {
  COLLECTOR_CONFIG,
  TOKEN_CONVERTER_CONFIG,
  checkMilestoneUnlocks,
  MILESTONES,
} from '../utils/milestones';

const SAVE_KEY = 'project_genesis_v2';

const INITIAL_STATE = {
  bytes: 0,
  totalBytes: 0,
  tokens: 0,
  totalTokens: 0,
  manualClicks: 0,
  wordCollectors: 0,
  sentenceCollectors: 0,
  textCollectors: 0,
  tokenConverters: 0,
  wordCost: COLLECTOR_CONFIG.word.baseCost,
  sentenceCost: COLLECTOR_CONFIG.sentence.baseCost,
  textCost: COLLECTOR_CONFIG.text.baseCost,
  tokenConverterCost: TOKEN_CONVERTER_CONFIG.autoBuyCost,
  autoBuyWord: false,
  autoBuySentence: false,
  autoBuyText: false,
  autoBuyWordPurchased: false,
  autoBuySentencePurchased: false,
  autoBuyTextPurchased: false,
  unlockedMilestones: [],
  introComplete: false,
  startTime: Date.now(),
};

function getCollectorState(state, type) {
  const config = COLLECTOR_CONFIG[type];
  const count = state[`${type}Collectors`];
  const cost = state[`${type}Cost`];
  const autoBuy = state[`autoBuy${type.charAt(0).toUpperCase() + type.slice(1)}`];
  const autoBuyPurchased = state[`autoBuy${type.charAt(0).toUpperCase() + type.slice(1)}Purchased`];
  const autoBuyCost = config.autoBuyCost;
  return { count, cost, autoBuy, autoBuyPurchased, autoBuyCost, config };
}

export function useGameLogic() {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [milestoneQueue, setMilestoneQueue] = useState([]);
  const [saveVisible, setSaveVisible] = useState(false);
  const lastTickRef = useRef(Date.now());
  const autoBuyRef = useRef(false);

  // Production rate calculations
  const byteRate =
    gameState.wordCollectors * COLLECTOR_CONFIG.word.baseProduction +
    gameState.sentenceCollectors * COLLECTOR_CONFIG.sentence.baseProduction +
    gameState.textCollectors * COLLECTOR_CONFIG.text.baseProduction;

  const tokenRate =
    gameState.tokenConverters > 0 && gameState.bytes >= TOKEN_CONVERTER_CONFIG.bytesPerToken
      ? gameState.tokenConverters * (1 / TOKEN_CONVERTER_CONFIG.bytesPerToken) * byteRate
      : gameState.tokenConverters > 0
        ? Math.min(gameState.bytes, byteRate) / TOKEN_CONVERTER_CONFIG.bytesPerToken
        : 0;

  // Game tick
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const delta = Math.min((now - lastTickRef.current) / 1000, 1);
      lastTickRef.current = now;

      setGameState(prev => {
        let bytes = prev.bytes;
        let totalBytes = prev.totalBytes;
        let tokens = prev.tokens;
        let totalTokens = prev.totalTokens;
        let changed = false;

        // Byte production
        const produced =
          prev.wordCollectors * COLLECTOR_CONFIG.word.baseProduction +
          prev.sentenceCollectors * COLLECTOR_CONFIG.sentence.baseProduction +
          prev.textCollectors * COLLECTOR_CONFIG.text.baseProduction;

        if (produced > 0) {
          bytes += produced * delta;
          totalBytes += produced * delta;
          changed = true;
        }

        // Token conversion
        if (prev.tokenConverters > 0 && bytes >= TOKEN_CONVERTER_CONFIG.bytesPerToken * delta) {
          const convertible = Math.min(
            bytes,
            prev.tokenConverters * (produced * delta / TOKEN_CONVERTER_CONFIG.bytesPerToken)
          );
          const tokensProduced = Math.max(0, convertible / TOKEN_CONVERTER_CONFIG.bytesPerToken);
          if (tokensProduced > 0) {
            bytes -= tokensProduced * TOKEN_CONVERTER_CONFIG.bytesPerToken;
            tokens += tokensProduced;
            totalTokens += tokensProduced;
            changed = true;
          }
        }

        if (!changed) return prev;

        // Check milestones
        const newUnlocks = checkMilestoneUnlocks(
          prev.unlockedMilestones,
          totalBytes,
          totalTokens
        );

        if (newUnlocks.length > 0) {
          const updatedMilestones = [...prev.unlockedMilestones, ...newUnlocks];
          setMilestoneQueue(q => [...q, ...newUnlocks]);
          return {
            ...prev,
            bytes,
            totalBytes,
            tokens,
            totalTokens,
            unlockedMilestones: updatedMilestones,
          };
        }

        return { ...prev, bytes, totalBytes, tokens, totalTokens };
      });
    };

    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, []);

  // Auto-buy tick
  useEffect(() => {
    const autoBuyTick = () => {
      setGameState(prev => {
        let updated = { ...prev };

        for (const type of ['word', 'sentence', 'text']) {
          const key = `autoBuy${type.charAt(0).toUpperCase() + type.slice(1)}`;
          if (!prev[key]) continue;

          const costKey = `${type}Cost`;
          const countKey = `${type}Collectors`;
          const config = COLLECTOR_CONFIG[type];

          if (updated.bytes >= updated[costKey]) {
            updated.bytes -= updated[costKey];
            updated[countKey] += 1;
            updated[costKey] = calculatePrice(config.baseCost, updated[countKey], config.costGrowth);
          }
        }

        return updated;
      });
    };

    const interval = setInterval(autoBuyTick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Manual collect for a collector type
  const onCollect = useCallback((type) => {
    const config = COLLECTOR_CONFIG[type];
    if (!config) return;

    setGameState(prev => ({
      ...prev,
      bytes: prev.bytes + config.clickValue,
      totalBytes: prev.totalBytes + config.clickValue,
      manualClicks: prev.manualClicks + 1,
    }));

    // Check milestones after collect
    setGameState(prev => {
      const newUnlocks = checkMilestoneUnlocks(
        prev.unlockedMilestones,
        prev.totalBytes,
        prev.totalTokens
      );
      if (newUnlocks.length > 0) {
        setMilestoneQueue(q => [...q, ...newUnlocks]);
        return { ...prev, unlockedMilestones: [...prev.unlockedMilestones, ...newUnlocks] };
      }
      return prev;
    });
  }, []);

  // Buy collector
  const onBuyCollector = useCallback((type) => {
    setGameState(prev => {
      const config = COLLECTOR_CONFIG[type];
      const costKey = `${type}Cost`;
      const countKey = `${type}Collectors`;

      if (prev.bytes < prev[costKey]) return prev;

      const newCount = prev[countKey] + 1;
      return {
        ...prev,
        bytes: prev.bytes - prev[costKey],
        [countKey]: newCount,
        [costKey]: calculatePrice(config.baseCost, newCount, config.costGrowth),
      };
    });
  }, []);

  // Buy token converter
  const onBuyTokenConverter = useCallback(() => {
    setGameState(prev => {
      if (prev.tokens < prev.tokenConverterCost) return prev;

      const newCount = prev.tokenConverters + 1;
      return {
        ...prev,
        tokens: prev.tokens - prev.tokenConverterCost,
        tokenConverters: newCount,
        tokenConverterCost: calculatePrice(TOKEN_CONVERTER_CONFIG.autoBuyCost, newCount, 1.2),
      };
    });
  }, []);

  // Buy auto-buy for a collector
  const onBuyAutoBuy = useCallback((type) => {
    const config = COLLECTOR_CONFIG[type];
    const key = `autoBuy${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const purchasedKey = `${key}Purchased`;

    setGameState(prev => {
      if (prev.tokens < config.autoBuyCost || prev[purchasedKey]) return prev;

      return {
        ...prev,
        tokens: prev.tokens - config.autoBuyCost,
        [key]: true,
        [purchasedKey]: true,
      };
    });
  }, []);

  // Toggle auto-buy
  const onToggleAutoBuy = useCallback((type) => {
    const key = `autoBuy${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const purchasedKey = `${key}Purchased`;

    setGameState(prev => {
      if (!prev[purchasedKey]) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  }, []);

  // Dismiss milestone notification
  const onDismissMilestone = useCallback(() => {
    setMilestoneQueue(q => q.slice(1));
  }, []);

  // Complete intro
  const onCompleteIntro = useCallback(() => {
    setGameState(prev => {
      if (prev.introComplete) return prev;

      const newUnlocks = checkMilestoneUnlocks(
        prev.unlockedMilestones,
        prev.totalBytes,
        prev.totalTokens
      );
      if (newUnlocks.length > 0) {
        setMilestoneQueue(q => [...q, ...newUnlocks]);
        return {
          ...prev,
          introComplete: true,
          unlockedMilestones: [...prev.unlockedMilestones, ...newUnlocks],
        };
      }
      return { ...prev, introComplete: true };
    });
  }, []);

  // Save/load
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGameState(prev => ({ ...prev, ...data }));
        lastTickRef.current = Date.now();
      } catch (e) {
        console.error('Load failed:', e);
      }
    }
  }, []);

  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
        setSaveVisible(true);
        setTimeout(() => setSaveVisible(false), 1500);
      } catch (e) {
        console.error('Save failed:', e);
      }
    };
    const interval = setInterval(save, 30000);
    return () => clearInterval(interval);
  }, [gameState]);

  const isUnlocked = useCallback(
    (milestoneKey) => gameState.unlockedMilestones.includes(milestoneKey),
    [gameState.unlockedMilestones]
  );

  const currentMilestone = milestoneQueue.length > 0 ? MILESTONES[milestoneQueue[0]] : null;

  const enhancedState = {
    ...gameState,
    byteRate,
    tokenRate,
    canBuyWord: gameState.bytes >= gameState.wordCost,
    canBuySentence: gameState.bytes >= gameState.sentenceCost,
    canBuyText: gameState.bytes >= gameState.textCost,
    canBuyTokenConverter: gameState.tokens >= gameState.tokenConverterCost,
    canBuyAutoWord:
      !gameState.autoBuyWordPurchased && gameState.tokens >= COLLECTOR_CONFIG.word.autoBuyCost,
    canBuyAutoSentence:
      !gameState.autoBuySentencePurchased && gameState.tokens >= COLLECTOR_CONFIG.sentence.autoBuyCost,
    canBuyAutoText:
      !gameState.autoBuyTextPurchased && gameState.tokens >= COLLECTOR_CONFIG.text.autoBuyCost,
    uptime: Math.floor((Date.now() - gameState.startTime) / 1000),
  };

  return {
    gameState: enhancedState,
    currentMilestone,
    saveVisible,
    isUnlocked,
    onCollect,
    onBuyCollector,
    onBuyTokenConverter,
    onBuyAutoBuy,
    onToggleAutoBuy,
    onDismissMilestone,
    onCompleteIntro,
  };
}
