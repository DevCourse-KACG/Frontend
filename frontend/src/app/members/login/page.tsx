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
      // api.ts에서 정의한 login 함수를 호출
      const data = await login({ email, password });
      
      console.log("로그인 성공:", data);
      setSuccess("로그인에 성공했습니다!");
      
      // 로그인 성공 시 메인 페이지로 이동
      router.push('/'); 
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
            onClick={() => router.push('/signup')}
            className="text-blue-600 hover:underline"
          >
            회원가입하기
          </button>
        </div>
      </div>
    </main>
  );
}
