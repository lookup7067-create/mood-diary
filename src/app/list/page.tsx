'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MoodLog {
    type: string;
    icon: string;
    image?: string;
    color: string;
    monsterName?: string;
    content?: string;
}

export default function ListPage() {
    const [logs, setLogs] = useState<Record<string, MoodLog>>({});

    useEffect(() => {
        const savedLogs = localStorage.getItem('moodLogs');
        if (savedLogs) {
            setLogs(JSON.parse(savedLogs));
        }
    }, []);

    // 날짜 내림차순 정렬 (최신순)
    const sortedDates = Object.keys(logs).sort((a, b) => b.localeCompare(a));

    const getMoodDetails = (type: string) => {
        const map: Record<string, { label: string; bg: string }> = {
            happy: { label: '기쁨', bg: 'bg-yellow-100/50' },
            sad: { label: '슬픔', bg: 'bg-blue-100/50' },
            angry: { label: '화남', bg: 'bg-red-100/50' },
            tired: { label: '지침', bg: 'bg-purple-100/50' },
            calm: { label: '평온', bg: 'bg-green-100/50' },
            anxious: { label: '걱정', bg: 'bg-orange-100/50' },
        };
        return map[type] || { label: '기록', bg: 'bg-gray-100' };
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] p-6 pb-20">
            <header className="flex items-center gap-4 mb-8 pt-2">
                <Link href="/" className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-text-main" />
                </Link>
                <h1 className="text-xl font-bold text-text-main">한 줄 일기장</h1>
            </header>

            {sortedDates.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                    <div className="text-6xl grayscale opacity-50">📖</div>
                    <p className="text-text-sub">아직 작성된 일기가 없어요.<br />첫 번째 이야기를 들려주세요!</p>
                    <Link href="/log" className="btn-primary">
                        첫 기록 남기기
                    </Link>
                </div>
            ) : (
                <div className="space-y-4 animate-slide-up">
                    {sortedDates.map((date) => {
                        const log = logs[date];
                        const moodInfo = getMoodDetails(log.type);
                        const dateObj = new Date(date);
                        const dayStr = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
                        const weekDay = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];

                        return (
                            <Link href={`/log?date=${date}`} key={date} className="block">
                                <div className={`bg-white p-5 rounded-3xl shadow-sm border border-orange-50/50 active:scale-[0.98] transition-transform ${moodInfo.bg}`}>
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                            <span className="text-sm font-bold text-text-sub">{dayStr}</span>
                                            <span className="text-xs text-gray-400">{weekDay}요일</span>
                                            <div className="w-10 h-10 mt-1 rounded-full bg-white flex items-center justify-center text-xl shadow-sm overflow-hidden">
                                                {log.image ? (
                                                    <Image src={log.image} alt={log.type} width={40} height={40} className="object-cover" />
                                                ) : (
                                                    log.icon
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-h-[80px] flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-white text-text-sub shadow-sm`}>
                                                    {moodInfo.label}
                                                </span>
                                                {log.monsterName && (
                                                    <span className="text-[10px] text-gray-400">
                                                        with {log.monsterName}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-text-main text-sm leading-relaxed line-clamp-3">
                                                {log.content || "기록된 내용이 없습니다."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    <div className="text-center pt-8 pb-4 text-gray-300 text-xs text-balance">
                        소중한 하루들이 차곡차곡 쌓이고 있어요 🌱
                    </div>
                </div>
            )}
        </div>
    );
}
