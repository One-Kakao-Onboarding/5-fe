import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ITEMS } from '../../constants/items';
import ChatInterface from '../ChatInterface';

const Stage3 = () => {
  const { addDialogue, addItemToInventory, goToNextStage, openEmailTranslator } = useGame();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 초기 NPC 대화
    const timer1 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '프로젝트가 드디어 끝났네요! 수고하셨습니다! 🎉',
        timestamp: getCurrentTime(),
      });
    }, 500);

    const timer2 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '이제 휴가(오프)를 가실 수 있을 것 같은데요,\n휴가 전에 팀원들에게 부재중 메일을 보내주세요!',
        timestamp: getCurrentTime(),
      });
    }, 2500);

    const timer3 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '📋 휴가 정보:\n\n• 기간: 12월 25일 ~ 12월 27일 (3일간)\n• 백업 담당자: 김판교 대리\n• 인수인계: 주요 업무는 문서로 정리하여 공유 드라이브에 업로드\n• 긴급 연락: 슬랙 DM 또는 개인 핸드폰\n• 응답 시간: 오전 9시 ~ 오후 6시',
        timestamp: getCurrentTime(),
      });
    }, 4500);

    const timer4 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '💡 TIP: 메일 번역기 아이템을 사용하면\n판교어로 자연스럽게 작성할 수 있어요!',
        timestamp: getCurrentTime(),
      });
    }, 7000);

    const timer5 = setTimeout(() => {
      setShowEmailForm(true);
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [addDialogue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || !emailContent.trim()) return;

    // 사용자 메일 추가
    addDialogue({
      sender: 'user',
      text: `[메일 발송]\n\n${emailContent}`,
      timestamp: getCurrentTime(),
    });

    setShowEmailForm(false);
    setSubmitted(true);

    // 메일 평가
    const evaluation = evaluateEmail(emailContent);

    if (evaluation.passed) {
      // 성공
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '완벽한 부재중 메일이네요! 👍\n판교어 사용도 자연스럽고, 필요한 정보가 모두 포함되어 있습니다!',
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: evaluation.feedback,
          timestamp: getCurrentTime(),
        });
      }, 3000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '이제 판교어 돋보기를 드릴게요! 🔍\n텍스트를 드래그하면 판교어 뜻을 알려줍니다!',
          timestamp: getCurrentTime(),
        });
      }, 5500);

      setTimeout(() => {
        addItemToInventory(ITEMS.MAGNIFIER);
      }, 7000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '마지막 단계로 이동합니다!',
          timestamp: getCurrentTime(),
        });
      }, 8500);

      setTimeout(() => {
        goToNextStage();
      }, 10000);
    } else {
      // 실패
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: `${evaluation.feedback}\n\n💡 메일 번역기를 활용해보세요!`,
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '다시 작성해주세요!',
          timestamp: getCurrentTime(),
        });
        setSubmitted(false);
        setShowEmailForm(true);
      }, 3500);
    }
  };

  const evaluateEmail = (content) => {
    const length = content.length;

    // 기본 정보 체크
    const hasDate = /\d{1,2}월|12월|25일|27일|\d{1,2}\/\d{1,2}/.test(content);
    const hasBackup = content.includes('김판교') || content.includes('백업') || content.includes('담당');
    const hasContact = content.includes('슬랙') || content.includes('핸드폰') || content.includes('연락') || content.includes('DM');
    const hasVacation = content.includes('오프') || content.includes('휴가') || content.includes('부재');

    // 판교어 사용 체크 (보너스)
    const panggyoTerms = ['오프', '핑', '드라이브', '백업', '슬랙', 'DM'];
    const usedTermsCount = panggyoTerms.filter(term => content.includes(term)).length;

    // 최소 길이 체크 (80자 이상)
    const hasMinLength = length >= 80;

    // 통과 조건: 최소 길이 + (날짜 + 연락처) 또는 (백업 + 휴가)
    const basicInfoCount = [hasDate, hasBackup, hasContact, hasVacation].filter(Boolean).length;
    const passed = hasMinLength && basicInfoCount >= 3;

    if (passed) {
      let feedback = '✅ 포함된 정보:\n';
      if (hasDate) feedback += '• 휴가 날짜\n';
      if (hasBackup) feedback += '• 백업 담당자\n';
      if (hasContact) feedback += '• 연락 방법\n';
      if (hasVacation) feedback += '• 부재 안내\n';
      if (usedTermsCount > 0) feedback += `\n🎯 판교어 ${usedTermsCount}개 사용 - 훌륭해요!`;
      return { passed: true, feedback };
    } else {
      let feedback = '❌ 부족한 부분:\n';
      if (!hasMinLength) feedback += '• 메일이 너무 짧습니다 (최소 80자)\n';
      if (!hasDate) feedback += '• 휴가 날짜를 명시해주세요\n';
      if (!hasBackup) feedback += '• 백업 담당자 정보를 포함해주세요\n';
      if (!hasContact) feedback += '• 연락 방법을 알려주세요\n';
      if (!hasVacation) feedback += '• 휴가/부재 안내를 포함해주세요\n';
      return { passed: false, feedback };
    }
  };

  return (
    <ChatInterface>
      {showEmailForm && !submitted && (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-700">
                📧 메일 번역기를 사용하면 더 쉽게 작성할 수 있어요!
              </p>
              <motion.button
                type="button"
                onClick={openEmailTranslator}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                번역기 열기
              </motion.button>
            </div>
          </div>

          <textarea
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kakao-yellow resize-none"
            rows="8"
            placeholder="부재중 메일을 작성하세요...&#10;&#10;예시:&#10;안녕하세요,&#10;12월 25일부터 27일까지 오프 예정입니다.&#10;긴급한 사항은 김판교 대리에게 연락 부탁드립니다.&#10;..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />

          <div className="text-xs text-gray-500 text-center">
            {emailContent.length}/80자 (최소 80자 필요)
          </div>

          <motion.button
            type="submit"
            className="w-full bg-kakao-yellow hover:bg-yellow-400 text-kakao-brown font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!emailContent.trim() || emailContent.length < 80}
          >
            메일 보내기 📤
          </motion.button>
        </motion.form>
      )}
    </ChatInterface>
  );
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export default Stage3;
