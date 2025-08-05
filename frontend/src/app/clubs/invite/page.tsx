'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

// 클럽 데이터의 타입을 명시적으로 정의합니다.
interface ClubData {
  clubName: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  // TODO: 백엔드 API 응답에 맞게 필드를 추가하세요.
}

// inviteToken 매개변수에 string 타입을 명시했습니다.
async function fetchClubInfo(inviteToken: string): Promise<ClubData> {
  try {
    const response = await fetch(`/api/clubs/invite-info?token=${inviteToken}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '클럽 정보를 불러오는 데 실패했습니다.' }));
      throw new Error(errorData.message);
    }
    const data: ClubData = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
}

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      alert('유효하지 않은 초대 링크입니다.');
      router.push('/');
      return;
    }

    const loadData = async () => {
      try {
        const data = await fetchClubInfo(token);
        setClubData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();

    // TODO: 로그인 상태를 확인하는 실제 로직을 구현하세요.
    const userAuthToken = localStorage.getItem('authToken');
    if (userAuthToken) {
      setIsLoggedIn(true);
    }
  }, [token, router]);

  const handleJoinClick = () => {
    if (isLoggedIn) {
      // TODO: 모임 가입 API 호출 로직
      alert('모임 가입을 신청합니다.');
    } else {
      setShowLoginModal(true);
    }
  };

  if (isLoading) {
    return <p>모임 정보를 불러오는 중...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-gray-200 rounded">홈으로</button>
      </div>
    );
  }

  if (!clubData) {
    return <p>모임 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="p-6">
      <h1>{clubData.clubName}</h1>
      <p>모임 설명: {clubData.description}</p>

      <button onClick={handleJoinClick} className="mt-4 px-4 py-2 bg-black text-white rounded">
        가입 신청
      </button>

      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white text-center">
            <h3 className="text-xl font-bold mb-4">로그인이 필요합니다</h3>
            <p className="mb-4">모임 가입 신청을 위해 로그인 해주세요.</p>
            <div className="flex justify-around">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                닫기
              </button>
              <button 
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                로그인 하러 가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}