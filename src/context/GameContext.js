import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // 전역 상태
  const [currentStage, setCurrentStage] = useState(1);
  const [inventory, setInventory] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [newItem, setNewItem] = useState(null);

  // 대화 추가
  const addDialogue = useCallback((message) => {
    setDialogueHistory((prev) => [...prev, message]);
  }, []);

  // 대화 초기화 (스테이지 변경 시)
  const clearDialogue = useCallback(() => {
    setDialogueHistory([]);
  }, []);

  // 아이템 획득
  const addItemToInventory = useCallback((item) => {
    setInventory((prev) => [...prev, item]);
    setNewItem(item);
    setShowItemModal(true);
  }, []);

  // 아이템 모달 닫기
  const closeItemModal = useCallback(() => {
    setShowItemModal(false);
    setNewItem(null);
  }, []);

  // 다음 스테이지로 이동
  const goToNextStage = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  // 비디오 종료 후 처리
  const completeTransition = useCallback(() => {
    setIsTransitioning(false);
    setCurrentStage((prev) => prev + 1);
    clearDialogue();
  }, [clearDialogue]);

  // 아이템 소유 여부 확인
  const hasItem = useCallback((itemId) => {
    return inventory.some(item => item.id === itemId);
  }, [inventory]);

  const value = {
    currentStage,
    inventory,
    isTransitioning,
    dialogueHistory,
    showItemModal,
    newItem,
    addDialogue,
    clearDialogue,
    addItemToInventory,
    closeItemModal,
    goToNextStage,
    completeTransition,
    hasItem,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
