'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// ToastType 정의 (MainPage.tsx와 동일하게 유지)
type ToastType = 'success' | 'error';

// Header 컴포넌트의 props 타입을 정의합니다.
interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onMypage: () => void;
  onFriends: () => void;
  showToast: (message: string, type: ToastType, redirectPath?: string) => void; // Toast 함수를 props로 받음
}

export default function Header({
  isLoggedIn,
  onLogout,
  onLogin,
  onSignup,
  onMypage,
  onFriends,
  showToast, // showToast 함수를 props로 받음
}: HeaderProps) {
  const router = useRouter();

  // '준비물.com' 클릭 시 메인 페이지로 이동
  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md w-full p-4 md:p-6 fixed top-0 z-40"> {/* z-index를 40으로 조정 */}
      <div className="container mx-auto flex items-center justify-between">
        <div onClick={handleHomeClick} className="cursor-pointer">
          <h1 className="text-3xl font-extrabold text-blue-600">
            <span className="text-blue-600">준비물</span>
            <span className="text-gray-900">.com</span>
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                로그아웃
              </button>
              <button
                onClick={onFriends}
                className="px-4 py-2 text-gray-800 bg-gray-200 font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                내 친구
              </button>
              <button
                onClick={onMypage}
                className="px-4 py-2 text-gray-800 bg-gray-200 font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                마이페이지
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSignup}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                회원가입
              </button>
              <button
                onClick={onLogin}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                로그인
              </button>
              <button
                onClick={onFriends}
                className="px-4 py-2 text-gray-800 bg-gray-200 font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                내 친구
              </button>
              <button
                onClick={onMypage}
                className="px-4 py-2 text-gray-800 bg-gray-200 font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                마이페이지
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}