'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventContentArg } from '@fullcalendar/core';

interface CalendarProps {
  events: any[];
  handleDatesSet: (arg: any) => void;
}

export default function Calendar({ events, handleDatesSet }: CalendarProps) {
  // 이벤트 내용 렌더링 함수
  const renderEventContent = (eventInfo: EventContentArg) => (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );

  return (
    <FullCalendar
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
      events={events}
    />
  );
}
