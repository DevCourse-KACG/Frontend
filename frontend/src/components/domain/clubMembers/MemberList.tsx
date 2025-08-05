'use client';

import MemberListItem from './MemberListItem';
import { components } from '@/types/backend/apiV1/schema';
import MultiEmailInput from './MultiEmailInput';
import { inviteMembers } from '@/api/clubMember';
import { useParams } from 'next/navigation';

type MemberInfo = components['schemas']['ClubMemberInfo'];

// MemberListItem에서 필요한 함수들을 props로 내려받습니다.
interface MemberListProps {
    members: MemberInfo[];
    state?: 'JOINING' | 'APPLYING' | 'INVITED';
    onApprove: (memberId: number) => void;
    onReject: (memberId: number) => void;
    onChangeRole: (memberId: number, role: 'MANAGER' | 'PARTICIPANT') => void;
    onDelete: (memberId: number) => void;
}

export default function MemberList({ members, state, ...handlers }: MemberListProps) {
    const params = useParams();
    const clubId = params.clubId as string;

    const handleInviteMembers = (emails: string[]) => {
        console.log("초대할 최종 이메일 목록:", emails);
        // 여기에 실제 API 호출 로직을 구현합니다.
        inviteMembers(clubId, emails)
            .then(() => {
                alert('초대 이메일이 성공적으로 발송되었습니다.');
            })
            .catch((error) => {
                console.error('초대 이메일 발송 실패:', error);
                alert('초대 이메일 발송에 실패했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <div>
            {state === 'INVITED' && (
                <div className="mb-4">
                    <MultiEmailInput
                        onSubmit={handleInviteMembers}
                        label="모임에 초대할 멤버의 이메일 주소를 입력하세요"
                        placeholder="예: user@example.com"
                    />
                </div>
            )}
            {members.length === 0 ? (
                <p className="text-center text-gray-500 py-10">해당하는 멤버가 없습니다.</p>
            ) : (
                <ul className="bg-white rounded-lg shadow">
                    {members.map(member => (
                        <MemberListItem key={member.clubMemberId} member={member} {...handlers} />
                    ))}
                </ul>
            )}
        </div>
    );
}