import { components } from "@/types/backend/apiV1/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8080';

type MyInfoInClub = components['schemas']['MyInfoInClub'];

/**
 * 모임에서 내 정보 조회
 * @param clubId 모임 ID
 * @returns 내 정보
 */
export const getMyInfoInClub = async (clubId: string): Promise<MyInfoInClub> => {
    const response = await fetch(`${API_URL}/api/v1/my-clubs/${clubId}`, {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함하여 요청
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '내 정보를 가져오는 데 실패했습니다.');
    }

    return data.data;
}
