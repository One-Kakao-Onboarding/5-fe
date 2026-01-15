import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ITEMS } from '../../constants/items';
import ChatInterface from '../ChatInterface';

// API 서버 주소
const API_BASE_URL = 'https://five-be.onrender.com';

const Stage4 = () => {
  const { addDialogue, addItemToInventory, returnToMain } = useGame();
  const [meeting, setMeeting] = useState(null);
  const [showMinutesForm, setShowMinutesForm] = useState(false);
  const [minutesContent, setMinutesContent] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const hasStarted = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 회의 생성
    if (!hasStarted.current) {
      hasStarted.current = true;
      generateMeeting();
    }
  }, []);

  const generateMeeting = async () => {
    setIsLoading(true);

    try {
      // 랜덤 시나리오 선택 (1, 2, 3 중)
      const scenarioId = Math.floor(Math.random() * 3) + 1;

      const response = await fetch(`${API_BASE_URL}/generate-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario_id: scenarioId,
          turn_count: 4,
        }),
        signal: AbortSignal.timeout(60000),
      });

      if (!response.ok) {
        throw new Error('회의 생성 실패');
      }

      const data = await response.json();
      setMeeting(data);

      // 초기 안내 메시지
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '마지막 단계입니다! 🎯\n회의록 작성 능력을 평가하겠습니다.',
          timestamp: getCurrentTime(),
        });
      }, 500);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: `📋 회의 주제: ${data.scenario}\n\n${data.context}`,
          timestamp: getCurrentTime(),
        });
      }, 2000);

      // 회의 대화 표시
      data.dialogue.forEach((msg, index) => {
        setTimeout(() => {
          addDialogue({
            sender: msg.speaker === '직원A' ? 'employeeA' : 'employeeB',
            text: msg.message,
            timestamp: getCurrentTime(),
          });
        }, 3500 + index * 2000);
      });

      // 회의록 작성 폼 표시
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '위 회의 내용을 바탕으로 회의록을 작성해주세요! ✍️',
          timestamp: getCurrentTime(),
        });
      }, 3500 + data.dialogue.length * 2000);

      setTimeout(() => {
        setShowMinutesForm(true);
        setIsLoading(false);
      }, 4500 + data.dialogue.length * 2000);

    } catch (error) {
      console.error('회의 생성 오류:', error);
      setIsLoading(false);

      addDialogue({
        sender: 'npc',
        text: '회의를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: getCurrentTime(),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitted || !minutesContent.trim()) return;

    // 사용자 회의록 추가
    addDialogue({
      sender: 'user',
      text: `[회의록 제출]\n\n${minutesContent}`,
      timestamp: getCurrentTime(),
    });

    setShowMinutesForm(false);
    setSubmitted(true);
    setIsLoading(true);

    // 평가 API 호출
    try {
      const response = await fetch(`${API_BASE_URL}/evaluate-minutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dialogue: meeting.dialogue,
          key_points: meeting.key_points,
          user_minutes: minutesContent,
          used_terms: meeting.used_terms,
        }),
        signal: AbortSignal.timeout(60000),
      });

      if (!response.ok) {
        throw new Error('평가 실패');
      }

      const data = await response.json();
      setEvaluation(data);
      setIsLoading(false);

      // 평가 결과 표시
      setTimeout(() => {
        if (data.is_well_written) {
          // 합격 (70점 이상)
          addDialogue({
            sender: 'npc',
            text: `✅ 합격입니다! (${data.score}/100점)\n\n${data.feedback}`,
            timestamp: getCurrentTime(),
          });
        } else {
          // 불합격 (70점 미만)
          addDialogue({
            sender: 'npc',
            text: `❌ 아쉽지만 조금 더 보완이 필요해요. (${data.score}/100점)\n\n${data.feedback}`,
            timestamp: getCurrentTime(),
          });
        }
      }, 1000);

      // 빠진 포인트 표시
      if (data.missing_points && data.missing_points.length > 0) {
        setTimeout(() => {
          const missingText = data.missing_points.map(point => `• ${point}`).join('\n');
          addDialogue({
            sender: 'npc',
            text: `⚠️ 빠진 핵심 포인트:\n\n${missingText}`,
            timestamp: getCurrentTime(),
          });
        }, 3000);
      }

      // 오해한 용어 표시
      if (data.misunderstood_terms && data.misunderstood_terms.length > 0) {
        setTimeout(() => {
          const misunderstoodText = data.misunderstood_terms.map(term => `• ${term}`).join('\n');
          addDialogue({
            sender: 'npc',
            text: `❌ 오해한 판교어:\n\n${misunderstoodText}`,
            timestamp: getCurrentTime(),
          });
        }, 5000);
      }

      // 개선 제안 표시
      if (data.suggestions && data.suggestions.length > 0) {
        setTimeout(() => {
          const suggestionsText = data.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n');
          addDialogue({
            sender: 'npc',
            text: `💡 개선 제안:\n\n${suggestionsText}`,
            timestamp: getCurrentTime(),
          });
        }, 7000);
      }

      // 합격 시 엔딩
      if (data.is_well_written) {
        setTimeout(() => {
          addDialogue({
            sender: 'npc',
            text: '지금까지 정말 수고 많으셨습니다!\n판교 생존의 모든 단계를 완료하셨어요! 🎉',
            timestamp: getCurrentTime(),
          });
        }, 9000);

        setTimeout(() => {
          addDialogue({
            sender: 'npc',
            text: '축하드립니다! 🎁\n"판교 생존 웰컴 키트"를 드릴게요!',
            timestamp: getCurrentTime(),
          });
        }, 11000);

        setTimeout(() => {
          addItemToInventory(ITEMS.WELCOME_KIT);
        }, 12500);

        setTimeout(() => {
          setShowEnding(true);
        }, 14000);
      } else {
        // 불합격 시 재도전
        setTimeout(() => {
          addDialogue({
            sender: 'npc',
            text: '다시 도전해보시겠어요? 회의록을 수정해서 제출해주세요!',
            timestamp: getCurrentTime(),
          });
        }, 9000);

        setTimeout(() => {
          setSubmitted(false);
          setMinutesContent('');
          setShowMinutesForm(true);
        }, 10500);
      }

    } catch (error) {
      console.error('평가 오류:', error);
      setIsLoading(false);

      addDialogue({
        sender: 'npc',
        text: '평가 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: getCurrentTime(),
      });

      setTimeout(() => {
        setSubmitted(false);
        setShowMinutesForm(true);
      }, 2000);
    }
  };

  return (
    <ChatInterface>
      {isLoading && !showEnding && (
        <motion.div
          className="text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {submitted ? '회의록을 평가하고 있습니다...' : '회의를 생성하고 있습니다...'}
        </motion.div>
      )}

      {showMinutesForm && !submitted && meeting && (
        <div className="space-y-3">
          {/* 접기/펼치기 버튼 */}
          <motion.button
            type="button"
            onClick={() => setIsFormCollapsed(!isFormCollapsed)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-colors text-sm flex items-center justify-between"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span>{isFormCollapsed ? '입력창 펼치기 ▼' : '입력창 접기 ▲'}</span>
            <span className="text-xs text-gray-500">대화 내용 보기</span>
          </motion.button>

          {!isFormCollapsed && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kakao-yellow resize-none"
                rows="10"
                placeholder="회의록을 작성하세요...&#10;&#10;예시:&#10;회의 제목: ...&#10;일시: ...&#10;참석자: ...&#10;&#10;논의 내용:&#10;1. ...&#10;&#10;결정 사항:&#10;- ...&#10;&#10;액션 아이템:&#10;- ..."
                value={minutesContent}
                onChange={(e) => setMinutesContent(e.target.value)}
              />

              <motion.button
                type="submit"
                className="w-full bg-kakao-yellow hover:bg-yellow-400 text-kakao-brown font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!minutesContent.trim()}
              >
                회의록 제출하기 ✍️
              </motion.button>
            </motion.form>
          )}
        </div>
      )}

      {showEnding && (
        <motion.div
          className="text-center py-8 space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-2xl font-bold text-kakao-brown">
            판교 생존 완료!
          </h2>
          <p className="text-gray-600">
            이제 당신은 진정한 판교인입니다!
          </p>
          <div className="flex justify-center gap-2 text-4xl mt-6">
            📚 📧 🔍 🎁
          </div>
          <motion.div
            className="mt-8 bg-kakao-yellow text-kakao-brown font-bold py-4 px-6 rounded-xl inline-block"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            모든 아이템을 획득했습니다! ✨
          </motion.div>

          {evaluation && (
            <div className="mt-6 text-sm text-gray-600">
              최종 점수: {evaluation.score}/100점
            </div>
          )}

          <motion.button
            onClick={returnToMain}
            className="mt-8 bg-white hover:bg-kakao-yellow text-kakao-brown font-bold py-3 px-8 rounded-xl shadow-lg transition-all border-2 border-kakao-yellow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            메인 화면으로 돌아가기 🏠
          </motion.button>
        </motion.div>
      )}
    </ChatInterface>
  );
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export default Stage4;
