import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { ResourcePanel } from './components/ResourcePanel';
import { UpgradePanel } from './components/UpgradePanel';
import { LogPanel } from './components/LogPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function App() {
  const {
    gameState,
    logs,
    onManualCollect,
    onBuyCrawler,
    onBuyServer
  } = useGameLogic();

  return (
    <div className="app-container">
      <Header />

      <ResourcePanel
        bytes={gameState.bytes}
        productionRate={gameState.productionRate}
        onManualCollect={onManualCollect}
      />

      <UpgradePanel
        crawlers={gameState.crawlers}
        servers={gameState.servers}
        crawlerCost={gameState.crawlerCost}
        serverCost={gameState.serverCost}
        totalBytes={gameState.totalBytes}
        manualClicks={gameState.manualClicks}
        uptime={gameState.uptime}
        canBuyCrawler={gameState.bytes >= gameState.crawlerCost}
        canBuyServer={gameState.bytes >= gameState.serverCost}
        onBuyCrawler={onBuyCrawler}
        onBuyServer={onBuyServer}
      />

      <LogPanel logs={logs} />

      <Footer autoSaveStatus={gameState.autoSaveStatus} />
    </div>
  );
}
