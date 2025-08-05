import type { components } from "@/types/backend/apiV1/schema";

// 친구
export type FriendDto = components["schemas"]["FriendDto"];
// 친구 + 자기소개
export type FriendWithBioDto = components["schemas"]["FriendWithBioDto"];
// 친구 정보
export type FriendMemberDto = components["schemas"]["FriendMemberDto"];

// 친구 상태
export enum FriendStatus {
    SENT = "SENT",
    RECEIVED = "RECEIVED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    ALL = "ALL"
  }
  
export const FriendStatusMap: Record<FriendStatus, string> = {
  [FriendStatus.SENT]: "요청 중",
  [FriendStatus.RECEIVED]: "요청받음",
  [FriendStatus.ACCEPTED]: "수락됨",
  [FriendStatus.REJECTED]: "거절됨",
  [FriendStatus.ALL]: "전체",
};