'use client';

import ClubDataForm, { ClubFormData } from '@/components/domain/clubs/clubDataForm';

export default function NewClubPage() {

    const handleSubmit = (data: ClubFormData, image: File | null) => {
        console.log('Form Data:', data);
        console.log('Image:', image);

        //dada를 schema 형태로 변환

        // api 호출

        // 성공 시 모임 상세 페이지로 이동

        // 실패 시 에러 메시지 표시


    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">모임 생성</h1>
            <ClubDataForm onSubmit={handleSubmit} />
        </div>
    );
}