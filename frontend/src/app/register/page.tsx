'use client';

import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== passwordConfirm) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!email || !password || !nickname) {
      setError("이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.");
      return;
    }

    // TODO: 백엔드 API 호출로 회원가입 처리
    // 예: fetch("/api/signup", { method: "POST", body: JSON.stringify({...}) })

    setSuccess("회원가입 요청이 성공적으로 전송되었습니다.");
  }

  return (
    <main className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium mb-1">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-1">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="block font-medium mb-1">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block font-medium mb-1">닉네임</label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block font-medium mb-1">자기소개</label>
          <textarea
            id="bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          가입하기
        </button>
      </form>
    </main>
  );
}
