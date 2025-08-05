'use client';

import { useState, useEffect } from 'react';
import MemberListItem from './MemberListItem';
import { components } from '@/types/backend/apiV1/schema';
import MultiEmailInput from './MultiEmailInput';

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
    //const [emails, setEmails] = useState<string[]>([]);

    const handleInviteMembers = (emails: string[]) => {
        console.log("초대할 최종 이메일 목록:", emails);
        // 여기에 실제 API 호출 로직을 구현합니다.
        // 예: await inviteMembersAPI(clubId, emails);
        alert(`${emails.length}명의 멤버에게 초대 이메일을 보냅니다.`);
    };

    if (members.length === 0) {
        return (
            <div>
                {
                    state === 'INVITED' && (
                        < MultiEmailInput
                            onSubmit={handleInviteMembers}
                            label="모임에 초대할 멤버의 이메일 주소를 입력하세요"
                            placeholder="예: user@example.com"
                        />
                    )
                }
                <p className="text-center text-gray-500 py-10">해당하는 멤버가 없습니다.</p>
            </div>
        );
    }

    return (
        <div>
            {
                (state === 'INVITED') && (
                    <p className="text-center text-gray-500 py-4">
                        초대된 멤버는 클럽에 참여하기 전까지는 목록에 표시되지 않습니다.
                    </p>
                )
            }
            <ul className="bg-white rounded-lg shadow">
                {members.map(member => (
                    <MultiEmailInput
                        onSubmit={handleInviteMembers}
                        label="모임에 초대할 멤버의 이메일 주소를 입력하세요"
                        placeholder="예: user@example.com"
                    />
                ))}
            </ul>
        </div>
    );
}