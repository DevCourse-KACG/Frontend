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
  
  /**
   * 초대 토큰을 사용하여 클럽 정보를 불러오는 함수
   * @param inviteToken 클럽 초대 링크에 포함된 토큰
   * @returns 클럽 정보 데이터
   */
  export async function getClubInfoByInvitationToken(inviteToken: string): Promise<ClubData> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
      const response = await fetch(`${API_BASE_URL}/invitations/${inviteToken}`);
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
  