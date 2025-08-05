'use client';

import React from 'react';
import { components } from "@/types/backend/apiV1/schema";
import { EventType, EventTypeKorean } from '@/types/EventType';
import { ClubCategory, ClubCategoryKorean } from '@/types/ClubCategory';

type ClubSearchFilter = {
    name: string;
    mainSpot: string;
    clubCategory: ClubCategory | '';
    eventType: EventType | '';
};

type ClubSearchBarProps = {
    value: ClubSearchFilter;
    onChange: (value: ClubSearchFilter) => void;
    onSubmit?: () => void; // Optional submit handler
};

const ClubSearchBar: React.FC<ClubSearchBarProps> = ({ value, onChange, onSubmit }) => {
    const handleChange = (field: keyof ClubSearchFilter, newValue: string) => {
        onChange({
            ...value,
            [field]: newValue,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    return (
        <form
            style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                placeholder="모임명"
                value={value.name}
                onChange={e => handleChange('name', e.target.value)}
            />
            <input
                type="text"
                placeholder="지역"
                value={value.mainSpot}
                onChange={e => handleChange('mainSpot', e.target.value)}
            />
            <select
                value={value.clubCategory}
                onChange={e => handleChange('clubCategory', e.target.value)}
            >
                <option value="">카테고리</option>
                {Object.values(ClubCategory).map(cat => (
                    <option key={cat} value={cat}>
                        {ClubCategoryKorean[cat]}
                    </option>
                ))}
            </select>
            <select
                value={value.eventType}
                onChange={e => handleChange('eventType', e.target.value)}
            >
                <option value="">종류</option>
                {Object.values(EventType).map(type => (
                    <option key={type} value={type}>
                        {EventTypeKorean[type]}
                    </option>
                ))}
            </select>
            <button type="submit">검색</button>
        </form>
    );
};

export default ClubSearchBar;