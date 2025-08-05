import { GroupUserInfo } from '@/api/checklistApi';

/**
 * 체크리스트 생성 권한이 있는지 확인
 * HOST, MANAGER만 생성 가능하고, 반드시 JOINED 상태여야 함
 */
export function canCreateChecklist(userInfo: GroupUserInfo | null): boolean {
  if (!userInfo) return false;
  
  // 가입되지 않은 상태에서는 생성 불가
  if (userInfo.state !== 'JOINED') return false;
  
  // HOST, MANAGER만 생성 가능
  return userInfo.role === 'HOST' || userInfo.role === 'MANAGER';
}

/**
 * 체크리스트 수정 권한이 있는지 확인
 * HOST, MANAGER만 수정 가능하고, 반드시 JOINED 상태여야 함
 */
export function canEditChecklist(userInfo: GroupUserInfo | null): boolean {
  if (!userInfo) return false;
  
  // 가입되지 않은 상태에서는 수정 불가
  if (userInfo.state !== 'JOINED') return false;
  
  // HOST, MANAGER만 수정 가능
  return userInfo.role === 'HOST' || userInfo.role === 'MANAGER';
}

/**
 * 체크리스트 삭제 권한이 있는지 확인
 * HOST, MANAGER만 삭제 가능하고, 반드시 JOINED 상태여야 함
 */
export function canDeleteChecklist(userInfo: GroupUserInfo | null): boolean {
  if (!userInfo) return false;
  
  // 가입되지 않은 상태에서는 삭제 불가
  if (userInfo.state !== 'JOINED') return false;
  
  // HOST, MANAGER만 삭제 가능
  return userInfo.role === 'HOST' || userInfo.role === 'MANAGER';
}

/**
 * 체크리스트 조회 권한이 있는지 확인
 * 모든 역할이 조회 가능하지만, 반드시 JOINED 상태여야 함
 */
export function canViewChecklist(userInfo: GroupUserInfo | null): boolean {
  if (!userInfo) return false;
  
  // 가입되지 않은 상태에서는 조회 불가
  return userInfo.state === 'JOINED';
}

/**
 * 권한 없음 메시지 생성
 */
export function getPermissionDeniedMessage(userInfo: GroupUserInfo | null, action: string): string {
  if (!userInfo) {
    return `${action}하려면 로그인이 필요합니다.`;
  }
  
  if (userInfo.state !== 'JOINED') {
    switch (userInfo.state) {
      case 'PENDING':
        return '그룹 가입 승인이 완료된 후 이용하실 수 있습니다.';
      case 'INVITED':
        return '그룹 초대를 수락한 후 이용하실 수 있습니다.';
      default:
        return '그룹에 가입한 후 이용하실 수 있습니다.';
    }
  }
  
  if (userInfo.role === 'PARTICIPANT') {
    return `${action}은 클럽 관리자(호스트/매니저)만 가능합니다.`;
  }
  
  return `${action} 권한이 없습니다.`;
}