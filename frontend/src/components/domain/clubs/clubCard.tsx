'use client';

import React from 'react';
import { components } from "@/types/backend/apiV1/schema";
import { COLORS } from '@/constants/colors';
import { useRouter } from 'next/navigation';
import { ClubCategory, ClubCategoryKorean } from '@/types/ClubCategory';
import { EventType, EventTypeKorean } from '@/types/EventType';


type SimpleClubInfoWithoutLeader = components['schemas']['SimpleClubInfoWithoutLeader'];

const ClubCard: React.FC<{ club: SimpleClubInfoWithoutLeader }> = ({ club }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: 20,
                borderRadius: 16,
                background: COLORS.beige,
                boxShadow: `0 2px 8px ${COLORS.gray}`,
                gap: 32,
                border: `1px solid ${COLORS.gray}`,
                height: '30vh'
            }}
        >
            {/* Left: Club Image */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
                {club.imageUrl ? (
                    <img
                        src={club.imageUrl}
                        alt={club.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'scale-down',
                            borderRadius: 12,
                            border: `2px solid ${COLORS.brown}`,
                            background: COLORS.white,
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: COLORS.white,
                            borderRadius: 12,
                            border: `2px solid ${COLORS.gray}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: COLORS.gray,
                            fontSize: 13,
                        }}
                    >
                        No Image
                    </div>
                )}
            </div>
            {/* Center: Name & Bio */}
            <div style={{ flex: 2, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', justifyContent: 'flex-start', height: '100%' }}>
                <h2
                    style={{
                        margin: 0,
                        fontSize: 22,
                        color: COLORS.brown,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    title={club.name}
                >
                    {club.name}
                </h2>
                <p
                    style={{
                        margin: '10px 0 0 0',
                        color: COLORS.gray,
                        fontSize: 15,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // 최대 2줄까지 표시
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'normal',
                    }}
                    title={club.bio}
                >
                    {club.bio}
                </p>
            </div>
            {/* Right: Club Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: COLORS.brown, minWidth: 80 }}>카테고리</span>
                    <span style={{ color: COLORS.black }}>
                        {club.category ? ClubCategoryKorean[club.category as ClubCategory] ?? club.category : '-'}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: COLORS.brown, minWidth: 80 }}>활동 기간</span>
                    <span style={{ color: COLORS.black }}>
                        {club.startDate && club.endDate
                            ? `${club.startDate} ~ ${club.endDate}`
                            : club.startDate
                                ? `${club.startDate} ~ -`
                                : club.endDate
                                    ? `- ~ ${club.endDate}`
                                    : '-'}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: COLORS.brown, minWidth: 80 }}>유형</span>
                    <span style={{ color: COLORS.black }}>
                        {club.eventType ? EventTypeKorean[club.eventType as EventType] ?? club.eventType : '-'}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: COLORS.brown, minWidth: 80 }}>지역</span>
                    <span style={{ color: COLORS.black }}>{club.mainSpot ?? '-'}</span>
                </div>
            </div>
        </div>
    );
};

export default ClubCard;