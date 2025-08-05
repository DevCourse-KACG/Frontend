'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from '@/api/members'; // api.ts에서 함수를 import

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== passwordConfirm) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (!email || !password || !nickname) {
      setError("이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.");
      return;
    }

    setLoading(true);

    try {
      // 서버에서 보낸 응답 데이터를 data 변수에 저장
      const data = await signUp({
        email: email,
        password: password,
        nickname: nickname,
        bio: bio,
      });

      // 로그인 페이지처럼 성공 응답을 콘솔에 출력
      console.log("회원가입 성공:", data);

      setSuccess("회원가입에 성공했습니다!");
      // 회원가입 성공 시 메인 페이지로 이동
      router.push("/");
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
        <h1 className="text-2xl font-bold mb-6">회원가입</h1>

        {error && <p className="mb-4 text-red-600">{error}</p>}
        {success && <p className="mb-4 text-green-600">{success}</p>}

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
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block font-medium mb-1">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="nickname" className="block font-medium mb-1">닉네임</label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              autoComplete="nickname"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block font-medium mb-1">자기소개</label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </form>
      </div>
    </main>
  );
}
