'use client';

import { useParams } from 'next/navigation';
import React, { useState, useCallback, useRef } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventContentArg } from '@fullcalendar/core';
import toast from 'react-hot-toast';

import type { components } from "@/types/backend/apiV1/schema";
import { getClubSchedules } from "@/api/schedule";
import '@/app/schedule/utils/fullcalendar.css';

// YYYY-mm-dd 포맷
export function formatDateString(dateStr: string): string {
  return dateStr.split('T')[0];
}

// ScheduleDto를 FullCalendar Event 객체로 변환
const convertSchedulesToEvents = (
  schedules: components["schemas"]["ScheduleDto"][]
) => {
  return schedules.map(schedule => ({
    id: schedule.id !== undefined ? String(schedule.id) : undefined,
    title: schedule.title!,
    start: schedule.startDate!,
    end: schedule.endDate,
    allDay: schedule.startDate!.length <= 10 && schedule.endDate!.length <= 10,
  }));
};

export default function ScheduleListPage() {
  // 파라미터 처리 - 모임 아이디
  //const parm = useParams();
  //const clubId = parm.clubId;
  const clubId = 1;

  // 캘린더 처리
  const calendarRef = useRef<FullCalendar>(null);

  // API 호출 취소를 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 일정 목록 조회
  const fetchSchedules = useCallback(async (startDate?: string, endDate?: string) => {
    if (!clubId || isNaN(Number(clubId))) {
      setError('유효하지 않은 모임입니다.');
      return;
    }
    // 이전 요청 있으면 취소
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setError(null);

    try {
      // 일정 목록 조회
      const data = await getClubSchedules(Number(clubId), { startDate, endDate });

      // 일정 목록 세팅
      const events = convertSchedulesToEvents(data.data ?? []);
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(events);
      }
    } catch (e) {
      // 요청 취소는 무시
      if (e instanceof DOMException && e.name === 'AbortError') return;
      // 에러 처리
      const msg = e instanceof Error ? e.message : '일정 불러오기 실패';
      setError(msg);
      toast.error(msg);
    }
  }, [clubId]);

  // 캘린더 날짜가 변경될 때마다(이전, 다음 버튼 등) 일정 목록 API 재호출
  const handleDatesSet = useCallback((arg: any) => {
    const startDate = formatDateString(arg.startStr);
    const endDate = formatDateString(arg.endStr);
    fetchSchedules(startDate, endDate);
  }, [fetchSchedules]);

  // 이벤트 내용 렌더링 함수
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gray-100 font-sans'>
      {/* Main Calendar */}
      <div className='flex-1 p-4 lg:p-6'>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          datesSet={handleDatesSet}
          eventContent={renderEventContent}
          locale='ko'
          height='auto'
        />
      </div>
    </div>
  );
}
