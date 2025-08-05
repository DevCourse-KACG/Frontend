'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 공개 모임 목록을 불러오는 API 함수를 임포트합니다.
import { getPublicClubs } from '@/api/club';
// 백엔드 스키마에서 정의된 클럽 정보 타입을 임포트합니다.
import { components } from "@/types/backend/apiV1/schema";

type SimpleClubInfoWithoutLeader = components['schemas']['SimpleClubInfoWithoutLeader'];

// 토스트 메시지 컴포넌트입니다.
// 이 컴포넌트는 상태에 따라 화면에 나타났다 사라집니다.
const Toast = ({ show, message, type = 'success' }: { show: boolean; message: string; type?: 'success' | 'error' }) => {
  // 토스트 메시지 타입에 따라 색상을 다르게 설정합니다.
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 p-4 rounded-xl text-white shadow-xl transition-all duration-300 transform
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
  
  // 토스트 메시지 상태를 관리하는 새로운 상태입니다.
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 토스트 메시지를 표시하고 일정 시간 후 숨기는 함수
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    // 3초 후에 토스트를 자동으로 숨깁니다.
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 accessToken을 확인합니다.
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    setIsLoggedIn(!!token);

    // 공개 모임 목록을 불러오는 함수
    const fetchPublicClubs = async () => {
      try {
        const response = await getPublicClubs();
        if (response.data && response.data.content) {
          setPublicClubs(response.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch public clubs:', error);
        // 에러 발생 시 토스트 메시지를 표시합니다.
        showToast('공개 모임 목록을 불러오는 데 실패했습니다.', 'error');
      } finally {
        setIsLoadingClubs(false);
      }
    };

    fetchPublicClubs();
  }, []);

  // 3초마다 배너를 자동으로 전환하는 useEffect 훅
  useEffect(() => {
    if (publicClubs.length > 0) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) =>
          (prevIndex + 1) % publicClubs.length
        );
      }, 3000); // 3초마다 전환

      return () => clearInterval(interval);
    }
  }, [publicClubs]);
  
  // 배너를 수동으로 전환하는 함수
  const goToBanner = (index: number) => {
    setCurrentBannerIndex(index);
  };

  const handleLogout = () => {
    // 로그아웃 시 로컬 스토리지에서 토큰을 제거합니다.
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    setIsLoggedIn(false);
    // 로그아웃 후 토스트 메시지를 표시합니다.
    showToast('로그아웃되었습니다.', 'success');
  };

  const handleLogin = () => {
    router.push('/members/login');
  };

  const handleSignup = () => {
    router.push('/members/signup');
  };

  const handleMypage = () => {
    // 로그인 상태에 따라 다른 페이지로 이동합니다.
    if (isLoggedIn) {
      router.push('/members/mypage');
    } else {
      router.push('/members/login');
    }
  };

  // 스크롤 다운 화살표 클릭 시 '공개 모임' 섹션으로 부드럽게 스크롤하는 함수
  const scrollToPublicClubs = () => {
    const publicClubsSection = document.getElementById('public-clubs');
    if (publicClubsSection) {
      // URL 변경 없이 부드러운 스크롤만 실행
      publicClubsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentBanner = publicClubs[currentBannerIndex] || null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 토스트 컴포넌트를 최상단에 렌더링합니다. */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      
      {/* 전체 페이지를 스크롤 스냅 컨테이너로 만듭니다. */}
      <main className="flex-grow overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        {/* 헤더 섹션: 이제 스크롤 스냅의 일부가 됩니다. */}
        <header className="bg-white shadow-md w-full p-4 md:p-6 snap-start">
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

        {/* 첫 번째 스냅 섹션: 환영 메시지 */}
        <div className="flex flex-col items-center justify-center h-screen snap-start text-center p-4">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            준비물 닷컴에 오신 것을 환영합니다!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            모임을 만들고, 필요한 준비물을 공유하고, 사람들을 초대해 보세요.
          </p>
          {/* 스크롤 다운 화살표는 이제 onClick 이벤트로 작동합니다. */}
          <div
            onClick={scrollToPublicClubs}
            className="mt-8 animate-bounce cursor-pointer"
          >
            <svg
              className="w-10 h-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
        </div>

        {/* 두 번째 스냅 섹션: 공개 모임 배너 */}
        <div id="public-clubs" className="flex flex-col items-center justify-center h-screen snap-start p-4">
          <div className="container mx-auto">
            {/* '공개 모임' 제목과 설명을 중앙 정렬하는 컨테이너 */}
            <div className="flex flex-col items-center justify-center mb-2">
              <h3 className="text-4xl font-extrabold text-gray-900">공개 모임</h3>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl">
                현재 활발하게 진행 중인 공개 모임들을 둘러보고 참여해보세요.
              </p>
            </div>
            {/* '전체보기' 링크를 배너 바로 위에, 그리고 우측에 배치합니다. */}
            <div className="w-full max-w-4xl flex justify-end mb-4 mx-auto">
              <div
                onClick={() => router.push('/clubs/public')}
                className="whitespace-nowrap text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                전체보기
              </div>
            </div>

            {isLoadingClubs ? (
              <div className="w-full max-w-4xl h-64 bg-gray-200 rounded-xl animate-pulse flex items-center justify-center mx-auto">
                <p className="text-xl text-gray-600">공개 모임 배너를 불러오는 중...</p>
              </div>
            ) : (
              publicClubs.length > 0 && (
                <div>
                  <div
                    className="w-full max-w-4xl h-64 rounded-xl shadow-xl overflow-hidden relative cursor-pointer group mx-auto"
                    style={{
                      backgroundImage: `url(${currentBanner?.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'background-image 0.5s ease-in-out',
                      backgroundColor: currentBanner?.imageUrl ? 'transparent' : '#3B82F6',
                    }}
                  >
                    {!currentBanner?.imageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 transition-all duration-300 group-hover:bg-opacity-60">
                      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-shadow-lg drop-shadow-md">
                        {currentBanner?.name}
                      </h2>
                      <p className="mt-2 text-lg md:text-xl text-white opacity-80">
                        {currentBanner?.mainSpot}
                      </p>
                    </div>
                  </div>
                  {/* 작은 원형 페이징 버튼을 배너 아래에 위치하도록 수정했습니다. */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {publicClubs.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToBanner(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          currentBannerIndex === index ? 'bg-blue-600' : 'bg-gray-400 hover:bg-blue-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        
        {/* 푸터 섹션: 마지막 스냅 섹션으로 추가 */}
        <footer id="footer" className="bg-gray-800 text-white text-center p-4 snap-start h-24 flex items-center justify-center">
          <p>© 2024 준비물 닷컴. 모든 권리 보유.</p>
        </footer>
      </main>
    </div>
  );
}
