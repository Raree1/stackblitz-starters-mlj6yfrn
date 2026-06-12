export const MILESTONES = {
  WORD_COLLECTOR: {
    id: 'wordCollector',
    name: '단어 수집기',
    description: '기초적인 단어들을 수집합니다.',
    unlockAt: { totalBytes: 0 },
    autoUnlockAt: { totalTokens: 5 },
  },
  SENTENCE_COLLECTOR: {
    id: 'sentenceCollector',
    name: '문장 수집기',
    description: '단어보다 더 많은 데이터를 수집합니다.',
    unlockAt: { totalBytes: 50 },
  },
  TEXT_COLLECTOR: {
    id: 'textCollector',
    name: '글 수집기',
    description: '문장들을 대량으로 수집합니다.',
    unlockAt: { totalBytes: 500 },
  },
  TOKEN_CONVERTER: {
    id: 'tokenConverter',
    name: '토큰 변환기',
    description: '수집된 데이터를 토큰으로 자동 변환합니다.',
    unlockAt: { totalBytes: 2000 },
  },
  AUTO_BUY: {
    id: 'autoBuy',
    name: '자동 구매기',
    description: '수집기를 자동으로 구매합니다.',
    unlockAt: { totalTokens: 5 },
  },
  EMBEDDING_PHASE: {
    id: 'embeddingPhase',
    name: '임베딩 단계',
    description: '수집된 토큰을 벡터 공간에 임베딩합니다.\n이제 본격적으로 LLM을 만듭니다.',
    unlockAt: { totalTokens: 500 },
  },
};

export const MILESTONE_ORDER = [
  'WORD_COLLECTOR',
  'SENTENCE_COLLECTOR',
  'TEXT_COLLECTOR',
  'TOKEN_CONVERTER',
  'AUTO_BUY',
  'EMBEDDING_PHASE',
];

export const COLLECTOR_CONFIG = {
  word: {
    name: '단어 수집기',
    baseProduction: 0.5,
    clickValue: 1,
    baseCost: 15,
    costGrowth: 1.15,
    autoBuyCost: 3,
  },
  sentence: {
    name: '문장 수집기',
    baseProduction: 3,
    clickValue: 5,
    baseCost: 100,
    costGrowth: 1.15,
    autoBuyCost: 8,
  },
  text: {
    name: '글 수집기',
    baseProduction: 15,
    clickValue: 25,
    baseCost: 1100,
    costGrowth: 1.15,
    autoBuyCost: 20,
  },
};

export const TOKEN_CONVERTER_CONFIG = {
  bytesPerToken: 100,
  autoBuyCost: 15,
};

export function checkMilestoneUnlocks(unlocked, totalBytes, totalTokens) {
  const newUnlocks = [];

  for (const key of MILESTONE_ORDER) {
    if (unlocked.includes(key)) continue;

    const milestone = MILESTONES[key];
    const { totalBytes: reqBytes = 0, totalTokens: reqTokens = 0 } = milestone.unlockAt;

    if (totalBytes >= reqBytes && totalTokens >= reqTokens) {
      newUnlocks.push(key);
    }
  }

  return newUnlocks;
}
