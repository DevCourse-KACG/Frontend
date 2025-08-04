import { components } from "@/types/backend/apiV1/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8080';

type CreateClubRequest = components['schemas']['CreateClubRequest'];
type ClubResponse = components['schemas']['ClubResponse'];

/**
 * 모임 생성
 * @param data 모임 데이터
 * @param imageFile 모임 이미지
 * @returns 모임 생성 결과
 */
export const createClub = async (
    data: CreateClubRequest,
    imageFile: File | null,
): Promise<ClubResponse> => {
    // 1. FormData 객체 생성
    const formData = new FormData();

    // 2. JSON 데이터를 Blob으로 변환하여 FormData에 추가
    // 'data'라는 이름(key)으로 JSON 데이터를 추가합니다. 이는 스키마에 정의된 이름입니다.
    formData.append(
        'data',
        new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );

    // 3. 이미지 파일이 있으면 FormData에 추가
    // 'image'라는 이름(key)으로 파일을 추가합니다.
    if (imageFile) {
        formData.append('image', imageFile);
    }

    // 4. fetch API로 요청 전송
    const response = await fetch(`${API_URL}/api/v1/clubs`, {
        method: 'POST',
        // FormData를 body로 사용할 때는 'Content-Type' 헤더를 직접 설정하지 않습니다.
        // 브라우저가 자동으로 'multipart/form-data'와 함께 올바른 boundary를 설정해줍니다.
        body: formData,
        credentials: 'include', // 쿠키를 포함하여 요청
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || '모임 생성에 실패했습니다.');
    }

    return responseData.data;
};

export const getClubInfo = async (clubId: string): Promise<components['schemas']['ClubInfoResponse']> => {
    const response = await fetch(`${API_URL}/api/v1/clubs/${clubId}`, {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함하여 요청
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '모임 정보를 가져오는 데 실패했습니다.');
    }

    const data: components['schemas']['ClubInfoResponse'] = await response.json();
    return data;
}