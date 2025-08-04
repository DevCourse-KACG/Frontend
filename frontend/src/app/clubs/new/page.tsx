'use client';

import ClubDataForm, { ClubFormData } from '@/components/domain/clubs/clubDataForm';

export default function NewClubPage() {

    const handleSubmit = (data: ClubFormData, image: File | null) => {
        console.log('Form Data:', data);
        console.log('Image:', image);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">모임 생성</h1>
            <ClubDataForm onSubmit={handleSubmit} />
        </div>
    );
}