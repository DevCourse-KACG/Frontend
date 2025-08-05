// api/members.ts

// 백엔드 응답에 맞게 인터페이스를 정의합니다.
interface LoginResponse {
  accessToken: string;
  // 백엔드 응답에 따라 다른 필드가 있을 수 있습니다.
}

interface ApiResponse<T> {
  data: T;
  // 다른 필드들이 있을 수 있습니다.
}

// 게스트 등록 요청 DTO 인터페이스
interface GuestDto {
  nickname: string;
  password: string;
  clubId: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// API 호출 시 공통으로 사용할 fetcher 함수
export async function fetcher(url: string, options: RequestInit = {}) {
  // localStorage에서 토큰을 가져옵니다.
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // Headers 객체를 사용하여 헤더를 안전하게 관리합니다.
  const headers = new Headers(options.headers);

  // 'Content-Type'이 없는 경우에만 추가합니다.
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 토큰이 있는 경우 'Authorization' 헤더를 추가합니다.
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include', // 쿠키를 포함하여 요청
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

/**
 * 게스트 계정을 등록하는 API 함수
 * @param dto GuestDto 객체 (닉네임, 비밀번호, 클럽 ID 포함)
 * @returns 액세스 토큰이 포함된 응답 데이터
 */
export async function registerGuest(dto: GuestDto): Promise<ApiResponse<LoginResponse>> {
  // 백엔드 명세에 따라 DTO를 포함하여 POST 요청을 보냅니다.
  return fetcher('/api/v1/members/auth/guest-register', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

// 내 정보 불러오기
export async function fetchMe() {
  const response = await fetcher('/api/v1/members/me');
  return response.data; // 응답 구조에 맞게 data 필드 반환
}

// 내가 가입한 모임 불러오기
export async function fetchMyClubs() {
  const response = await fetcher('/api/v1/my-clubs');
  return response.data.clubs; // 응답 구조에 맞게 data.clubs 필드 반환
}

// 내 친구 목록 불러오기
export async function fetchMyFriends() {
  const response = await fetcher('/api/v1/members/me/friends');
  return response.data; // 응답 구조에 맞게 data 필드 반환
}

// 내가 만든 프리셋 목록 불러오기
export async function fetchMyPresets() {
  const response = await fetcher('/api/v1/presets');
  return response.data; // 응답 구조에 맞게 data 필드 반환
}

export async function verifyPassword({ email, password }: { email: string; password: string }) {
  const payload = { email, password };
  return fetcher('/api/v1/members/auth/verify-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
