import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { STAGE_CONFIG } from '../constants/stageConfig';

const ChatInterface = ({ children }) => {
  const { dialogueHistory, currentStage, showMagnifier, hasItem } = useGame();
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // 배경 이미지 경로 및 설정
  const backgroundImagePath = `/assets/npc/stage${currentStage}.png`;
  const stageConfig = STAGE_CONFIG[currentStage] || STAGE_CONFIG[1];

  // 자동 스크롤 - 새 메시지 추가 시 최하단으로
  useEffect(() => {
    if (chatEndRef.current && messagesContainerRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [dialogueHistory]);

  // 텍스트 선택 감지 - 돋보기 기능
  useEffect(() => {
    const handleTextSelection = (e) => {
      // 돋보기 아이템이 없으면 작동하지 않음
      if (!hasItem('magnifier')) return;

      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      // 선택된 텍스트가 있고, 1-50자 사이일 때만 처리
      if (selectedText && selectedText.length > 0 && selectedText.length <= 50) {
        // 마우스 위치 가져오기
        const position = {
          x: e.clientX,
          y: e.clientY
        };

        // 돋보기 툴팁 표시
        showMagnifier(selectedText, position);
      }
    };

    // messagesContainer에만 이벤트 리스너 추가
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleTextSelection);
      return () => {
        container.removeEventListener('mouseup', handleTextSelection);
      };
    }
  }, [showMagnifier, hasItem]);

  // Framer Motion 설정
  const bubbleVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      {/* Background Layer - 전체 화면 고정 배경 */}
      <div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${backgroundImagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 오버레이 - 가독성 향상 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Content Wrapper - 배경 위에 올라가는 컨텐츠 */}
      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Header - NPC 정보 */}
        <motion.div
          className="bg-white/90 backdrop-blur-md px-6 py-4 shadow-lg border-b border-white/20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-kakao-yellow via-yellow-400 to-yellow-300 rounded-full flex items-center justify-center text-3xl shadow-xl ring-4 ring-white/30">
              👤
            </div>
            <div>
              <h2 className="text-xl font-bold text-kakao-brown">
                {stageConfig.npcName}
              </h2>
              <p className="text-sm text-gray-600">
                Stage {currentStage} · {stageConfig.title}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dialogue Container - 대화 영역 */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          style={{
            scrollbarWidth: 'thin',
          }}
        >
          <div className="max-w-5xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {dialogueHistory.map((message, index) => {
                const isNPC = message.sender === 'npc';
                const isUser = message.sender === 'user';

                return (
                  <motion.div
                    key={`${message.sender}-${index}`}
                    variants={bubbleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    layout
                  >
                    {/* Speech Bubble */}
                    <div
                      className={`
                        max-w-xl px-5 py-4 rounded-3xl shadow-2xl
                        ${isNPC
                          ? 'bg-white/95 text-gray-800 rounded-tl-sm'
                          : 'bg-gradient-to-br from-kakao-yellow to-yellow-400 text-kakao-brown rounded-tr-sm'
                        }
                        backdrop-blur-sm border border-white/20
                      `}
                    >
                      {/* Message Text */}
                      <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
                        {message.text}
                      </p>

                      {/* Timestamp */}
                      {message.timestamp && (
                        <p className={`
                          text-xs mt-2
                          ${isNPC ? 'text-gray-400' : 'text-kakao-brown/70'}
                        `}>
                          {message.timestamp}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* 자동 스크롤 타겟 */}
            <div ref={chatEndRef} className="h-1" />
          </div>
        </div>

        {/* Input Area - 입력 영역 */}
        <motion.div
          className="bg-white/95 backdrop-blur-md px-6 py-5 shadow-2xl border-t border-white/20"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
