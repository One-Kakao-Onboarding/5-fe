import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

// localStorage 키
const STORAGE_KEYS = {
  INVENTORY: 'pangyo_inventory',
  COMPLETED_STAGES: 'pangyo_completed_stages',
};

export const GameProvider = ({ children }) => {
  // localStorage에서 인벤토리 로드
  const loadInventory = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load inventory:', error);
      return [];
    }
  };

  // localStorage에서 완료된 스테이지 로드
  const loadCompletedStages = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_STAGES);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load completed stages:', error);
      return [];
    }
  };

  // 전역 상태
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [inventory, setInventory] = useState(loadInventory());
  const [completedStages, setCompletedStages] = useState(loadCompletedStages());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [newItem, setNewItem] = useState(null);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [showEmailTranslator, setShowEmailTranslator] = useState(false);
  const [magnifierData, setMagnifierData] = useState(null); // { word, position: { x, y } }
  const [showStartVideo, setShowStartVideo] = useState(false);

  // 인벤토리가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (error) {
      console.error('Failed to save inventory:', error);
    }
  }, [inventory]);

  // 완료된 스테이지가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_STAGES, JSON.stringify(completedStages));
    } catch (error) {
      console.error('Failed to save completed stages:', error);
    }
  }, [completedStages]);

  // 대화 추가
  const addDialogue = useCallback((message) => {
    setDialogueHistory((prev) => [...prev, message]);
  }, []);

  // 대화 초기화 (스테이지 변경 시)
  const clearDialogue = useCallback(() => {
    setDialogueHistory([]);
  }, []);

  // 아이템 획득 (중복 방지)
  const addItemToInventory = useCallback((item) => {
    setInventory((prev) => {
      // 이미 같은 id의 아이템이 있는지 확인
      const alreadyHas = prev.some(existingItem => existingItem.id === item.id);

      if (alreadyHas) {
        console.log(`Already have item: ${item.id}`);
        return prev; // 이미 있으면 추가하지 않음
      }

      // 없으면 추가
      return [...prev, item];
    });

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

    // 현재 스테이지를 완료 목록에 추가
    setCompletedStages((prev) => {
      const stage = currentStage;
      if (!prev.includes(stage)) {
        return [...prev, stage];
      }
      return prev;
    });

    setCurrentStage((prev) => prev + 1);
    clearDialogue();
  }, [currentStage, clearDialogue]);

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

  // 게임 시작 (start.mp4 비디오 표시)
  const startGame = useCallback(() => {
    setShowStartVideo(true);
  }, []);

  // start 비디오 완료 후 게임 시작
  const completeStartVideo = useCallback(() => {
    setShowStartVideo(false);
    setGameStarted(true);
  }, []);

  // 특정 스테이지로 이동
  const setStage = useCallback((stage) => {
    setCurrentStage(stage);
    setDialogueHistory([]);
  }, []);

  // 모든 스테이지 완료 여부 확인
  const hasCompletedAllStages = useCallback(() => {
    return completedStages.length >= 4 &&
           [1, 2, 3, 4].every(stage => completedStages.includes(stage));
  }, [completedStages]);

  // 메인 화면으로 돌아가기
  const returnToMain = useCallback(() => {
    setGameStarted(false);
    setCurrentStage(1);
    setDialogueHistory([]);
    setShowStartVideo(false);
    setIsTransitioning(false);
  }, []);

  const value = {
    gameStarted,
    currentStage,
    inventory,
    completedStages,
    isTransitioning,
    dialogueHistory,
    showItemModal,
    newItem,
    showDictionaryModal,
    showEmailTranslator,
    magnifierData,
    showStartVideo,
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
    startGame,
    completeStartVideo,
    setStage,
    hasCompletedAllStages,
    returnToMain,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
