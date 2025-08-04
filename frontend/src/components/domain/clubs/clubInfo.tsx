'use client';

import React from 'react';
import { components } from "@/types/backend/apiV1/schema";

type ClubInfoResponse = components['schemas']['ClubInfoResponse'];

interface ClubInfoProps {
    club: ClubInfoResponse;
}

const ClubInfo: React.FC<ClubInfoProps> = ({ club }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32 }}>
            {/* Left: Name, Image, Description */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <img
                    src={club.imageUrl}
                    alt={club.name}
                    style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
                />
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: 20 }}>{club.name}</div>
                    <div style={{ color: '#666', fontSize: 14 }}>{club.bio}</div>
                </div>
            </div>
            {/* Right: Meta Info */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 220 }}>
                <div><strong>지역:</strong> {club.mainSpot}</div>
                <div><strong>총인원:</strong> {club.maximumCapacity}명</div>
                <div><strong>카테고리:</strong> {club.category}</div>
                <div>
                    <strong>활동기간:</strong>{' '}
                    {club.startDate && club.endDate
                        ? `${club.startDate.replace(/-/g, '.')} ~ ${club.endDate.replace(/-/g, '.')}`
                        : '미정'}
                </div>
                <div>
                    <strong>이벤트 유형:</strong>{' '}
                    {typeof club.eventType === 'string'
                        ? ({
                            ONE_TIME: '일회성',
                            SHORT_TERM: '단기',
                            LONG_TERM: '장기',
                        } as Record<string, string>)[club.eventType] || '미정'
                        : '미정'}
                </div>
                <div>
                    <strong>공개 여부:</strong> {club.isPublic ? '공개' : '비공개'}
                </div>
            </div>
        </div>
    );
};

export default ClubInfo;