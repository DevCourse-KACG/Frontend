import { CheckListListResponse, CheckListResponse, CheckListUpdateReqDto, CheckListWriteReqDto, ApiErrorResponse } from '@/types/checklist';
import { components } from '@/types/backend/apiV1/schema';

export type ClubMemberResponse = components['schemas']['RsDataClubMemberResponse'];
export type ClubMember = components['schemas']['ClubMemberInfo'];

// 그룹 내 사용자 정보 타입
export interface GroupUserInfo {
  role: 'HOST' | 'MANAGER' | 'PARTICIPANT';
  state: 'JOINED' | 'PENDING' | 'INVITED';
}

export interface GroupUserResponse {
  code: number;
  message: string;
  data: GroupUserInfo;
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

export async function fetchChecklists(groupId: string): Promise<CheckListListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/checklists/group/${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    // 401 에러인 경우 (로그인 필요)
    if (response.status === 401) {
      const errorData = data as ApiErrorResponse;
      throw new Error(`LOGIN_REQUIRED:${errorData.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchChecklistDetail(checklistId: string): Promise<CheckListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/checklists/${checklistId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    // 401 에러인 경우 (로그인 필요)
    if (response.status === 401) {
      const errorData = data as ApiErrorResponse;
      throw new Error(`LOGIN_REQUIRED:${errorData.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateChecklist(checklistId: string, updateData: CheckListUpdateReqDto): Promise<CheckListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/checklists/${checklistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    // 401 에러인 경우 (로그인 필요)
    if (response.status === 401) {
      const errorData = data as ApiErrorResponse;
      throw new Error(`LOGIN_REQUIRED:${errorData.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteChecklist(checklistId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/checklists/${checklistId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // 401 에러인 경우 (로그인 필요)
    if (response.status === 401) {
      const data = await response.json();
      const errorData = data as ApiErrorResponse;
      throw new Error(`LOGIN_REQUIRED:${errorData.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
}

export async function fetchGroupMembers(groupId: string): Promise<ClubMemberResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members?state=JOINED`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    // 401 에러인 경우 (로그인 필요)
    if (response.status === 401) {
      const errorData = data as ApiErrorResponse;
      throw new Error(`LOGIN_REQUIRED:${errorData.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchGroupUserInfo(groupId: string): Promise<GroupUserResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    // 401 에러인 경우 (로그인 필요)
    if (response.status === 401) {
      const errorData = data as ApiErrorResponse;
      throw new Error(`LOGIN_REQUIRED:${errorData.message}`);
    }

    // 각 상태 코드별 구체적 에러 메시지
    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      const message = errorData?.message || '알 수 없는 오류가 발생했습니다.';
      
      switch (response.status) {
        case 404:
          throw new Error(`GROUP_NOT_FOUND:${message}`);
        case 403:
          throw new Error(`ACCESS_DENIED:${message}`);
        default:
          throw new Error(`HTTP error! status: ${response.status} - ${message}`);
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function createChecklist(checklistData: CheckListWriteReqDto): Promise<CheckListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/checklists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(checklistData),
    });

    const data = await response.json();

    // 401 에러인 경우 (로그인 필요)
    if (response.status === 401) {
      const errorData = data as ApiErrorResponse;
      throw new Error(`LOGIN_REQUIRED:${errorData.message}`);
    }

    // 각 상태 코드별 구체적 에러 메시지
    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      const message = errorData?.message || '알 수 없는 오류가 발생했습니다.';
      
      switch (response.status) {
        case 404:
          throw new Error(`SCHEDULE_NOT_FOUND:${message}`);
        case 403:
          throw new Error(`PERMISSION_DENIED:${message}`);
        case 409:
          throw new Error(`CHECKLIST_ALREADY_EXISTS:${message}`);
        default:
          throw new Error(`HTTP error! status: ${response.status} - ${message}`);
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
}