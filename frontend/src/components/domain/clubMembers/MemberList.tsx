import MemberListItem from './MemberListItem';
import { components } from '@/types/backend/apiV1/schema';

type MemberInfo = components['schemas']['ClubMemberInfo'];

// MemberListItem에서 필요한 함수들을 props로 내려받습니다.
interface MemberListProps {
    members: MemberInfo[];
    onApprove: (memberId: number) => void;
    onReject: (memberId: number) => void;
    onChangeRole: (memberId: number, role: 'MANAGER' | 'PARTICIPANT') => void;
}

export default function MemberList({ members, ...handlers }: MemberListProps) {
    if (members.length === 0) {
        return <p className="text-center text-gray-500 py-10">해당하는 멤버가 없습니다.</p>;
    }

    return (
        <ul className="bg-white rounded-lg shadow">
            {members.map(member => (
                <MemberListItem key={member.clubMemberId} member={member} {...handlers} />
            ))}
        </ul>
    );
}