'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

import { getSchedule, deleteSchedule } from '@/api/schedule';
import type { ScheduleDetailDto } from '@/types/schedule';

// props
interface ScheduleModalProps {
  showModal: boolean;
  selectedScheduleId: number | null;
  onClose: () => void;
}

export default function ScheduleModal ({
  showModal,
  selectedScheduleId,
  onClose
}: ScheduleModalProps ) {
  const [schedule, setSchedule] = useState<ScheduleDetailDto | null | undefined>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 이전 상세 조회 중복 응답이 나중에 덮어쓰는 걸 방지하기 위한 AbortController
  const detailAbortRef = useRef<AbortController | null>(null);

  const fetchScheduleDetail = useCallback(async (scheduleId: number) => {
    // 이전 요청 있으면 취소
    detailAbortRef.current?.abort();
    const controller = new AbortController();
    detailAbortRef.current = controller;

    setError(null);

    try {
      // 일정 상세 정보
      const data = await getSchedule(Number(scheduleId), controller.signal);

      // 일정 세팅
      setSchedule(data.data);
    } catch (e: any) {
      const msg = e instanceof Error ? e.message : '일정 상세 불러오기 실패';
      setError(msg);
      toast.error(msg);
    }
  }, []);

  // 모달 열고 닫을 때 데이터 처리
  useEffect(() => {
    // 모달 열릴 시 일정 상세 조회, 닫힐 시 상태 초기화
    if (showModal && selectedScheduleId !== null) {
      fetchScheduleDetail(selectedScheduleId);
    } else {
      setSchedule(null);
      setError(null);
    }
    // 모달 닫히거나 의존성 변경 시 이전 조회 요청 취소
    return () => {
      detailAbortRef.current?.abort();
    };
  }, [showModal, selectedScheduleId, fetchScheduleDetail]);

  const handleDelete = async () => {
    if (!selectedScheduleId) return;
    if (!confirm('정말 이 일정을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      // 삭제
      const data = await deleteSchedule(Number(selectedScheduleId));

      // 삭제 알림 후 모달 닫기
      toast.success(data.message || '일정이 삭제되었습니다.');
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : '삭제 중 오류 발생';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };
  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      style={{}}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6"
        style={{
          width: '66vw',
          height: '66vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {selectedScheduleId && (
          <>
            {schedule && (
              <>
                <div className="mb-6 pb-4 border-b-1 border-gray-300">
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center">{schedule.title}</h3>
                </div>
                <div className="space-y-3 px-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">일시:</span> {schedule.startDate} ~ {schedule.endDate}
                  </p>
                  {schedule.spot && (
                    <p className="text-gray-700">
                      <span className="font-semibold">장소:</span> {schedule.spot}
                    </p>
                  )}
                  {schedule.content && (
                    <p className="text-gray-700 whitespace-pre-line">
                      <span className="font-semibold">내용:</span> {schedule.content}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 mt-auto">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}