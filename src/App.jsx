import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { IntroScreen } from './components/IntroScreen';
import { AISquare } from './components/AISquare';
import { ResourceDisplay } from './components/ResourceDisplay';
import { CollectorCard } from './components/CollectorCard';
import { TokenConverter } from './components/TokenConverter';
import { AutoBuyPanel } from './components/AutoBuyPanel';
import { MilestoneNotification } from './components/MilestoneNotification';
import { EmbeddingPhase } from './components/EmbeddingPhase';

export default function App() {
  const {
    gameState,
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
  } = useGameLogic();

  if (!gameState.introComplete) {
    return <IntroScreen onComplete={onCompleteIntro} />;
  }

  const showTokens = isUnlocked('TOKEN_CONVERTER');

  return (
    <div className="game-screen">
      <MilestoneNotification
        milestone={currentMilestone}
        onDismiss={onDismissMilestone}
      />

      <AISquare />

      <ResourceDisplay
        bytes={gameState.bytes}
        byteRate={gameState.byteRate}
        tokens={gameState.tokens}
        tokenRate={gameState.tokenRate}
        totalBytes={gameState.totalBytes}
        totalTokens={gameState.totalTokens}
        uptime={gameState.uptime}
        showTokens={showTokens}
      />

      <div className="divider" />

      <div className="collectors-section">
        <CollectorCard
          type="word"
          count={gameState.wordCollectors}
          cost={gameState.wordCost}
          canBuy={gameState.canBuyWord}
          canCollect={true}
          autoBuyPurchased={gameState.autoBuyWordPurchased}
          autoBuyEnabled={gameState.autoBuyWord}
          canBuyAutoBuy={gameState.canBuyAutoWord}
          autoBuyCost={0}
          onCollect={onCollect}
          onBuy={onBuyCollector}
          onBuyAutoBuy={onBuyAutoBuy}
          onToggleAutoBuy={onToggleAutoBuy}
          isUnlocked={isUnlocked('WORD_COLLECTOR')}
        />

        <CollectorCard
          type="sentence"
          count={gameState.sentenceCollectors}
          cost={gameState.sentenceCost}
          canBuy={gameState.canBuySentence}
          canCollect={true}
          autoBuyPurchased={gameState.autoBuySentencePurchased}
          autoBuyEnabled={gameState.autoBuySentence}
          canBuyAutoBuy={gameState.canBuyAutoSentence}
          autoBuyCost={0}
          onCollect={onCollect}
          onBuy={onBuyCollector}
          onBuyAutoBuy={onBuyAutoBuy}
          onToggleAutoBuy={onToggleAutoBuy}
          isUnlocked={isUnlocked('SENTENCE_COLLECTOR')}
        />

        <CollectorCard
          type="text"
          count={gameState.textCollectors}
          cost={gameState.textCost}
          canBuy={gameState.canBuyText}
          canCollect={true}
          autoBuyPurchased={gameState.autoBuyTextPurchased}
          autoBuyEnabled={gameState.autoBuyText}
          canBuyAutoBuy={gameState.canBuyAutoText}
          autoBuyCost={0}
          onCollect={onCollect}
          onBuy={onBuyCollector}
          onBuyAutoBuy={onBuyAutoBuy}
          onToggleAutoBuy={onToggleAutoBuy}
          isUnlocked={isUnlocked('TEXT_COLLECTOR')}
        />
      </div>

      <TokenConverter
        count={gameState.tokenConverters}
        cost={gameState.tokenConverterCost}
        canBuy={gameState.canBuyTokenConverter}
        isUnlocked={isUnlocked('TOKEN_CONVERTER')}
        tokenRate={gameState.tokenRate}
        onBuy={onBuyTokenConverter}
      />

      <AutoBuyPanel
        canBuyAutoWord={gameState.canBuyAutoWord}
        canBuyAutoSentence={gameState.canBuyAutoSentence}
        canBuyAutoText={gameState.canBuyAutoText}
        autoBuyWordPurchased={gameState.autoBuyWordPurchased}
        autoBuySentencePurchased={gameState.autoBuySentencePurchased}
        autoBuyTextPurchased={gameState.autoBuyTextPurchased}
        autoBuyWord={gameState.autoBuyWord}
        autoBuySentence={gameState.autoBuySentence}
        autoBuyText={gameState.autoBuyText}
        onBuyAutoBuy={onBuyAutoBuy}
        onToggleAutoBuy={onToggleAutoBuy}
        isUnlocked={isUnlocked('AUTO_BUY')}
        tokens={gameState.tokens}
      />

      <EmbeddingPhase isUnlocked={isUnlocked('EMBEDDING_PHASE')} />

      <div className={`save-indicator ${saveVisible ? 'visible' : ''}`}>
        저장됨
      </div>
    </div>
  );
}
