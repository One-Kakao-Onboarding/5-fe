import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ITEMS } from '../../constants/items';
import ChatInterface from '../ChatInterface';

// API 서버 주소
const API_BASE_URL = 'https://five-be.onrender.com';

const Stage1 = () => {
  const { addDialogue, addItemToInventory, goToNextStage, returnToMain, isPracticeMode } = useGame();
  const [conversation, setConversation] = useState(null);
  const [showChoices, setShowChoices] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasStarted = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 대화 생성
    if (!hasStarted.current) {
      hasStarted.current = true;
      generateConversation();
    }
  }, []);

  const generateConversation = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-choice-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(60000),
      });

      if (!response.ok) {
        throw new Error('대화 생성 실패');
      }

      const data = await response.json();
      setConversation(data);

      // 상황 설명 추가
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: `안녕하세요! 오늘 첫 출근이시네요. 환영합니다! 👋\n\n📝 ${data.context}`,
          timestamp: getCurrentTime(),
        });
      }, 500);

      // dialogue_before 추가
      data.dialogue_before.forEach((msg, index) => {
        setTimeout(() => {
          addDialogue({
            sender: msg.speaker === '나' ? 'user' : 'npc',
            text: msg.message,
            timestamp: getCurrentTime(),
          });
        }, 1500 + index * 1500);
      });

      // 선택지 표시
      setTimeout(() => {
        setShowChoices(true);
        setIsLoading(false);
      }, 1500 + data.dialogue_before.length * 1500);

    } catch (error) {
      console.error('대화 생성 오류:', error);
      setIsLoading(false);

      // 에러 시 폴백 메시지
      addDialogue({
        sender: 'npc',
        text: '대화를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: getCurrentTime(),
      });
    }
  };

  const handleChoice = (choiceIndex) => {
    if (answered) return;

    const choiceText = conversation.choices[choiceIndex];

    // 사용자 응답 추가
    addDialogue({
      sender: 'user',
      text: choiceText,
      timestamp: getCurrentTime(),
    });

    setShowChoices(false);
    setAnswered(true);

    const isCorrect = choiceIndex === conversation.correct_choice_index;

    if (isCorrect) {
      // 정답 - 설명 표시
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: `✅ 정답입니다!\n\n💡 ${conversation.explanation}`,
          timestamp: getCurrentTime(),
        });
      }, 1000);

      // dialogue_after 표시
      conversation.dialogue_after.forEach((msg, index) => {
        setTimeout(() => {
          addDialogue({
            sender: msg.speaker === '나' ? 'user' : 'npc',
            text: msg.message,
            timestamp: getCurrentTime(),
          });
        }, 3000 + index * 1500);
      });

      // 사용된 판교어 표시
      setTimeout(() => {
        const termsText = conversation.used_terms
          .map(term => `• ${term.용어}: ${term.정의}`)
          .join('\n');

        addDialogue({
          sender: 'npc',
          text: `📚 사용된 판교어:\n\n${termsText}`,
          timestamp: getCurrentTime(),
        });
      }, 3000 + conversation.dialogue_after.length * 1500);

      // 아이템 획득
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '첫 출근부터 훌륭하세요!\n판교어 기초 단어 사전을 드릴게요. 📚',
          timestamp: getCurrentTime(),
        });
      }, 5000 + conversation.dialogue_after.length * 1500);

      setTimeout(() => {
        addItemToInventory(ITEMS.DICTIONARY);
      }, 6500 + conversation.dialogue_after.length * 1500);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: isPracticeMode ? '수고하셨습니다! 메인으로 돌아갑니다.' : '다음 단계로 넘어가볼까요?',
          timestamp: getCurrentTime(),
        });
      }, 8000 + conversation.dialogue_after.length * 1500);

      setTimeout(() => {
        if (isPracticeMode) {
          returnToMain();
        } else {
          goToNextStage();
        }
      }, 9500 + conversation.dialogue_after.length * 1500);

    } else {
      // 오답 - 정답 설명과 함께 재시도
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: `❌ 아쉽지만 다시 생각해보세요!\n\n💡 힌트: ${conversation.explanation}`,
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        const correctAnswer = conversation.choices[conversation.correct_choice_index];
        addDialogue({
          sender: 'npc',
          text: `✅ 정답: "${correctAnswer}"`,
          timestamp: getCurrentTime(),
        });
      }, 3000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '다시 한번 선택해보세요!',
          timestamp: getCurrentTime(),
        });
        setAnswered(false);
        setShowChoices(true);
      }, 5000);
    }
  };

  return (
    <ChatInterface>
      {isLoading && (
        <motion.div
          className="text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          대화를 생성하고 있습니다...
        </motion.div>
      )}

      {showChoices && !answered && conversation && (
        <div className="space-y-3">
          {conversation.choices.map((choice, index) => (
            <motion.button
              key={index}
              className="w-full bg-white hover:bg-kakao-yellow border-2 border-gray-200 hover:border-kakao-yellow rounded-xl px-4 py-3 text-left transition-all shadow-sm hover:shadow-md"
              onClick={() => handleChoice(index)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium text-gray-800">
                {choice}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </ChatInterface>
  );
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export default Stage1;
