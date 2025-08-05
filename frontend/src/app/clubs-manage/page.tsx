'use client';


import { useState, useEffect } from 'react';
import { components } from '@/types/backend/apiV1/schema'
import LoadingSpinner from '@/components/global/LoadingSpinner'
import { getMyClubs } from '@/api/myClub';
import ClubsManagement from '@/components/domain/clubManage/ClubsManagement';

type MyClubList = components['schemas']['MyClubList'];
type ClubListItem = components['schemas']['ClubListItem'];

export default function MyClubsPage() {
    const [initialClubs, setInitialClubs] = useState<ClubListItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 순차 호출 (병렬도 가능)
                const initialClubs = await getMyClubs();

                if (!initialClubs) {
                    throw new Error('모임 목록을 불러오는 데 실패했습니다.');
                }
                setInitialClubs(initialClubs);
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // 가드 클로즈 : 로딩 중
    if (isLoading) return <LoadingSpinner />;

    // 가드 클로즈 : 에러 발생
    const errorMessage = error;
    if (errorMessage) {
        return <div className="text-center py-12">{errorMessage}</div>;
    }


    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">멤버 관리</h1>
            <section className="flex" style={{ height: 'calc(90vh - 64px)' }}>
                <section className="w-4/5">
                    {/* 클라이언트 컴포넌트에 초기 데이터를 props로 전달 */}
                    <ClubsManagement initialClubs={initialClubs} />
                </section>
            </section>
        </div>
    );
}