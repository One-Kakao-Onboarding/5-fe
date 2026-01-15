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
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [showEmailTranslator, setShowEmailTranslator] = useState(false);
  const [magnifierData, setMagnifierData] = useState(null); // { word, position: { x, y } }

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

  // 사전 모달 열기
  const openDictionary = useCallback(() => {
    setShowDictionaryModal(true);
  }, []);

  // 사전 모달 닫기
  const closeDictionary = useCallback(() => {
    setShowDictionaryModal(false);
  }, []);

  // 메일 번역기 열기
  const openEmailTranslator = useCallback(() => {
    setShowEmailTranslator(true);
  }, []);

  // 메일 번역기 닫기
  const closeEmailTranslator = useCallback(() => {
    setShowEmailTranslator(false);
  }, []);

  // 돋보기 툴팁 표시
  const showMagnifier = useCallback((word, position) => {
    setMagnifierData({ word, position });
  }, []);

  // 돋보기 툴팁 숨기기
  const hideMagnifier = useCallback(() => {
    setMagnifierData(null);
  }, []);

  const value = {
    currentStage,
    inventory,
    isTransitioning,
    dialogueHistory,
    showItemModal,
    newItem,
    showDictionaryModal,
    showEmailTranslator,
    magnifierData,
    addDialogue,
    clearDialogue,
    addItemToInventory,
    closeItemModal,
    goToNextStage,
    completeTransition,
    hasItem,
    openDictionary,
    closeDictionary,
    openEmailTranslator,
    closeEmailTranslator,
    showMagnifier,
    hideMagnifier,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
