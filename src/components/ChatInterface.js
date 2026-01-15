import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const ChatInterface = ({ children }) => {
  const { dialogueHistory, currentStage } = useGame();
  const chatEndRef = useRef(null);

  // NPC 이미지 경로 (플레이스홀더)
  const npcImagePath = `/assets/npc/stage${currentStage}.png`;

  // 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueHistory]);

  return (
    <div className="flex-1 bg-kakao-lightGray overflow-hidden flex flex-col">
      {/* NPC 캐릭터 영역 */}
      <div className="bg-white p-6 border-b-2 border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-kakao-yellow to-yellow-300 rounded-full flex items-center justify-center text-4xl shadow-lg">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold text-kakao-brown">시니어 NPC</h2>
            <p className="text-sm text-gray-600">판교 생존의 길잡이</p>
          </div>
        </div>
      </div>

      {/* 대화창 영역 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {dialogueHistory.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${
                    message.sender === 'npc'
                      ? 'bg-white text-gray-800'
                      : 'bg-kakao-yellow text-kakao-brown'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  {message.timestamp && (
                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 입력 영역 (각 스테이지별로 다름) */}
      <div className="bg-white border-t-2 border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
