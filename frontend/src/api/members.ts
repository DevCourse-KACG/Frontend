// api/members.ts 파일

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

// 백엔드 응답에 맞게 인터페이스를 정의합니다.
interface LoginResponse {
  accessToken: string;
}

interface ApiResponse<T> {
  data: T;
}

interface UserData {
  nickname: string;
  email: string;
  bio: string;
  profileImage: string | null;
}

interface Club {
  clubId: number;
  clubName: string;
  myRole: 'HOST' | 'MANAGER' | 'PARTICIPANT';
  myState: 'JOINING' | 'APPLIED';
}

interface Friend {
  id: number;
  nickname: string;
}

interface Preset {
  id: number;
  name: string;
}

interface PasswordVerifyResponse {
  verified: boolean;
}

interface GuestDto {
  nickname: string;
  password: string;
  clubId: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// API 호출 시 공통으로 사용할 fetcher 함수
export async function fetcher(url: string, options: RequestInit = {}) {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `API 호출 실패: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// 회원가입 API
export async function signUp({ email, password, nickname, bio }: { email: string; password: string; nickname: string; bio: string }) {
  const payload = { email, password, nickname, bio };
  return fetcher('/api/v1/members/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 로그인 API
export async function login({ email, password }: { email: string; password: string }) {
  const payload = { email, password };
  return fetcher('/api/v1/members/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 게스트 계정 등록 API
export async function registerGuest(dto: GuestDto): Promise<ApiResponse<LoginResponse>> {
  return fetcher('/api/v1/members/auth/guest-register', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

// 내 정보 불러오기
export async function fetchMe(): Promise<UserData> {
  const response = await fetcher('/api/v1/members/me');
  return response.data;
}

// 내가 가입한 모임 불러오기
export async function fetchMyClubs(): Promise<Club[]> {
  const response = await fetcher('/api/v1/my-clubs');
  return response.data.clubs;
}

// 내 친구 목록 불러오기
export async function fetchMyFriends(): Promise<Friend[]> {
  const response = await fetcher('/api/v1/members/me/friends');
  return response.data;
}

// 내가 만든 프리셋 목록 불러오기
export async function fetchMyPresets(): Promise<Preset[]> {
  const response = await fetcher('/api/v1/presets');
  return response.data;
}

// 비밀번호 확인 API
export async function verifyPassword({ email, password }: { email: string; password: string }): Promise<PasswordVerifyResponse> {
  const payload = { email, password };
  const response = await fetcher('/api/v1/members/auth/verify-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}