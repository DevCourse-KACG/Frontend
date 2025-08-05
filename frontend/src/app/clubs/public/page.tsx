'use client';

import React from 'react';
import { components } from "@/types/backend/apiV1/schema";
import ClubCard from '@/components/domain/clubs/clubCard';
import { getPublicClubs } from '@/api/club';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/global/LoadingSpinner';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ClubCategory, ClubCategoryKorean } from '@/types/ClubCategory';
import { EventType, EventTypeKorean } from '@/types/EventType';
import ClubSearchBar from '@/components/domain/clubs/clubSearchBar';
import PagingUnit from '@/components/global/PagingUnit';


type SimpleClubInfoWithoutLeader = components['schemas']['SimpleClubInfoWithoutLeader'];

export default function ClubListPage() {
    const [clubs, setClubs] = useState<SimpleClubInfoWithoutLeader[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const searchParams = useSearchParams();
    const router = useRouter();


    // 로컬 입력값 상태
    const [filters, setFilters] = useState<{
        name: string;
        mainSpot: string;
        clubCategory: ClubCategory | '';
        eventType: EventType | '';
    }>({
        name: searchParams.get('name') || '',
        mainSpot: searchParams.get('mainSpot') || '',
        clubCategory: (searchParams.get('clubCategory') as ClubCategory) || '',
        eventType: (searchParams.get('eventType') as EventType) || '',
    });

    // 검색어가 있는 경우, 해당 검색어로 필터링
    useEffect(() => {
        const fetchClubs = async () => {
            setLoading(true);

            const name = searchParams.get('name');
            const mainSpot = searchParams.get('mainSpot');
            const category = searchParams.get('clubCategory');
            const eventType = searchParams.get('eventType');

            const data = await getPublicClubs(
                page, // page
                10, // size
                'id,desc', // sort
                name,
                category,
                mainSpot,
                eventType
            );


            setClubs(Array.isArray(data.data?.content) ? data.data.content : []);
            setTotalPages(data.data?.totalPages || 1);
            setLoading(false);
        };

        fetchClubs();
    }, [
        page,
        searchParams.get('name'),
        searchParams.get('mainSpot'),
        searchParams.get('clubCategory'),
        searchParams.get('eventType')
    ]);


    const handleSubmit = () => {
        const params = new URLSearchParams();
        if (filters.name) params.set('name', filters.name);
        if (filters.mainSpot) params.set('mainSpot', filters.mainSpot);
        if (filters.clubCategory) params.set('clubCategory', filters.clubCategory);
        if (filters.eventType) params.set('eventType', filters.eventType);

        router.push(`/clubs/public?${params.toString()}`);
        setPage(0); // 페이지 초기화
    };


    // 가드 클로즈 : 로딩 중
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16, position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10 }}>
                <ClubSearchBar
                    value={filters}
                    onChange={(newFilters) => setFilters(newFilters)}
                    onSubmit={handleSubmit}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {clubs.length > 0 ? (
                    clubs.map((club) => (
                        <ClubCard key={club.clubId} club={club} />
                    ))
                ) : (
                    <p>등록된 모임이 없습니다.</p>
                )}
            </div>
            {/* ✅ 페이지네이션 */}
            <PagingUnit
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                className="mt-8"
            />
        </div>

    );
}