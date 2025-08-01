'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { MyPageCard } from "../components/MyPageCard";
import { ShortcutLink } from "../components/ShortcutLink";

const DEFAULT_PROFILE_IMG = "/default-profile.png";

interface MemberInfo {
  email: string;
  profileUrl: string;
  nickname: string;
  bio: string;
}

export default function MyPage() {
  const [user, setUser] = useState<MemberInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    fetch("http://localhost:8080/api/v1/members/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("유저 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setUser(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>로딩 중...</div>;

  return (
    <main className="max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">마이페이지</h1>

      <div className="flex items-center space-x-4 p-4 rounded-xl shadow bg-white">
        <Image
          src={user.profileUrl || DEFAULT_PROFILE_IMG}
          alt="Profile"
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{user.nickname}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">내 정보</h2>
        <MyPageCard label="이메일" value={user.email} />
        <MyPageCard label="프로필 주소" value={user.profileUrl || "없음"} />
        <MyPageCard label="닉네임" value={user.nickname} />
        <MyPageCard label="자기소개" value={user.bio || "없음"} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">바로가기</h2>
        <div className="grid grid-cols-2 gap-3">
          <ShortcutLink label="내 정보 수정" href="/my/edit" />
          <ShortcutLink label="내 친구 목록" href="/friends" />
          <ShortcutLink label="가입한 모임" href="/clubs" />
          <ShortcutLink label="프리셋 목록" href="/presets" />
        </div>
      </section>
    </main>
  );
}
