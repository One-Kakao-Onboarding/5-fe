import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ITEMS } from '../../constants/items';
import ChatInterface from '../ChatInterface';

// API 서버 주소
const API_BASE_URL = 'http://192.168.8.204:8000';

const Stage2 = () => {
  const { addDialogue, addItemToInventory, goToNextStage } = useGame();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isEnded, setIsEnded] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const hasStarted = useRef(false); // 중복 호출 방지

  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 대화 시작
    if (!hasStarted.current) {
      hasStarted.current = true;
      startConversation();
    }
  }, []);

  const startConversation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [],
          scenario_id: 2, // 2단계 시나리오
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error('대화 시작 실패');
      }

      const data = await response.json();

      // AI 첫 메시지를 messages와 dialogueHistory에 추가
      const aiMessage = { role: 'assistant', content: data.message };
      setMessages([aiMessage]);

      addDialogue({
        sender: 'npc',
        text: data.message,
        timestamp: getCurrentTime(),
      });

      setTurnCount(data.turn_count);
    } catch (error) {
      console.error('대화 시작 오류:', error);
      addDialogue({
        sender: 'npc',
        text: '대화를 시작하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: getCurrentTime(),
      });
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || isLoading || isEnded) return;

    const userMessage = userInput.trim();
    setUserInput('');

    // 사용자 메시지를 dialogueHistory에 추가
    addDialogue({
      sender: 'user',
      text: userMessage,
      timestamp: getCurrentTime(),
    });

    // messages 배열에 추가
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();

      // AI 응답을 messages와 dialogueHistory에 추가
      const aiMessage = { role: 'assistant', content: data.message };
      setMessages([...newMessages, aiMessage]);

      addDialogue({
        sender: 'npc',
        text: data.message,
        timestamp: getCurrentTime(),
      });

      setTurnCount(data.turn_count);

      // 대화 종료 처리
      if (data.is_ending) {
        setIsEnded(true);
        handleConversationEnd(data.understood);
      }
    } catch (error) {
      console.error('대화 오류:', error);
      addDialogue({
        sender: 'npc',
        text: '응답을 받는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: getCurrentTime(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationEnd = (understood) => {
    if (understood) {
      // 성공
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '완벽해요! 👏\n판교어를 잘 이해하고 계시네요!',
          timestamp: getCurrentTime(),
        });
      }, 2000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '업무 메일 작성할 때 유용한\n"메일 작성 도우미"를 드릴게요! 📧',
          timestamp: getCurrentTime(),
        });
      }, 4000);

      setTimeout(() => {
        addItemToInventory(ITEMS.EMAIL_HELPER);
      }, 5500);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '다음 단계로 이동할게요!',
          timestamp: getCurrentTime(),
        });
      }, 7000);

      setTimeout(() => {
        goToNextStage();
      }, 8500);
    } else {
      // 실패 - 즉시 재시작
      addDialogue({
        sender: 'npc',
        text: '음... 판교어 학습이 좀 더 필요할 것 같아요. 😅\n처음부터 다시 시작할게요!',
        timestamp: getCurrentTime(),
      });

      setTimeout(() => {
        // 즉시 재시작
        setIsEnded(false);
        setMessages([]);
        setTurnCount(0);
        startConversation();
      }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatInterface>
      <div className="space-y-3">
        {/* 입력 영역 */}
        {!isEnded && (
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="답변을 입력하세요..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kakao-yellow disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <motion.button
              onClick={handleSend}
              disabled={isLoading || !userInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-kakao-yellow to-yellow-400 hover:from-yellow-400 hover:to-kakao-yellow text-kakao-brown font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '⏳' : '전송'}
            </motion.button>
          </div>
        )}

        {/* 로딩 표시 */}
        {isLoading && (
          <motion.div
            className="text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            AI가 응답을 생성하고 있습니다...
          </motion.div>
        )}
      </div>
    </ChatInterface>
  );
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export default Stage2;
