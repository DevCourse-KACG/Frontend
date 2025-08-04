'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { components } from "@/types/backend/apiV1/schema";
import LoadingSpinner from '@/components/global/LoadingSpinner';
import { getClubInfo } from '@/api/club';
import ClubInfo from '@/components/domain/clubs/clubInfo';
import ClubInfoSideMenu from '@/components/domain/clubs/clubInfoSideMenu';

type ClubInfoResponse = components['schemas']['ClubInfoResponse'];

export default function ClubPage() {
    const params = useParams();
    const clubId = params.clubId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [clubInfo, setClubInfo] = useState<ClubInfoResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 데이터 가져오기
    useEffect(() => {
        const fetchClubData = async () => {
            setIsLoading(true);
            try {
                const data = await getClubInfo(clubId);

                if (!data || !data.data) {
                    throw new Error('해당 ID의 클럽을 찾을 수 없습니다.');
                }

                setClubInfo(data.data);

                console.log('클럽 정보:', data);
            } catch (err) {
                if (err instanceof Error) {
                    console.error('모임 정보를 가져오는 데 실패했습니다:', err.message);
                    // 이 블록 안에서는 err가 Error 타입으로 추론되어 .message에 안전하게 접근할 수 있습니다.
                    setError(err.message);
                } else {
                    // Error 객체가 아닌 다른 것이 throw된 경우의 처리
                    console.error('알 수 없는 타입의 에러입니다:', err);
                    setError('알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchClubData();
    }, [clubId]);


    // 가드 클로즈 : 로딩 중
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // 가드 클로즈 : 해당 모임이 없는 경우
    if (error === '해당 ID의 클럽을 찾을 수 없습니다.') {
        return <div className="text-center py-12">해당 모임을 찾을 수 없습니다.</div>;
    }

    // 가드 클로즈 : 접근 권한이 없는 경우 (모임원이 아님)
    if (error === '비공개 클럽 정보는 클럽 멤버만 조회할 수 있습니다.') {
        return <div className="text-center py-12">접근 권한이 없습니다.</div>;
    }

    // 가드 클로즈 : 알 수 없는 에러 발생
    if (error) {
        return <div className="text-center py-12">오류가 발생했습니다: {error}</div>;
    }

    // 클럽 정보가 성공적으로 로드된 경우
    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{clubId}번 모임 페이지</h1>
            <section className="flex">
                <aside className="w-1/5 pr-4">
                    <ClubInfoSideMenu />
                </aside>
                <section className="w-4/5">
                    {clubInfo ? <ClubInfo club={clubInfo} /> : <div className="text-center">클럽 정보를 불러오는 중입니다...</div>}
                </section>
            </section>

        </div>
    );
}