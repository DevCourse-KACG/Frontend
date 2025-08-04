'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Image 컴포넌트를 사용하여 최적화

// Next.js 라우터는 모의 객체로 대체하여 코드 실행 가능성을 높입니다.
const useRouter = () => ({
  push: (path: string) => console.log(`Navigating to: ${path}`),
  back: () => console.log('Navigating back'),
});

// ======================= API 함수 정의 =======================
// 제공해주신 마이페이지 코드의 API 구조를 기반으로 업데이트했습니다.
const API_BASE_URL = 'http://localhost:8080/api/v1';

// 사용자 정보 응답 데이터 타입
interface MeData {
  nickname: string;
  bio: string | null;
  profileImage: string | null;
  email: string;
}

// API 응답 구조를 맞추기 위한 인터페이스
interface ApiResponse<T> {
  data: T;
}

// 프로필 업데이트 응답 데이터 타입
interface UpdateProfileResponse {
  message: string;
}

/**
 * 현재 로그인한 사용자의 정보를 가져오는 함수입니다.
 * 실제 백엔드 API 호출 코드를 이 함수 내부에 작성해 주세요.
 * @returns {Promise<MeData>} 사용자 정보를 담은 객체를 반환합니다.
 */
const fetchMe = async (): Promise<MeData> => {
  // TODO: 필요한 인증 헤더를 추가하세요.
  const response = await fetch(`${API_BASE_URL}/members/me`, { credentials: 'include' });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('인증되지 않았습니다. 로그인 페이지로 이동합니다.');
    }
    throw new Error('회원 정보를 불러오는데 실패했습니다.');
  }

  const result: ApiResponse<MeData> = await response.json();
  return result.data;
};

/**
 * 사용자 프로필 정보를 업데이트하는 함수입니다.
 * FormData를 사용하여 닉네임, 자기소개, 프로필 이미지를 전송합니다.
 * @param {FormData} formData 닉네임, 자기소개, 이미지 파일을 포함한 FormData 객체
 * @returns {Promise<UpdateProfileResponse>} 업데이트 결과를 담은 객체를 반환합니다.
 */
const updateProfile = async (formData: FormData): Promise<UpdateProfileResponse> => {
  // TODO: 프로필 업데이트를 위한 정확한 API 엔드포인트와 필요한 인증 헤더를 추가하세요.
  // 이 예시는 단순화된 POST 요청입니다.
  const response = await fetch(`${API_BASE_URL}/members/me`, {
    method: 'PATCH', // 또는 PUT
    body: formData,
    credentials: 'include',
    // FormData를 사용할 때는 'Content-Type': 'multipart/form-data' 헤더를 수동으로 설정하지 마세요.
    // 브라우저가 자동으로 올바르게 설정합니다.
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '프로필 업데이트에 실패했습니다.');
  }

  const result: UpdateProfileResponse = await response.json();
  return result;
};


// ======================= 상수 및 컴포넌트 =======================
const DEFAULT_PROFILE_IMG = 'https://placehold.co/150x150/e5e7eb/6b7280?text=Profile';

export default function EditProfilePage() {
  const router = useRouter();
  
  // 사용자 정보 상태 관리
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    bio: '',
    profileImage: '',
    email: '',
  });
  
  // 비밀번호 변경 폼 상태
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  // 프로필 이미지 파일 상태
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // UI/API 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // 사용자 정보를 불러오는 함수를 useCallback으로 메모이제이션
  const getUserInfo = useCallback(async () => {
    try {
      console.log('API 호출 시작: 내 정보 불러오기...');
      const meData = await fetchMe();
      console.log('API 호출 성공: 내 정보 응답', meData);

      setUserInfo({
        nickname: meData.nickname,
        bio: meData.bio || '',
        profileImage: meData.profileImage || '',
        email: meData.email,
      });
      setLoading(false);
    } catch (err: unknown) {
      console.error('API 호출 실패: 내 정보 불러오기', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("사용자 정보를 불러오는 중 오류가 발생했습니다.");
      }
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 사용자 정보를 불러옵니다.
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  // 파일 입력 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  // 폼 제출 핸들러
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setApiLoading(true);

    if (newPassword && newPassword !== newPasswordConfirm) {
      setError("새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setApiLoading(false);
      return;
    }
    
    // FormData를 사용하여 텍스트 데이터와 파일을 함께 전송
    const formData = new FormData();
    
    // 프로필 데이터를 JSON 객체로 준비
    const profileData = {
      nickname: userInfo.nickname,
      bio: userInfo.bio,
      ...(newPassword && { password: newPassword }),
    };
    
    console.log('API 호출 시작: 회원 정보 수정...');
    console.log('전송될 데이터:', profileData);
    
    formData.append('data', JSON.stringify(profileData));

    if (profileImageFile) {
      formData.append('profileImage', profileImageFile);
      console.log('전송될 이미지 파일:', profileImageFile.name);
    }

    try {
      // 실제 API 호출
      await updateProfile(formData);
      setSuccess("회원 정보가 성공적으로 수정되었습니다.");
      console.log('API 호출 성공: 회원 정보 수정');
      
      // 수정 후 최신 정보로 UI를 업데이트하기 위해 다시 API를 호출합니다.
      await getUserInfo();
      
      // 비밀번호 입력 필드 초기화
      setNewPassword('');
      setNewPasswordConfirm('');

    } catch (err: unknown) {
      console.error('API 호출 실패: 회원 정보 수정', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("서버와 통신 중 오류가 발생했습니다.");
      }
    } finally {
      setApiLoading(false);
    }
  }

  // 로딩 중 화면
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-gray-200"></div>
        <p className="ml-4 text-gray-600">사용자 정보를 불러오는 중...</p>
      </div>
    );
  }
  
  // 에러 발생 시 화면
  if (error && !apiLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-red-500">
        <p className="text-xl">오류가 발생했습니다: {error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  // 메인 컴포넌트
  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-md shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">회원 정보 수정</h1>

        {success && <p className="mb-4 text-green-600 text-center">{success}</p>}
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center">
            <img 
              src={profileImageFile ? URL.createObjectURL(profileImageFile) : userInfo.profileImage || DEFAULT_PROFILE_IMG}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <label htmlFor="profileImage" className="cursor-pointer text-blue-600 hover:underline">
              프로필 이미지 변경
            </label>
            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className="block font-medium mb-1">닉네임</label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={userInfo.nickname}
              onChange={e => setUserInfo({...userInfo, nickname: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label htmlFor="bio" className="block font-medium mb-1">자기소개</label>
            <textarea
              id="bio"
              name="bio"
              value={userInfo.bio}
              onChange={e => setUserInfo({...userInfo, bio: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label htmlFor="newPassword" className="block font-medium mb-1">새 비밀번호 (변경 시에만 입력)</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              autoComplete="new-password"
            />
          </div>
          
          {/* 새 비밀번호 확인 */}
          <div>
            <label htmlFor="newPasswordConfirm" className="block font-medium mb-1">새 비밀번호 확인</label>
            <input
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              type="password"
              value={newPasswordConfirm}
              onChange={e => setNewPasswordConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={apiLoading}
            className={`w-full py-2 rounded text-white transition ${apiLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {apiLoading ? '수정 중...' : '변경 내용 저장'}
          </button>
        </form>
      </div>
    </main>
  );
}
