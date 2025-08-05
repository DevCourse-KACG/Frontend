interface ClubData {
    clubId: number;
    name: string;
    category: string;
    imageUrl: string;
    mainSpot: string;
    eventType: string;
    startDate: string;
    endDate: string;
    leaderId: number;
    leaderName: string;
  }
  
  // 백엔드 API 응답 구조에 맞게 RsData 인터페이스를 정의합니다.
  interface RsData<T> {
    code: number;
    message: string;
    data: T | null;
  }
  
  /**
   * 초대 토큰을 사용하여 클럽 정보를 불러오는 함수
   * @param inviteToken 클럽 초대 링크에 포함된 토큰
   * @returns 클럽 정보 데이터
   */
  export async function getClubInfoByInvitationToken(inviteToken: string): Promise<ClubData> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/clubs/invitations/${inviteToken}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '클럽 정보를 불러오는 데 실패했습니다.' }));
        throw new Error(errorData.message);
      }
      const { data }: { data: ClubData } = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
  
  /**
   * 초대 토큰을 사용하여 비공개 클럽에 가입 신청하는 함수
   * @param inviteToken 클럽 초대 링크에 포함된 토큰
   * @returns 가입 신청 결과 메시지
   */
  export async function applyToClubByInvitationToken(inviteToken: string): Promise<string> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/clubs/invitations/${inviteToken}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 로그인 유저의 인증 정보를 포함하기 위해 credentials를 설정합니다.
        credentials: 'include',
      });
  
      const result: RsData<null> = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message);
      }
  
      return result.message;
  
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
  