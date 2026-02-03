'use client';

import { Mic, ArrowLeft, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function LogMoodContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');

    const [moodText, setMoodText] = useState('');
    const [selectedMood, setSelectedMood] = useState('happy'); // 기본값: 기쁨
    const [isListening, setIsListening] = useState(false);

    // Mock Voice Input
    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setTimeout(() => {
                setMoodText("오늘 날씨가 너무 좋아서 산책을 다녀왔어. 기분이 상쾌해!");
                setIsListening(false);
            }, 2000);
        }
    };

    const handleSubmit = () => {
        const query = new URLSearchParams({
            ...(dateParam ? { date: dateParam } : {}),
            mood: selectedMood
        }).toString();

        router.push(`/hatch?${query}`);
    };

    const moods = [
        { id: 'happy', label: '😊 기쁨', color: 'bg-yellow-100 border-yellow-300' },
        { id: 'sad', label: '☁️ 슬픔', color: 'bg-blue-100 border-blue-300' },
        { id: 'angry', label: '😠 화남', color: 'bg-red-100 border-red-300' },
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
                <div className="flex justify-center gap-3 mb-6 animate-fade-in">
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
