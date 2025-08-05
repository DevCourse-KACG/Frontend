'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from '@/api/members';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const data = await login({ email, password });
      
      console.log("로그인 성공:", data);
      
      // TODO: 여기에 액세스 토큰을 로컬 스토리지에 저장하는 로직 추가
      // API 응답 형식에 따라 수정이 필요할 수 있습니다.
      // 아래 예시는 응답이 { data: { accessToken: '...' } } 형태라고 가정합니다.
      if (data && data.data && data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        setSuccess("로그인에 성공했습니다!");
        // 로그인 성공 시 메인 페이지로 이동
        router.push('/'); 
      } else {
        // 토큰이 없으면 오류 처리
        setError("로그인에 성공했으나, 토큰을 받지 못했습니다.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("서버와 통신 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-md shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>

        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
        {success && <p className="mb-4 text-green-600 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium mb-1">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium mb-1">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600">아직 회원이 아니신가요? </span>
          <button
            onClick={() => router.push('/members/register')}
            className="text-blue-600 hover:underline"
          >
            회원가입하기
          </button>
        </div>
      </div>
    </main>
  );
}