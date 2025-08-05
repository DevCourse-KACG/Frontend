'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 공개 모임 목록을 불러오는 API 함수를 임포트합니다.
import { getPublicClubs } from '@/api/club';
// 백엔드 스키마에서 정의된 클럽 정보 타입을 임포트합니다.
import { components } from "@/types/backend/apiV1/schema";

type SimpleClubInfoWithoutLeader = components['schemas']['SimpleClubInfoWithoutLeader'];

export default function MainPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicClubs, setPublicClubs] = useState<SimpleClubInfoWithoutLeader[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoadingClubs, setIsLoadingClubs] = useState(true);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 accessToken을 확인합니다.
    const token = localStorage.getItem('accessToken');
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
    // 로그아웃 시 로컬 스토리지에서 토큰을 제거하고 로그인 상태를 업데이트합니다.
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
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

  const currentBanner = publicClubs[currentBannerIndex];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 헤더 섹션 */}
      <header className="bg-white shadow-md w-full p-4 md:p-6 sticky top-0 z-50">
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

      {/* 스크롤 스냅 컨테이너 */}
      {/* main 태그에 스크롤 스냅 속성을 다시 적용하여 스크롤 가능한 영역을 명확히 했습니다. */}
      <main className="flex-grow overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        {/* 첫 번째 섹션: 환영 메시지 */}
        {/* `h-screen` 대신 `min-h-[calc(100vh-theme(spacing.24))]`와 같이 헤더 높이를 제외한 계산값을 사용합니다.
        헤더의 높이가 `6rem` 또는 `24`이기 때문에 `96`을 사용했습니다.
        p-4 또는 p-6가 4 * 4=16 or 6*4=24이므로
        tailwind.config.ts에 padding 값을 직접 지정해야 합니다.*/}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] snap-start text-center p-4">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            준비물 닷컴에 오신 것을 환영합니다!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            모임을 만들고, 필요한 준비물을 공유하고, 사람들을 초대해 보세요.
          </p>
          <a href="#public-clubs" className="mt-8 animate-bounce">
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
          </a>
        </div>

        {/* 두 번째 섹션: 공개 모임 배너 */}
        {/* `h-screen` 대신 `min-h-[calc(100vh-6rem)]`와 같이 헤더 높이를 제외한 계산값을 사용합니다. */}
        <div id="public-clubs" className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] snap-start p-4">
          <div className="container mx-auto">
            {/* 공개 모임에 대한 설명 추가 */}
            <div className="text-center mb-8">
              <h3 className="text-4xl font-extrabold text-gray-900">공개 모임</h3>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                현재 활발하게 진행 중인 공개 모임들을 둘러보고 참여해보세요.
              </p>
            </div>
            {isLoadingClubs ? (
              <div className="w-full max-w-4xl h-64 bg-gray-200 rounded-xl animate-pulse flex items-center justify-center mx-auto">
                <p className="text-xl text-gray-600">공개 모임 배너를 불러오는 중...</p>
              </div>
            ) : (
              publicClubs.length > 0 && (
                <div className="relative">
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
                  {/* 작은 원형 페이징 버튼 추가 */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
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
      </main>

      {/* 푸터 섹션 */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2024 준비물 닷컴. 모든 권리 보유.</p>
      </footer>
    </div>
  );
}
