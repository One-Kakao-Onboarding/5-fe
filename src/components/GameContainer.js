import React from 'react';
import { useGame } from '../context/GameContext';
import ProgressBar from './ProgressBar';
import InventoryBar from './InventoryBar';
import ItemRewardModal from './ItemRewardModal';
import DictionaryModal from './DictionaryModal';
import EmailTranslator from './EmailTranslator';
import MagnifierTooltip from './MagnifierTooltip';
import Stage1 from './stages/Stage1';
import Stage2 from './stages/Stage2';
import Stage3 from './stages/Stage3';
import Stage4 from './stages/Stage4';

const GameContainer = () => {
  const { currentStage } = useGame();

  // 현재 스테이지에 맞는 컴포넌트 렌더링
  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <Stage1 />;
      case 2:
        return <Stage2 />;
      case 3:
        return <Stage3 />;
      case 4:
        return <Stage4 />;
      default:
        return <Stage1 />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-kakao-lightGray">
      {/* 상단: 진행 상황 바 */}
      <ProgressBar />

      {/* 중앙: 채팅 인터페이스 */}
      <div className="flex-1 overflow-hidden">
        {renderStage()}
      </div>

      {/* 하단: 인벤토리 바 */}
      <InventoryBar />

      {/* 아이템 획득 모달 */}
      <ItemRewardModal />

      {/* 판교어 사전 모달 */}
      <DictionaryModal />

      {/* 메일 번역기 모달 */}
      <EmailTranslator />

      {/* 판교어 돋보기 툴팁 */}
      <MagnifierTooltip />
    </div>
  );
};

export default GameContainer;
