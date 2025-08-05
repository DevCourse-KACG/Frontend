'use client';

import { useParams } from 'next/navigation';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

import { EventInput, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';

import type { components } from "@/types/backend/apiV1/schema";
import { getClubSchedules } from "@/api/schedule";
import { extractDateFromISO } from '@/lib/formatDate';
import Calendar from '@/components/domain/schedule/Calender';
import ScheduleModal from '@/app/schedule/modals/ScheduleModal';
import ScheduleEditModal from '@/app/schedule/modals/ScheduleEditModal';

import '@/lib/fullcalendar.css';

export default function ScheduleListPage() {
  // 파라미터 처리 - 모임 아이디
  //const parm = useParams();
  //const clubId = parm.clubId;
  const clubId = 1;

  // 캘린더 처리
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<EventInput[]>([]); 
  const [selectedDateInfo, setSelectedDateInfo] = useState<DateSelectArg | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  // 모달 상태 관리
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'edit' | 'detail' | null>(null);

  // API 호출 취소를 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ScheduleDto를 FullCalendar Event 객체로 변환
  const convertSchedulesToEvents = (
    schedules: components["schemas"]["ScheduleDto"][]
  ) => {
    return schedules.map(schedule => ({
      id: schedule.id !== undefined ? String(schedule.id) : undefined,
      title: schedule.title || '제목 없음',
      start: schedule.startDate || new Date().toISOString(),
      end: schedule.endDate,
      allDay: (schedule.startDate?.length || 0) <= 10 && (schedule.endDate?.length || 0) <= 10,
      color: '#6366F1', // bg-indigo-500
      textColor: '#FFFFFF'
    }));
  };
  
  // 컴포넌트 사라질 때 요청 취소
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchSchedules = useCallback(async (startDate?: string, endDate?: string) => {
    if (!clubId) {
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
      const data = await getClubSchedules(Number(clubId), { startDate, endDate }, controller.signal);
      // 일정 목록 세팅
      const events = convertSchedulesToEvents(data.data ?? []);

      // 캘린더 이벤트 저장
      setEvents(events);
    } catch (e) {
      // 요청 취소는 무시
      if (e instanceof Error && e.message.includes('aborted')) return; 
      // 에러 처리
      const msg = e instanceof Error ? e.message : '일정 불러오기 실패';
      setError(msg);
      toast.error(msg);
    }
  }, [clubId]);

  // 캘린더 날짜가 변경될 때마다(이전, 다음 버튼 등) 일정 목록 API 재호출
  const handleDatesSet = useCallback((arg: any) => {
    const startDate = extractDateFromISO(arg.startStr);
    const endDate = extractDateFromISO(arg.endStr);
    fetchSchedules(startDate, endDate);
  }, [fetchSchedules]);

  // Date UI(일) 클릭 시 일정 생성/수정정 모달
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setModalType('edit');
    setSelectedDateInfo(selectInfo);
    setSelectedScheduleId(null);
    setShowModal(true);
  };

  // 일정 클릭 시 일정 상세 모달
  const handleEventClick = (clickInfo: EventClickArg) => {
    setModalType('detail');
    setSelectedScheduleId(Number(clickInfo.event.id)); // ID만 저장
    setSelectedDateInfo(null);
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = (shouldRefresh: boolean, action?: 'modify' | 'goToCheckList' | 'createCheckList', checkListId?: number) => {
    setShowModal(false);
    setSelectedDateInfo(null);
    setModalType(null);

    if (action === 'modify') {
      // 상세 -> 수정버튼 클릭 -> 수정 모드
      setModalType('edit'); 
      setShowModal(true);
    } else if (action === 'goToCheckList') {
      toast.success('체크리스트로 이동합니다.'); 
      setModalType(null);
      setSelectedScheduleId(null);
      //router.push() // checkListId
    } else if (action === 'createCheckList') {
      toast.success('체크리스트 생성 페이지로 이동합니다.'); 
      setModalType(null);
      //router.push() // scheduleId
    } else {
      // 일반 닫기 - 선택된 일정 ID 초기화
      setSelectedScheduleId(null); 
    }

    // 캘린더 새로 고침
    if (shouldRefresh) {
      refreshCalendar();
    }
  };
  
  // 일정 생성/삭제 후 캘린더를 최신화
  const refreshCalendar = async () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const view = calendarApi.view;
      const startDate = extractDateFromISO(view.activeStart.toISOString());
      const endDate = extractDateFromISO(view.activeEnd.toISOString());
      // 일정 목록 재조회
      await fetchSchedules(startDate, endDate);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gray-100 font-sans'>
      {/* Main Calendar */}
      <div className='flex-1 p-4 lg:p-6'>
        <Calendar 
          ref={calendarRef}
          events={events} 
          handleDatesSet={handleDatesSet} 
          handleEventClick={handleEventClick}
          handleDateSelect={handleDateSelect}
          />
        {showModal && modalType === 'detail' && (
          <ScheduleModal
            showModal={showModal}
            selectedScheduleId={selectedScheduleId}
            onClose={handleCloseModal}
          />
        )}
        {showModal && modalType === 'edit' && (
          <ScheduleEditModal
            showModal={showModal}
            clubId={clubId}
            startDate={selectedDateInfo?.startStr}
            endDate={selectedDateInfo?.endStr}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}
