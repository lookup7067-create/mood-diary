'use client';

import { Mic, ArrowLeft, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

function LogMoodContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');

    const [moodText, setMoodText] = useState('');
    const [selectedMood, setSelectedMood] = useState('happy'); // 기본값: 기쁨
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    // Initial Load for Past Data
    useEffect(() => {
        if (dateParam) {
            const savedLogs = localStorage.getItem('moodLogs');
            if (savedLogs) {
                const logs = JSON.parse(savedLogs);
                if (logs[dateParam]) {
                    setSelectedMood(logs[dateParam].type);
                    setMoodText(logs[dateParam].content || '');
                }
            }
        }
    }, [dateParam]);

    // 키워드 기반 감정 자동 감지
    useEffect(() => {
        if (!moodText) return;

        const keywords: Record<string, string[]> = {
            happy: ['기쁨', '행복', '좋아', '신나', '최고', '웃겨', '즐거', 'happy', 'good', '감사', '뿌듯', '만족'],
            sad: ['슬퍼', '우울', '눈물', '속상', '힘들', '아파', 'sad', 'cry', '괴로', '외로', '절망'],
            angry: ['화나', '짜증', '열받', '미워', 'angry', 'mad', '분노', '빡쳐'],
            tired: ['피곤', '지쳐', '졸려', '힘없', 'tired', 'sleep', 'exhausted', '방전', '힘드', '녹초'],
            calm: ['평온', '편안', '휴식', '느긋', 'calm', 'relax', '편해', '편하', '차분', '잔잔', '고요', '안정'],
            anxious: ['걱정', '불안', '긴장', '무서', 'anxious', 'scared', 'worry', '두려', '떨려', '초조']
        };

        for (const [mood, words] of Object.entries(keywords)) {
            if (words.some(word => moodText.includes(word))) {
                setSelectedMood(mood);
                break; // 하나 찾으면 멈춤 (우선순위: 위에서 아래)
            }
        }
    }, [moodText]);

    // Speech Recognition Setup
    useEffect(() => {
        if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const notification = new SpeechRecognition();
            notification.continuous = false;
            notification.interimResults = false;
            notification.lang = 'ko-KR';

            notification.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setMoodText((prev) => prev ? `${prev} ${transcript}` : transcript);
                setIsListening(false);
            };

            notification.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            notification.onend = () => {
                setIsListening(false);
            };

            setRecognition(notification);
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) {
            alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const handleSubmit = () => {
        const query = new URLSearchParams({
            ...(dateParam ? { date: dateParam } : {}),
            mood: selectedMood,
            content: moodText
        }).toString();

        router.push(`/hatch?${query}`);
    };

    const moods = [
        { id: 'happy', label: '😊 기쁨', color: 'bg-yellow-100 border-yellow-300' },
        { id: 'sad', label: '☁️ 슬픔', color: 'bg-blue-100 border-blue-300' },
        { id: 'angry', label: '😠 화남', color: 'bg-red-100 border-red-300' },
        { id: 'tired', label: '🫠 지침', color: 'bg-purple-100 border-purple-300' },
        { id: 'calm', label: '😌 평온', color: 'bg-green-100 border-green-300' },
        { id: 'anxious', label: '😟 걱정', color: 'bg-orange-100 border-orange-300' },
    ];

    return (
        <div className="min-h-screen bg-secondary/20 flex flex-col relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 w-full h-64 bg-gradient-to-b from-[#8B5F4D]/80 to-transparent z-0 pointer-events-none opacity-50" />

            {/* Header */}
            <header className="p-6 pt-8 z-10 flex items-center justify-between text-text-main">
                <Link href="/">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold">오 늘 의 기 록</h1>
                <div className="w-6" />
            </header>

            <div className="flex-1 px-6 z-10 flex flex-col justify-center pb-20">
                <div className="text-center mb-6 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-2 text-text-main">오늘 기분은 어때요?</h2>
                    <p className="text-text-sub">솔직한 마음을 선택해주세요</p>
                </div>

                {/* Mood Selection Buttons */}
                <div className="flex justify-center gap-3 mb-6 animate-fade-in flex-wrap">
                    {moods.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setSelectedMood(m.id)}
                            className={`px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-bold text-text-main
                ${selectedMood === m.id ? `${m.color} scale-110 shadow-md` : 'bg-white border-transparent hover:bg-gray-50'}
              `}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-md shadow-orange-100/50 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <textarea
                        className="w-full h-32 resize-none border-none outline-none text-lg text-text-main p-2 placeholder-gray-300 bg-transparent"
                        placeholder="어떤 일이 있었나요? (선택)"
                        value={moodText}
                        onChange={(e) => setMoodText(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={toggleListening}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-orange-100 text-primary'}`}
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="animate-fade-in text-center" style={{ animationDelay: '0.2s' }}>
                    <p className="text-xs text-primary mb-4 font-bold flex items-center justify-center gap-1">
                        <Wand2 className="w-3 h-3" /> 나만의 몬스터 만나러 가기
                    </p>
                    <button
                        onClick={handleSubmit}
                        className="btn-primary w-full text-lg shadow-xl shadow-orange-200"
                    >
                        ✨ 몬스터 생성하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LogMood() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LogMoodContent />
        </Suspense>
    )
}
