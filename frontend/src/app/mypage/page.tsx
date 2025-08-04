"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:8080/api/v1';

interface UserData {
  nickname: string;
  email: string;
  bio: string;
}

interface Club {
  id: number;
  name: string;
}

interface Friend {
  id: number;
  nickname: string;
}

interface Preset {
  id: number;
  name: string;
}

function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [clubs, setClubs] = useState<Club[] | null>(null);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [presets, setPresets] = useState<Preset[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meResponse, clubsResponse, friendsResponse, presetsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/members/me`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/my-clubs`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/members/me/friends`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/presets`, { credentials: 'include' })
        ]);

        if (!meResponse.ok) {
          if (meResponse.status === 401) {
            console.error('인증되지 않았습니다. 로그인 페이지로 이동합니다.');
            router.push('/login');
            return;
          }
          throw new Error('회원 정보를 불러오는데 실패했습니다.');
        }

        const meData = await meResponse.json();
        setUserData(meData.data);

        if (clubsResponse.ok) {
          const clubsData = await clubsResponse.json();
          setClubs(clubsData.data);
        }

        if (friendsResponse.ok) {
          const friendsData = await friendsResponse.json();
          setFriends(friendsData.data);
        }

        if (presetsResponse.ok) {
          const presetsData = await presetsResponse.json();
          setPresets(presetsData.data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error('Fetch error:', err.message);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
          console.error('Fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">회원 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p className="text-xl">에러 발생: {error}</p>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          로그인 페이지로
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-xl rounded-2xl mt-10">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        마이페이지
      </h1>

      {userData && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              안녕하세요, {userData.nickname}님!
            </p>
            <p className="text-lg text-gray-600 mt-2">
              {userData.email}
            </p>
          </div>

          <div className="relative flex items-start space-x-6 p-6 border-t border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex-shrink-0">
              {/* 여기에 실제 프로필 이미지를 넣을 수 있습니다. */}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{userData.nickname}</h2>
              <p className="text-gray-600 mt-2">{userData.bio}</p>
            </div>
            
            {/* 수정 버튼을 자기소개 박스 오른쪽 하단에 배치 */}
            <button
              onClick={() => router.push('/edit-profile')}
              className="absolute bottom-6 right-6 text-sm px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              수정
            </button>
          </div>

          <div
            onClick={() => router.push('/friends-manage')}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-2">친구 목록</h3>
            {friends && friends.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {friends.map(friend => (
                  <li key={friend.id}>{friend.nickname}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">현재 친구가 없습니다.</p>
            )}
          </div>

          <div
            onClick={() => router.push('/clubs-manage')}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-2">가입한 모임 목록</h3>
            {clubs && clubs.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {clubs.map(club => (
                  <li key={club.id}>{club.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">현재 가입한 모임이 없습니다.</p>
            )}
          </div>

          <div
            onClick={() => router.push('/presets-manage')}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-2">내가 만든 프리셋 목록</h3>
            {presets && presets.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {presets.map(preset => (
                  <li key={preset.id}>{preset.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">현재 만든 프리셋이 없습니다.</p>
            )}
          </div>
        </div>
      )}

      {!userData && (
        <div className="text-center text-red-500">
          <p>회원 정보를 불러올 수 없습니다. 다시 로그인해 주세요.</p>
        </div>
      )}
    </div>
  );
}

export default MyPage;
