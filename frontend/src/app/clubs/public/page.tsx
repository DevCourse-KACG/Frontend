'use client';

import React from 'react';
import { components } from "@/types/backend/apiV1/schema";
import ClubCard from '@/components/domain/clubs/clubCard';
import { COLORS } from '@/constants/colors';
import { getPublicClubs } from '@/api/club';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/global/LoadingSpinner';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';


type SimpleClubInfoWithoutLeader = components['schemas']['SimpleClubInfoWithoutLeader'];

export default function ClubListPage() {
    const [clubs, setClubs] = useState<SimpleClubInfoWithoutLeader[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    // 검색어가 있는 경우, 해당 검색어로 필터링
    useEffect(() => {
        const fetchClubs = async () => {
            setLoading(true);
            const data = await getPublicClubs();
            if (data.data?.content instanceof Array && data.data.content.length !== 0) {
                setClubs(data.data.content);
            }
            else {
                setClubs([]);
            }
            setLoading(false);
        };

        fetchClubs();
    }, [searchParams]);

    // 가드 클로즈 : 로딩 중
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1>모임 목록</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {clubs.length > 0 ? (
                    clubs.map((club) => (
                        <ClubCard key={club.clubId} club={club} />
                    ))
                ) : (
                    <p>등록된 모임이 없습니다.</p>
                )}
            </div>
        </div>
    );
}