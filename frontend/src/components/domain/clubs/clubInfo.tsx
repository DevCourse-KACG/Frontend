'use client';

import React from 'react';
import { components } from "@/types/backend/apiV1/schema";

type ClubInfoResponse = components['schemas']['ClubInfoResponse'];

interface ClubInfoProps {
    club: ClubInfoResponse;
}

// 57564F 7A7A73 DDDAD0 F8F3CE
const ClubInfo: React.FC<ClubInfoProps> = ({ club }) => {
    return (
        <div style={{ padding: 16, borderRadius: 8, backgroundColor: '#DDDAD0', boxShadow: '0 2px 4px rgba(87,86,79,0.08)' }}>
            <InfoCard title="모임명" content={club.name} color="#57564F" contentColor="#FFFFFF" />
            <div style={{ height: 16 }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32 }}>
                {/* Left: Name, Image, Description */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                        <img
                            src={club.imageUrl}
                            alt={club.name}
                            style={{ width: '100%', borderRadius: 8, objectFit: 'cover', background: '#F8F3CE' }}
                        />
                    </div>
                </div>
                {/* Right: Meta Info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 220 }}>
                    <InfoCard title="지역" content={club.mainSpot} color="#F8F3CE" contentColor="#57564F" />
                    <InfoCard title="총인원" content={`${club.maximumCapacity}명`} color="#F8F3CE" contentColor="#57564F" />
                    <InfoCard title="카테고리" content={club.category} color="#F8F3CE" contentColor="#57564F" />
                    <InfoCard
                        title="시작일"
                        content={club.startDate ? club.startDate.replace(/-/g, '.') : '미정'}
                        color="#F8F3CE"
                        contentColor="#57564F"
                    />
                    <InfoCard
                        title="종료일"
                        content={club.endDate ? club.endDate.replace(/-/g, '.') : '미정'}
                        color="#F8F3CE"
                        contentColor="#57564F"
                    />
                    <InfoCard
                        title="이벤트 유형"
                        content={
                            typeof club.eventType === 'string'
                                ? (
                                    {
                                        ONE_TIME: '일회성',
                                        SHORT_TERM: '단기',
                                        LONG_TERM: '장기',
                                    } as Record<string, string>
                                )[club.eventType] || '미정'
                                : '미정'
                        }
                        color="#F8F3CE"
                        contentColor="#57564F"
                    />
                    <InfoCard title="공개 여부" content={club.isPublic ? '공개' : '비공개'} color="#F8F3CE" contentColor="#57564F" />
                </div>
            </div>
            <div style={{ height: 16 }} />
            <InfoCard title="소개" content={club.bio} color="#FFFFFF" contentColor="#000000" />
        </div>
    );
};

export default ClubInfo;


//---------------------------------------------------------------------------------

// InfoCard
// 모임 정보를 카드 형태로 표시하는 컴포넌트
interface InfoCardProps {
    title: string;
    content: React.ReactNode;
    color?: string;
    contentColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    content,
    color = "#fff",
    contentColor = "#222",
}) => (
    <div
        style={{
            background: color,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            padding: "18px 20px",
            width: "100%",
            minWidth: 120,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            gap: 12,
        }}
    >
        <span
            style={{
                fontSize: 12,
                color: "#999",
                fontWeight: 500,
                letterSpacing: 0.2,
                marginRight: 8,
                minWidth: 56,
            }}
        >
            {title}
        </span>
        <span
            style={{
                fontSize: 15,
                color: contentColor,
                fontWeight: 700,
                wordBreak: "break-word",
            }}
        >
            {content}
        </span>
    </div>
);

export { InfoCard };