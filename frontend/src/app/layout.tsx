'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type ToastType = 'success' | 'error';

function Header({
  isLoggedIn,
  onLogout,
  onLogin,
  onSignup,
  onMypage,
  onFriends,
}: {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onMypage: () => void;
  onFriends: () => void;
}) {
  const router = useRouter();
  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md w-full p-4 md:p-6 fixed top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <div onClick={handleHomeClick} className="cursor-pointer">
          <h1 className="text-3xl font-extrabold text-blue-600">
            <span className="text-blue-600">준비물</span>
            <span className="text-gray-900">.com</span>
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
          {/* 로그인 상태에 따라 로그인/회원가입 또는 로그아웃 버튼 표시 */}
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              로그아웃
            </button>
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
            </>
          )}

          {/* 내 친구 및 마이페이지 버튼은 항상 표시 */}
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
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4">
      <p>© 2025 준비물 닷컴.</p>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    setIsLoggedIn(!!token);
  }, []);

  const showToast = (message: string, type: ToastType, redirectPath?: string) => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
    if (redirectPath) {
      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    showToast('로그아웃되었습니다.', 'success');
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
      router.push('/members/friend');
    } else {
      showToast('친구 목록은 로그인 후 이용 가능합니다.', 'error', '/members/login');
    }
  };

  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onLogin={() => router.push('/members/login')}
          onSignup={() => router.push('/members/register')}
          onMypage={handleMypage}
          onFriends={handleFriends}
        />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="bottom-center"
          toastOptions={{
            error: {
              style: {
                background: '#EF4444', 
                color: 'white',
              },
            },
          }}
        />
      </body>
    </html>
  );
}