const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// API 호출 시 공통으로 사용할 fetcher 함수
async function fetcher(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: 'include', // 쿠키를 포함하여 요청
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
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
