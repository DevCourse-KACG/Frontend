import { getClubMembers } from '@/api/clubMember';
import MemberManagement from '@/components/domain/clubMembers/MemberManagement';

interface MembersPageProps {
    params: { slug: string }; // [slug]는 clubId로 간주
}

export default async function MembersPage({ params }: MembersPageProps) {
    const clubId = params.slug;

    // 서버에서 초기 멤버 데이터를 모두 가져옴
    const initialMembers = await getClubMembers(clubId);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">멤버 관리</h1>
            {/* 클라이언트 컴포넌트에 초기 데이터를 props로 전달 */}
            <MemberManagement clubId={clubId} initialMembers={initialMembers} />
        </div>
    );
}