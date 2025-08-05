'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { components } from '@/types/backend/apiV1/schema';
import MemberTabs from './MemberTabs';
import MemberList from './MemberList';
import { approveApplication, rejectApplication, changeMemberRole } from '@/api/clubMember';

type MemberInfo = components['schemas']['ClubMemberInfo'];

interface MemberManagementProps {
    clubId: string;
    initialMembers: MemberInfo[];
}

export default function MemberManagement({ clubId, initialMembers }: MemberManagementProps) {
    const router = useRouter();

    const [members, setMembers] = useState(initialMembers);
    const searchParams = useSearchParams();
    const currentState = searchParams.get('state') || 'JOINING';

    // 탭이 변경될 때마다 서버 데이터를 다시 불러오고 싶다면 useEffect 사용
    useEffect(() => {
        setMembers(initialMembers);
    }, [initialMembers]);


    const filteredMembers = useMemo(() => {
        return members.filter(member => member.state === currentState);
    }, [members, currentState]);

    const handleAction = async (action: () => Promise<void>) => {
        try {
            await action();
            // 성공 시, 실제로는 전체 목록을 다시 fetch 하는 것이 가장 정확합니다.
            // 여기서는 예시로 로컬 상태를 직접 조작합니다.
            alert('작업이 완료되었습니다.');
            router.refresh();
        } catch (err) {
            alert(err instanceof Error ? err.message : '작업에 실패했습니다.');
        }
    };

    const handleApprove = (memberId: number) => handleAction(() => approveApplication(clubId, memberId));
    const handleReject = (memberId: number) => handleAction(() => rejectApplication(clubId, memberId));
    const handleChangeRole = (memberId: number, role: 'MANAGER' | 'PARTICIPANT') => handleAction(() => changeMemberRole(clubId, memberId, role));

    return (
        <>
            <MemberTabs clubId={clubId} />
            <MemberList
                members={filteredMembers}
                onApprove={handleApprove}
                onReject={handleReject}
                onChangeRole={handleChangeRole}
            />
        </>
    );
}