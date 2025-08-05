'use client';

import React from 'react';
import { components } from "@/types/backend/apiV1/schema";

type SimpleClubInfoWithoutLeader = components['schemas']['SimpleClubInfoWithoutLeader'];

const ClubCard: React.FC<{ club: SimpleClubInfoWithoutLeader }> = ({ club }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: 8, padding: 16, gap: 24 }}>
            {/* Left: Name & Bio */}
            <div style={{ flex: 2 }}>
                <h2 style={{ margin: 0 }}>{club.name}</h2>
                <p style={{ margin: '8px 0 0 0', color: '#555' }}>{club.bio}</p>
            </div>
            {/* Center: Category, Region, Member Count, Period */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div><strong>카테고리:</strong> {club.category ?? '-'}</div>
                <div><strong>지역:</strong> {club.mainSpot ?? '-'}</div>
                <div><strong>인원수:</strong> {club.eventType ?? '-'}</div>
                <div><strong>시작일:</strong> {club.startDate ?? '-'}</div>
                <div><strong>종료일:</strong> {club.endDate ?? '-'}</div>
            </div>
            {/* Right: Club Image */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                {club.imageUrl ? (
                    <img src={club.imageUrl} alt={club.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                    <div style={{ width: 80, height: 80, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 12 }}>
                        No Image
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClubCard;