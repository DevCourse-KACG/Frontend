// src/services/club.ts

import { components } from '@/types/backend/apiV1/schema';

type ClubMembersResponse = components['schemas']['RsDataClubMemberResponse'];
type MemberInfo = components['schemas']['ClubMemberInfo'];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 멤버 목록 조회
export const getClubMembers = async (clubId: string): Promise<MemberInfo[]> => {

    const response = await fetch(`${API_URL}/api/v1/clubs/${clubId}/members`, {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함하여 요청
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '멤버 목록을 불러오는 데 실패했습니다.');
    }
    const result: ClubMembersResponse = await response.json();
    return result.data?.members || [];
};

// 가입 신청 승인
export const approveApplication = async (clubId: string, memberId: number) => {
    const response = await fetch(`${API_URL}/api/v1/clubs/${clubId}/members/${memberId}/approval`, {
        method: 'PATCH',
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '가입 승인에 실패했습니다.');
    }
};

// 가입 신청 거절
export const rejectApplication = async (clubId: string, memberId: number) => {
    const response = await fetch(`${API_URL}/api/v1/clubs/${clubId}/members/${memberId}/approval`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '가입 거절에 실패했습니다.');
    }
};

// 멤버 역할 변경
export const changeMemberRole = async (clubId: string, memberId: number, role: 'MANAGER' | 'PARTICIPANT') => {
    const response = await fetch(`${API_URL}/api/v1/clubs/${clubId}/members/${memberId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '멤버 역할 변경에 실패했습니다.');
    }
};
// 멤버 추가/삭제 등 필요한 다른 API 함수들...