'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getClubInfoByInvitationToken } from '@/api/clubLink'; // 변경된 파일에서 API 함수를 import

// 백엔드 응답에 맞게 ClubData 인터페이스를 수정합니다.
interface ClubData {
  clubId: number;
  name: string;
  category: string;
  imageUrl: string;
  mainSpot: string;
  eventType: string;
  startDate: string;
  endDate: string;
  leaderId: number;
  leaderName: string;
}

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false); // 비회원 상태 추가
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('유효하지 않은 초대 링크입니다.');
      setIsLoading(false);
      return;
    }

    const userAuthToken = localStorage.getItem('accessToken');
    const userIsLoggedIn = !!userAuthToken;
    setIsLoggedIn(userIsLoggedIn);

    const loadData = async () => {
      try {
        const data = await getClubInfoByInvitationToken(token); // 분리된 함수 사용
        setClubData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
        // 로그인 여부에 따라 모달을 바로 띄우는 로직을 제거했습니다.
        // if (!userIsLoggedIn) {
        //   setShowLoginModal(true);
        // }
      }
    };
    
    loadData();
  }, [token, router]);

  const handleJoinClick = () => {
    if (isLoggedIn) {
      // TODO: 모임 가입 API 호출 로직
      alert('모임 가입을 신청합니다.');
    } else if (isGuestUser) {
      // TODO: 닉네임과 임시 비밀번호 입력 페이지로 이동하는 로직
      alert('비회원 가입 신청을 위해 닉네임과 임시 비밀번호를 입력하는 페이지로 이동합니다.');
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
      <h1 className="text-3xl font-bold mb-2">{clubData.name}</h1>
      <p>카테고리: {clubData.category}</p>
      <p>리더: {clubData.leaderName}</p>
      <p>모임 시작일: {clubData.startDate}</p>
      <p>모임 종료일: {clubData.endDate}</p>
      
      <button onClick={handleJoinClick} className="mt-4 px-4 py-2 bg-black text-white rounded">
        가입 신청
      </button>

      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white text-center">
            <h3 className="text-xl font-bold mb-4">로그인이 필요합니다</h3>
            <p className="mb-4">모임 가입 신청을 위해 로그인하시거나 비회원으로 진행해주세요.</p>
            <div className="flex justify-around mt-4">
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                로그인하기
              </button>
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  setIsGuestUser(true);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                비회원으로 진행하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
