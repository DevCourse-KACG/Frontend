'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 🔔 쿼리 파라미터 기반 알림
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('로그인이 필요합니다.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const data = await login({ email, password });
      localStorage.setItem('accessToken', data.accessToken);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">로그인</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          로그인
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm">계정이 없으신가요?</p>
        <button onClick={goToRegister} className="mt-2 underline text-blue-600 hover:text-blue-800 text-sm">
          회원가입 하러 가기
        </button>
      </div>
    </div>
  );
}
