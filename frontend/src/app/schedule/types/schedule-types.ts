import type { RsData } from '@/global/types/rsData';

// 일정
export type ScheduleDto = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    spot: string;
}

// 일정 + 모임 정보
export type ScheduleWithClubDto = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    spot: string;
    clubId: string;
    clubName: string;
}

// 일정 상세 조회
export type ScheduleDetailDto = {
    id: string;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    spot: string;
    clubId: string;
    checkListId: string;
}

// 일정 목록 조회
export type ScheduleListResponse = RsData<ScheduleDto[]>;

// 내 일정 목록 조회
export type MyScheduleListResponse = RsData<ScheduleWithClubDto[]>;