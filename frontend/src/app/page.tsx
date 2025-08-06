'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getPublicClubs } from '@/api/club';
import { components } from "@/types/backend/apiV1/schema";

type SimpleClubInfoWithoutLeader = components['schemas']['SimpleClubInfoWithoutLeader'];

type ToastType = 'success' | 'error';

const Toast = ({ show, message, type = 'success' }: { show: boolean; message: string; type?: ToastType }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 p-4 rounded-xl text-white shadow-xl transition-all duration-300 transform z-50
      ${show ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}
      ${bgColor}`}
    >
      <span>{message}</span>
    </div>
  );
};

export default function MainPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicClubs, setPublicClubs] = useState<SimpleClubInfoWithoutLeader[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoadingClubs, setIsLoadingClubs] = useState(true);
  
  type ToastState = {
    show: boolean;
    message: string;
    type: ToastType;
  };
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: ToastType, redirectPath?: string) => {
    // 기존 타이머가 있다면 정리
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    setToast({ show: true, message, type });
    // 3초 후에 토스트를 자동으로 숨깁니다.
    const id = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
      setTimeoutId(null);
      // 메시지 확인 후 리다이렉트
      if (redirectPath) {
        router.push(redirectPath);
      }
    }, 2000); // 2초 동안 메시지 표시
    setTimeoutId(id);
  };
  
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    setIsLoggedIn(!!token);

    const fetchPublicClubs = async () => {
      try {
        const response = await getPublicClubs();
        if (response.data && response.data.content) {
          setPublicClubs(response.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch public clubs:', error);
        showToast('공개 모임 목록을 불러오는 데 실패했습니다.', 'error');
      } finally {
        setIsLoadingClubs(false);
      }
    };

    fetchPublicClubs();
  }, []);

  useEffect(() => {
    if (publicClubs.length > 0) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) =>
          (prevIndex + 1) % publicClubs.length
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [publicClubs]);
  
  const goToBanner = (index: number) => {
    setCurrentBannerIndex(index);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    setIsLoggedIn(false);
    showToast('로그아웃되었습니다.', 'success');
  };

  const handleLogin = () => {
    router.push('/members/login');
  };

  const handleSignup = () => {
    router.push('/members/signup');
  };

  const handleMypage = () => {
    if (isLoggedIn) {
      router.push('/members/mypage');
    } else {
      showToast('마이페이지는 로그인 후 이용 가능합니다.', 'error', '/members/login');
    }
  };

  const handleFriends = () => {
    if (isLoggedIn) {
      router.push('/members/friends');
    } else {
      showToast('친구 목록은 로그인 후 이용 가능합니다.', 'error', '/members/login');
    }
  };

  const handleCreateClub = () => {
    if (isLoggedIn) {
      router.push('/clubs/new');
    } else {
      showToast('새 모임 만들기는 로그인 후 이용 가능합니다.', 'error', '/members/login');
    }
  };

  // 무작위 그라데이션을 생성하는 함수
  const getRandomGradient = () => {
    const colors = [
      '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', // Vibrant
      '#A2D2FF', '#BDE0FE', '#CDB4DB', '#FFC8DD', '#FFAFCC', // Pastel
      '#8338EC', '#3A86FF', '#FF006E', '#FB5607', '#FFBE0B'  // Bold
    ];
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    
    let color1 = getRandomColor();
    let color2 = getRandomColor();
    while (color1 === color2) { 
      color2 = getRandomColor();
    }

    const direction = Math.random() > 0.5 ? 'to right' : 'to bottom right';
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      
      <header className="bg-white shadow-md w-full p-4 md:p-6 fixed top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-blue-600">
            <span className="text-blue-600">준비물</span>
            <span className="text-gray-900">.com</span>
          </h1>
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  로그아웃
                </button>
                <button
                  onClick={handleFriends}
                  className="px-4 py-2 text-gray-800 bg-gray-200 font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  내 친구
                </button>
                <button
                  onClick={handleMypage}
                  className="px-4 py-2 text-gray-800 bg-gray-200 font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  마이페이지
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignup}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  회원가입
                </button>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  로그인
                </button>
                <button
                  onClick={handleFriends}
                  className="px-4 py-2 text-gray-800 bg-gray-200 font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  내 친구
                </button>
                <button
                  onClick={handleMypage}
                  className="px-4 py-2 text-gray-800 bg-gray-200 font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  마이페이지
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-8">
        {/* 히어로 섹션 */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
              준비물 닷컴에 오신 것을 환영합니다!
            </h2>
            <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
              모임을 만들고, 필요한 준비물을 공유하고, 사람들을 초대해 보세요.
            </p>
          </div>
        </div>

        {/* 2단 레이아웃 섹션 */}
        <div className="container mx-auto mt-16 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* 왼쪽: 모임 만들기 섹션 */}
            <div className="flex flex-col animate-fadeInLeft">
              <h3 className="text-4xl font-bold text-gray-900 mb-6 text-left md:ml-12">모임을 만들거나</h3>
              <div className="p-8 bg-white rounded-3xl shadow-xl w-full flex-grow flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] transform-gpu">
                <p className="text-lg text-gray-600 mb-6">
                  새로운 모임을 만들고 멤버들을 초대하여 준비물을 관리해 보세요.
                </p>
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6">
                  <Image
                    src="/create-club-image.jpg"
                    alt="새 모임 만들기 이미지"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <button
                  onClick={handleCreateClub}
                  className="w-full px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-md transition-all duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
                >
                  새 모임 만들기
                </button>
              </div>
            </div>

            {/* 오른쪽: 공개 모임 참여 섹션 */}
            <div className="flex flex-col animate-fadeInRight">
              <h3 className="text-4xl font-bold text-gray-900 mb-6 text-right md:mr-12">모임에 참여하세요</h3>
              <div className="p-8 bg-white rounded-3xl shadow-xl w-full flex-grow flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] transform-gpu">
                <p className="text-lg text-gray-600 mb-6">
                  현재 활발하게 진행 중인 공개 모임들을 둘러보고 참여해보세요.
                </p>
                {isLoadingClubs ? (
                  <div className="w-full h-64 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
                    <p className="text-xl text-gray-600">공개 모임을 불러오는 중...</p>
                  </div>
                ) : publicClubs.length > 0 ? (
                  <div className="relative w-full h-64 rounded-2xl shadow-lg overflow-hidden">
                    {/* 모든 배너를 맵핑하고, translateX로 위치를 조정하여 슬라이드 효과 구현 */}
                    <div
                      className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
                    >
                      {publicClubs.map((club, index) => (
                        <div
                          key={club.clubId}
                          className="flex-shrink-0 w-full h-full relative group"
                          onClick={() => router.push(`/clubs/${club.clubId}`)}
                        >
                          {/* 배경 이미지 또는 그라데이션 */}
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                            style={{
                              backgroundImage: club.imageUrl ? `url(${club.imageUrl})` : getRandomGradient(),
                            }}
                          ></div>
                          {/* 오버레이 및 텍스트 (bg-black/30으로 변경) */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 transition-all duration-300 group-hover:bg-opacity-60">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white text-shadow-lg drop-shadow-md">
                              {club.name}
                            </h2>
                            {/* mainSpot 대신 bio 필드 내용으로 변경 */}
                            <p className="mt-2 text-lg md:text-xl text-white opacity-80">
                              {club.bio}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* 페이징 버튼 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                      {publicClubs.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            goToBanner(index);
                          }}
                          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            currentBannerIndex === index ? 'bg-white' : 'bg-gray-400 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-center text-gray-500">
                    <p>현재 공개 모임이 없습니다.</p>
                  </div>
                )}
                
                <button 
                  onClick={() => router.push('/clubs/public')}
                  className="w-full px-8 py-4 bg-blue-100 text-blue-600 text-xl font-semibold rounded-full shadow-md transition-all duration-300 hover:bg-blue-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400 mt-6"
                >
                  전체 공개 모임 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2024 준비물 닷컴. 모든 권리 보유.</p>
      </footer>
    </div>
  );
}