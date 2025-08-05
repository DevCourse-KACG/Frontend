'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getClubInfoByInvitationToken } from '@/api/clubLink';
import { registerGuest } from '@/api/members';

// 클럽 데이터 인터페이스
interface ClubData {
  clubId: number;
  name: string;
}

export default function GuestRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [clubId, setClubId] = useState<number | null>(null);
  const [clubName, setClubName] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('초대 토큰이 유효하지 않습니다.');
      setIsLoading(false);
      return;
    }

    const fetchClubInfo = async () => {
      try {
        const info = await getClubInfoByInvitationToken(token);
        setClubId(info.clubId);
        setClubName(info.name);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('클럽 정보를 가져오는 중 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubInfo();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 유효성 검사
    if (!nickname || !password) {
      setError('닉네임과 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (clubId === null) {
      setError('클럽 정보를 불러오지 못했습니다.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await registerGuest({ nickname, password, clubId });
      
      // 액세스 토큰을 로컬 스토리지에 저장
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        alert('비회원 모임 가입이 완료되었습니다!');
        router.push('/');
      } else {
        throw new Error('액세스 토큰을 받지 못했습니다.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('게스트 등록 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700">클럽 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">비회원 가입</h1>
        <p className="text-lg text-gray-600 mb-6">'{clubName}' 모임에 가입하기</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-left text-gray-700 font-semibold mb-2" htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-left text-gray-700 font-semibold mb-2" htmlFor="password">임시 비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="비밀번호를 입력하세요"
              required
            />
            <p className="text-left text-sm text-gray-500 mt-1">임시 비밀번호는 나중에 변경할 수 있습니다.</p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 text-white font-semibold text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '가입 중...' : '가입하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
