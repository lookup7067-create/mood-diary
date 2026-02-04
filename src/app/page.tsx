'use client';

import { Settings, Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface MoodData {
    type: string;
    icon: string;
    image?: string; // 이미지 필드 추가
    color: string;
    monsterName?: string;
}

export default function Home() {
    const router = useRouter();

    const [viewDate, setViewDate] = useState<Date | null>(null);
    const [today, setToday] = useState<Date | null>(null);
    const [moodLogs, setMoodLogs] = useState<Record<string, MoodData>>({});
    const [showStatsModal, setShowStatsModal] = useState(false);

    useEffect(() => {
        const now = new Date();
        setToday(now);
        setViewDate(now);

        // 저장된 데이터 불러오기
        const saved = localStorage.getItem('moodLogs');
        if (saved) {
            setMoodLogs(JSON.parse(saved));
        }
    }, []);

    if (!viewDate || !today) return null;

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth() + 1;

    // 실제 오늘 날짜 정보 (비교용)
    const realTodayYear = today.getFullYear();
    const realTodayMonth = today.getMonth() + 1;
    const realTodayDate = today.getDate();

    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 2, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth, 1));

    const handleDateClick = (day: number, isFuture: boolean) => {
        if (isFuture) {
            alert("아직 오지 않은 미래입니다! ⏳");
            return;
        }
        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        router.push(`/log?date=${dateStr}`);
    };

    const getMoodForDay = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return moodLogs[dateStr] || null;
    };

    // 통계 계산 로직 (가장 자주 느낀 감정)
    const getMonthlyStats = () => {
        const currentMonthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const monthlyKeys = Object.keys(moodLogs).filter(k => k.startsWith(currentMonthPrefix));

        if (monthlyKeys.length === 0) return null;

        const counts: Record<string, number> = {};
        monthlyKeys.forEach(key => {
            const { type } = moodLogs[key];
            counts[type] = (counts[type] || 0) + 1;
        });

        const total = monthlyKeys.length;
        const stats = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => ({
                type,
                count,
                percentage: Math.round((count / total) * 100),
                label: {
                    happy: '기쁨', sad: '슬픔', angry: '화남',
                    tired: '지침', calm: '평온', anxious: '걱정'
                }[type] || type,
                color: {
                    happy: '#FFD700', sad: '#89CFF0', angry: '#FF6B6B',
                    tired: '#E0B0FF', calm: '#98FB98', anxious: '#FFDAB9'
                }[type] || '#ccc'
            }));

        return { total, stats, topMood: stats[0] };
    };

    const monthlyStats = getMonthlyStats();

    // 최근 만난 몬스터들 (최신순 5개)
    const recentMonsters = Object.entries(moodLogs)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .slice(0, 5)
        .map(([date, data]) => ({ date, ...data }));

    return (
        <div className="min-h-screen pb-28 relative">
            <header className="p-6 flex justify-between items-center pt-8">
                <div className="flex items-center gap-4">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <h1 className="text-xl font-bold select-none min-w-[120px] text-center">
                            {currentYear}년 {currentMonth}월
                        </h1>
                        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/settings')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer z-20"
                >
                    <Settings className="w-6 h-6 text-gray-400" />
                </button>
            </header>

            <div className="px-6 space-y-6">
                {/* Stats Card */}
                <div
                    className="card flex justify-between items-center animate-fade-in cursor-pointer hover:bg-orange-50 transition-colors"
                    onClick={() => setShowStatsModal(true)}
                >
                    <div>
                        <p className="text-xs text-text-sub mb-1 font-medium flex items-center gap-1">
                            이번 달의 감정 <span className="bg-orange-100 text-primary text-[10px] px-1 rounded">분석 보기</span>
                        </p>
                        <div className="flex items-center gap-2">
                            {monthlyStats ? (
                                <>
                                    <span className="text-lg font-bold text-text-main">{monthlyStats.topMood.label}</span>
                                    <span className="text-sm text-text-sub">이 가장 많았어요</span>
                                </>
                            ) : (
                                <span className="text-sm text-gray-400">아직 기록이 없어요</span>
                            )}
                        </div>
                    </div>
                    <div className="h-10 w-px bg-gray-200"></div>
                    <div>
                        <p className="text-xs text-text-sub mb-1 font-medium">기록된 일수</p>
                        <p className="text-lg font-bold text-text-main">
                            {monthlyStats?.total || 0}
                            <span className="text-sm font-normal text-text-sub"> / {daysInMonth}</span>
                        </p>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="card p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                            <span key={day} className="text-xs text-text-sub font-medium">{day}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center place-items-center">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isToday = currentYear === realTodayYear && currentMonth === realTodayMonth && day === realTodayDate;
                            const checkDate = new Date(currentYear, currentMonth - 1, day);
                            const isFuture = checkDate > new Date(realTodayYear, realTodayMonth - 1, realTodayDate);
                            const mood = getMoodForDay(day);

                            return (
                                <div
                                    key={day}
                                    className={`relative w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all duration-200 
                     ${isFuture ? 'text-gray-300 cursor-not-allowed' : 'text-text-sub cursor-pointer hover:bg-orange-50 active:scale-90'}
                   `}
                                    onClick={() => handleDateClick(day, isFuture)}
                                >
                                    {mood ? (
                                        <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-sm overflow-hidden ${mood.color} border border-white`}>
                                            {mood.image ? (
                                                <Image
                                                    src={mood.image}
                                                    alt="mood"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                mood.icon
                                            )}
                                        </div>
                                    ) : (
                                        <span className={isToday ? "w-8 h-8 flex items-center justify-center bg-primary text-white font-bold rounded-full shadow-md ring-2 ring-orange-100" : ""}>
                                            {isToday ? '오늘' : day}
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-lg font-bold mb-4">최근 만난 몬스터들</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {recentMonsters.length > 0 ? (
                            recentMonsters.map((monster, idx) => (
                                <div key={`${monster.date}-${idx}`} className="min-w-[120px] bg-white rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-1 transition-transform">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl relative overflow-hidden bg-gray-50 border-2 border-white shadow-inner`}>
                                        {monster.image ? (
                                            <Image src={monster.image} alt={monster.monsterName || 'monster'} fill className="object-contain p-2" />
                                        ) : (
                                            monster.icon
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <span className="block font-bold text-sm text-text-main line-clamp-1">{monster.monsterName || '이름 없음'}</span>
                                        <span className="block text-[10px] text-gray-400 mt-1">{monster.date}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                아직 만난 몬스터가 없어요.<br />오늘의 기분을 기록해보세요!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 left-0 right-0 flex flex-col items-center gap-3 px-4 pointer-events-none z-50">
                <Link
                    href="/list"
                    className="bg-white/90 backdrop-blur-sm text-text-sub font-bold text-sm py-3 px-6 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all pointer-events-auto flex items-center gap-2"
                >
                    📖 한 줄 일기장 모아보기
                </Link>
                <button
                    className="btn-primary w-full max-w-[400px] shadow-lg text-lg pointer-events-auto hover:scale-105 active:scale-95 transition-all"
                    onClick={() => router.push('/log')}
                >
                    <Plus className="w-5 h-5" />
                    오늘의 기분 기록하기
                </button>
            </div>

            {/* Stats Modal */}
            {showStatsModal && monthlyStats && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative animate-slide-up">
                        <button
                            onClick={() => setShowStatsModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-center">{currentMonth}월의 감정 리포트</h2>

                        <div className="space-y-6">
                            {/* Bar Chart Representation */}
                            <div className="space-y-4">
                                {monthlyStats.stats.map((stat) => (
                                    <div key={stat.type} className="space-y-1">
                                        <div className="flex justify-between items-center text-sm mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{
                                                    { joy: '😊', happy: '😊', sad: '☁️', angry: '😠', tired: '🫠', calm: '😌', anxious: '😟' }[stat.type] || '😐'
                                                }</span>
                                                <span className="font-bold text-text-main">{stat.label}</span>
                                            </div>
                                            <span className="text-gray-500 font-medium">{stat.count}일 ({stat.percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${stat.percentage}%`,
                                                    backgroundColor: stat.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-100 text-center">
                                <p className="text-text-sub text-sm">
                                    지금까지 총 <span className="text-primary font-bold text-lg">{monthlyStats.total}</span>개의 감정을 모았어요!
                                </p>
                                <p className="text-xs text-text-sub mt-2 bg-orange-50 p-3 rounded-xl border border-orange-100">
                                    {monthlyStats.topMood.label === '기쁨' ? '긍정적인 에너지가 가득하네요! ✨' :
                                        monthlyStats.topMood.label === '슬픔' ? '토닥토닥, 따뜻한 위로를 보냅니다. 🍵' :
                                            monthlyStats.topMood.label === '화남' ? '마음속 불꽃을 다스리는 중이군요. 🔥' :
                                                '당신의 모든 감정은 소중해요. 🍀'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
